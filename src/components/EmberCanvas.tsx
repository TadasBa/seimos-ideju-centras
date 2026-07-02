import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface Ember {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  phase: number
  hue: number
  alpha: number
}

/**
 * Softly rising ember particles — the "fireplace" feel of the hero.
 * Pure canvas, no dependencies. Pauses off-screen and honours
 * prefers-reduced-motion (renders nothing at all).
 */
export function EmberCanvas({ className }: { className?: string }) {
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function spawn(atBottom: boolean): Ember {
      return {
        x: Math.random() * width,
        y: atBottom ? height + 10 : Math.random() * height,
        radius: 1 + Math.random() * 2.4,
        speed: 12 + Math.random() * 26,
        drift: 8 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        hue: 22 + Math.random() * 22, // ember orange → amber
        alpha: 0.25 + Math.random() * 0.45,
      }
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(46, Math.max(18, Math.round(width / 34)))
      embers = Array.from({ length: count }, () => spawn(false))
    }

    function frame(now: number) {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      ctx!.clearRect(0, 0, width, height)

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.y -= e.speed * dt
        e.phase += dt * 1.4
        const x = e.x + Math.sin(e.phase) * e.drift
        // fade out towards the top third
        const lifecycle = Math.min(1, Math.max(0, e.y / height))
        const alpha = e.alpha * (0.25 + lifecycle * 0.75)

        const gradient = ctx!.createRadialGradient(x, e.y, 0, x, e.y, e.radius * 3.2)
        gradient.addColorStop(0, `hsla(${e.hue}, 92%, 60%, ${alpha})`)
        gradient.addColorStop(1, `hsla(${e.hue}, 92%, 60%, 0)`)
        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(x, e.y, e.radius * 3.2, 0, Math.PI * 2)
        ctx!.fill()

        if (e.y < -12) embers[i] = spawn(true)
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

    resize()
    start()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // Save cycles when the hero is scrolled away or the tab is hidden
    const intersection = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    )
    intersection.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
