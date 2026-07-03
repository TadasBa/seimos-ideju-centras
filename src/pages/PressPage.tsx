import { useDocumentMeta } from '../hooks/useDocumentMeta'
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
          <SectionHeading as="h1" title={pressPage.title}>
            <p className="lead">{pressPage.intro}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <h2 className="section-title">{pressPage.mediaTitle}</h2>
          <div className="media-grid">
            {pressMedia.map((item) => (
              <MediaCard key={item.url} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">{pressPage.articlesTitle}</h2>
          <div className="media-grid">
            {pressArticles.map((article) => (
              <a key={article.url} className="card media-card" href={article.url} target="_blank" rel="noreferrer">
                {article.image ? (
                  <div className="media-card__thumb">
                    <img src={article.image} alt="" loading="lazy" />
                  </div>
                ) : null}
                <div className="media-card__body">
                  <span className="muted">
                    {article.source} <ExternalIcon />
                  </span>
                  <h3>{article.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
