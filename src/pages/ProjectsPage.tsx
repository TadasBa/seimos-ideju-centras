import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { SectionHeading } from '../components/SectionHeading'
import { ChevronDownIcon } from '../components/icons'
import { projects, projectsPage } from '../content/lt/projects'

/** Lithuanian plural forms: 1 projektas, 2–9 projektai, 10–20/0 projektų. */
function projectCountLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} projektas`
  if (mod10 >= 2 && mod10 <= 9 && !(mod100 >= 11 && mod100 <= 19)) return `${count} projektai`
  return `${count} projektų`
}

export function ProjectsPage() {
  useDocumentMeta(projectsPage.title, projectsPage.intro)
  const { hash } = useLocation()
  const openProjectId = hash ? hash.slice(1) : undefined

  const years = useMemo(
    () => [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a),
    [],
  )
  const [activeYear, setActiveYear] = useState<number | null>(null)

  const visible = activeYear ? projects.filter((project) => project.year === activeYear) : projects

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading as="h1" title={projectsPage.title}>
            <p className="lead">{projectsPage.intro}</p>
          </SectionHeading>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="container">
          <div className="projects-toolbar">
            <div className="chip-row" role="group" aria-label="Filtruoti pagal metus">
              <button
                type="button"
                className={`chip ${activeYear === null ? 'is-active' : ''}`}
                onClick={() => setActiveYear(null)}
              >
                {projectsPage.filterAll}
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`chip ${activeYear === year ? 'is-active' : ''}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
            <span style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-sm)' }}>
              {projectCountLabel(visible.length)}
            </span>
          </div>

          <div>
            {visible.map((project) => (
              <details
                key={project.id}
                className="accordion project-card"
                id={project.id}
                open={project.id === openProjectId}
              >
                <summary>
                  <span>{project.title}</span>
                  <span className="project-card__meta">
                    <span className="project-year">{project.year}</span>
                    <ChevronDownIcon className="accordion__chevron" />
                  </span>
                </summary>
                <div className="accordion__body">
                  {project.description?.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                  <dl className="detail-grid">
                    {project.details.map((detail) => (
                      <div key={detail.label}>
                        <dt>{detail.label}</dt>
                        <dd>{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
