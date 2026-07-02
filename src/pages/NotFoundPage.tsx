import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function NotFoundPage() {
  useDocumentMeta('Puslapis nerastas')

  return (
    <section className="container not-found">
      <h1>404</h1>
      <p>Atsiprašome, tokio puslapio nėra. Galbūt jis buvo perkeltas arba adresas įrašytas klaidingai.</p>
      <Link to="/" className="btn btn--fire">
        Grįžti į pagrindinį
      </Link>
    </section>
  )
}
