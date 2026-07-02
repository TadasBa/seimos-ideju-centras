import type { ReactNode } from 'react'
import { FlourishUnderline } from './icons'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  /** Underline the last word with the hand-drawn flourish. */
  flourish?: boolean
  children?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  flourish = false,
  children,
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  let heading: ReactNode = title
  if (flourish) {
    const words = title.split(' ')
    const last = words.pop()
    heading = (
      <>
        {words.join(' ')}{' '}
        <span className="underline-flourish">
          {last}
          <FlourishUnderline />
        </span>
      </>
    )
  }

  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag className="section-title">{heading}</Tag>
      {children}
    </div>
  )
}
