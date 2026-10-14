import type { MediaItem } from '../content/types'
import { PlayIcon } from './icons'

export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <a className="thumb-card" href={item.url} target="_blank" rel="noreferrer">
      <div className="thumb-card__media">
        <img src={item.image} alt="" loading="lazy" />
        <span className="thumb-card__play">
          <span>
            <PlayIcon />
          </span>
        </span>
      </div>
      <span className="muted">{item.tag}</span>
      <h3>{item.title}</h3>
    </a>
  )
}
