import type { ReactNode } from 'react'
import { BOTTOM_IN_VIEW, useInViewOnce } from './motion'

/**
 * The original site's signature flourish: a hand-drawn coral stroke under
 * one or two words of a heading. Path, geometry and timing are taken
 * verbatim from seimosidejucentras.lt — the stroke sits behind the text and
 * draws itself over 1.8s once the heading's bottom scrolls into view.
 */
export function Scribble({ children }: { children: ReactNode }) {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>(BOTTOM_IN_VIEW)

  return (
    <span ref={ref} className={`scribble ${inView ? 'is-drawn' : ''}`}>
      {children}
      <svg
        className="scribble__line"
        viewBox="-400 -55 730 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="m -383.25 -6 c 55.25 -22 130.75 -33.5 293.25 -38 c 54.5 -0.5 195 -2.5 401 15"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="20"
          fill="none"
        />
      </svg>
    </span>
  )
}
