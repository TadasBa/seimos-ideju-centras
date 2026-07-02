import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { privacyPage } from '../content/lt/privacy'

export function PrivacyPage() {
  useDocumentMeta(privacyPage.title)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" title={privacyPage.title}>
            <p className="lead">{privacyPage.updated}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container container--narrow prose">
          {privacyPage.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {'paragraphs' in section &&
                section.paragraphs?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} style={{ marginTop: 'var(--space-3)' }}>
                    {paragraph}
                  </p>
                ))}
              {'list' in section && section.list ? (
                <ul style={{ marginTop: 'var(--space-3)' }}>
                  {section.list.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {'after' in section &&
                section.after?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} style={{ marginTop: 'var(--space-3)' }}>
                    {paragraph}
                  </p>
                ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
