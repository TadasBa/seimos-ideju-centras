import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { CheckIcon, FlameIcon, MapPinIcon } from '../components/icons'
import { dayCenter } from '../content/lt/dayCenter'

export function DayCenterPage() {
  useDocumentMeta(dayCenter.title, dayCenter.subtitle)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="split">
            <Reveal>
              <SectionHeading as="h1" title={dayCenter.title} flourish>
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
            </Reveal>
            <Reveal delay={120} className="split__media">
              <div className="arch-frame">
                <img src={dayCenter.heroImage} alt={dayCenter.heroImageAlt} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <Reveal>
            <SectionHeading title={dayCenter.valuesTitle} flourish />
          </Reveal>
          <div className="media-grid">
            {dayCenter.values.map((value, index) => (
              <Reveal key={value.title} delay={index * 70}>
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
        <div className="container">
          <div className="split">
            <Reveal>
              <SectionHeading title={dayCenter.activitiesTitle} flourish />
              <ul className="feature-list">
                {dayCenter.activities.map((activity) => (
                  <li key={activity.slice(0, 30)}>
                    <CheckIcon />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="split__media">
              <div className="arch-frame">
                <img src={dayCenter.activitiesImage} alt={dayCenter.activitiesImageAlt} loading="lazy" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <Reveal>
            <SectionHeading title={dayCenter.infoTitle} flourish />
            <ul className="feature-list">
              {dayCenter.info.map((line) => (
                <li key={line.slice(0, 30)}>
                  <CheckIcon />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="section-title" style={{ marginTop: 'var(--space-7)' }}>
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
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split split--reverse">
            <Reveal className="split__media">
              <div className="arch-frame">
                <img src={dayCenter.campImage} alt={dayCenter.campImageAlt} loading="lazy" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <SectionHeading title={dayCenter.whyTitle} flourish />
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
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
