import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { FlameIcon } from '../components/icons'
import { aboutPage, aboutValues, historyParagraphs, timeline } from '../content/lt/about'

export function AboutPage() {
  useDocumentMeta(aboutPage.title, aboutPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <SectionHeading as="h1" title={aboutPage.title} flourish>
              <p className="lead">{aboutPage.intro}</p>
            </SectionHeading>
          </Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="container container--narrow">
          <Reveal>
            <h2 className="section-title">{aboutPage.missionTitle}</h2>
            <p className="lead">{aboutPage.mission}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <Reveal>
            <SectionHeading title={aboutPage.valuesTitle} flourish />
          </Reveal>
          <div className="media-grid">
            {aboutValues.map((value, index) => (
              <Reveal key={value.title} delay={index * 80}>
                <div className="card">
                  <FlameIcon className="value-list__flame" />
                  <h3 style={{ fontSize: 'var(--text-lg)', margin: 'var(--space-3) 0 var(--space-2)' }}>
                    {value.title}
                  </h3>
                  <p>{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <SectionHeading title={aboutPage.historyTitle} flourish />
          </Reveal>
          {historyParagraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 40)} delay={index * 60}>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-4)' }}>{paragraph}</p>
            </Reveal>
          ))}

          <Reveal>
            <ol className="timeline" style={{ marginTop: 'var(--space-7)' }}>
              {timeline.map((entry) => (
                <li key={entry.period}>
                  <strong>
                    {entry.period} — {entry.title}
                  </strong>
                  <p>{entry.description}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  )
}
