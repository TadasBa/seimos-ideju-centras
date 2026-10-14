import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { Scribble } from '../components/Scribble'
import { CheckIcon, MapPinIcon } from '../components/icons'
import { dayCenter } from '../content/lt/dayCenter'

export function DayCenterPage() {
  useDocumentMeta(dayCenter.title, dayCenter.subtitle)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="split">
            <SectionHeading as="h1" title={dayCenter.title}>
              <p className="lead" style={{ fontWeight: 560 }}>
                {dayCenter.subtitle}
              </p>
              <p className="lead" style={{ marginTop: 'var(--space-4)' }}>
                {dayCenter.intro}
              </p>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: 'var(--space-4)',
                  fontWeight: 600,
                }}
              >
                <MapPinIcon /> {dayCenter.addressLabel} {dayCenter.address}
              </p>
            </SectionHeading>
            <div className="split__media">
              <div className="photo-frame">
                <img src={dayCenter.heroImage} alt={dayCenter.heroImageAlt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h2 className="section-title">
            <Scribble>{dayCenter.valuesTitle}</Scribble>:
          </h2>
          <ul className="value-list">
            {dayCenter.values.map((value) => (
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
              <SectionHeading title={dayCenter.activitiesTitle} />
              <ul className="feature-list">
                {dayCenter.activities.map((activity) => (
                  <li key={activity.slice(0, 30)}>
                    <CheckIcon />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="split__media">
              <div className="photo-frame">
                <img src={dayCenter.activitiesImage} alt={dayCenter.activitiesImageAlt} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="split split--reverse split--start">
            <div className="split__media">
              <div className="photo-frame">
                <img src={dayCenter.infoImage} alt={dayCenter.infoImageAlt} loading="lazy" />
              </div>
            </div>
            <div>
              <SectionHeading title={dayCenter.infoTitle} />
              <ul className="feature-list">
                {dayCenter.info.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <h2 className="section-title" style={{ marginTop: 'var(--space-6)' }}>
                {dayCenter.alsoTitle}
              </h2>
              <ul className="feature-list">
                {dayCenter.also.map((item) => (
                  <li key={item.title}>
                    <CheckIcon />
                    <span>
                      <strong>{item.title}.</strong> {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split split--start">
            <div>
              <SectionHeading title={dayCenter.whyTitle} />
              <p style={{ color: 'var(--ink-soft)' }}>{dayCenter.why}</p>
              <p style={{ fontWeight: 620, marginTop: 'var(--space-4)' }}>{dayCenter.whyNote}</p>

              <h3 style={{ margin: 'var(--space-5) 0 var(--space-3)', fontSize: 'var(--text-lg)' }}>
                {dayCenter.supportHelpTitle}
              </h3>
              <ul className="feature-list">
                {dayCenter.supportHelp.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: 620, margin: 'var(--space-4) 0' }}>{dayCenter.supportOutro}</p>
              <Link to="/parama" className="btn btn--fire">
                {dayCenter.supportCta}
              </Link>
            </div>
            <div className="split__media">
              <div className="photo-frame">
                <img src={dayCenter.campImage} alt={dayCenter.campImageAlt} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
