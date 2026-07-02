import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { EmberCanvas } from '../components/EmberCanvas'
import { WordTrailBand } from '../components/WordTrailBand'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { MediaCard } from '../components/MediaCard'
import { ArrowRightIcon, FlameIcon, FlourishUnderline } from '../components/icons'
import { org } from '../content/lt/common'
import {
  aboutSection,
  ctaBand,
  hero,
  heroValues,
  homeMedia,
  mediaSection,
  services,
  servicesSection,
  storiesSection,
} from '../content/lt/home'
import { projects, projectsPage } from '../content/lt/projects'
import { stories } from '../content/lt/stories'

export function HomePage() {
  useDocumentMeta(null, org.description)

  const latestProjects = projects.slice(0, 4)

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <EmberCanvas className="hero__embers" />
        <div className="container hero__inner">
          <div>
            <h1>
              VšĮ Šeimos idėjų{' '}
              <span className="underline-flourish">
                centras
                <FlourishUnderline />
              </span>
            </h1>
            <p className="hero__text">{hero.text}</p>

            <div className="hero__values">
              <h2>{hero.valuesTitle}</h2>
              <ul>
                {heroValues.map((value) => (
                  <li key={value.title}>
                    <FlameIcon /> {value.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero__actions">
              <a href="#paslaugos" className="btn btn--fire">
                {hero.primaryCta.label}
              </a>
              <Link to={hero.secondaryCta.to} className="btn btn--ghost">
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="hero__media">
            <div className="arch-frame">
              <img src={hero.image} alt={hero.imageAlt} fetchPriority="high" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section" id="paslaugos">
        <div className="container">
          <Reveal>
            <div className="stories-intro">
              <SectionHeading eyebrow={servicesSection.eyebrow} title={servicesSection.title} flourish />
              <Link to="/kontaktai" className="btn btn--ghost">
                {servicesSection.ctaLabel}
              </Link>
            </div>
          </Reveal>
          <div className="media-grid">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 90}>
                <Link to={service.slug} className="card service-card">
                  <div className="service-card__media">
                    <img src={service.image} alt={service.imageAlt} loading="lazy" />
                  </div>
                  <div className="service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.excerpt}</p>
                    <span className="service-card__more">
                      Plačiau <ArrowRightIcon />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- About strip ---------- */}
      <section className="section section--alt">
        <div className="container">
          <Reveal>
            <div className="history-strip">
              <div className="history-strip__year">{aboutSection.year}</div>
              <div>
                <p className="eyebrow">{aboutSection.eyebrow}</p>
                <h2 className="section-title">{aboutSection.title}</h2>
                {aboutSection.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="lead" style={{ marginBottom: 'var(--space-3)' }}>
                    {paragraph}
                  </p>
                ))}
                <Link to="/apie-mus" className="btn btn--ghost" style={{ marginTop: 'var(--space-3)' }}>
                  {aboutSection.ctaLabel}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Media ---------- */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="stories-intro">
              <SectionHeading eyebrow={mediaSection.eyebrow} title={mediaSection.title} />
              <Link to="/spaudoje" className="btn btn--ghost">
                {mediaSection.ctaLabel}
              </Link>
            </div>
          </Reveal>
          <div className="media-grid">
            {homeMedia.map((item, index) => (
              <Reveal key={item.url} delay={index * 90}>
                <MediaCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Projects preview ---------- */}
      <section className="section section--alt">
        <div className="container">
          <Reveal>
            <div className="stories-intro">
              <SectionHeading eyebrow={projectsPage.title} title="Naujausi projektai" />
              <Link to="/projektai" className="btn btn--ghost">
                Visi projektai
              </Link>
            </div>
          </Reveal>
          <div className="media-grid">
            {latestProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 80}>
                <Link to={`/projektai#${project.id}`} className="card">
                  <span className="project-year">{project.year}</span>
                  <h3 style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-md)', lineHeight: 1.4 }}>
                    {project.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Success stories ---------- */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="stories-intro">
              <SectionHeading eyebrow={storiesSection.eyebrow} title={storiesSection.title} flourish>
                <p className="lead">{storiesSection.text}</p>
              </SectionHeading>
            </div>
          </Reveal>
          <div className="media-grid">
            {stories.map((story, index) => (
              <Reveal key={story.id} delay={index * 90}>
                <Link to={`/apsaugotas-bustas#${story.id}`} className="card">
                  <h3 style={{ fontSize: 'var(--text-lg)' }}>{story.title}</h3>
                  <p>{story.paragraphs[0]}</p>
                  <span className="service-card__more" style={{ marginTop: 'var(--space-4)' }}>
                    Skaityti visą istoriją <ArrowRightIcon />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA band with word trail ---------- */}
      <WordTrailBand words={ctaBand.words}>
        <div className="container cta-band__inner">
          <h2>{ctaBand.title}</h2>
          <p>{ctaBand.text}</p>
          <Link to="/kontaktai" className="btn btn--fire">
            {ctaBand.ctaLabel}
          </Link>
          <span className="cta-band__hint">{ctaBand.hint}</span>
        </div>
      </WordTrailBand>
    </>
  )
}
