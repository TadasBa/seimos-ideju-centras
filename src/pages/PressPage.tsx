import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { MediaCard } from '../components/MediaCard'
import { ExternalIcon } from '../components/icons'
import { pressArticles, pressMedia, pressPage } from '../content/lt/press'

export function PressPage() {
  useDocumentMeta(pressPage.title, pressPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <SectionHeading as="h1" title={pressPage.title} flourish>
              <p className="lead">{pressPage.intro}</p>
            </SectionHeading>
          </Reveal>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <Reveal>
            <h2 className="section-title">{pressPage.mediaTitle}</h2>
          </Reveal>
          <div className="media-grid">
            {pressMedia.map((item, index) => (
              <Reveal key={item.url} delay={index * 90}>
                <MediaCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <h2 className="section-title">{pressPage.articlesTitle}</h2>
          </Reveal>
          <div className="press-list">
            {pressArticles.map((article, index) => (
              <Reveal key={article.url} delay={Math.min(index, 5) * 60}>
                <a className="card press-item" href={article.url} target="_blank" rel="noreferrer">
                  <div>
                    <span className="muted">{article.source}</span>
                    <h3>{article.title}</h3>
                  </div>
                  <ExternalIcon />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
