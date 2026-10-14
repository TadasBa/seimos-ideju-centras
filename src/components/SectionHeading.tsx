import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  /** Accepts nodes so headings can wrap a word in <Scribble>. */
  title: ReactNode
  children?: ReactNode
  as?: 'h1' | 'h2'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag className="section-title">{title}</Tag>
      {children}
    </div>
  )
}
