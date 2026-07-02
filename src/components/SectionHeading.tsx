import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
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
