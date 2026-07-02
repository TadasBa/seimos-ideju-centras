import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { CheckIcon, ExternalIcon } from '../components/icons'
import { gpmPage } from '../content/lt/support'

export function GpmPage() {
  useDocumentMeta(gpmPage.title, gpmPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" title={gpmPage.title}>
            <p className="lead">{gpmPage.intro}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight">
        <div className="container container--narrow">
          <ol className="steps">
            {gpmPage.steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                {step.lines.map((line) => (
                  <p key={line.slice(0, 30)}>{line}</p>
                ))}
              </li>
            ))}
          </ol>

          <a
            href={gpmPage.edsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn--fire"
            style={{ marginTop: 'var(--space-6)' }}
          >
            {gpmPage.edsCta} <ExternalIcon />
          </a>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <SectionHeading title={gpmPage.goodToKnowTitle} />
          <ul className="feature-list">
            {gpmPage.goodToKnow.map((line) => (
              <li key={line.slice(0, 30)}>
                <CheckIcon />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
