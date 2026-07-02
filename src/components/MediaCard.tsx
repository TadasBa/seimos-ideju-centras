import type { MediaItem } from '../content/types'
import { PlayIcon } from './icons'

export function MediaCard({ item }: { item: MediaItem }) {
  return (
    <a className="card media-card" href={item.url} target="_blank" rel="noreferrer">
      <div className="media-card__thumb">
        <img src={item.image} alt="" loading="lazy" />
        <div className="media-card__play">
          <span>
            <PlayIcon />
          </span>
        </div>
      </div>
      <div className="media-card__body">
        <span className="muted">{item.tag}</span>
        <h3>{item.title}</h3>
      </div>
    </a>
  )
}
