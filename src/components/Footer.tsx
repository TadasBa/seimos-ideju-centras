import { Link } from 'react-router-dom'
import { footer, org } from '../content/lt/common'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <h2>{footer.contactsTitle}</h2>
            <p>
              <strong>{org.contacts.director.name}</strong>
              <br />
              {org.contacts.director.role}
              <br />
              <a href={`tel:${org.contacts.director.phoneHref}`}>{org.contacts.director.phone}</a>
              <br />
              {/* Shown obfuscated like the original, but still clickable */}
              <a className="site-footer__plain" href={`mailto:${org.email}`} aria-label={org.email}>
                {footer.emailDisplay}
              </a>
            </p>
            <p>
              <strong>Registracijos adresas</strong> ir adresas korespondencijai:{' '}
              <a href={org.mapUrl} target="_blank" rel="noreferrer">
                {footer.addressStreet}
              </a>
              {footer.addressRest}
            </p>
          </div>

          <div>
            <h2>{footer.servicesTitle}</h2>
            <ul>
              {footer.services.map((service) => (
                <li key={service.to}>
                  <Link to={service.to}>{service.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>{footer.linksTitle}</h2>
            <ul>
              {footer.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="site-footer__bottom">
          {footer.copyright} <Link to={footer.privacy.to}>{footer.privacy.label}</Link>,{' '}
          <a href={footer.supportRules.href} target="_blank" rel="noreferrer">
            {footer.supportRules.label}
          </a>
        </p>
      </div>
    </footer>
  )
}
