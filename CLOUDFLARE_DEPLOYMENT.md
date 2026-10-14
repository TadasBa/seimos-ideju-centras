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

## Variables, bindings and secrets

`wrangler.toml` is the source of truth for this Pages project's
configuration. Because the project has a `wrangler.toml`, Cloudflare manages
its plain variables and bindings from that file, and they can't be edited in
the dashboard. Change them in `wrangler.toml` and redeploy.

| Name | Kind | Where it is configured |
| --- | --- | --- |
| `CONTACT_TO` | Plain variable | `wrangler.toml` → `[vars]` |
| `CONTACT_FROM` | Plain variable | `wrangler.toml` → `[vars]` (must be a sender verified in Resend) |
| `CONTACT_RATE_LIMITER` | Workers KV binding | `wrangler.toml` → `[[kv_namespaces]]`, namespace `seimos-ideju-centras-contact-rate-limit` |
| `RESEND_API_KEY` | Secret | Encrypted Cloudflare Pages secret — never in `wrangler.toml` or any committed file |

The Node version for builds comes from `.node-version` / `.nvmrc` in the
repository, so no `NODE_VERSION` variable is needed.

### Setting the Resend API key

Set `RESEND_API_KEY` as an encrypted secret, either with Wrangler (it prompts
for the value, so the key never appears in shell history):

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name seimos-ideju-centras
```

or in the dashboard under `Workers & Pages > seimos-ideju-centras > Settings >
Variables and Secrets > Add`, with type `Secret`. Redeploy afterwards so the
running deployment picks it up.

Secrets are stored per environment. If preview deployments should send email
too, add the secret for the preview environment as well.

### KV namespace

The rate limiter uses the existing namespace
`seimos-ideju-centras-contact-rate-limit`; its ID is in `wrangler.toml`. Don't
create a new namespace. To look the ID up again:

```bash
npx wrangler kv namespace list
```

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

`wrangler pages dev` reads `[vars]` and the KV binding from `wrangler.toml`
(KV is simulated locally). Put the Resend key in a local `.dev.vars` file,
which is gitignored and must stay that way:

```txt
RESEND_API_KEY=...
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
