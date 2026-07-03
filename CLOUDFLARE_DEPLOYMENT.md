# Cloudflare Pages Deployment

This project is prepared for Cloudflare Pages with Vite static output and a Pages Function at `/api/contact`.

## Current SEO state

Indexing is intentionally disabled until the final custom domain is routed:

- `index.html` includes `noindex, nofollow, noarchive`.
- `public/robots.txt` disallows all crawlers.
- `public/_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive`.

When the final domain is ready, enable indexing by:

1. Remove the robots meta tag from `index.html`.
2. Remove `X-Robots-Tag` from `public/_headers`.
3. Change `public/robots.txt` to:

```txt
User-agent: *
Allow: /

Sitemap: https://seimosidejucentras.lt/sitemap.xml
```

## Cloudflare Pages settings

- Framework preset: `React (Vite)` or `None`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Node version: `22`

## Required environment variables

Set these in Cloudflare Pages under `Settings > Environment variables`:

| Variable | Environment | Notes |
| --- | --- | --- |
| `NODE_VERSION` | Production and preview | `22` |
| `RESEND_API_KEY` | Production and preview | Resend API key |
| `CONTACT_TO` | Production and preview | Destination mailbox, e.g. `info@seimosidejucentras.lt` |
| `CONTACT_FROM` | Production and preview | Verified sender, e.g. `svetaine@seimosidejucentras.lt` |

## Required binding

The contact form requires a KV namespace binding for rate limiting.

1. Create a KV namespace, for example `seimos-ideju-centras-contact-rate-limit`.
2. Open the Pages project.
3. Go to `Settings > Bindings > Add > KV namespace`.
4. Variable name: `CONTACT_RATE_LIMITER`.
5. Select the KV namespace.
6. Add the same binding for preview if you use preview deployments.
7. Redeploy after adding the binding.

## Local checks

```bash
npm ci
npm run check
npm run build
npm run preview
```

For local Pages Function testing:

```bash
npm run build
npm run preview:cf
```

Create a local `.dev.vars` file for Resend values. Do not commit it.

```txt
RESEND_API_KEY=...
CONTACT_TO=info@seimosidejucentras.lt
CONTACT_FROM=svetaine@seimosidejucentras.lt
```

## Automatic deploy pipeline

Use Cloudflare Pages Git integration:

1. Push this repository to GitHub.
2. In Cloudflare, open `Workers & Pages`.
3. Click `Create application`.
4. Choose `Pages`.
5. Connect the GitHub repository.
6. Set the build settings above.
7. Deploy.

After this, every push to `main` creates a production deployment. Pull requests and non-production branches create preview deployments if preview deployments are enabled.
