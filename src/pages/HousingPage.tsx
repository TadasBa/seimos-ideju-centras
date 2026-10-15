import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { StoryAccordion } from '../components/StoryAccordion'
import { ImageLightbox } from '../components/ImageLightbox'
import { CheckIcon, MailIcon, PhoneIcon } from '../components/icons'
import { housing } from '../content/lt/housing'
import { stories, storiesTitle } from '../content/lt/stories'
import { org } from '../content/lt/common'

export function HousingPage() {
  useDocumentMeta(housing.title, housing.intro)
  const { hash } = useLocation()
  const openStoryId = hash ? hash.slice(1) : undefined
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)
  const closePhoto = useCallback(() => setPhotoIndex(null), [])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="split split--flush">
            <SectionHeading as="h1" title={housing.title}>
              <p className="lead" style={{ fontWeight: 560 }}>
                {housing.subtitle}
              </p>
              <p className="lead" style={{ marginTop: 'var(--space-4)' }}>
                {housing.intro}
              </p>
            </SectionHeading>
            <div className="split__media">
              <div className="photo-frame">
                <img
                  src={housing.heroImage}
                  alt={housing.heroImageAlt}
                  style={{ objectPosition: housing.heroImagePosition }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <SectionHeading title={housing.whatTitle} />
          <p style={{ color: 'var(--ink-soft)', maxWidth: '68ch' }}>{housing.what}</p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="split split--start split--flush">
            <div>
              <SectionHeading title={housing.howTitle} />
              {housing.how.map((paragraph) => (
                <p key={paragraph.slice(0, 30)} style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-3)' }}>
                  {paragraph}
                </p>
              ))}
              <ul className="feature-list">
                {housing.howList.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <h2 className="section-title" style={{ marginTop: 'var(--space-6)' }}>
                {housing.strengthenTitle}
              </h2>
              <ul className="feature-list">
                {housing.strengthen.map((line) => (
                  <li key={line}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="split__media">
              <div className="photo-frame">
                <img
                  src={housing.howImage}
                  alt={housing.howImageAlt}
                  loading="lazy"
                  style={{ objectPosition: housing.howImagePosition }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who can receive the service + what it consists of, side by side */}
      <section className="section">
        <div className="container">
          <div className="pair-grid">
            <div>
              <SectionHeading title={housing.whoTitle} />
              <ul className="feature-list">
                {housing.who.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading title={housing.compositionTitle} />
              <ul className="feature-list">
                {housing.composition.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <ul className="feature-list--nested">
                {housing.compositionList.map((line) => (
                  <li key={line.slice(0, 30)}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="split split--reverse split--start split--flush">
            <div className="split__media">
              <div className="photo-frame">
                <img
                  src={housing.livingImage}
                  alt={housing.livingImageAlt}
                  loading="lazy"
                  style={{ objectPosition: housing.livingImagePosition }}
                />
              </div>
            </div>
            <div>
              <SectionHeading title={housing.livingTitle} />
              <p style={{ color: 'var(--ink-soft)', marginBottom: 'var(--space-3)' }}>{housing.livingIntro}</p>
              <ul className="feature-list">
                {housing.livingList.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p style={{ color: 'var(--ink-soft)', marginTop: 'var(--space-4)' }}>{housing.livingOutro}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to get the service: steps left, financing + contacts right */}
      <section className="section">
        <div className="container">
          <div className="split split--start">
            <div>
              <SectionHeading title={housing.stepsTitle} />
              <ol className="steps">
                {housing.steps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    {step.lines.map((line) => (
                      <p key={line.slice(0, 30)}>{line}</p>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <SectionHeading title={housing.financeTitle} />
              <ul className="feature-list">
                {housing.finance.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <h2 className="section-title" style={{ marginTop: 'var(--space-6)' }}>
                {housing.applicantsTitle}
              </h2>
              <ul className="feature-list">
                {housing.applicants.map((line) => (
                  <li key={line.slice(0, 30)}>
                    <CheckIcon />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="card" style={{ marginTop: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                  {housing.contactTitle}
                </h2>
                <p style={{ marginBottom: 'var(--space-3)' }}>{housing.contactText}</p>
                <div className="contact-card">
                  <a href={`tel:${org.contacts.housing.phoneHref}`}>
                    <PhoneIcon /> {org.contacts.housing.phone} ({org.contacts.housing.name.split(' ')[0]})
                  </a>
                  <a href={`mailto:${org.email}`}>
                    <MailIcon /> {org.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt" id="istorijos">
        <div className="container">
          <SectionHeading eyebrow={storiesTitle} title="Istorijos, kurios prasidėjo iš naujo" />
          <StoryAccordion stories={stories} openId={openStoryId} />
        </div>
      </section>

      {/* Photo gallery, between the stories and the site-wide contact band.
          Up to 64rem it becomes a horizontally scrollable strip. */}
      <section className="section">
        <div className="container">
          <SectionHeading title={housing.galleryTitle} />
          <ul className="photo-gallery" aria-label={housing.galleryTitle}>
            {housing.gallery.map((photo, i) => (
              <li key={photo.src} className={`photo-gallery__item photo-gallery__item--${photo.orientation}`}>
                <button type="button" className="photo-gallery__open" onClick={() => setPhotoIndex(i)}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ImageLightbox images={housing.gallery} index={photoIndex} onChange={setPhotoIndex} onClose={closePhoto} />
    </>
  )
}
