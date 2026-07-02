import type { Step } from '../types'

export const supportPage = {
  title: 'Parama',
  intro: 'Prisidėkite prie Šeimos idėjų centro veiklos – jūsų parama kuria realų pokytį.',

  requisitesTitle: 'Paramos gavėjo rekvizitai',
  requisites: [
    { label: 'Pavadinimas', value: 'VšĮ Šeimos idėjų centras' },
    { label: 'Paramos gavėjo kodas', value: '304972120' },
  ],

  campaignNote: 'Šiais metais ypač kviečiame paremti Debeikių vaikų dienos centrą 💛',

  whyTitle: 'Kodėl tai svarbu?',
  why: [
    'Mūsų vaikų dienos centras veikia kaimiškoje vietovėje, kur vaikams trūksta saugių ir prasmingų popamokinių veiklų. Čia jie gali mokytis, kurti, stiprinti socialinius įgūdžius ir būti vaikais – be ekranų.',
    'Nors centras teikia akredituotas paslaugas, finansavimo nepakanka, todėl jūsų parama padeda tęsti šią veiklą.',
  ],

  helpTitle: 'Jūsų parama padės',
  help: [
    'užtikrinti vaikų pavežėjimą',
    'organizuoti edukacines išvykas',
    'įsigyti ugdymo priemones',
    'kurti saugią žaidimų erdvę',
  ],
  helpOutro: 'Kartu galime suteikti vaikams daugiau saugumo ir galimybių augti.',

  donateCta: 'Skirti paramą',
  gpmCta: 'Skirti 1,2 % GPM',
  rulesLabel: 'Paramos taisyklės (PDF)',
}

export const gpmPage = {
  title: 'Kaip skirti 1,2 % GPM paramą',
  intro:
    'Dalį jau sumokėto gyventojų pajamų mokesčio galite skirti mūsų veiklai – tai nieko nekainuoja, bet vaikams reiškia labai daug.',

  steps: [
    {
      title: 'Prisijunkite prie VMI EDS',
      lines: [
        'deklaravimas.vmi.lt – prisijunkite per el. bankininkystę, Smart-ID ar mobilųjį parašą.',
      ],
    },
    {
      title: 'Pasirinkite formą',
      lines: ['„Pildyti formą“ → „Prašymas skirti paramą“ (FR0512 v.5)'],
    },
    {
      title: 'Įrašykite mūsų duomenis',
      lines: [
        'Gavėjo tipas: Paramos gavėjas',
        'Gavėjo pavadinimas: VšĮ Šeimos idėjų centras',
        'Gavėjo kodas: 304972120',
        'Mokesčio dalis: iki 1,2 %',
        'Mokesčio paskirtis: Vaikų dienos centrui',
        'Paskirties laukelyje galite įrašyti ir kitą pageidaujamą paskirtį, pvz. „Organizacijos veiklai“.',
      ],
    },
    {
      title: 'Pateikite prašymą',
      lines: ['Spauskite „Pateikti deklaraciją“.'],
    },
  ] satisfies Step[],

  goodToKnowTitle: 'Svarbu žinoti',
  goodToKnow: [
    'Tai nieko nekainuoja – skiriate dalį jau sumokėto mokesčio.',
    'Jei nepaskirsite – ši dalis liks valstybės biudžete.',
    'Galite keisti sprendimą kiekvienais metais.',
  ],

  edsUrl: 'https://deklaravimas.vmi.lt',
  edsCta: 'Eiti į deklaravimas.vmi.lt',
}
