import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface VideoLightboxProps {
  /** YouTube video id, or null when closed */
  videoId: string | null
  title: string
  onClose: () => void
}

/**
 * Full-screen YouTube player, as the original opens for the "Aklas
 * pasimatymas" interview: near-black overlay, a 16:9 player with 44px side
 * margins, fullscreen and close controls top-right. Esc or a click on the
 * backdrop closes it; focus returns to whatever opened it.
 */
export function VideoLightbox({ videoId, title, onClose }: VideoLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const playerRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!videoId) return
    const opener = document.activeElement as HTMLElement | null
    const root = document.documentElement
    root.classList.add('lightbox-open')
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.classList.remove('lightbox-open')
      opener?.focus({ preventScroll: true })
    }
  }, [videoId, onClose])

  if (!videoId) return null

  const goFullscreen = () => {
    playerRef.current?.requestFullscreen?.().catch(() => {})
  }

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title}>
      <div className="lightbox__bg" onClick={onClose} />
      <div className="lightbox__toolbar">
        <button type="button" className="lightbox__btn" aria-label="Visas ekranas" onClick={goFullscreen}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
        <button ref={closeRef} type="button" className="lightbox__btn" aria-label="Uždaryti" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="lightbox__stage" onClick={onClose}>
        <iframe
          ref={playerRef}
          className="lightbox__player"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&fs=1`}
          title={title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>,
    document.body,
  )
}
