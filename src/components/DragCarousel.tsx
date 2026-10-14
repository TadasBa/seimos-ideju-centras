import {
  Children,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { onEveryFrame, prefersReducedMotion } from '../lib/viewport'

/*
 * Draggable carousel reproducing the feel of the original's Flickity
 * carousels: the slider is a particle pulled toward the selected cell
 * (attraction) and slowed by friction every frame; on release the
 * projected resting point picks the next cell, with a "boost" so a short
 * flick still advances. Constants are Flickity's defaults as configured
 * by the original theme. (Flickity itself is not used: it is GPLv3 or
 * commercially licensed.)
 */

const FRICTION = 0.28
const DRAG_THRESHOLD = 3
const BOOST_WINDOW_MS = 100

type IndicatorVariant = 'tooltip' | 'circle'

interface DragCarouselProps {
  label: string
  children: ReactNode
  /** Loop around (stories) or stop at the ends (projects). */
  wrap?: boolean
  /** Pull toward the selected cell per frame (0.02 projects, 0.025 stories). */
  attraction?: number
  indicator: IndicatorVariant
  indicatorText?: string
  /** Thin track with a coral bar marking the current cell. */
  progress?: boolean
  className?: string
}

const mod = (n: number, m: number) => ((n % m) + m) % m

export function DragCarousel({
  label,
  children,
  wrap = false,
  attraction = 0.025,
  indicator,
  indicatorText = 'Tempti',
  progress = false,
  className = '',
}: DragCarouselProps) {
  const cells = Children.toArray(children)
  const count = cells.length

  const viewportRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])
  const barRef = useRef<HTMLSpanElement>(null)

  const [selected, setSelected] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [finePointer, setFinePointer] = useState(false)

  // Physics state lives outside React so frames never re-render.
  const s = useRef({
    x: 0,
    velocity: 0,
    dragX: 0,
    previousDragX: 0,
    dragStartX: 0,
    dragging: false,
    index: 0,
    raf: 0,
    restingFrames: 0,
    /* no-wrap: resting position of each page, and which page each cell is on */
    slides: [] as number[],
    cellSlide: [] as number[],
    step: 0,
    suppressClick: false,
  }).current

  /* ---------- geometry ---------- */

  const positionOf = useCallback(
    (index: number) => (wrap ? index * s.step : (s.slides[index] ?? 0)),
    [wrap, s],
  )

  const lastIndex = useCallback(() => (wrap ? count - 1 : s.slides.length - 1), [wrap, count, s])

  const render = useCallback(() => {
    if (wrap) {
      const span = count * s.step
      cellRefs.current.forEach((cell, i) => {
        if (!cell) return
        const pos = mod(i * s.step + s.x + s.step, span) - s.step
        cell.style.transform = `translate3d(${pos}px, 0, 0)`
      })
    } else if (sliderRef.current) {
      sliderRef.current.style.transform = `translate3d(${s.x}px, 0, 0)`
    }
    if (barRef.current && s.step) {
      const fraction = Math.min(Math.max(mod(-s.x / s.step, count), 0), count - 1)
      barRef.current.style.transform = `translate3d(${fraction * 100}%, 0, 0)`
    }
  }, [wrap, count, s])

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    if (wrap) {
      s.step = viewport.clientWidth
    } else {
      // Group cells into pages of what fits in view, and stop the last page
      // flush with the right edge (Flickity's groupCells + contain).
      const width = viewport.clientWidth
      const first = cellRefs.current[0]
      const cells = cellRefs.current.map((cell) => ({
        left: cell && first ? cell.offsetLeft - first.offsetLeft : 0,
        width: cell?.offsetWidth ?? 0,
      }))
      const last = cells[cells.length - 1]
      const maxScroll = Math.max(0, last ? last.left + last.width - width : 0)
      s.slides = []
      s.cellSlide = []
      let pageStart = -Infinity
      cells.forEach((cell) => {
        if (cell.left + cell.width - pageStart > width + 1) {
          pageStart = cell.left
          const target = Math.min(cell.left, maxScroll)
          if (s.slides[s.slides.length - 1] !== target) s.slides.push(target)
        }
        s.cellSlide.push(s.slides.length - 1)
      })
      s.index = Math.min(s.index, s.slides.length - 1)
      s.step = cells[1] ? cells[1].left : width
    }
    s.x = -positionOf(s.index)
    s.velocity = 0
    render()
  }, [wrap, s, positionOf, render])

  /* ---------- physics loop ---------- */

  const animate = useCallback(() => {
    if (s.dragging) {
      s.velocity = s.dragX - s.x
    } else {
      s.velocity += (-positionOf(s.index) - s.x) * attraction
    }
    const previousX = s.x
    s.x += s.velocity
    s.velocity *= 1 - FRICTION
    render()

    if (!s.dragging && Math.round(s.x * 100) === Math.round(previousX * 100)) {
      s.restingFrames += 1
      if (s.restingFrames > 2) {
        s.raf = 0
        if (wrap) {
          // Keep numbers small: fold the index back into range.
          const folded = mod(s.index, count)
          s.x += (s.index - folded) * s.step
          s.index = folded
          render()
        }
        return
      }
    } else {
      s.restingFrames = 0
    }
    s.raf = requestAnimationFrame(animate)
  }, [s, attraction, positionOf, render, wrap, count])

  const start = useCallback(() => {
    if (!s.raf) {
      s.restingFrames = 0
      s.raf = requestAnimationFrame(animate)
    }
  }, [s, animate])

  const select = useCallback(
    (index: number) => {
      s.index = wrap ? index : Math.min(Math.max(index, 0), lastIndex())
      setSelected(mod(s.index, count))
      if (prefersReducedMotion()) {
        s.x = -positionOf(s.index)
        s.velocity = 0
        render()
        return
      }
      start()
    },
    [s, wrap, count, lastIndex, positionOf, render, start],
  )

  useLayoutEffect(() => {
    measure()
    const viewport = viewportRef.current
    if (!viewport) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    setFinePointer(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
    return () => cancelAnimationFrame(s.raf)
  }, [s])

  /* ---------- dragging ---------- */

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const viewport = viewportRef.current
    if (!viewport) return
    const startX = event.clientX
    const startY = event.clientY
    const pointerId = event.pointerId
    const isMouse = event.pointerType === 'mouse'
    let dragStarted = false
    let lastMoveTime = 0

    setPressed(true)
    s.dragStartX = s.x
    s.dragX = s.x
    s.previousDragX = s.x

    const onMove = (move: PointerEvent) => {
      if (move.pointerId !== pointerId) return
      const dx = move.clientX - startX
      const dy = move.clientY - startY
      if (!dragStarted) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
        // On touch, a mostly-vertical gesture is a page scroll, not a drag.
        if (!isMouse && Math.abs(dy) > Math.abs(dx)) {
          finish()
          return
        }
        dragStarted = true
        s.dragging = true
        viewport.setPointerCapture(pointerId)
        viewport.classList.add('is-dragging')
        start()
      }
      let dragX = s.dragStartX + dx
      if (!wrap) {
        // Rubber-band past either end, as Flickity does.
        const originBound = Math.max(-positionOf(0), s.dragStartX)
        if (dragX > originBound) dragX = (dragX + originBound) * 0.5
        const endBound = Math.min(-positionOf(lastIndex()), s.dragStartX)
        if (dragX < endBound) dragX = (dragX + endBound) * 0.5
      }
      s.previousDragX = s.dragX
      s.dragX = dragX
      lastMoveTime = performance.now()
    }

    const finish = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      setPressed(false)
      viewport.classList.remove('is-dragging')
      if (!dragStarted) return

      s.dragging = false
      s.suppressClick = true
      // Where would the slider coast to? Pick the page nearest that point.
      const restingX = s.x + s.velocity / FRICTION
      let next = s.index
      if (wrap) {
        next = Math.round(-restingX / s.step)
      } else {
        let best = Infinity
        s.slides.forEach((target, i) => {
          const distance = Math.abs(-target - restingX)
          if (distance < best) {
            best = distance
            next = i
          }
        })
      }
      // A quick flick that would settle back on the same cell still moves on.
      if (next === s.index && performance.now() - lastMoveTime < BOOST_WINDOW_MS) {
        const distance = -s.dragX - positionOf(s.index)
        const delta = s.previousDragX - s.dragX
        if (distance > 0 && delta > 0) next += 1
        else if (distance < 0 && delta < 0) next -= 1
      }
      select(next)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
  }

  // A drag must not also count as a click on the link underneath.
  const onClickCapture = (event: React.MouseEvent) => {
    if (s.suppressClick) {
      event.preventDefault()
      event.stopPropagation()
      s.suppressClick = false
    }
  }

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      select(s.index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      select(s.index - 1)
    }
  }

  // Tabbing to a link inside a cell brings that cell into view. Only for
  // keyboard focus: pressing a card to drag it also focuses its link.
  const onFocusCell = (event: React.FocusEvent, index: number) => {
    if (!(event.target as HTMLElement).matches(':focus-visible')) return
    if (wrap) {
      if (mod(s.index, count) !== index) select(s.index + (index - mod(s.index, count)))
    } else if (s.cellSlide[index] !== s.index) {
      select(s.cellSlide[index])
    }
  }

  /* ---------- adaptive height (wrap mode: cells are stacked absolutely) ---------- */

  const [height, setHeight] = useState<number | undefined>(undefined)
  useLayoutEffect(() => {
    if (!wrap) return
    const cell = cellRefs.current[selected]
    if (!cell) return
    const update = () => setHeight(cell.offsetHeight)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(cell)
    return () => observer.disconnect()
  }, [wrap, selected])

  return (
    <div
      className={`carousel ${wrap ? 'carousel--wrap' : ''} ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={viewportRef}
        className={`carousel__viewport ${pressed ? 'is-pointer-down' : ''}`}
        style={wrap ? { height } : undefined}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        onKeyDown={onKeyDown}
      >
        <div ref={sliderRef} className="carousel__slider">
          {cells.map((cell, i) => (
            <div
              key={i}
              ref={(node) => {
                cellRefs.current[i] = node
              }}
              className="carousel__cell"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={wrap && i !== selected ? true : undefined}
              inert={wrap && i !== selected ? true : undefined}
              onFocus={(event) => onFocusCell(event, i)}
            >
              {cell}
            </div>
          ))}
        </div>
      </div>

      {progress ? (
        <div className="carousel__progress" aria-hidden="true">
          <span ref={barRef} style={{ width: `${100 / count}%` }} />
        </div>
      ) : null}

      {finePointer ? (
        <DragIndicator variant={indicator} text={indicatorText} visible={hovering} pressed={pressed} />
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * Cursor companion shown while hovering a carousel, as on the original:
 * a frosted "Tempti" tooltip (projects) or a coral circle with arrows
 * (stories). It eases after the pointer (lerp 0.24 / 0.18); inside the
 * circle the arrows lag a little more, and pressing shrinks the circle
 * while the arrows spread.
 */
function DragIndicator({
  variant,
  text,
  visible,
  pressed,
}: {
  variant: IndicatorVariant
  text: string
  visible: boolean
  pressed: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const track = useRef({
    pointerX: Number.NaN,
    pointerY: Number.NaN,
    lastX: 0,
    lastY: 0,
    lagX: 0,
    lagY: 0,
    visible: false,
    hiddenAt: 0,
    stop: null as null | (() => void),
  }).current

  // Pointer position is tracked page-wide, like the original's single
  // indicator, so the badge is already under the cursor on entry.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      track.pointerX = event.clientX
      track.pointerY = event.clientY
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      track.stop?.()
    }
  }, [track])

  useEffect(() => {
    track.visible = visible
    if (!visible) {
      track.hiddenAt = performance.now()
      return
    }
    if (track.stop) return
    const el = ref.current
    if (!el) return
    const damp = variant === 'tooltip' ? 0.24 : 0.18
    let snapped = false

    const stop = onEveryFrame(() => {
      // Keep easing for a moment after leaving so it fades out in place.
      if (!track.visible && performance.now() - track.hiddenAt > 500) {
        stop()
        track.stop = null
        return
      }
      if (Number.isNaN(track.pointerX)) return
      if (!snapped) {
        // Start exactly at the pointer rather than sliding in from elsewhere.
        track.lastX = track.pointerX
        track.lastY = track.pointerY
        snapped = true
      }
      track.lastX += (track.pointerX - track.lastX) * damp
      track.lastY += (track.pointerY - track.lastY) * damp
      el.style.transform = `translate3d(${track.lastX}px, ${track.lastY}px, 0)`
      if (variant === 'circle' && innerRef.current) {
        track.lagX = (track.lagX + (track.pointerX - track.lastX - track.lagX) * damp) / 1.65
        track.lagY = (track.lagY + (track.pointerY - track.lastY - track.lagY) * damp) / 1.65
        innerRef.current.style.transform = `translate3d(${clamp(track.lagX, -12, 12)}px, ${clamp(track.lagY, -12, 12)}px, 0)`
      }
    })
    track.stop = stop
  }, [visible, variant, track])

  return createPortal(
    <div
      ref={ref}
      className={`drag-indicator drag-indicator--${variant} ${visible ? 'is-visible' : ''} ${pressed ? 'is-pressed' : ''}`}
      aria-hidden="true"
    >
      <div className="drag-indicator__bg" />
      <span ref={innerRef} className="drag-indicator__inner">
        {variant === 'tooltip' ? (
          text
        ) : (
          <>
            <svg className="drag-indicator__arrow drag-indicator__arrow--prev" viewBox="0 0 6 11">
              <path d="M5.5 0.5 0.75 5.5l4.75 5" />
            </svg>
            <svg className="drag-indicator__arrow drag-indicator__arrow--next" viewBox="0 0 6 11">
              <path d="M0.5 0.5l4.75 5-4.75 5" />
            </svg>
          </>
        )}
      </span>
    </div>,
    document.body,
  )
}
