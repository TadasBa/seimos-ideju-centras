import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { CheckIcon, ExternalIcon } from '../components/icons'
import { gpmPage } from '../content/lt/support'

export function GpmPage() {
  useDocumentMeta(gpmPage.title, gpmPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <SectionHeading as="h1" title={gpmPage.title} flourish>
              <p className="lead">{gpmPage.intro}</p>
            </SectionHeading>
          </Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="container container--narrow">
          <Reveal>
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
          </Reveal>

          <Reveal>
            <a
              href={gpmPage.edsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn--fire"
              style={{ marginTop: 'var(--space-6)' }}
            >
              {gpmPage.edsCta} <ExternalIcon />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <Reveal>
            <SectionHeading title={gpmPage.goodToKnowTitle} flourish />
            <ul className="feature-list">
              {gpmPage.goodToKnow.map((line) => (
                <li key={line.slice(0, 30)}>
                  <CheckIcon />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
