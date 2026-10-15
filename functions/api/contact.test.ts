import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { normalizeContactPayload, onRequestGet, onRequestPost, validateContactPayload } from './contact'

describe('contact payload validation', () => {
  it('rejects non-object payloads', () => {
    expect(normalizeContactPayload(null)).toBeNull()
    expect(normalizeContactPayload([])).toBeNull()
    expect(normalizeContactPayload('hello')).toBeNull()
  })

  it('requires name, email, message, and consent', () => {
    const contact = normalizeContactPayload({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello',
      consent: true,
    })

    expect(contact).not.toBeNull()
    expect(validateContactPayload(contact!)).toBe(true)
  })

  it('rejects missing consent and invalid email addresses', () => {
    const missingConsent = normalizeContactPayload({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello',
    })
    const invalidEmail = normalizeContactPayload({
      name: 'Test User',
      email: 'not-an-email',
      message: 'Hello',
      consent: true,
    })

    expect(validateContactPayload(missingConsent!)).toBe(false)
    expect(validateContactPayload(invalidEmail!)).toBe(false)
  })

  it('normalizes strings and caps long values', () => {
    const contact = normalizeContactPayload({
      name: `  ${'A'.repeat(300)}  `,
      email: `  person@example.com  `,
      phone: '  +370 600 00000  ',
      message: `  ${'M'.repeat(6000)}  `,
      consent: true,
      website: '  bot.example  ',
    })

    expect(contact?.name).toHaveLength(200)
    expect(contact?.email).toBe('person@example.com')
    expect(contact?.phone).toBe('+370 600 00000')
    expect(contact?.message).toHaveLength(5000)
    expect(contact?.website).toBe('bot.example')
  })

  it('keeps the Turnstile token, trimmed and capped', () => {
    const contact = normalizeContactPayload({ turnstileToken: `  ${'t'.repeat(3000)}  ` })
    expect(contact?.turnstileToken).toHaveLength(2048)
    expect(normalizeContactPayload({})?.turnstileToken).toBe('')
  })
})

/* ---------- Request handler ---------- */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const RESEND_URL = 'https://api.resend.com/emails'

const validBody = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'Hello',
  consent: true,
  website: '',
  turnstileToken: 'token-123',
}

function createKv() {
  const store = new Map<string, string>()
  return {
    store,
    get: vi.fn(async (key: string, type?: string) => {
      const value = store.get(key)
      if (value === undefined) return null
      return type === 'json' ? JSON.parse(value) : value
    }),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value)
    }),
  }
}

function createEnv(overrides: Record<string, unknown> = {}) {
  return {
    RESEND_API_KEY: 're_test',
    CONTACT_TO: 'info@example.com',
    CONTACT_FROM: 'form@example.com',
    CONTACT_RATE_LIMITER: createKv(),
    TURNSTILE_SITE_KEY: 'site-key',
    TURNSTILE_SECRET_KEY: 'turnstile-secret',
    ...overrides,
  }
}

function post(body: unknown, env = createEnv(), ip = '203.0.113.7') {
  const request = new Request('https://seimosidejucentras.lt/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: JSON.stringify(body),
  })
  // Only request and env are used by the handler
  return onRequestPost({ request, env } as unknown as Parameters<typeof onRequestPost>[0]) as Promise<Response>
}

type FetchMock = ReturnType<typeof vi.fn>

/** Routes Siteverify and Resend calls to canned responses */
function mockFetch(siteverify: () => Response | Promise<Response>): FetchMock {
  const fn = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (url === SITEVERIFY_URL) return siteverify()
    if (url === RESEND_URL) return Response.json({ id: 'email_1' })
    throw new Error(`Unexpected fetch: ${url}`)
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

const callsTo = (fn: FetchMock, url: string) => fn.mock.calls.filter(([input]) => String(input) === url)

describe('contact handler', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('serves the public site key on GET', async () => {
    const ok = (await onRequestGet({ env: createEnv() } as unknown as Parameters<typeof onRequestGet>[0])) as Response
    expect(await ok.json()).toEqual({ turnstileSiteKey: 'site-key' })

    const missing = (await onRequestGet({
      env: createEnv({ TURNSTILE_SITE_KEY: '' }),
    } as unknown as Parameters<typeof onRequestGet>[0])) as Response
    expect(missing.status).toBe(503)
  })

  it('rejects a missing Turnstile token without calling Siteverify or Resend', async () => {
    const fetchMock = mockFetch(() => Response.json({ success: true }))
    const env = createEnv()

    const response = await post({ ...validBody, turnstileToken: '' }, env)

    expect(response.status).toBe(403)
    expect(await response.json()).toMatchObject({ code: 'turnstile' })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(env.CONTACT_RATE_LIMITER.put).not.toHaveBeenCalled()
  })

  it('rejects a token that Siteverify does not accept, without calling Resend', async () => {
    const fetchMock = mockFetch(() => Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] }))

    const response = await post(validBody)

    expect(response.status).toBe(403)
    expect(await response.json()).toMatchObject({ code: 'turnstile' })
    expect(callsTo(fetchMock, SITEVERIFY_URL)).toHaveLength(1)
    expect(callsTo(fetchMock, RESEND_URL)).toHaveLength(0)
  })

  it('fails closed when Siteverify errors or is unreachable', async () => {
    const httpError = mockFetch(() => new Response('oops', { status: 500 }))
    expect((await post(validBody)).status).toBe(403)
    expect(callsTo(httpError, RESEND_URL)).toHaveLength(0)

    const networkError = mockFetch(() => Promise.reject(new TypeError('network down')))
    expect((await post(validBody)).status).toBe(403)
    expect(callsTo(networkError, RESEND_URL)).toHaveLength(0)
  })

  it('sends the email after a valid token, passing secret, token and IP to Siteverify', async () => {
    const fetchMock = mockFetch(() => Response.json({ success: true }))

    const response = await post(validBody)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })

    const [[, verifyInit]] = callsTo(fetchMock, SITEVERIFY_URL)
    const form = verifyInit?.body as FormData
    expect(form.get('secret')).toBe('turnstile-secret')
    expect(form.get('response')).toBe('token-123')
    expect(form.get('remoteip')).toBe('203.0.113.7')

    const resendCalls = callsTo(fetchMock, RESEND_URL)
    expect(resendCalls).toHaveLength(1)
    const email = JSON.parse(String(resendCalls[0][1]?.body))
    expect(email).toMatchObject({ to: ['info@example.com'], reply_to: 'test@example.com' })
    // Siteverify ran before Resend
    expect(String(fetchMock.mock.calls[0][0])).toBe(SITEVERIFY_URL)
  })

  it('still answers honeypot submissions with a fake success and sends nothing', async () => {
    const fetchMock = mockFetch(() => Response.json({ success: true }))

    const response = await post({ ...validBody, website: 'https://spam.example' })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('still rate-limits by IP before verifying the token', async () => {
    const fetchMock = mockFetch(() => Response.json({ success: true }))
    const env = createEnv()

    for (let i = 0; i < 5; i += 1) {
      expect((await post(validBody, env)).status).toBe(200)
    }
    const limited = await post(validBody, env)
    expect(limited.status).toBe(429)
    // The sixth request never reached Siteverify or Resend
    expect(callsTo(fetchMock, SITEVERIFY_URL)).toHaveLength(5)
    expect(callsTo(fetchMock, RESEND_URL)).toHaveLength(5)

    // Another visitor is unaffected
    expect((await post(validBody, env, '198.51.100.1')).status).toBe(200)
  })

  it('keeps the body size and field validation', async () => {
    mockFetch(() => Response.json({ success: true }))
    const tooLarge = new Request('https://seimosidejucentras.lt/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': '20000' },
      body: '{}',
    })
    const sizeResponse = (await onRequestPost({
      request: tooLarge,
      env: createEnv(),
    } as unknown as Parameters<typeof onRequestPost>[0])) as Response
    expect(sizeResponse.status).toBe(413)

    expect((await post({ ...validBody, email: 'not-an-email' })).status).toBe(422)
  })
})
