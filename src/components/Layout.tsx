import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Page shell: header, routed content, footer.
 * Also handles scroll restoration and in-page #anchor navigation.
 */
export function Layout() {
  const { pathname, hash } = useLocation()

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <a href="#main" className="skip-link">
        Pereiti prie turinio
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
