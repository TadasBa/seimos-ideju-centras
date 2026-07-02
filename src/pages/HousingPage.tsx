import { useLocation } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { StoryAccordion } from '../components/StoryAccordion'
import { CheckIcon, MailIcon, PhoneIcon } from '../components/icons'
import { housing } from '../content/lt/housing'
import { stories, storiesTitle } from '../content/lt/stories'
import { org } from '../content/lt/common'

export function HousingPage() {
  useDocumentMeta(housing.title, housing.intro)
  const { hash } = useLocation()
  const openStoryId = hash ? hash.slice(1) : undefined

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="split">
            <SectionHeading as="h1" title={housing.title}>
              <p className="lead" style={{ fontWeight: 560 }}>
                {housing.subtitle}
              </p>
              <p className="lead" style={{ marginTop: 'var(--space-4)' }}>
                {housing.intro}
              </p>
            </SectionHeading>
            <div className="split__media">
              <div className="arch-frame">
                <img src={housing.heroImage} alt={housing.heroImageAlt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container container--narrow">
          <SectionHeading title={housing.whatTitle} />
          <p style={{ color: 'var(--ink-soft)' }}>{housing.what}</p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
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

          <h2 className="section-title" style={{ marginTop: 'var(--space-7)' }}>
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

          <h2 className="section-title" style={{ marginTop: 'var(--space-7)' }}>
            {housing.whoTitle}
          </h2>
          <ul className="feature-list">
            {housing.who.map((line) => (
              <li key={line.slice(0, 30)}>
                <CheckIcon />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <h2 className="section-title" style={{ marginTop: 'var(--space-7)' }}>
            {housing.compositionTitle}
          </h2>
          <ul className="feature-list">
            {housing.composition.map((line) => (
              <li key={line.slice(0, 30)}>
                <CheckIcon />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <ul className="feature-list" style={{ marginTop: 'var(--space-3)', paddingLeft: 'var(--space-6)' }}>
            {housing.compositionList.map((line) => (
              <li key={line.slice(0, 30)}>
                <CheckIcon />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
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
            <div className="split__media">
              <div className="arch-frame">
                <img src={housing.livingImage} alt={housing.livingImageAlt} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <SectionHeading title={housing.financeTitle} />
          <ul className="feature-list">
            {housing.finance.map((line) => (
              <li key={line.slice(0, 30)}>
                <CheckIcon />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <h2 className="section-title" style={{ marginTop: 'var(--space-7)' }}>
            {housing.stepsTitle}
          </h2>
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

          <h2 className="section-title" style={{ marginTop: 'var(--space-7)' }}>
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

          <div className="card" style={{ marginTop: 'var(--space-7)' }}>
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
      </section>

      <section className="section" id="istorijos">
        <div className="container container--narrow">
          <SectionHeading eyebrow={storiesTitle} title="Istorijos, kurios prasidėjo iš naujo" />
          <StoryAccordion stories={stories} openId={openStoryId} />
        </div>
      </section>
    </>
  )
}
