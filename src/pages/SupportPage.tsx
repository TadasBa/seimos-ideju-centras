import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { CheckIcon } from '../components/icons'
import { supportPage } from '../content/lt/support'
import { footer } from '../content/lt/common'

export function SupportPage() {
  useDocumentMeta(supportPage.title, supportPage.intro)
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(value)
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard unavailable (e.g. http) — silently ignore
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" title={supportPage.title}>
            <p className="lead">{supportPage.intro}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight" id="skirtiparama">
        <div className="container">
          <h2 className="section-title">{supportPage.requisitesTitle}</h2>
          <div className="support-req">
            {supportPage.requisites.map((requisite) => (
              <div key={requisite.label} className="card">
                <span className="muted">{requisite.label}</span>
                <strong>
                  {requisite.value}
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => copy(requisite.value)}
                    aria-label={`Kopijuoti: ${requisite.label}`}
                  >
                    {copied === requisite.value ? 'Nukopijuota ✓' : 'Kopijuoti'}
                  </button>
                </strong>
              </div>
            ))}
          </div>
          <p className="lead" style={{ marginTop: 'var(--space-5)', fontWeight: 580 }}>
            {supportPage.campaignNote}
          </p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="split">
            <SectionHeading title={supportPage.whyTitle} />
            {supportPage.why.map((paragraph) => (
              <p key={paragraph.slice(0, 30)} style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-3)' }}>
                {paragraph}
              </p>
            ))}
            <div className="hero__actions" style={{ marginTop: 'var(--space-5)' }}>
              <Link to="/skirti-1-2-gpm" className="btn btn--fire">
                {supportPage.gpmCta}
              </Link>
              <a href={footer.supportRules.href} target="_blank" rel="noreferrer" className="btn btn--ghost">
                {supportPage.rulesLabel}
              </a>
            </div>
            <div className="card">
              <h3>{supportPage.helpTitle}</h3>
              <ul className="feature-list" style={{ marginTop: 'var(--space-3)' }}>
                {supportPage.help.map((line) => (
                  <li key={line}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: 620, marginTop: 'var(--space-4)' }}>{supportPage.helpOutro}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
