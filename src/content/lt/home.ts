import type { MediaItem, ServiceSummary, ValueItem } from '../types'

export const hero = {
  title: 'VšĮ Šeimos idėjų centras',
  text: 'Nevyriausybinė organizacija, teikianti socialines paslaugas vaikams, šeimoms, proto / psichikos negalią turintiems asmenims bei prisidedanti prie visuomenės gerovės per švietimą, mokymą ir profesinių santykių konsultavimą (superviziją).',
  valuesTitle: 'Mūsų vertybės:',
  primaryCta: { label: 'Mūsų paslaugos', to: '#paslaugos' },
  secondaryCta: { label: 'Susisiekti', to: '/kontaktai' },
  image: '/images/hero-hands.webp',
  imageAlt: 'Rankos, sudėtos kartu – palaikymo ir bendrystės simbolis',
}

export const heroValues: ValueItem[] = [
  { title: 'Kokybė ir efektyvumas' },
  { title: 'Lygiavertiškumas' },
  { title: 'Savarankiškumo ugdymas' },
  { title: 'Asmeninis ryšys ir profesionalumas' },
]

export const servicesSection = {
  eyebrow: 'Paslaugos',
  title: 'Kuo galime padėti?',
  ctaLabel: 'Susisiekti dėl paslaugos',
}

export const services: ServiceSummary[] = [
  {
    slug: '/vaiku-dienos-centras',
    title: 'Vaikų dienos centras',
    excerpt:
      'Socialinių įgūdžių ugdymas, pagalba pamokų ruošoje, amatų ir menų užsiėmimai vaikams iš socialinę riziką patiriančių šeimų.',
    image: '/images/vdc-veikla.jpg',
    imageAlt: 'Vaikai užsiėmimų metu vaikų dienos centre',
  },
  {
    slug: '/apsaugotas-bustas',
    title: 'Apsaugotas būstas',
    excerpt:
      'Alternatyva institucinei globai asmenims su proto ar psichikos negalia. Teikiame apgyvendinimo paslaugas bendruomenėje.',
    image: '/images/apsaugotas-bustas-veikla.jpg',
    imageAlt: 'Žmonės, dirbantys kartu bendruomenėje',
  },
  {
    slug: '/supervizija',
    title: 'Supervizija / Profesinių santykių konsultavimas',
    excerpt: 'Tikslas – atvira, stipri organizacija ir matomas, įgalintas darbuotojas.',
    image: '/images/supervizija-seminaras.jpg',
    imageAlt: 'Supervizijos seminaro akimirka',
  },
]

export const aboutSection = {
  eyebrow: 'Apie mus',
  year: '2018',
  title: 'VšĮ Šeimos idėjų centras',
  paragraphs: [
    'Įkurtas 2018 m., tęsiant Debeikių vaikų dienos centro veiklą.',
    'Mūsų misija – teikti kokybiškas ir efektyvias socialines paslaugas bei profesionalią pagalbą, siekiant visuomenės, bendruomenės, šeimos ir asmens gerovės.',
    'Nuo 2020 metų teikiame apgyvendinimo apsaugotame būste socialines paslaugas suaugusiems asmenims ir šeimoms, turintiems proto ar psichikos negalią. Nuo 2024 m. pradėjome teikti profesinių santykių konsultavimo paslaugas (superviziją).',
  ],
  ctaLabel: 'Daugiau apie mus',
}

export const mediaSection = {
  eyebrow: 'Spaudoje',
  title: 'Daugiau spaudoje',
  ctaLabel: 'Visos publikacijos',
}

export const homeMedia: MediaItem[] = [
  {
    title:
      '„Verslas iš širdies“. Gytis Baltrūnas: viskas, ką kuriu ir darau, yra iš trūkumo ir noro padėti kitam.',
    url: 'https://www.lrt.lt/radioteka/irasas/2000306627/verslas-is-sirdies-gytis-baltrunas-viskas-ka-kuriu-ir-darau-yra-is-trukumo-ir-noro-padeti-kitam',
    image: '/images/media-lrt.jpg',
    tag: 'LRT radijas',
  },
  {
    title: 'Aklas pasimatymas S08E37 | Gytis Baltrūnas | „Įgalinti žmogų – tai nieko nedaryti už jį“',
    url: 'https://youtube.com/watch?v=YSKpBnskdhQ',
    image: '/images/media-aklas-pasimatymas.jpg',
    tag: 'YouTube',
  },
]

export const storiesSection = {
  eyebrow: 'Įkvepiančios istorijos',
  title: 'Istorijos, kurios prasidėjo iš naujo',
  text: 'Apsaugoto būsto paslauga žmonėms padeda susigrąžinti savarankiškumą ir gyvenimą bendruomenėje. Štai keletas tikrų mūsų paslaugų gavėjų kelių.',
}

export const ctaBand = {
  title: 'Ieškote pagalbos? Susisiekite su mumis',
  text: 'Atsakysime į klausimus apie paslaugas, padėsime įvertinti situaciją ir rasti tinkamiausią pagalbos kelią.',
  ctaLabel: 'Susisiekti',
  words: [
    'Supervizija',
    'Apsaugotas būstas',
    'Socialinės paslaugos',
    'Vaikų dienos centras',
    'Pagalba',
    'Bendruomenė',
    'Šeima',
    'Savarankiškumas',
    'Apgyvendinimas',
    'Profesiniai santykiai',
    'Palaikymas',
    'Įgalinimas',
  ],
}
