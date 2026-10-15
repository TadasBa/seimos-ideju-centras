import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

/* The parts of Cloudflare's Turnstile API (explicit rendering) used here */
interface TurnstileRenderOptions {
  sitekey: string
  language?: string
  theme?: 'auto' | 'light' | 'dark'
  'refresh-expired'?: 'auto' | 'manual' | 'never'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: (code: string) => boolean | void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptPromise: Promise<TurnstileApi> | null = null

/** Loads the Turnstile script once per page, however many widgets mount. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing')))
    script.onerror = () => {
      scriptPromise = null // allow a later mount to retry
      script.remove()
      reject(new Error('Turnstile script failed to load'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export interface TurnstileHandle {
  /** Discard the current token and get a fresh one (tokens are single-use). */
  reset: () => void
}

interface TurnstileProps {
  siteKey: string
  /** A fresh token, or null when the previous one expired or failed */
  onToken: (token: string | null) => void
  /** The script or widget could not load at all */
  onUnavailable?: () => void
}

/**
 * Cloudflare Turnstile widget, rendered explicitly into a ref. The widget's
 * mode (Managed) is set on the site key in the Cloudflare dashboard. Tokens
 * expire after ~5 minutes; the widget then fetches a new one by itself
 * ('refresh-expired': 'auto') and reports null in between.
 */
export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(function Turnstile(
  { siteKey, onToken, onUnavailable },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const api = useRef<TurnstileApi | null>(null)
  // Latest callbacks, so the widget is never re-rendered just because the
  // parent passed new function identities.
  const callbacks = useRef({ onToken, onUnavailable })
  callbacks.current = { onToken, onUnavailable }

  useImperativeHandle(ref, () => ({
    reset: () => {
      callbacks.current.onToken(null)
      if (api.current && widgetId.current) api.current.reset(widgetId.current)
    },
  }))

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return
        api.current = turnstile
        widgetId.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          language: 'lt',
          theme: 'light',
          'refresh-expired': 'auto',
          callback: (token) => callbacks.current.onToken(token),
          'expired-callback': () => callbacks.current.onToken(null),
          'error-callback': () => {
            callbacks.current.onToken(null)
            // Let Turnstile keep retrying on its own
          },
        })
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onUnavailable?.()
      })

    return () => {
      cancelled = true
      if (api.current && widgetId.current) api.current.remove(widgetId.current)
      widgetId.current = null
    }
  }, [siteKey])

  return <div ref={containerRef} className="turnstile" />
})
