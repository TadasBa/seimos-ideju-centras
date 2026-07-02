import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ContactForm } from '../components/ContactForm'
import { FacebookIcon, MailIcon, MapPinIcon, PhoneIcon } from '../components/icons'
import { contactsPage } from '../content/lt/contacts'
import { org } from '../content/lt/common'

export function ContactsPage() {
  useDocumentMeta(contactsPage.title, contactsPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <SectionHeading as="h1" title={contactsPage.title} flourish>
              <p className="lead">{contactsPage.intro}</p>
            </SectionHeading>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container contact-layout">
          <Reveal>
            <div className="contact-panel">
              <div className="card contact-card">
                <strong>{org.contacts.director.name}</strong>
                <span className="muted">{org.contacts.director.role}</span>
                <a href={`tel:${org.contacts.director.phoneHref}`}>
                  <PhoneIcon /> {org.contacts.director.phone}
                </a>
                <a href={`mailto:${org.email}`}>
                  <MailIcon /> {org.email}
                </a>
              </div>

              <div className="card contact-card">
                <strong>{org.contacts.housing.name}</strong>
                <span className="muted">{org.contacts.housing.role}</span>
                <a href={`tel:${org.contacts.housing.phoneHref}`}>
                  <PhoneIcon /> {org.contacts.housing.phone}
                </a>
              </div>

              <div className="card contact-card">
                <span className="muted">{org.addressNote}:</span>
                <strong style={{ fontSize: 'var(--text-md)' }}>{org.address}</strong>
                <a href={org.mapUrl} target="_blank" rel="noreferrer">
                  <MapPinIcon /> {contactsPage.mapCta}
                </a>
                <a href={org.facebook} target="_blank" rel="noreferrer">
                  <FacebookIcon /> Facebook
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card">
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)' }}>
                {contactsPage.formTitle}
              </h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
