import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header, MobileMenu } from './Header'
import { CtaBand } from './CtaBand'
import { Footer } from './Footer'

const DESKTOP_MIN = 1000

/**
 * Page shell: fixed header, routed content, the global "Ieškote pagalbos?"
 * band and the footer. Also handles scroll restoration, in-page #anchor
 * navigation and the mobile slide-out menu, which shrinks the page around
 * the current viewport centre.
 */
export function Layout() {
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])

  useEffect(() => {
    if (hash) {
      // Let the page render first, then scroll to the anchor
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  useEffect(() => {
    const root = document.documentElement
    if (menuOpen) {
      // Anchor the shrink at the middle of what is on screen right now
      root.style.setProperty('--ocm-origin-y', `${window.scrollY + window.innerHeight / 2}px`)
    }
    root.classList.toggle('ocm-open', menuOpen)
  }, [menuOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_MIN) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">
        Pereiti prie turinio
      </a>
      <div className="ocm-backdrop" aria-hidden="true" />
      <Header menuOpen={menuOpen} onToggleMenu={toggleMenu} />
      <div className="page-shell">
        <main id="main" className="page-content">
          <Outlet />
        </main>
        <CtaBand />
        <Footer />
      </div>
      {/* Tapping the slid-away page closes the menu */}
      <div className="ocm-scrim" aria-hidden="true" onClick={closeMenu} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
