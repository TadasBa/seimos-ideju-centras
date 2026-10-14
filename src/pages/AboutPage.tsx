import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { Scribble } from '../components/Scribble'
import { Timeline } from '../components/Timeline'
import { CheckIcon } from '../components/icons'
import { aboutPage, aboutValues, historyParagraphs, timeline } from '../content/lt/about'

export function AboutPage() {
  useDocumentMeta(aboutPage.title, aboutPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{aboutPage.title}</h1>
          <hr className="page-hero__rule" />
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="split split--reverse">
            <div className="split__media">
              <div className="photo-frame">
                <img src={aboutPage.introImage} alt={aboutPage.introImageAlt} />
              </div>
            </div>
            <div>
              <SectionHeading title={aboutPage.missionTitle} />
              <p className="lead">{aboutPage.mission}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <h2 className="section-title">
            <Scribble>Mūsų vertybės</Scribble>:
          </h2>
          <ul className="value-list">
            {aboutValues.map((value) => (
              <li key={value.title}>
                <CheckIcon className="value-list__flame" />
                <span>
                  <strong>{value.title}</strong> – {value.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split split--start">
            <div>
              <SectionHeading title={aboutPage.historyTitle} />
              {historyParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  style={{ color: 'var(--ink-body)', marginBottom: 'var(--space-4)' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="split__media">
              <div className="photo-frame">
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
