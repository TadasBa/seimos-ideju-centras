import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { PlayIcon } from '../components/icons'
import { pressArticles, pressMedia, pressPage } from '../content/lt/press'

export function PressPage() {
  useDocumentMeta(pressPage.title, pressPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{pressPage.title}</h1>
          <p className="lead">{pressPage.intro}</p>
          <hr className="page-hero__rule" />
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <h2 className="section-title">{pressPage.mediaTitle}</h2>
          {pressMedia.map((item) => (
            <a key={item.url} className="media-row" href={item.url} target="_blank" rel="noreferrer">
              <div className="media-row__media">
                <img src={item.image} alt="" loading="lazy" />
                <span className="thumb-card__play">
                  <span>
                    <PlayIcon />
                  </span>
                </span>
              </div>
              <div>
                <span className="muted">{item.tag}</span>
                <h3>{item.title}</h3>
                <span className="text-link">Žiūrėti</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">{pressPage.articlesTitle}</h2>
          {pressArticles.map((article) => (
            <a
              key={article.url}
              className="media-row"
              href={article.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="media-row__media">
                {article.image ? <img src={article.image} alt="" loading="lazy" /> : null}
              </div>
              <div>
                <span className="muted">{article.source}</span>
                <h3>{article.title}</h3>
                <span className="text-link">Skaityti</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
