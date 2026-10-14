import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://payment.maksekeskus.ee/static/js/donation/donation.js'

/* The only host MakeCommerce allows to frame this project (their
   frame-ancestors). Change it in the MakeCommerce merchant portal first. */
const REGISTERED_HOST = 'seimosidejucentras.lt'

interface DonationWidgetProps {
  project: string
  locale?: string
}

/**
 * MakeCommerce (Maksekeskus) donation form, embedded the same way as on the
 * original site: their script looks for div[data-project][data-locale] when
 * it runs and fills it with the payment iframe. It only scans once, so the
 * script is (re)inserted every time the widget mounts.
 *
 * MakeCommerce only lets the form be framed on the registered domain, so
 * elsewhere (localhost, *.pages.dev previews) a placeholder is shown instead
 * of a form that would fail to load.
 */
export function DonationWidget({ project, locale = 'lt' }: DonationWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = window.location.hostname === REGISTERED_HOST

  useEffect(() => {
    const container = ref.current
    if (!container || !enabled) return
    let script: HTMLScriptElement | null = null
    // Deferred so a mount that is immediately undone (StrictMode) never
    // runs the script and leaves a second iframe behind.
    const timer = window.setTimeout(() => {
      script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      document.body.appendChild(script)
    }, 0)
    return () => {
      window.clearTimeout(timer)
      script?.remove()
      container.replaceChildren()
    }
  }, [project, locale, enabled])

  if (!enabled) {
    return (
      <div className="donation-widget donation-widget--placeholder">
        Mokėjimo forma (MakeCommerce) rodoma tik svetainėje {REGISTERED_HOST}.
      </div>
    )
  }

  return <div ref={ref} className="donation-widget" data-project={project} data-locale={locale} />
}
