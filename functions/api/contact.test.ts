import { describe, expect, it } from 'vitest'
import { normalizeContactPayload, validateContactPayload } from './contact'

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
})
