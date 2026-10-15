import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { CheckIcon } from '../components/icons'
import { DonationWidget } from '../components/DonationWidget'
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
      {/* Intro and requisites beside a photo from the day center the
          campaign supports */}
      <section className="page-hero support-hero">
        <div className="container">
          <div className="split split--flush">
            <div>
              <SectionHeading as="h1" title={supportPage.title}>
                <p className="lead">{supportPage.intro}</p>
              </SectionHeading>

              <div id="skirtiparama" className="support-hero__requisites">
                <h2 className="section-title">{supportPage.requisitesTitle}</h2>
                <div className="support-req support-req--stacked">
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
            </div>
            <div className="split__media">
              <div className="photo-frame">
                <img src={supportPage.heroImage} alt={supportPage.heroImageAlt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
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
        </div>
      </section>

      {/* As on the original: what the support pays for, beside the payment form */}
      <section className="section" id="parama-internetu">
        <div className="container pair-grid">
          <div>
            <h2 className="section-title">{supportPage.helpTitle}</h2>
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
          <DonationWidget project={supportPage.donationProject} />
        </div>
      </section>
    </>
  )
}
