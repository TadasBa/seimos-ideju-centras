import { useDocumentMeta } from '../hooks/useDocumentMeta'
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
          <SectionHeading as="h1" title={contactsPage.title}>
            <p className="lead">{contactsPage.intro}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container contact-layout">
          <div className="contact-panel">
            <img
              className="contact-photo"
              src={contactsPage.photo}
              alt={contactsPage.photoAlt}
              loading="lazy"
            />
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

          <div className="card">
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)' }}>
              {contactsPage.formTitle}
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
