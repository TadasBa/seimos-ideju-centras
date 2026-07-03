/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Receives the contact form and forwards it by email through Resend
 * (https://resend.com — free tier: 3 000 emails/month, more than enough
 * for a contact form; no credit card required).
 *
 * Required environment variables (Cloudflare Pages → Settings →
 * Environment variables):
 *   RESEND_API_KEY   — API key from resend.com
 *   CONTACT_TO       — where to deliver messages, e.g. info@seimosidejucentras.lt
 *   CONTACT_FROM     — verified sender, e.g. svetaine@seimosidejucentras.lt
 *
 * The form includes a honeypot field ("website"): bots fill it, people
 * never see it. Honeypot submissions get a fake 200 so bots don't retry.
 */

interface Env {
  RESEND_API_KEY: string
  CONTACT_TO: string
  CONTACT_FROM: string
  CONTACT_RATE_LIMITER: KVNamespace
}

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  message?: string
  consent?: boolean
  website?: string // honeypot
}

const MAX_LENGTHS = { name: 200, email: 320, phone: 50, message: 5000 } as const
const MAX_BODY_BYTES = 12_000
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60
const RATE_LIMIT_MAX_SUBMISSIONS = 5
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NormalizedContact {
  name: string
  email: string
  phone: string
  message: string
  consent: boolean
  website: string
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
  }
}

export function validateContactPayload(contact: NormalizedContact): boolean {
  return Boolean(contact.name && contact.message && contact.consent && EMAIL_PATTERN.test(contact.email))
}

function clientKey(request: Request): string {
  const ip =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'unknown'
  return `contact:${ip}`
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

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, CONTACT_RATE_LIMITER } = context.env
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM || !CONTACT_RATE_LIMITER) {
    // Deployment not configured yet — fail loudly so it's noticed in logs
    console.error('Contact form: missing RESEND_API_KEY / CONTACT_TO / CONTACT_FROM env vars or CONTACT_RATE_LIMITER binding')
    return Response.json({ error: 'Paslauga laikinai nepasiekiama' }, { status: 503 })
  }

  if (await isRateLimited(context)) {
    return Response.json({ error: 'Per daug užklausų. Bandykite vėliau.' }, { status: 429 })
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
