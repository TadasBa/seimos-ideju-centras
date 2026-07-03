import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  maxLife: number
  size: number
  swayPhase: number
  swaySpeed: number
  flickerPhase: number
}

/** How close the pointer has to be to stir an ember (px). */
const POINTER_RADIUS = 130
const POINTER_FORCE = 240

/**
 * Fireplace embers drifting up across the whole viewport — a fixed
 * layer *behind* the page content, so text, images and cards always
 * stay readable above the glow. Embers cool from bright amber to deep
 * red as they rise, flicker like the real thing and swirl away from
 * the pointer. Honours prefers-reduced-motion (renders nothing).
 */
export function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let embers: Ember[] = []
    let rafId = 0
    let running = false
    let last = performance.now()
    const pointer = { x: -1e4, y: -1e4 }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    /** Every ember is born just below the bottom edge — the unseen fireplace. */
    function spawn(): Ember {
      return {
        x: Math.random() * width,
        y: height + 6,
        vx: 0,
        vy: -(16 + Math.random() * 32),
        age: 0,
        maxLife: 9 + Math.random() * 8,
        size: 0.7 + Math.random() * 1.2,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.6 + Math.random() * 1.1,
        flickerPhase: Math.random() * Math.PI * 2,
      }
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(38, Math.max(16, Math.round(width / 42)))
      // Stagger the births: every ember waits its turn below the screen
      // edge, so the whole stream visibly rises out of the "fireplace".
      embers = Array.from({ length: count }, () => {
        const ember = spawn()
        ember.age = -Math.random() * 10
        return ember
      })
    }

    function frame(now: number) {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      ctx!.clearRect(0, 0, width, height)

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.age += dt
        if (e.age < 0) continue // not born yet — still in the fire below
        const t = e.age / e.maxLife

        if (t >= 1 || e.y < -14) {
          embers[i] = spawn()
          continue
        }

        // Turbulent sideways sway, like heat currents
        e.swayPhase += dt * e.swaySpeed
        const sway = Math.sin(e.swayPhase) * 9 + Math.sin(e.swayPhase * 2.7) * 4

        // The pointer stirs nearby embers aside, as if fanning the air
        const dx = e.x - pointer.x
        const dy = e.y - pointer.y
        const distSq = dx * dx + dy * dy
        if (distSq < POINTER_RADIUS * POINTER_RADIUS && distSq > 1) {
          const dist = Math.sqrt(distSq)
          const push = (1 - dist / POINTER_RADIUS) * POINTER_FORCE * dt
          e.vx += (dx / dist) * push
          e.vy += (dy / dist) * push * 0.6 - push * 0.4 // stirred air also lifts
        }

        e.vx *= 1 - Math.min(1, 1.6 * dt) // air drag
        e.x += (e.vx + sway) * dt
        e.y += e.vy * dt

        // Embers cool as they rise: bright amber → deep ember red
        const hue = 36 - t * 24
        const lightness = 58 - t * 16
        // Flicker — uneven, like a glowing coal
        e.flickerPhase += dt * (5 + Math.sin(e.swayPhase) * 2)
        const flicker = 0.7 + 0.3 * Math.sin(e.flickerPhase * 3.1)
        const fadeIn = Math.min(1, e.age / 0.35)
        const fadeOut = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1
        const alpha = 0.85 * fadeIn * fadeOut * flicker
        if (alpha <= 0.01) continue

        // Tight halo — a point of light, not a bokeh blob
        const glowR = e.size * 3
        const gradient = ctx!.createRadialGradient(e.x, e.y, 0, e.x, e.y, glowR)
        gradient.addColorStop(0, `hsla(${hue}, 100%, ${lightness + 10}%, ${alpha * 0.9})`)
        gradient.addColorStop(0.5, `hsla(${hue}, 96%, ${lightness}%, ${alpha * 0.4})`)
        gradient.addColorStop(1, `hsla(${hue - 6}, 92%, ${lightness - 8}%, 0)`)
        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(e.x, e.y, glowR, 0, Math.PI * 2)
        ctx!.fill()

        // Hot core
        ctx!.fillStyle = `hsla(${hue + 4}, 100%, ${lightness + 22}%, ${alpha})`
        ctx!.beginPath()
        ctx!.arc(e.x, e.y, e.size * 0.75, 0, Math.PI * 2)
        ctx!.fill()
      }

      rafId = requestAnimationFrame(frame)
    }

    function start() {
      if (running) return
      running = true
      last = performance.now()
      rafId = requestAnimationFrame(frame)
    }

    function stop() {
      running = false
      cancelAnimationFrame(rafId)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    resize()
    start()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return <canvas ref={canvasRef} className="ember-layer" aria-hidden="true" />
}
