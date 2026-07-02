import type { Story } from '../content/types'
import { ChevronDownIcon } from './icons'

interface StoryAccordionProps {
  stories: Story[]
  /** Which story (if any) starts expanded. */
  openId?: string
}

export function StoryAccordion({ stories, openId }: StoryAccordionProps) {
  return (
    <div>
      {stories.map((story) => (
        <details key={story.id} className="accordion" id={story.id} open={story.id === openId}>
          <summary>
            {story.title}
            <ChevronDownIcon className="accordion__chevron" />
          </summary>
          <div className="accordion__body">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
