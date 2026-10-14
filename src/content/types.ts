/**
 * Content model shared by all locales.
 *
 * All user-visible text lives in `src/content/<locale>/` modules typed
 * against these interfaces. Adding a language later means adding a new
 * locale folder that satisfies the same types — components stay untouched.
 */

export type Locale = 'lt' // later: | 'en' | 'ru' | 'uk'

export interface NavItem {
  label: string
  to: string
}

export interface ValueItem {
  title: string
  /** Longer explanation, shown on the About page. */
  description?: string
}

export interface ServiceSummary {
  slug: string
  title: string
  excerpt: string
  image: string
  imageAlt: string
  /** Outline mark shown on the home page tile. */
  icon: 'children' | 'house' | 'hands'
}

export interface Story {
  id: string
  title: string
  paragraphs: string[]
}

export interface ProjectDetail {
  label: string
  value: string
}

export interface Project {
  id: string
  title: string
  year: number
  /** Photo from the project archive. */
  image?: string
  /** Shown when the card is expanded. */
  details: ProjectDetail[]
  description?: string[]
}

export interface PressArticle {
  title: string
  url: string
  source: string
  /** Thumbnail from the article. */
  image?: string
}

export interface MediaItem {
  title: string
  url: string
  image: string
  tag: string
  /** When set, the video plays in an on-page lightbox instead of linking out. */
  youtubeId?: string
}

export interface DocumentLink {
  title: string
  href: string
  kind: 'pdf' | 'docx'
}

export interface ReportGroup {
  year: string
  documents: DocumentLink[]
}

export interface TimelineEntry {
  period: string
  title: string
  description: string
}

export interface Step {
  title: string
  lines: string[]
}
