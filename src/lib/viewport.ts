/**
 * Scroll-trigger and parallax engine.
 *
 * Mirrors how the original theme (Salient/Waypoints) decides when things
 * animate, so reveals fire at the same scroll positions:
 *   - atOffset(0.85)  → element top has risen to 85% of the viewport
 *   - bottomInView    → element bottom has entered the viewport
 *
 * One passive scroll listener and one rAF per frame serve every element.
 */

export type Trigger = (rect: DOMRect, viewportHeight: number) => boolean

export const atOffset =
  (fraction: number): Trigger =>
  (rect, vh) =>
    rect.top <= vh * fraction

export const bottomInView: Trigger = (rect, vh) => rect.bottom <= vh

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* ---------------- one-shot triggers ---------------- */

interface Watch {
  el: Element
  trigger: Trigger
  fire: () => void
}

const watches = new Set<Watch>()
let checkQueued = false
let listening = false

function check() {
  checkQueued = false
  const vh = window.innerHeight
  for (const watch of [...watches]) {
    if (watch.trigger(watch.el.getBoundingClientRect(), vh)) {
      watches.delete(watch)
      watch.fire()
    }
  }
  if (watches.size === 0) stopListening()
}

function queueCheck() {
  if (checkQueued) return
  checkQueued = true
  requestAnimationFrame(check)
}

function startListening() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', queueCheck, { passive: true })
  window.addEventListener('resize', queueCheck, { passive: true })
}

function stopListening() {
  if (!listening) return
  listening = false
  window.removeEventListener('scroll', queueCheck)
  window.removeEventListener('resize', queueCheck)
}

/** Calls `fire` once, the first time `trigger` passes. Returns a canceller. */
export function whenInView(el: Element, trigger: Trigger, fire: () => void): () => void {
  const watch: Watch = { el, trigger, fire }
  watches.add(watch)
  startListening()
  queueCheck()
  return () => {
    watches.delete(watch)
    if (watches.size === 0) stopListening()
  }
}

/* ---------------- continuous per-frame updates ---------------- */

type Ticker = () => void
const tickers = new Set<Ticker>()
let rafId = 0

function loop() {
  tickers.forEach((tick) => tick())
  rafId = tickers.size ? requestAnimationFrame(loop) : 0
}

/** Runs `tick` every animation frame until the returned function is called. */
export function onEveryFrame(tick: Ticker): () => void {
  tickers.add(tick)
  if (!rafId) rafId = requestAnimationFrame(loop)
  return () => {
    tickers.delete(tick)
  }
}

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
