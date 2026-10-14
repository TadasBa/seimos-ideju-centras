import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { atOffset, bottomInView, prefersReducedMotion, whenInView, type Trigger } from '../lib/viewport'

/* Stable trigger instances (hooks depend on identity) */
export const AT_85 = atOffset(0.85)
export const AT_90 = atOffset(0.9)
export const BOTTOM_IN_VIEW = bottomInView

/** True from the first time `trigger` passes for the referenced element. */
export function useInViewOnce<T extends Element>(trigger: Trigger) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setInView(true)
      return
    }
    return whenInView(el, trigger, () => setInView(true))
  }, [trigger])

  return [ref, inView] as const
}

/* ------------------------------------------------------------------ */

type RevealEffect = 'fade-in-from-bottom' | 'fade-in'

interface RevealProps {
  as?: ElementType
  effect?: RevealEffect
  /** ms, like the original's data-delay */
  delay?: number
  trigger?: Trigger
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * Column entrance, as on the original: rises 100px while fading in over
 * 750ms easeOutCubic once its top reaches 85% of the viewport.
 */
export function Reveal({
  as: Tag = 'div',
  effect = 'fade-in-from-bottom',
  delay = 0,
  trigger = AT_85,
  className = '',
  style,
  children,
}: RevealProps) {
  const [ref, inView] = useInViewOnce<HTMLElement>(trigger)
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      data-effect={effect}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */

type SplitEffect = 'default' | 'blur-bottom' | 'none'

interface SplitTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  text: string
  /** default = words slide up from a mask; blur-bottom = words un-blur upward */
  effect?: SplitEffect
  className?: string
}

/**
 * Word-by-word reveal ("line-reveal-by-space" on the original). Each word
 * starts 50ms (or 500ms / wordCount, clamped 15–50ms) after the previous
 * and settles over 1.2s cubic-bezier(.25,1,.5,1) once the block's bottom
 * is in view. The full sentence stays available to screen readers.
 */
export function SplitText({ as = 'h2', text, effect = 'default', className = '' }: SplitTextProps) {
  const Tag = as as ElementType
  const [ref, inView] = useInViewOnce<HTMLElement>(BOTTOM_IN_VIEW)
  const words = text.trim().split(/\s+/)

  if (effect === 'none') return <Tag className={className}>{text}</Tag>

  const stagger = Math.min(Math.max(500 / words.length, 15), 50)

  return (
    <Tag ref={ref} className={`words words--${effect} ${inView ? 'is-in' : ''} ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        // The space sits outside the clipped word box, as on the original;
        // inside an inline-block a trailing space would collapse.
        <Fragment key={index}>
          <span className="words__word" aria-hidden="true">
            <span className="words__inner" style={{ transitionDelay: `${index * stagger}ms` }}>
              {word}
            </span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}
