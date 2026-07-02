import type { NavItem } from '../types'

export const org = {
  name: 'VšĮ Šeimos idėjų centras',
  shortName: 'Šeimos idėjų centras',
  description:
    'Nevyriausybinė organizacija, teikianti socialines paslaugas vaikams, šeimoms, proto / psichikos negalią turintiems asmenims bei prisidedanti prie visuomenės gerovės per švietimą, mokymą ir profesinių santykių konsultavimą (superviziją).',
  supportCode: '304972120',
  email: 'info@seimosidejucentras.lt',
  facebook: 'https://www.facebook.com/profile.php?id=100057326596579',
  mapUrl: 'https://maps.app.goo.gl/JzLyVL8orb2sdB9X9',
  address: 'Pakalnės g. 26B, Leliūnų k., Anykščių r., LT-29362',
  addressNote: 'Registracijos adresas ir adresas korespondencijai',
  dayCenterAddress: 'Gedimino g. 9, Debeikiai, Anykščių r.',
  contacts: {
    director: {
      name: 'Aušra Baltrūnienė',
      role: 'Organizacijos vadovė',
      phone: '+370 615 25138',
      phoneHref: '+37061525138',
    },
    housing: {
      name: 'Gytis Baltrūnas',
      role: 'Apsaugoto būsto paslaugų koordinatorius',
      phone: '+370 680 98923',
      phoneHref: '+37068098923',
    },
  },
} as const

export const nav: NavItem[] = [
  { label: 'Pagrindinis', to: '/' },
  { label: 'Apie mus', to: '/apie-mus' },
  { label: 'Paslaugos', to: '/#paslaugos' },
  { label: 'Projektai', to: '/projektai' },
  { label: 'Spaudoje', to: '/spaudoje' },
  { label: 'Ataskaitos', to: '/ataskaitos-dokumentai' },
  { label: 'Kontaktai', to: '/kontaktai' },
]

export const navCta: NavItem = { label: 'Parama', to: '/parama' }

export const footer = {
  servicesTitle: 'Paslaugos',
  services: [
    { label: 'Vaikų dienos centras', to: '/vaiku-dienos-centras' },
    { label: 'Apsaugotas būstas', to: '/apsaugotas-bustas' },
    { label: 'Supervizija / Profesinių santykių konsultavimas', to: '/supervizija' },
  ],
  linksTitle: 'Nuorodos',
  links: [
    { label: 'Pagrindinis', to: '/' },
    { label: 'Apie mus', to: '/apie-mus' },
    { label: 'Ataskaitos / Dokumentai', to: '/ataskaitos-dokumentai' },
    { label: 'Projektai', to: '/projektai' },
    { label: 'Spaudoje', to: '/spaudoje' },
    { label: 'Parama', to: '/parama' },
    { label: 'Kontaktai', to: '/kontaktai' },
  ],
  contactsTitle: 'Kontaktai',
  copyright: `© ${new Date().getFullYear()} VšĮ Šeimos idėjų centras.`,
  privacy: { label: 'Privatumo politika', to: '/privatumo-politika' },
  supportRules: { label: 'Paramos taisyklės', href: '/documents/paramos-taisykles.pdf' },
} as const
