import type { TimelineEntry, ValueItem } from '../types'

export const aboutPage = {
  title: 'Apie mus',
  intro:
    'VšĮ Šeimos idėjų centras – nevyriausybinė organizacija, teikianti socialines, švietimo paslaugas vaikams, šeimoms, proto / psichikos negalią turintiems asmenims.',

  missionTitle: 'Misija',
  mission:
    'Mūsų misija – teikti kokybiškas ir efektyvias socialines paslaugas bei profesionalią pagalbą dėl negalios ar socialinės rizikos atskirtį patiriantiems asmenims ir šeimoms. Skatiname savarankiškumą, lygiavertiškumą ir socialinę įtrauktį, o taip pat stipriname organizacijas bei specialistus, teikdami profesinių santykių konsultavimo (supervizijos) paslaugas.',

  valuesTitle: 'Mūsų vertybės',
  historyTitle: 'Istorija',
}

export const aboutValues: ValueItem[] = [
  {
    title: 'Kokybė ir efektyvumas',
    description: 'Siekiame aukštų standartų, prasmingų rezultatų ir nuolatinio tobulėjimo.',
  },
  {
    title: 'Lygiavertiškumas',
    description: 'Savo darbe užtikriname pagarbą, atvirumą ir nediskriminavimą.',
  },
  {
    title: 'Savarankiškumo ugdymas',
    description: 'Skatiname asmeninį augimą ir atsakomybę tiek mūsų klientams, tiek darbuotojams.',
  },
  {
    title: 'Asmeninis ryšys ir profesionalumas',
    description:
      'Dirbame atsakingai, kurdami nuoširdų ir pagarba grįstą bendravimą su klientu ir kolektyve.',
  },
]

export const historyParagraphs = [
  'VšĮ Šeimos idėjų centras įkurtas 2018 m. siekiant užtikrinti Debeikių vaikų dienos centro veiklos tęstinumą. Tai tėvų iniciatyva, įgyvendinta bendradarbiaujant su vietos mokykla, bendruomene ir savivaldybe. Nuo veiklos pradžios čia užtikrinamas vaikų užimtumas, maitinimas ir socialinių įgūdžių ugdymas.',
  'Plėsdama veiklą, organizacija pradėjo teikti socialines paslaugas šeimoms bei asmenims su proto, psichikos ir psichosocialine negalia, vykdyti pagalbos šeimoms ir neįgaliųjų socialinės integracijos projektus.',
  '2021 m. įkurta nevalstybinė pradinė Šventosios upės mokykla, veikusi iki 2024 m., kurios ugdymas rėmėsi netradicinio ugdymo koncepcija bei visuminio ugdymo pedagoginėmis idėjomis.',
  'Nuo 2024 m. organizacija teikia profesinių santykių konsultavimo paslaugas (supervizijas) įstaigoms ir specialistams, padėdama kurti palaikančias ir atsakingas organizacijų bendruomenes, stiprinti bendradarbiavimą bei skatinti asmeninį ir profesinį augimą.',
]

export const timeline: TimelineEntry[] = [
  {
    period: '2018',
    title: 'Įkurtas Šeimos idėjų centras',
    description:
      'Tėvų iniciatyva, bendradarbiaujant su vietos mokykla, bendruomene ir savivaldybe, užtikrintas Debeikių vaikų dienos centro veiklos tęstinumas.',
  },
  {
    period: '2020',
    title: 'Pradėtos apsaugoto būsto paslaugos',
    description:
      'Pradėtos teikti apgyvendinimo apsaugotame būste socialinės paslaugos suaugusiems asmenims ir šeimoms, turintiems proto ar psichikos negalią.',
  },
  {
    period: '2021–2024',
    title: 'Šventosios upės mokykla',
    description:
      'Veikė nevalstybinė pradinė mokykla, kurios ugdymas rėmėsi netradicinio ugdymo koncepcija bei visuminio ugdymo pedagoginėmis idėjomis.',
  },
  {
    period: 'Nuo 2024',
    title: 'Supervizijos paslaugos',
    description:
      'Teikiamos profesinių santykių konsultavimo paslaugos (supervizijos) įstaigoms ir specialistams.',
  },
]
