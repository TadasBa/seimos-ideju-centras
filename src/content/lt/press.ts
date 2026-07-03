import type { MediaItem, PressArticle } from '../types'

export const pressPage = {
  title: 'Spaudoje',
  intro: 'Publikacijos ir pokalbiai apie mūsų veiklą, bendruomenines paslaugas ir žmones.',
  articlesTitle: 'Publikacijos',
  mediaTitle: 'Pokalbiai ir laidos',
  readLabel: 'Skaityti',
}

export const pressArticles: PressArticle[] = [
  {
    title:
      'Baimė, kad žmogus su psichosocialine negalia taps kaimynu ar vaiko klasioku: ją įveikti – paprasčiausias būdas',
    url: 'https://www.15min.lt/gyvenimas/naujiena/sveikata/baime-kad-zmogus-su-psichosocialine-negalia-taps-kaimynu-ar-vaiko-klasioku-ja-iveikti-paprasciausias-budas-1028-2022592',
    source: '15min.lt',
    image: '/images/press-nerimas.jpg',
  },
  {
    title: 'Gytis Baltrūnas: „Svarbu žmonėms palikti klaidos galimybę“',
    url: 'https://www.utenis.lt/projektas-paribio-istorijos/gytis-baltrunas-svarbu-zmonems-palikti-klaidos-galimybe-2/',
    source: 'Utenis.lt',
    image: '/images/supervizija-video-poster.webp',
  },
  {
    title: 'Namai, kuriuose prasideda naujas gyvenimas',
    url: 'https://www.15min.lt/naujiena/aktualu/lietuva/namai-kuriuose-prasideda-naujas-gyvenimas-56-1519514',
    source: '15min.lt',
    image: '/images/press-namai-naujas-gyvenimas.png',
  },
  {
    title:
      'Alternatyva institucinei globai – grupinio ir savarankiško gyvenimo namai bei apsaugotas būstas',
    url: 'https://www.15min.lt/video/alternatyva-institucinei-globai-grupinio-ir-savarankisko-gyvenimo-namai-bei-apsaugotas-bustas-203570',
    source: '15min.lt (video)',
    image: '/images/press-alternatyva-globai.png',
  },
  {
    title: 'Ekspertas G. Baltrūnas: perteklinė pagalba žaloja žmogų',
    url: 'https://www.15min.lt/naujiena/aktualu/lietuva/institucines-globos-pertvarkos-ekspertas-g-baltrunas-pertekline-pagalba-zaloja-zmogu-56-1506006',
    source: '15min.lt',
    image: '/images/press-negalia-darbai.jpg',
  },
  {
    title:
      'Globos namų pertvarkos ekspertas G. Baltrūnas: „Kol žmogus nenusipirks per mažų batų, neišmoks priimti tinkamo sprendimo“',
    url: 'https://www.bernardinai.lt/globos-namu-pertvarkos-ekspertas-g-baltrunas-kol-zmogus-nenusipirks-per-mazu-batu-neismoks-priimti-tinkamo-sprendimo/',
    source: 'Bernardinai.lt',
    image: '/images/gytis-baltrunas.jpg',
  },
]

export const pressMedia: MediaItem[] = [
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
