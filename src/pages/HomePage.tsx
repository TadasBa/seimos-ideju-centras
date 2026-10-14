import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Scribble } from '../components/Scribble'
import { AT_90, Reveal, SplitText } from '../components/motion'
import { ParallaxCircle, useTileParallax } from '../components/parallax'
import { DragCarousel } from '../components/DragCarousel'
import { VideoLightbox } from '../components/VideoLightbox'
import { RichText } from '../components/RichText'
import { CheckIcon, ChildrenIcon, HandsIcon, HouseIcon, PlayIcon } from '../components/icons'
import { org } from '../content/lt/common'
import {
  aboutSection,
  hero,
  heroValues,
  homeMedia,
  projectsSection,
  services,
  servicesSection,
  storiesSection,
} from '../content/lt/home'
import { projects } from '../content/lt/projects'
import { stories } from '../content/lt/stories'
import type { MediaItem, Project, ServiceSummary } from '../content/types'

const serviceIcons = {
  children: ChildrenIcon,
  house: HouseIcon,
  hands: HandsIcon,
}

export function HomePage() {
  useDocumentMeta(null, org.description)
  const [video, setVideo] = useState<MediaItem | null>(null)
  const closeVideo = useCallback(() => setVideo(null), [])

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero__inner">
          <Reveal className="hero__copy">
            <h1 className="hl-heading">
              <Scribble>{hero.title}</Scribble>
            </h1>
            <p className="hero__text">{hero.text}</p>
            <div className="fancy-list">
              <strong className="fancy-list__label">{hero.valuesTitle}</strong>
              <ul>
                {heroValues.map((value) => (
                  <li key={value.title}>
                    <CheckIcon className="fancy-list__icon" />
                    <strong>{value.title}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="hero__media">
            {/* The original masks a tall image with an arch shape */}
            <div className="arch">
              <img src={hero.image} alt={hero.imageAlt} width="688" height="1030" fetchPriority="high" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="home-services">
        <div className="container">
          <div className="section-head">
            <SplitText as="h2" text={servicesSection.title} />
            <Link to="/kontaktai" className="text-link">
              {servicesSection.ctaLabel}
            </Link>
          </div>

          <div className="tiles">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={(index + 1) * 100}>
                <ServiceTile service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section className="home-about">
        <div className="container">
          <Reveal effect="fade-in" trigger={AT_90} className="about-col">
            <ParallaxCircle className="about-col__circle" />
            <h2 className="hl-heading">
              <Scribble>{aboutSection.titleHighlight}</Scribble>
              {aboutSection.titleRest}
            </h2>
            {aboutSection.paragraphs.map((paragraph) => (
              <SplitText key={paragraph.slice(0, 24)} as="p" text={paragraph} className="about-col__text" />
            ))}
          </Reveal>
          {/* Outside the fading column, as on the original */}
          <div className="about-col__link">
            <Link to={aboutSection.ctaTo} className="text-link">
              {aboutSection.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Media ---------- */}
      <section className="home-media">
        <div className="container media-pair">
          {homeMedia.map((item) => (
            <VideoCard key={item.url} item={item} onPlay={setVideo} />
          ))}
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section className="home-projects">
        <div className="container">
          <div className="section-head">
            <SplitText as="h2" text={projectsSection.title} />
            <Link to="/projektai" className="text-link">
              {projectsSection.ctaLabel}
            </Link>
          </div>

          <DragCarousel label="Naujausi projektai" indicator="tooltip" attraction={0.02} className="projects-carousel">
            {projects.slice(0, projectsSection.count).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </DragCarousel>
        </div>
      </section>

      {/* ---------- Inspiring stories ---------- */}
      <section className="home-stories">
        <div className="container">
          <div className="story-card">
            <h2 className="hl-heading">
              <Scribble>{storiesSection.title}</Scribble>
            </h2>
            <DragCarousel label={storiesSection.title} indicator="circle" wrap progress className="stories-carousel">
              {stories.map((story) => (
                <article key={story.id} className="story">
                  <h3>{story.title}</h3>
                  {story.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </article>
              ))}
            </DragCarousel>
          </div>
        </div>
      </section>

      <VideoLightbox videoId={video?.youtubeId ?? null} title={video?.title ?? ''} onClose={closeVideo} />
    </>
  )
}

/* ------------------------------------------------------------------ */

function ServiceTile({ service }: { service: ServiceSummary }) {
  const boxRef = useRef<HTMLAnchorElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  useTileParallax(boxRef, layerRef)
  const Icon = serviceIcons[service.icon]

  return (
    <Link ref={boxRef} to={service.slug} className="tile">
      <div ref={layerRef} className="tile__layer">
        <img src={service.image} alt={service.imageAlt} loading="lazy" />
      </div>
      <div className="tile__body">
        <Icon className="tile__icon" />
        <h3>{service.title}</h3>
        <p>{service.excerpt}</p>
      </div>
    </Link>
  )
}

function VideoCard({ item, onPlay }: { item: MediaItem; onPlay: (item: MediaItem) => void }) {
  const thumbnail = (
    <span className="video-card__thumb">
      <img src={item.image} alt="" loading="lazy" />
      <span className="video-card__play">
        <PlayIcon />
      </span>
    </span>
  )

  return (
    <div className="video-card">
      {item.youtubeId ? (
        <button type="button" className="video-card__link" onClick={() => onPlay(item)}>
          {thumbnail}
          <span className="sr-only">Žiūrėti: {item.title}</span>
        </button>
      ) : (
        <a className="video-card__link" href={item.url} target="_blank" rel="noreferrer">
          {thumbnail}
          <span className="sr-only">Klausyti: {item.title}</span>
        </a>
      )}
      <p className="video-card__caption">{item.title}</p>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projektai#${project.id}`} className="pcard" draggable={false}>
      <div className="pcard__bg">
        {project.image ? <img src={project.image} alt="" loading="lazy" draggable={false} /> : null}
      </div>
      <div className="pcard__content">
        <span className="pcard__year">{project.year}</span>
        {/* Inline heading in a 29px-leading block, as on the original:
            that is what spaces the title lines 33px apart. */}
        <div className="pcard__main">
          <h3 className="pcard__title">
            <span>{project.title}</span>
          </h3>
        </div>
      </div>
    </Link>
  )
}
