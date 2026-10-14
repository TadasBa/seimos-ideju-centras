import type { NavItem } from '../types'

export const org = {
  name: 'VšĮ Šeimos idėjų centras',
  shortName: 'Šeimos idėjų centras',
  /* Runs across the amber announcement bar at the top of every page. */
  tagline:
    'VšĮ Šeimos idėjų centras – nevyriausybinė organizacija, teikianti socialines, švietimo paslaugas vaikams, šeimoms, proto / psichikos negalią turintiems asmenims.',
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

/* Mirrors the original site's header menu, in the same order. */
export const nav: NavItem[] = [
  { label: 'Pagrindinis', to: '/' },
  { label: 'Apie mus', to: '/apie-mus' },
  { label: 'Ataskaitos / Dokumentai', to: '/ataskaitos-dokumentai' },
  { label: 'Projektai', to: '/projektai' },
  { label: 'Parama', to: '/parama' },
  { label: 'Kontaktai', to: '/kontaktai' },
]

/* The grey "Ieškote pagalbos?" band shown before the footer on every page.
   Trail words and colours are the original's own settings. */
export const ctaBand = {
  title: 'Ieškote pagalbos? Susisiekite su mumis',
  linkLabel: 'Susisiekite su mumis',
  trailWords: [
    'Socialinės paslaugos',
    'Supervizija',
    'Pagalba',
    'Apgyvendinimas',
    'Apsaugotas būstas',
    'Profesiniai santykiai',
  ],
  trailColors: ['#ff6c50', '#ffa628', '#8ccbff', '#78cd6e', '#2ac4ea'],
}

export const footer = {
  servicesTitle: 'Paslaugos',
  services: [
    { label: 'Vaikų dienos centras', to: '/vaiku-dienos-centras' },
    { label: 'Apsaugotas būstas', to: '/apsaugotas-bustas' },
    { label: 'Supervizija/ Profesinių santykių konsultavimas', to: '/supervizija' },
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
  privacy: { label: 'Privatumo Politika', to: '/privatumo-politika' },
  /* The original shows the address obfuscated against scrapers */
  emailDisplay: 'info [eta] seimosidejucentras.lt',
  addressStreet: 'Pakalnės g. 26B',
  addressRest: ', Leliūnų k. Anykščių r. LT29362',
  supportRules: { label: 'Paramos taisyklės', href: '/documents/paramos-taisykles.pdf' },
} as const
