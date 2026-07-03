import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { MediaCard } from '../components/MediaCard'
import { CheckIcon } from '../components/icons'
import { supervision } from '../content/lt/supervision'

export function SupervisionPage() {
  useDocumentMeta(supervision.title, supervision.what[0])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" title={supervision.title}>
            <p className="lead">{supervision.what[0]}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <SectionHeading title={supervision.whatTitle}>
            <p style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-sm)' }}>
              {supervision.whatSource}
            </p>
          </SectionHeading>
          {supervision.what.map((paragraph) => (
            <p
              key={paragraph.slice(0, 30)}
              style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-3)', maxWidth: '62ch' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Supervisor: photo + education + specialisation, like the original page */}
      <section className="section section--alt">
        <div className="container">
          <div className="split split--reverse split--start">
            <div className="split__media">
              <div className="arch-frame">
                <img src={supervision.supervisorImage} alt={supervision.supervisorImageAlt} loading="lazy" />
              </div>
            </div>
            <div>
              <SectionHeading title={supervision.supervisorTitle} />

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
            </div>
          </div>
        </div>
      </section>

      {/* Experience quote + video shortcut to the Bernardinai interview */}
      <section className="section">
        <div className="container">
          <SectionHeading title={supervision.experienceTitle} />
          <div className="split split--start">
            <blockquote className="quote-block">
              „{supervision.quote}“<footer>— {supervision.quoteAuthor}</footer>
            </blockquote>
            <MediaCard item={supervision.videoItem} />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading title={supervision.faqTitle} />
          {supervision.faq.map((item, index) => (
            <details key={item.question} className="accordion" open={index === 0}>
              <summary>{item.question}</summary>
              <div className="accordion__body">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
