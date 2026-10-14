/**
 * Renders content strings that mark emphasis as **bold**, so copy taken
 * from the original keeps its <strong> phrases without storing HTML.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return <>{parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}</>
}
