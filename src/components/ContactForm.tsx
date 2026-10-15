import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { contactsPage } from '../content/lt/contacts'
import { org } from '../content/lt/common'
import { Turnstile, type TurnstileHandle } from './Turnstile'

type Status = 'idle' | 'sending' | 'success' | 'error' | 'turnstile-error'

/**
 * Contact form posting to the Cloudflare Pages Function at /api/contact.
 * Includes a honeypot field ("website") that silently rejects bots, and a
 * Cloudflare Turnstile token that the function verifies before sending.
 */
export function ContactForm() {
  const { form } = contactsPage
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // The public site key lives in wrangler.toml and is served by the function
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [turnstileUnavailable, setTurnstileUnavailable] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileHandle>(null)
  const markUnavailable = useCallback(() => setTurnstileUnavailable(true), [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/contact', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((config: { turnstileSiteKey?: string }) => {
        if (cancelled) return
        if (config.turnstileSiteKey) setSiteKey(config.turnstileSiteKey)
        else setTurnstileUnavailable(true)
      })
      .catch(() => {
        if (!cancelled) setTurnstileUnavailable(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const data = new FormData(formElement)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const consent = data.get('consent') === 'on'
    const website = String(data.get('website') ?? '') // honeypot

    const validation: Record<string, string> = {}
    if (!name) validation.name = form.validation.name
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) validation.email = form.validation.email
    if (!message) validation.message = form.validation.message
    if (!consent) validation.consent = form.validation.consent
    if (Object.keys(validation).length === 0 && !token && !turnstileUnavailable) {
      validation.turnstile = form.turnstile.waiting
    }

    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, consent, website, turnstileToken: token ?? '' }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { code?: string } | null
        setStatus(body?.code === 'turnstile' ? 'turnstile-error' : 'error')
        return
      }
      setStatus('success')
      formElement.reset()
    } catch {
      setStatus('error')
    } finally {
      // A token is single-use whether or not the send succeeded: get a new one
      turnstileRef.current?.reset()
    }
  }

  return (
    <form className="form-grid" onSubmit={onSubmit} noValidate>
      {/* Name / email / phone share one row, as on the original site */}
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name">{form.name} *</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" required />
          {errors.name ? <span className="form-status form-status--error">{errors.name}</span> : null}
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">{form.email} *</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required />
          {errors.email ? (
            <span className="form-status form-status--error">{errors.email}</span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="contact-phone">{form.phone}</label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="contact-message">{form.message} *</label>
        <textarea id="contact-message" name="message" rows={6} required />
        {errors.message ? (
          <span className="form-status form-status--error">{errors.message}</span>
        ) : null}
      </div>

      {/* Honeypot — hidden from people, tempting for bots */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="form-consent">
        <input type="checkbox" name="consent" required />
        <span>* {form.consent}</span>
      </label>
      {errors.consent ? <span className="form-status form-status--error">{errors.consent}</span> : null}

      {siteKey ? (
        <Turnstile ref={turnstileRef} siteKey={siteKey} onToken={setToken} onUnavailable={markUnavailable} />
      ) : null}
      {errors.turnstile ? (
        <span className="form-status form-status--error" role="alert">
          {errors.turnstile}
        </span>
      ) : null}

      <div>
        <button type="submit" className="btn btn--fire" disabled={status === 'sending'}>
          {status === 'sending' ? form.sending : form.submit}
        </button>
      </div>

      {status === 'success' ? (
        <p className="form-status form-status--ok" role="status">
          {form.success}
        </p>
      ) : null}
      {status === 'turnstile-error' ? (
        <p className="form-status form-status--error" role="alert">
          {form.turnstile.failed}
        </p>
      ) : null}
      {status === 'error' || (turnstileUnavailable && status !== 'success') ? (
        <p className="form-status form-status--error" role="alert">
          {status === 'error' ? form.error : form.turnstile.unavailable}{' '}
          <a href={`mailto:${org.email}`} style={{ color: 'inherit', fontWeight: 700 }}>
            {org.email}
          </a>
        </p>
      ) : null}
    </form>
  )
}
