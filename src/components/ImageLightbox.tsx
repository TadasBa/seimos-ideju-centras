import { useEffect, useRef, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'

export interface LightboxImage {
  src: string
  alt: string
}

interface ImageLightboxProps {
  images: readonly LightboxImage[]
  /** Index of the open image, or null when closed */
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
}

/** Horizontal swipe distance (px) that counts as previous / next */
const SWIPE_THRESHOLD = 50

/**
 * Full-screen photo viewer in the same style as VideoLightbox: near-black
 * overlay, controls top-right. Arrow keys, the side buttons or a swipe step
 * through the photos (wrapping around); Esc or a click on the backdrop
 * closes it, and focus returns to the photo that opened it.
 */
export function ImageLightbox({ images, index, onChange, onClose }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const open = index !== null
  const count = images.length

  // Kept in a ref so the key listener below doesn't re-bind on every step.
  const step = useRef((_delta: number) => {})
  step.current = (delta: number) => {
    if (index !== null) onChange((index + delta + count) % count)
  }

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const root = document.documentElement
    root.classList.add('lightbox-open')
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft') step.current(-1)
      else if (event.key === 'ArrowRight') step.current(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.classList.remove('lightbox-open')
      opener?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  if (index === null) return null
  const image = images[index]

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStartX.current
    const end = event.changedTouches[0]?.clientX
    touchStartX.current = null
    if (start === null || end === undefined) return
    const dx = end - start
    if (Math.abs(dx) >= SWIPE_THRESHOLD) step.current(dx < 0 ? 1 : -1)
  }

  return createPortal(
    <div
      className="lightbox lightbox--image"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lightbox__bg" onClick={onClose} />
      <div className="lightbox__toolbar">
        <span className="lightbox__counter" aria-live="polite">
          {index + 1} / {count}
        </span>
        <button ref={closeRef} type="button" className="lightbox__btn" aria-label="Uždaryti" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="lightbox__stage" onClick={onClose}>
        {/* key: restart the fade for each photo */}
        <img key={image.src} className="lightbox__image" src={image.src} alt={image.alt} onClick={(e) => e.stopPropagation()} />
      </div>
      {count > 1 ? (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Ankstesnė nuotrauka"
            onClick={() => step.current(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Kita nuotrauka"
            onClick={() => step.current(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      ) : null}
    </div>,
    document.body,
  )
}
