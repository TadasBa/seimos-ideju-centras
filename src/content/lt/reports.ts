import type { ReportGroup } from '../types'

export const reportsPage = {
  title: 'Ataskaitos / Dokumentai',
  intro: 'Metinės veiklos ir finansinės ataskaitos – mūsų veiklos skaidrumui.',
  downloadLabel: 'Atsisiųsti',
}

export const reportGroups: ReportGroup[] = [
  {
    year: '2025 m.',
    documents: [
      {
        title: 'VšĮ Šeimos idėjų centras 2025 metų veiklos ataskaita',
        href: '/documents/veiklos-ataskaita-2025.pdf',
        kind: 'pdf',
      },
      {
        title: 'Metinių finansinių ataskaitų rinkinys',
        href: '/documents/finansine-ataskaita-2025.pdf',
        kind: 'pdf',
      },
    ],
  },
  {
    year: '2024 m.',
    documents: [
      {
        title: 'Metinė veiklos ataskaita',
        href: '/documents/veiklos-ataskaita-2024.pdf',
        kind: 'pdf',
      },
      {
        title: 'Metinė finansinė ataskaita',
        href: '/documents/finansine-ataskaita-2024.pdf',
        kind: 'pdf',
      },
    ],
  },
  {
    year: '2023 m.',
    documents: [
      {
        title: 'Metinė veiklos ataskaita',
        href: '/documents/veiklos-ataskaita-2023.pdf',
        kind: 'pdf',
      },
      {
        title: 'Metinė finansinė ataskaita',
        href: '/documents/finansine-ataskaita-2023.pdf',
        kind: 'pdf',
      },
    ],
  },
  {
    year: '2022 m.',
    documents: [
      {
        title: 'Metinė veiklos ataskaita',
        href: '/documents/veiklos-ataskaita-2022.pdf',
        kind: 'pdf',
      },
      { title: 'Metinė finansinė ataskaita (balansas)', href: '/documents/balansas-2022.pdf', kind: 'pdf' },
      {
        title: 'Metinė finansinė ataskaita (pelno / nuostolių)',
        href: '/documents/pelno-nuostoliu-2022.pdf',
        kind: 'pdf',
      },
      {
        title: 'Aiškinamasis raštas',
        href: '/documents/aiskinamasis-rastas-2022.docx',
        kind: 'docx',
      },
    ],
  },
  {
    year: '2021 m.',
    documents: [
      {
        title: 'VšĮ Šeimos idėjų centras metinė ataskaita',
        href: '/documents/veiklos-ataskaita-2021.pdf',
        kind: 'pdf',
      },
      {
        title: 'Metinė finansinė ataskaita',
        href: '/documents/finansine-ataskaita-2021.pdf',
        kind: 'pdf',
      },
      {
        title: 'Aiškinamasis raštas',
        href: '/documents/aiskinamasis-rastas-2021.pdf',
        kind: 'pdf',
      },
    ],
  },
  {
    year: '2020 m.',
    documents: [
      {
        title: 'Metinė veiklos ataskaita',
        href: '/documents/veiklos-ataskaita-2020.pdf',
        kind: 'pdf',
      },
      {
        title: 'Metinė finansinė ataskaita',
        href: '/documents/finansine-ataskaita-2020.pdf',
        kind: 'pdf',
      },
    ],
  },
]
