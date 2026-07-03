import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { Timeline } from '../components/Timeline'
import { FlameIcon } from '../components/icons'
import { aboutPage, aboutValues, historyParagraphs, timeline } from '../content/lt/about'

export function AboutPage() {
  useDocumentMeta(aboutPage.title, aboutPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="split">
            <SectionHeading as="h1" title={aboutPage.title}>
              <p className="lead">{aboutPage.intro}</p>
              <h2 className="section-title" style={{ marginTop: 'var(--space-6)' }}>
                {aboutPage.missionTitle}
              </h2>
              <p className="lead">{aboutPage.mission}</p>
            </SectionHeading>
            <div className="split__media">
              <div className="arch-frame">
                <img src={aboutPage.introImage} alt={aboutPage.introImageAlt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading title={aboutPage.valuesTitle} />
          <div className="media-grid">
            {aboutValues.map((value) => (
              <div key={value.title} className="card value-card">
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
        <div className="container">
          <div className="split split--start">
            <div>
              <SectionHeading title={aboutPage.historyTitle} />
              {historyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-4)' }}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="split__media">
              <div className="arch-frame">
                <img src={aboutPage.historyImage} alt={aboutPage.historyImageAlt} loading="lazy" />
              </div>
            </div>
          </div>

          <Timeline entries={timeline} />
        </div>
      </section>
    </>
  )
}
