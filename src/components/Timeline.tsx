import { useEffect, useRef } from 'react'
import type { TimelineEntry } from '../content/types'

/**
 * The organisation's history as a road of ember dots: each milestone
 * "kindles" (dot ignites, text warms up) as it scrolls into view, so
 * the story lights up step by step while reading. Without JS or with
 * reduced motion everything is simply visible.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const items = Array.from(list.querySelectorAll('li'))
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-lit')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.6, rootMargin: '0px 0px -10% 0px' },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [entries])

  return (
    <ol ref={listRef} className="timeline" style={{ marginTop: 'var(--space-7)' }}>
      {entries.map((entry) => (
        <li key={entry.period}>
          <strong>
            {entry.period} — {entry.title}
          </strong>
          <p>{entry.description}</p>
        </li>
      ))}
    </ol>
  )
}
