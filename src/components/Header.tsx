import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, org } from '../content/lt/common'
import { FacebookIcon } from './icons'

/* Scroll distance after which the desktop bar condenses (measured on the
   original: still full at 20px, condensed by 40px). */
const SHRINK_AFTER = 30

interface HeaderProps {
  menuOpen: boolean
  onToggleMenu: () => void
}

/**
 * Fixed header as on the original: amber announcement bar over a white
 * bar with the logo and menu. On desktop the bar condenses (90 → 61px,
 * logo 70 → 50px) and gains a soft shadow once the page scrolls. Below
 * 1000px the menu moves into the slide-out panel (see MobileMenu).
 */
export function Header({ menuOpen, onToggleMenu }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const topbarRef = useRef<HTMLDivElement>(null)

  // Content clears the header at its resting (uncondensed) height, which
  // depends on whether the amber bar wraps — measure rather than assume.
  useEffect(() => {
    const topbar = topbarRef.current
    if (!topbar) return
    const root = document.documentElement
    const update = () => {
      const bar = window.innerWidth >= 1000 ? 90 : 64
      root.style.setProperty('--header-offset', `${topbar.offsetHeight + bar}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(topbar)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    let queued = false
    const update = () => {
      queued = false
      header.classList.toggle('is-small', window.scrollY > SHRINK_AFTER)
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header ref={headerRef} className="site-header">
      <div ref={topbarRef} className="site-topbar">
        <span>{org.tagline}</span>
      </div>

      <div className="site-header__bar">
        <div className="container site-header__inner">
          {/* The logo file is the full lockup — mark plus wordmark */}
          <Link to="/" className="site-header__brand" aria-label={org.name}>
            <img src="/images/logo.png" alt="" width="1342" height="395" />
          </Link>

          <nav className="site-nav" aria-label="Pagrindinis meniu">
            <ul>
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => (isActive ? 'is-active' : '')}
                  >
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <a className="site-nav__social" href={org.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </nav>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'}
            onClick={onToggleMenu}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>
    </header>
  )
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

/**
 * The original's "material" slide-out: the whole page shrinks to 84% and
 * slides left, revealing a coral panel with large white links. A pink
 * close button pops in and its cross draws itself.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  // Close on navigation
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div id="mobile-menu" className={`ocm ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <button ref={closeRef} type="button" className="ocm__close" aria-label="Uždaryti meniu" onClick={onClose}>
        <span />
      </button>
      <div className="ocm__panel">
        <ul className="ocm__links">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <a className="ocm__social" href={org.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
          <FacebookIcon />
        </a>
      </div>
    </div>
  )
}
