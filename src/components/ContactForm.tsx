import { useState, type FormEvent } from 'react'
import { contactsPage } from '../content/lt/contacts'
import { org } from '../content/lt/common'

type Status = 'idle' | 'sending' | 'success' | 'error'

/**
 * Contact form posting to the Cloudflare Pages Function at /api/contact.
 * Includes a honeypot field ("website") that silently rejects bots.
 */
export function ContactForm() {
  const { form } = contactsPage
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, consent, website }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('success')
      formElement.reset()
    } catch {
      setStatus('error')
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
      {status === 'error' ? (
        <p className="form-status form-status--error" role="alert">
          {form.error}{' '}
          <a href={`mailto:${org.email}`} style={{ color: 'inherit', fontWeight: 700 }}>
            {org.email}
          </a>
        </p>
      ) : null}
    </form>
  )
}
