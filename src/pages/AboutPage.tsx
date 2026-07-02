import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { FlameIcon } from '../components/icons'
import { aboutPage, aboutValues, historyParagraphs, timeline } from '../content/lt/about'

export function AboutPage() {
  useDocumentMeta(aboutPage.title, aboutPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" title={aboutPage.title}>
            <p className="lead">{aboutPage.intro}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight">
        <div className="container container--narrow">
          <h2 className="section-title">{aboutPage.missionTitle}</h2>
          <p className="lead">{aboutPage.mission}</p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading title={aboutPage.valuesTitle} />
          <div className="media-grid">
            {aboutValues.map((value) => (
              <div key={value.title} className="card">
                <FlameIcon className="value-list__flame" />
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 'var(--space-3) 0 var(--space-2)' }}>
                  {value.title}
                </h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHeading title={aboutPage.historyTitle} />
          {historyParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-4)' }}>{paragraph}</p>
          ))}

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
        </div>
      </section>
    </>
  )
}
