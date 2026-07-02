import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { DocumentIcon } from '../components/icons'
import { reportGroups, reportsPage } from '../content/lt/reports'

export function ReportsPage() {
  useDocumentMeta(reportsPage.title, reportsPage.intro)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" title={reportsPage.title}>
            <p className="lead">{reportsPage.intro}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container container--narrow">
          {reportGroups.map((group) => (
            <div key={group.year} className="report-year" style={{ marginBottom: 'var(--space-7)' }}>
              <h2>{group.year}</h2>
              <ul className="report-list">
                {group.documents.map((doc) => (
                  <li key={doc.href}>
                    <a className="doc-link" href={doc.href} target="_blank" rel="noreferrer">
                      <DocumentIcon />
                      <span>{doc.title}</span>
                      <span>{doc.kind.toUpperCase()}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
