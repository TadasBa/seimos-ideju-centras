import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface TrailWord {
  id: number
  text: string
  x: number
  y: number
  rotation: number
  palette: number
}

/** Warm pill palettes for the floating words. */
const PALETTES = [
  { bg: '#e05c10', fg: '#fff7ee' },
  { bg: '#f59e0b', fg: '#3a2410' },
  { bg: '#fcd34d', fg: '#4a3005' },
  { bg: '#8a5a34', fg: '#fdf3e6' },
  { bg: '#f7efe5', fg: '#5c3a17' },
]

const WORD_LIFETIME_MS = 2600
const MIN_TRAVEL_PX = 85
const MAX_WORDS = 26

interface WordTrailBandProps {
  words: readonly string[]
  children: ReactNode
  className?: string
}

/**
 * The "Ieškote pagalbos?" band: moving the pointer (or finger) across it
 * leaves a trail of the organisation's key words — a playful nod to the
 * current site. Words also drift in slowly on their own so the section
 * feels alive on touch devices before any interaction.
 */
export function WordTrailBand({ words, children, className = '' }: WordTrailBandProps) {
  const reducedMotion = usePrefersReducedMotion()
  const bandRef = useRef<HTMLElement>(null)
  const [trail, setTrail] = useState<TrailWord[]>([])
  const lastPoint = useRef({ x: -1000, y: -1000 })
  const counter = useRef(0)
  const wordIndex = useRef(0)

  const spawn = useCallback(
    (x: number, y: number) => {
      const id = ++counter.current
      const text = words[wordIndex.current % words.length] ?? ''
      wordIndex.current += 1
      const word: TrailWord = {
        id,
        text,
        x,
        y,
        rotation: -9 + Math.random() * 18,
        palette: id % PALETTES.length,
      }
      setTrail((current) => [...current.slice(-MAX_WORDS + 1), word])
      window.setTimeout(() => {
        setTrail((current) => current.filter((w) => w.id !== id))
      }, WORD_LIFETIME_MS)
    },
    [words],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion) return
      const rect = bandRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const dx = x - lastPoint.current.x
      const dy = y - lastPoint.current.y
      if (dx * dx + dy * dy < MIN_TRAVEL_PX * MIN_TRAVEL_PX) return
      lastPoint.current = { x, y }
      spawn(x, y)
    },
    [reducedMotion, spawn],
  )

  // Gentle ambient drift so the band is alive without a pointer (mobile).
  useEffect(() => {
    if (reducedMotion) return
    const interval = window.setInterval(() => {
      const rect = bandRef.current?.getBoundingClientRect()
      if (!rect) return
      // Only while visible
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const x = rect.width * (0.08 + Math.random() * 0.84)
      const y = rect.height * (0.12 + Math.random() * 0.76)
      spawn(x, y)
    }, 2200)
    return () => window.clearInterval(interval)
  }, [reducedMotion, spawn])

  return (
    <section ref={bandRef} className={`cta-band ${className}`} onPointerMove={onPointerMove}>
      <div className="cta-band__trail" aria-hidden="true">
        {trail.map((word) => (
          <span
            key={word.id}
            className="trail-word"
            style={{
              left: word.x,
              top: word.y,
              background: PALETTES[word.palette].bg,
              color: PALETTES[word.palette].fg,
              ['--rot' as string]: `${word.rotation}deg`,
            }}
          >
            {word.text}
          </span>
        ))}
      </div>
      {children}
    </section>
  )
}
