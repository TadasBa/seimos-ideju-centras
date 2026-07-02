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
}

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  message?: string
  website?: string // honeypot
}

const MAX_LENGTHS = { name: 200, email: 320, phone: 50, message: 5000 } as const

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: ContactPayload
  try {
    payload = await context.request.json<ContactPayload>()
  } catch {
    return Response.json({ error: 'Neteisinga užklausa' }, { status: 400 })
  }

  // Honeypot filled → almost certainly a bot. Pretend success.
  if (payload.website) {
    return Response.json({ ok: true })
  }

  const name = (payload.name ?? '').trim().slice(0, MAX_LENGTHS.name)
  const email = (payload.email ?? '').trim().slice(0, MAX_LENGTHS.email)
  const phone = (payload.phone ?? '').trim().slice(0, MAX_LENGTHS.phone)
  const message = (payload.message ?? '').trim().slice(0, MAX_LENGTHS.message)

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Užpildykite privalomus laukus' }, { status: 422 })
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = context.env
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    // Deployment not configured yet — fail loudly so it's noticed in logs
    console.error('Contact form: missing RESEND_API_KEY / CONTACT_TO / CONTACT_FROM env vars')
    return Response.json({ error: 'Paslauga laikinai nepasiekiama' }, { status: 503 })
  }

  const html = `
    <h2>Nauja žinutė iš seimosidejucentras.lt</h2>
    <p><strong>Vardas:</strong> ${escapeHtml(name)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Telefonas:</strong> ${escapeHtml(phone)}</p>` : ''}
    <p><strong>Žinutė:</strong></p>
    <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Svetainės forma <${CONTACT_FROM}>`,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `Nauja žinutė iš svetainės: ${name}`,
      html,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error('Resend API error:', response.status, detail)
    return Response.json({ error: 'Nepavyko išsiųsti žinutės' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
