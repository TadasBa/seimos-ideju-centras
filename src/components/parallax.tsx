import { useEffect, useRef, type RefObject } from 'react'
import { onEveryFrame, prefersReducedMotion } from '../lib/viewport'

/**
 * Runs `update(rect)` every frame while `watched` is near the viewport,
 * easing toward the new value by `ease` per frame (the original lerps its
 * scroll position the same way, which gives the soft trailing feel).
 */
function useScrollFollower(
  watched: RefObject<HTMLElement | null>,
  moved: RefObject<HTMLElement | null>,
  target: (rect: DOMRect, viewportWidth: number, viewportHeight: number) => number,
  ease: number,
) {
  useEffect(() => {
    const anchor = watched.current
    const el = moved.current
    if (!anchor || !el || prefersReducedMotion()) return

    let current = Number.NaN
    let stop: null | (() => void) = null

    const tick = () => {
      const goal = target(anchor.getBoundingClientRect(), window.innerWidth, window.innerHeight)
      current = Number.isNaN(current) ? goal : current + (goal - current) * ease
      el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !stop) stop = onEveryFrame(tick)
        else if (!entry.isIntersecting && stop) {
          stop()
          stop = null
        }
      },
      { rootMargin: '250px 0px' },
    )
    observer.observe(anchor)
    return () => {
      observer.disconnect()
      stop?.()
    }
  }, [watched, moved, target, ease])
}

/* Service tiles: the photo drifts at 0.131× the tile's distance from the
   top of the viewport (measured on the original); the layer is 122.6% of
   the tile's height, so it is clamped where it would expose an edge. */
const tileTarget = (rect: DOMRect) => Math.max(-0.131 * rect.top, -0.226 * rect.height)

export function useTileParallax(
  box: RefObject<HTMLElement | null>,
  layer: RefObject<HTMLElement | null>,
) {
  useScrollFollower(box, layer, tileTarget, 0.2)
}

/* Grey circle behind the About heading. The original's formula:
   translateY((elementCentre − viewportCentre) × 0.06), softened by 1.2 on
   tablets and a further 1.35 on phones, lerped at 0.28. */
const circleTarget = (rect: DOMRect, vw: number, vh: number) => {
  let intensity = 0.06
  if (vw < 1025) intensity /= 1.2
  if (vw < 690) intensity /= 1.35
  return (rect.top + rect.height / 2 - vh / 2) * intensity
}

export function ParallaxCircle({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  useScrollFollower(wrapRef, innerRef, circleTarget, 0.28)

  return (
    <div ref={wrapRef} className={`parallax-circle ${className}`} aria-hidden="true">
      <div ref={innerRef} className="parallax-circle__inner">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </div>
    </div>
  )
}
