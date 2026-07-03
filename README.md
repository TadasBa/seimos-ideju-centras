# VšĮ Šeimos idėjų centras

Website for [seimosidejucentras.lt](https://seimosidejucentras.lt) — React, TypeScript and Vite,
deployed on Cloudflare Pages. The contact form runs as a Cloudflare Pages Function.

Indexing is currently disabled until the final custom domain is routed. See
[`CLOUDFLARE_DEPLOYMENT.md`](./CLOUDFLARE_DEPLOYMENT.md) before deploying.

## Getting started

```bash
npm install        # install dependencies
npm run dev        # dev server → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run preview:cf # preview with Pages Functions (requires wrangler)
npm run test       # contact validation tests
npm run check      # typecheck + tests + production build
npm run typecheck  # type-check only
```

The contact form (`/api/contact`) only runs under `npm run preview:cf` or on Cloudflare Pages —
plain `npm run dev` serves the frontend only.

## Structure

```
├── public/          # static assets, copied to dist/ as-is
│   ├── documents/    # annual reports (PDF), donation terms
│   └── images/
├── functions/
│   └── api/contact.ts  # Cloudflare Pages Function — sends the contact form via Resend
└── src/
    ├── content/
    │   ├── types.ts    # content model shared by all locales
    │   └── lt/         # all site copy, in Lithuanian
    ├── components/     # shared components
    ├── hooks/
    ├── pages/          # one file per route
    └── styles/         # tokens.css holds design variables
```

All visible text lives in `src/content/lt/*.ts` — copy changes don't touch components. Adding a
language later means a new `src/content/<locale>/` folder matching `content/types.ts`.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Add a custom domain under the Pages project's **Custom domains**.

## Contact form (Resend)

The form sends email via [Resend](https://resend.com) (free tier: 3,000 emails/month).

1. Create a Resend account and verify the sending domain.
2. Create an API key.
3. In the Pages project's **Settings → Environment variables**, add:

   | Variable         | Example                        |
   | ---------------- | ------------------------------- |
   | `RESEND_API_KEY` | Resend API key                  |
   | `CONTACT_TO`     | `info@seimosidejucentras.lt`    |
   | `CONTACT_FROM`   | a verified sender address       |

The contact form also requires a Cloudflare KV binding named `CONTACT_RATE_LIMITER` for rate
limiting. Without these variables and the binding, the form returns an error with a mailto fallback —
the rest of the site is unaffected. For local testing, put the same variables in a `.dev.vars` file
(git-ignored) and run `npm run build && npm run preview:cf`.
