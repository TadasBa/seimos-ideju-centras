# VšĮ Šeimos idėjų centras — svetainė

Naujoji [seimosidejucentras.lt](https://seimosidejucentras.lt) svetainė: React + TypeScript + Vite,
talpinama **Cloudflare Pages** (nemokamas planas), kontaktų forma — **Cloudflare Pages Function**.

## Paleidimas

```bash
npm install        # įdiegti priklausomybes
npm run dev        # dev serveris → http://localhost:5173
npm run build      # produkcinis build į dist/
npm run preview    # peržiūrėti produkcinį build lokaliai
npm run preview:cf # build peržiūra su Pages Functions (reikia: npm i -g wrangler)
npm run typecheck  # TypeScript patikra
```

> Kontaktų forma (`/api/contact`) dev režime (`npm run dev`) neveikia — funkcijos veikia tik
> per `npm run preview:cf` (wrangler) arba Cloudflare Pages aplinkoje.

## Struktūra

```
├── public/               # statiniai failai (kopijuojami į dist/ be pakeitimų)
│   ├── documents/        # metinės ataskaitos (PDF), paramos taisyklės
│   ├── images/           # nuotraukos, logotipas
│   └── _redirects        # SPA fallback Cloudflare Pages
├── functions/
│   └── api/contact.ts    # Cloudflare Pages Function — kontaktų formos siuntimas
└── src/
    ├── content/
    │   ├── types.ts      # turinio modelio tipai (bendri visoms kalboms)
    │   └── lt/           # VISAS svetainės tekstas lietuvių kalba
    ├── components/       # perpanaudojami komponentai (Header, Footer, animacijos…)
    ├── hooks/            # useDocumentMeta, usePrefersReducedMotion
    ├── pages/            # puslapiai (1 failas = 1 maršrutas)
    └── styles/           # tokens.css (dizaino kintamieji) + kiti stiliai
```

### Turinys atskirtas nuo kodo

Visas matomas tekstas gyvena `src/content/lt/*.ts` failuose — norint pakeisti tekstą,
nereikia liesti komponentų. Kai prireiks EN / RU / UA kalbų: sukuriamas `src/content/en/`
(ir t. t.) katalogas su tais pačiais failais pagal `src/content/types.ts` tipus, ir pridedamas
kalbos prefiksas maršrutuose.

### Dizainas

Spalvos, šriftai, atstumai — `src/styles/tokens.css` (CSS kintamieji). Motyvai: židinio arka
(`.arch-frame`), kylančios žiežirbos (`EmberCanvas`), žodžių pėdsakas CTA juostoje
(`WordTrailBand`). Visos animacijos gerbia `prefers-reduced-motion`.

## Diegimas į Cloudflare Pages

1. Įkelkite repozitoriją į GitHub:

   ```bash
   git init
   git add .
   git commit -m "Pradinė svetainės versija"
   git remote add origin git@github.com:<jūsų-vartotojas>/<repo>.git
   git push -u origin main
   ```

2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pasirinkite repo:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

   Nuo šiol kiekvienas `git push` automatiškai perdiegs svetainę.

3. Prijunkite domeną: Pages projekto **Custom domains** → `seimosidejucentras.lt`.

## Kontaktų formos nustatymas (Resend)

Forma siunčia laiškus per [Resend](https://resend.com) (nemokamai iki 3 000 laiškų/mėn.):

1. Užsiregistruokite resend.com, patvirtinkite `seimosidejucentras.lt` domeną (DNS įrašai — per Cloudflare).
2. Sukurkite API raktą.
3. Cloudflare Pages projekto **Settings → Environment variables** pridėkite:

   | Kintamasis       | Reikšmė                                        |
   | ---------------- | ---------------------------------------------- |
   | `RESEND_API_KEY` | Resend API raktas                              |
   | `CONTACT_TO`     | `info@seimosidejucentras.lt`                   |
   | `CONTACT_FROM`   | `svetaine@seimosidejucentras.lt` (patvirtintas siuntėjas) |

Kol kintamieji nenustatyti, forma grąžina klaidą su nuoroda parašyti tiesiogiai el. paštu —
svetainė veikia ir be jos.

Lokalus formos testavimas: sukurkite `.dev.vars` failą (jis yra `.gitignore`) su tais pačiais
kintamaisiais ir paleiskite `npm run build && npm run preview:cf`.
