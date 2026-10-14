import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Scribble } from '../components/Scribble'
import { ContactForm } from '../components/ContactForm'
import { contactsPage } from '../content/lt/contacts'
import { org } from '../content/lt/common'

export function ContactsPage() {
  useDocumentMeta(contactsPage.title, contactsPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{contactsPage.title}</h1>
          <hr className="page-hero__rule" />
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container contact-layout">
          <div>
            <h2 className="section-title">
              <Scribble>Mūsų kontaktai</Scribble>
            </h2>

            <address className="contact-details">
              <div>
                <strong>{org.contacts.director.name}</strong>
                <br />
                {org.contacts.director.role}
                <br />
                <a href={`tel:${org.contacts.director.phoneHref}`}>{org.contacts.director.phone}</a>
                <br />
                <a href={`mailto:${org.email}`}>{org.email}</a>
              </div>

              <div>
                <strong>{org.contacts.housing.name}</strong>
                <br />
                {org.contacts.housing.role}
                <br />
                <a href={`tel:${org.contacts.housing.phoneHref}`}>{org.contacts.housing.phone}</a>
              </div>

              <div>
                <strong>{org.addressNote}:</strong>{' '}
                <a href={org.mapUrl} target="_blank" rel="noreferrer">
                  {org.address}
                </a>
              </div>
            </address>

            <h2 className="section-title">
              <Scribble>{contactsPage.formTitle}</Scribble>
            </h2>
            <ContactForm />
          </div>

          <div>
            <img
              className="contact-photo"
              src={contactsPage.photo}
              alt={contactsPage.photoAlt}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  )
}
