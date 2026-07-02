import { useEffect } from 'react'

const SITE_NAME = 'VšĮ Šeimos idėjų centras'

/**
 * Sets the document title and meta description for a page.
 * Pass `null` as title for the home page (site name only).
 */
export function useDocumentMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} – ${SITE_NAME}` : SITE_NAME

    if (description) {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (meta) meta.content = description
    }
  }, [title, description])
}
