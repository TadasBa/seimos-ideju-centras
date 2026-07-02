import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, navCta, org } from '../content/lt/common'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label={org.name}>
          <img src="/images/logo.png" alt="" width="167" height="90" />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Pagrindinis meniu">
          {nav.map((item) =>
            item.to.includes('#') ? (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ),
          )}
          <Link to={navCta.to} className="btn btn--fire site-nav__cta">
            {navCta.label}
          </Link>
        </nav>
      </div>
    </header>
  )
}
