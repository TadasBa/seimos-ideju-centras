import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Transition delay in milliseconds, for staggered groups. */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Fades content up into view the first time it enters the viewport.
 * Purely additive: without JS (or with reduced motion) content is visible.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined

  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  )
}
