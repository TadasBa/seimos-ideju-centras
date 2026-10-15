/**
 * Cloudflare Pages Function: /api/contact
 *
 * POST receives the contact form and forwards it by email through Resend
 * (https://resend.com — free tier: 3 000 emails/month, more than enough
 * for a contact form; no credit card required).
 * GET returns the public Turnstile site key for the form's widget.
 *
 * Configuration (see CLOUDFLARE_DEPLOYMENT.md):
 *   CONTACT_TO, CONTACT_FROM, TURNSTILE_SITE_KEY — wrangler.toml [vars]
 *   CONTACT_RATE_LIMITER                       — wrangler.toml KV binding
 *   RESEND_API_KEY, TURNSTILE_SECRET_KEY        — encrypted Pages secrets
 *
 * Layers of protection, in the order a submission meets them:
 *   1. size and JSON checks;
 *   2. honeypot field ("website"): bots fill it, people never see it, and
 *      it gets a fake 200 so bots don't retry;
 *   3. field validation;
 *   4. a Turnstile token must be present;
 *   5. per-IP rate limit in Workers KV;
 *   6. the token is verified server-side with Turnstile Siteverify.
 * Resend is only called once all of them pass.
 */

interface Env {
  RESEND_API_KEY: string
  CONTACT_TO: string
  CONTACT_FROM: string
  CONTACT_RATE_LIMITER: KVNamespace
  TURNSTILE_SITE_KEY: string
  TURNSTILE_SECRET_KEY: string
}

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  message?: string
  consent?: boolean
  website?: string // honeypot
  turnstileToken?: string
}

const MAX_LENGTHS = { name: 200, email: 320, phone: 50, message: 5000 } as const
const MAX_BODY_BYTES = 12_000
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60
const RATE_LIMIT_MAX_SUBMISSIONS = 5
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Turnstile tokens are at most 2048 characters
const MAX_TURNSTILE_TOKEN_LENGTH = 2048
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const SITEVERIFY_TIMEOUT_MS = 5000

/** Sent with Turnstile rejections so the form knows to get a fresh token */
const TURNSTILE_ERROR = { error: 'Nepavyko patvirtinti saugumo patikros', code: 'turnstile' } as const

interface NormalizedContact {
  name: string
  email: string
  phone: string
  message: string
  consent: boolean
  website: string
  turnstileToken: string
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getStringField(payload: Record<string, unknown>, key: keyof ContactPayload): string {
  const value = payload[key]
  return typeof value === 'string' ? value : ''
}

export function normalizeContactPayload(value: unknown): NormalizedContact | null {
  if (!isRecord(value)) return null

  return {
    name: getStringField(value, 'name').trim().slice(0, MAX_LENGTHS.name),
    email: getStringField(value, 'email').trim().slice(0, MAX_LENGTHS.email),
    phone: getStringField(value, 'phone').trim().slice(0, MAX_LENGTHS.phone),
    message: getStringField(value, 'message').trim().slice(0, MAX_LENGTHS.message),
    consent: value.consent === true,
    website: getStringField(value, 'website').trim(),
    turnstileToken: getStringField(value, 'turnstileToken').trim().slice(0, MAX_TURNSTILE_TOKEN_LENGTH),
  }
}

export function validateContactPayload(contact: NormalizedContact): boolean {
  return Boolean(contact.name && contact.message && contact.consent && EMAIL_PATTERN.test(contact.email))
}

function clientIp(request: Request): string | null {
  return (
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    null
  )
}

function clientKey(request: Request): string {
  return `contact:${clientIp(request) ?? 'unknown'}`
}

interface SiteverifyResponse {
  success: boolean
  'error-codes'?: string[]
}

/**
 * Checks a Turnstile token with Cloudflare Siteverify. Fails closed: a
 * network error, timeout, non-200 reply or unreadable body all count as
 * not verified. Tokens are single-use and expire after ~5 minutes, which
 * Siteverify reports as `timeout-or-duplicate`.
 */
export async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<boolean> {
  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (remoteIp) body.append('remoteip', remoteIp)

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error('Turnstile Siteverify HTTP error:', response.status)
      return false
    }
    const result = (await response.json()) as SiteverifyResponse
    if (!result.success) console.warn('Turnstile rejected token:', result['error-codes'] ?? [])
    return result.success === true
  } catch (error) {
    console.error('Turnstile Siteverify request failed:', error)
    return false
  }
}

async function isRateLimited(context: EventContext<Env, string, unknown>): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000)
  const key = clientKey(context.request)
  const stored = await context.env.CONTACT_RATE_LIMITER.get<RateLimitEntry>(key, 'json')

  const entry =
    stored && stored.resetAt > now
      ? { count: stored.count + 1, resetAt: stored.resetAt }
      : { count: 1, resetAt: now + RATE_LIMIT_WINDOW_SECONDS }

  await context.env.CONTACT_RATE_LIMITER.put(key, JSON.stringify(entry), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  })

  return entry.count > RATE_LIMIT_MAX_SUBMISSIONS
}

/** Public site key for the browser widget (it is not a secret). */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const siteKey = context.env.TURNSTILE_SITE_KEY
  if (!siteKey) {
    console.error('Contact form: missing TURNSTILE_SITE_KEY')
    return Response.json({ error: 'Paslauga laikinai nepasiekiama' }, { status: 503 })
  }
  return Response.json({ turnstileSiteKey: siteKey }, { headers: { 'Cache-Control': 'public, max-age=300' } })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const contentType = context.request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return Response.json({ error: 'Neteisinga užklausa' }, { status: 415 })
  }

  const contentLength = Number(context.request.headers.get('content-length') ?? '0')
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: 'Užklausa per didelė' }, { status: 413 })
  }

  let payload: unknown
  try {
    payload = await context.request.json()
  } catch {
    return Response.json({ error: 'Neteisinga užklausa' }, { status: 400 })
  }

  const contact = normalizeContactPayload(payload)
  if (!contact) {
    return Response.json({ error: 'Neteisinga užklausa' }, { status: 400 })
  }

  // Honeypot filled → almost certainly a bot. Pretend success.
  if (contact.website) {
    return Response.json({ ok: true })
  }

  if (!validateContactPayload(contact)) {
    return Response.json({ error: 'Užpildykite privalomus laukus' }, { status: 422 })
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, CONTACT_RATE_LIMITER, TURNSTILE_SECRET_KEY } = context.env
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM || !CONTACT_RATE_LIMITER || !TURNSTILE_SECRET_KEY) {
    // Deployment not configured yet — fail loudly so it's noticed in logs
    console.error(
      'Contact form: missing RESEND_API_KEY / CONTACT_TO / CONTACT_FROM / TURNSTILE_SECRET_KEY or CONTACT_RATE_LIMITER binding',
    )
    return Response.json({ error: 'Paslauga laikinai nepasiekiama' }, { status: 503 })
  }

  // No token: rejected before it can use up the rate limit or a Siteverify call
  if (!contact.turnstileToken) {
    return Response.json(TURNSTILE_ERROR, { status: 403 })
  }

  if (await isRateLimited(context)) {
    return Response.json({ error: 'Per daug užklausų. Bandykite vėliau.' }, { status: 429 })
  }

  if (!(await verifyTurnstile(contact.turnstileToken, TURNSTILE_SECRET_KEY, clientIp(context.request)))) {
    return Response.json(TURNSTILE_ERROR, { status: 403 })
  }

  const html = `
    <h2>Nauja žinutė iš seimosidejucentras.lt</h2>
    <p><strong>Vardas:</strong> ${escapeHtml(contact.name)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(contact.email)}</p>
    ${contact.phone ? `<p><strong>Telefonas:</strong> ${escapeHtml(contact.phone)}</p>` : ''}
    <p><strong>Sutikimas dėl privatumo politikos:</strong> Taip</p>
    <p><strong>Žinutė:</strong></p>
    <p>${escapeHtml(contact.message).replaceAll('\n', '<br />')}</p>
  `

  let response: Response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Svetainės forma <${CONTACT_FROM}>`,
        to: [CONTACT_TO],
        reply_to: contact.email,
        subject: `Nauja žinutė iš svetainės: ${contact.name}`,
        html,
      }),
    })
  } catch (error) {
    console.error('Resend API request failed:', error)
    return Response.json({ error: 'Nepavyko išsiųsti žinutės' }, { status: 502 })
  }

  if (!response.ok) {
    const detail = await response.text()
    console.error('Resend API error:', response.status, detail)
    return Response.json({ error: 'Nepavyko išsiųsti žinutės' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
