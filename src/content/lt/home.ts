import type { MediaItem, ServiceSummary, ValueItem } from '../types'

/* Copy and structure follow the original home page section by section. */

export const hero = {
  title: 'VšĮ Šeimos idėjų centras',
  text: 'nevyriausybinė organizacija, teikianti socialines paslaugas vaikams, šeimoms, proto / psichikos negalią turintiems asmenims bei prisidedanti prie visuomenės gerovės per švietimą, mokymą ir profesinių santykių konsultavimą (superviziją).',
  valuesTitle: 'Mūsų vertybės:',
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
  title: 'Paslaugos',
  ctaLabel: 'Susisiekti dėl paslaugos',
}

export const services: ServiceSummary[] = [
  {
    slug: '/vaiku-dienos-centras',
    title: 'Vaikų dienos centras',
    excerpt:
      'Socialinių įgūdžių ugdymas, pagalba pamokų ruošoje, amatų ir menų užsiėmimai vaikams iš socialinę riziką patiriančių šeimų.',
    image: '/images/paslauga-vaiku-dienos-centras.jpg',
    imageAlt: 'Vaikai užsiėmimų metu vaikų dienos centre',
    icon: 'children',
  },
  {
    slug: '/apsaugotas-bustas',
    title: 'Apsaugotas būstas',
    excerpt:
      'Alternatyva institucinei globai asmenims su proto ar psichikos negalia. Teikiame apgyvendinimo paslaugas bendruomenėje.',
    image: '/images/apsaugotas-bustas-namai.webp',
    imageAlt: 'Apsaugoto būsto gyventojas savo namuose laiko ant rankų katę, šalia sėdi kitas gyventojas',
    imagePosition: '55% 50%',
    icon: 'house',
  },
  {
    slug: '/supervizija',
    title: 'Supervizija/ Profesinių santykių konsultavimas',
    excerpt: 'Tikslas – atvira, stipri organizacija ir matomas, įgalintas darbuotojas.',
    image: '/images/paslauga-supervizija.jpg',
    imageAlt: 'Spalvoti pieštukai savanorių užsiėmime',
    icon: 'hands',
  },
]

export const aboutSection = {
  /* The heading is split so the first phrase can carry the scribble. */
  titleHighlight: 'VšĮ Šeimos idėjų centras',
  titleRest: ' įkurtas 2018 m., tęsiant Debeikių vaikų dienos centro veiklą.',
  paragraphs: [
    'Mūsų misija – teikti kokybiškas ir efektyvias socialines paslaugas bei profesionalią pagalbą, siekiant visuomenės, bendruomenės, šeimos ir asmens gerovės.',
    'Nuo 2020 metų teikiame apgyvendinimo apsaugotame būste socialines paslaugas suaugusiems asmenims ir šeimoms, turintiems proto ar psichikos negalią. Nuo 2024 m. pradėjome teikti profesinių santykių konsultavimo paslaugas (superviziją).',
  ],
  /* On the original this link introduces the press videos below. */
  ctaLabel: 'Daugiau spaudoje',
  ctaTo: '/spaudoje',
}

/* The first video links out to LRT; the second plays in a lightbox. */
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
    youtubeId: 'YSKpBnskdhQ',
    image: '/images/media-aklas-pasimatymas.jpg',
    tag: 'YouTube',
  },
]

export const projectsSection = {
  title: 'Projektai',
  ctaLabel: 'Visi projektai',
  /* The original's home carousel shows the five most recent projects */
  count: 5,
}

export const storiesSection = {
  title: 'Įkvepiančios istorijos:',
}
