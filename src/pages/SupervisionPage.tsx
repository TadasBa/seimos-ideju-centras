import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { CheckIcon, ExternalIcon } from '../components/icons'
import { supervision } from '../content/lt/supervision'

export function SupervisionPage() {
  useDocumentMeta(supervision.title, supervision.what[0])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <SectionHeading as="h1" title={supervision.title} flourish>
              <p className="lead">{supervision.what[0]}</p>
            </SectionHeading>
          </Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="container container--narrow">
          <Reveal>
            <SectionHeading title={supervision.whatTitle}>
              <p className="muted" style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-sm)' }}>
                {supervision.whatSource}
              </p>
            </SectionHeading>
            {supervision.what.map((paragraph) => (
              <p key={paragraph.slice(0, 30)} style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-3)' }}>
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="split split--reverse">
            <Reveal className="split__media">
              <div className="arch-frame">
                <img src={supervision.supervisorImage} alt={supervision.supervisorImageAlt} loading="lazy" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <SectionHeading title={supervision.supervisorTitle} flourish />

              <h3 style={{ fontSize: 'var(--text-lg)', margin: 'var(--space-4) 0 var(--space-3)' }}>
                {supervision.educationTitle}
              </h3>
              <ul className="feature-list">
                {supervision.education.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize: 'var(--text-lg)', margin: 'var(--space-5) 0 var(--space-3)' }}>
                {supervision.specializationTitle}
              </h3>
              <ul className="feature-list">
                {supervision.specialization.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <blockquote className="quote-block">
              „{supervision.quote}“<footer>— {supervision.quoteAuthor}</footer>
            </blockquote>
          </Reveal>

          <Reveal>
            <a
              className="card"
              href={supervision.pressItem.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginTop: 'var(--space-6)' }}
            >
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-faint)',
                  }}
                >
                  {supervision.pressItem.source}
                </span>
                <h3 style={{ fontSize: 'var(--text-md)', lineHeight: 1.4, marginTop: '0.3rem' }}>
                  {supervision.pressItem.title}
                </h3>
              </div>
              <ExternalIcon />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <Reveal>
            <SectionHeading title={supervision.faqTitle} flourish />
          </Reveal>
          {supervision.faq.map((item, index) => (
            <Reveal key={item.question} delay={index * 70}>
              <details className="accordion" open={index === 0}>
                <summary>{item.question}</summary>
                <div className="accordion__body">
                  <p>{item.answer}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
