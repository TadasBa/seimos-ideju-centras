import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/viewport'

interface ContentTrailProps {
  words: string[]
  colors: string[]
  /** Pointer travel in px between two pills (original: 85). */
  frequency?: number
  /** Seconds a pill takes to scale in (original: 1.2). */
  duration?: number
}

/* anime.js easings used by the original, as CSS curves */
const SWIFT_OUT = 'cubic-bezier(0, 0.2, 0.2, 1)'
const EASE_OUT_CUBIC = 'cubic-bezier(0.33, 1, 0.68, 1)'
const EASE_OUT_QUART = 'cubic-bezier(0.25, 1, 0.5, 1)'
const MAX_PILLS = 100

/**
 * Port of the original's `cflow-content-trail.js` (text mode, settings from
 * seimosidejucentras.lt: frequency 85, duration 1.2, lerp 0, scale in/out,
 * randomised word and rotation).
 *
 * Every animation frame it measures how far the pointer has moved since the
 * last pill; past the threshold it drops a new pill at the pointer: a random
 * word, the next colour in turn, a random ±20° tilt. Each pill scales in on
 * a swift curve, then shrinks away and fades — 2.2s in all — and removes
 * itself. The loop only runs while the band is on screen.
 *
 * Pills are animated with the Web Animations API (transform + opacity only),
 * so they run on the compositor and stay smooth under load.
 */
export function ContentTrail({ words, colors, frequency = 85, duration = 1.2 }: ContentTrailProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || words.length === 0 || prefersReducedMotion()) return

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    // The original tightens spacing and adds slight smoothing on touch.
    const threshold = isTouch ? frequency * 0.6 : frequency
    const follow = isTouch ? 0.8 : 1
    const inMs = duration * 1000
    const outMs = Math.max(inMs - 200, 0)
    const fadeOutDelay = Math.max(inMs - 500, 0)
    const total = inMs + Math.max(outMs, fadeOutDelay + 300)

    const mouse = { x: 0, y: 0 }
    const last = { x: 0, y: 0 }
    const cached = { x: 0, y: 0 }
    let hasInteracted = false
    let visible = false
    let running = false
    let colorIndex = 0
    let zIndex = 1
    let rafId = 0
    const pills: HTMLElement[] = []

    const spawn = () => {
      const pill = document.createElement('div')
      pill.className = 'trail__pill'
      pill.textContent = words[Math.floor(Math.random() * words.length)]
      pill.style.setProperty('--pill-bg', colors[colorIndex % colors.length])
      pill.style.left = `${cached.x}px`
      pill.style.top = `${cached.y}px`
      pill.style.zIndex = String(zIndex)
      el.appendChild(pill)
      pills.push(pill)
      if (pills.length > MAX_PILLS) pills.shift()?.remove()

      const tilt = Math.random() * 40 - 20
      const at = (scale: number) => `translate(-50%, -50%) scale(${scale}) rotate(${tilt}deg)`

      // Scale: 0 → 1 over `inMs` (swift out), then 1 → 0 over `outMs` (easeOutQuart).
      const grow = pill.animate(
        [
          { transform: at(0), offset: 0, easing: SWIFT_OUT },
          { transform: at(1), offset: inMs / total, easing: EASE_OUT_QUART },
          { transform: at(0), offset: Math.min((inMs + outMs) / total, 1) },
          ...(inMs + outMs < total ? [{ transform: at(0), offset: 1 }] : []),
        ],
        { duration: total, fill: 'forwards' },
      )
      // Opacity: in over 300ms, out over the last 300ms of the shrink.
      pill.animate(
        [
          { opacity: 0, offset: 0, easing: EASE_OUT_CUBIC },
          { opacity: 1, offset: 300 / total },
          { opacity: 1, offset: (inMs + fadeOutDelay) / total, easing: EASE_OUT_CUBIC },
          { opacity: 0, offset: Math.min((inMs + fadeOutDelay + 300) / total, 1) },
          ...(inMs + fadeOutDelay + 300 < total ? [{ opacity: 0, offset: 1 }] : []),
        ],
        { duration: total, fill: 'forwards' },
      )

      grow.onfinish = () => {
        pill.remove()
        const i = pills.indexOf(pill)
        if (i !== -1) pills.splice(i, 1)
      }
    }

    const render = () => {
      if (!visible) {
        running = false
        return
      }
      const travelled = Math.hypot(mouse.x - last.x, mouse.y - last.y)
      // lerp(cache || mouse, mouse, follow) — follow is 1 on desktop, so
      // pills land exactly under the pointer.
      const fromX = cached.x || mouse.x
      const fromY = cached.y || mouse.y
      cached.x = fromX + (mouse.x - fromX) * follow
      cached.y = fromY + (mouse.y - fromY) * follow

      if (travelled > threshold) {
        spawn()
        zIndex += 1
        colorIndex = (colorIndex + 1) % colors.length
        last.x = mouse.x
        last.y = mouse.y
      }
      rafId = requestAnimationFrame(render)
    }

    const start = () => {
      if (running || !visible || !hasInteracted) return
      running = true
      rafId = requestAnimationFrame(render)
    }

    const onPointer = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
      mouse.x = x
      mouse.y = y
      if (!hasInteracted) {
        hasInteracted = true
        start()
      }
    }
    const onMouseMove = (event: MouseEvent) => onPointer(event.clientX, event.clientY)
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) onPointer(touch.clientX, touch.clientY)
    }
    const onTouchEnd = () => {
      last.x = 0
      last.y = 0
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    if (isTouch) {
      window.addEventListener('touchstart', onTouch, { passive: true })
      window.addEventListener('touchmove', onTouch, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
      },
      { threshold: 0 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onTouchEnd)
      pills.forEach((pill) => pill.remove())
      pills.length = 0
    }
  }, [words, colors, frequency, duration])

  return <div ref={ref} className="trail" aria-hidden="true" />
}
