import { Link } from 'react-router-dom'
import { footer, org } from '../content/lt/common'
import { FacebookIcon, MailIcon, MapPinIcon, PhoneIcon } from './icons'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <span className="site-footer__logo-chip">
              <img src="/images/logo.png" alt={org.name} width="167" height="90" />
            </span>
            <p>{org.description}</p>
          </div>

          <div>
            <h3>{footer.servicesTitle}</h3>
            <ul>
              {footer.services.map((service) => (
                <li key={service.to}>
                  <Link to={service.to}>{service.label}</Link>
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: 'var(--space-5)' }}>{footer.linksTitle}</h3>
            <ul>
              {footer.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>{footer.contactsTitle}</h3>
            <address>
              <span>
                {org.contacts.director.name}
                <br />
                {org.contacts.director.role}
              </span>
              <a href={`tel:${org.contacts.director.phoneHref}`}>
                <PhoneIcon /> {org.contacts.director.phone}
              </a>
              <a href={`mailto:${org.email}`}>
                <MailIcon /> {org.email}
              </a>
              <a href={org.mapUrl} target="_blank" rel="noreferrer">
                <MapPinIcon /> {org.address}
              </a>
              <a href={org.facebook} target="_blank" rel="noreferrer">
                <FacebookIcon /> Facebook
              </a>
            </address>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>{footer.copyright}</span>
          <nav aria-label="Papildomos nuorodos">
            <Link to={footer.privacy.to}>{footer.privacy.label}</Link>
            <a href={footer.supportRules.href} target="_blank" rel="noreferrer">
              {footer.supportRules.label}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
