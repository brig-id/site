# AGENTS.md — brig·id `site`

This repository is the **public marketing/landing site** for brig·id.

## Language

**All content must be in English** — code, comments, docs, issues. No exceptions.

## What the site is for

brig·id is pre-beta. The site says where the project is going, so it describes
features that do not exist yet: **every one carries its status** (`available`,
`progress`, `planned`), set in `src/data/features.ts` and shown as a tag. Before
changing a status or writing a new claim, check it against the code and
[`brig-id/spec`](https://github.com/brig-id/spec): nothing may read as shipped
when it is not. The limits of the system are stated on `/identities/` and stay
there.

## Stack

- **Astro**, built as a fully static site: no server runtime, no client
  framework. A page ships the little JavaScript it needs (`src/scripts/`) and
  reads fine without it.
- **Hand-written CSS**: the design tokens and shared parts are in
  `src/styles/global.css`, the rest sits in each page or component. Dark only.
- **Nothing from a third party at run time.** Fonts (Geist, Geist Mono,
  Instrument Serif, via Fontsource) and icons (Phosphor, inlined as SVG at build
  time by `src/components/Icon.astro`) are built into `dist/`. No analytics, no
  cookie, no CDN.
- This differs on purpose from [`brig-id/app`](https://github.com/brig-id/app)
  (Qwik + Web Awesome): the site needs no component library and no private
  registry token.

### Layout

| Path                      | Content                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/`              | One file per page: home, `features`, `identities`, `pricing`, `editions`, `compare/` (hub and one page per product), `manifesto`, `history`, `status`, `servers`, `404` |
| `src/data/features.ts`    | Every feature, its group and its status                                                                                                                                 |
| `src/data/competitors.ts` | The products brig·id is compared with, their facts and sources                                                                                                          |
| `src/data/editions.ts`    | seedling, grove and forest: what is decided about each                                                                                                                  |
| `src/data/nav.ts`         | Navigation, and `CONTACT`: where "Contact us" leads                                                                                                                     |
| `src/components/`         | Header, footer, icons, the hero's prism scene                                                                                                                           |
| `src/lib/derive.ts`       | The per-site identifier demo of `/identities/`                                                                                                                          |
| `worker/`                 | The Cloudflare Worker: security headers, `www` redirect, `/api/status`                                                                                                  |
| `scripts/check-dist.mjs`  | Fails the build if a page needs an inline script or style                                                                                                               |
| `scripts/og/og.html`      | Source of `public/og.png`                                                                                                                                               |

### Voice

- Written for the general public first. The passkey is how it works, not the
  headline: say "nothing to remember", and that the private self carries no
  data (no name, no email, no password, no profile); what others see always
  belongs to an identity.
- The pages that present the product (`features`, `identities`, `history`,
  `pricing`, `editions`) do not link to GitHub for their evidence, and never to
  decision records. Links to the source belong in the footer.
- The origin story is told on `/history/`. Elsewhere, say that brig·id follows
  from work between human-computer interaction and the social sciences on a
  semiotic model of digital identity; the idea of brig·id itself is its
  author's alone.

### Comparison pages

`/compare/` exists to be useful to someone choosing, which is also what makes it
worth finding. The rules, enforced in part by `src/data/competitors.spec.ts`:

- Every product lists where it is **ahead** of brig·id. Most are mature and
  brig·id is pre-beta: say so.
- A fact about another product comes from its own documentation or repository,
  linked in `sources`. What cannot be confirmed is `unknown` ("Not confirmed"),
  never a guess.
- No prices and no popularity figures.
- `CHECKED` is the date the sources were last read: change it when you re-read
  them, not when you reword a sentence.

### Pricing and editions

Nothing is sold yet. `/pricing/` and `/editions/` describe the intended model.

- **Hosted (brig·id Cloud), shown first:** Personal is free for ever, with
  limits stated as a safeguard (1 account per person, 5 identities, 10 connected
  websites) and not enforced at the start; Team and Enterprise on quotation.
- **Self-hosted:** three editions, **all free software (AGPL-3.0)**: seedling
  for oneself or a family, grove for a community or an association on **one**
  machine of its own, forest for a company. They differ by who runs them and by
  what an outage costs, not by features. **No volumes and no test figures on
  the site**: an edition is presented by the situation it is for.
- **What is paid**, for any edition: support with guaranteed updates, hosting
  by the project, and modules that are separate programs. No security feature
  is ever paid, and there is no commercial licence.

Everything that does not exist carries a `Planned` tag, and an undecided detail
reads "To be defined". Only the offers above are public: do not add others to
this repository, which anyone can read.

### Content-Security-Policy

`worker/headers.ts` sends `script-src 'self'; style-src 'self'` with no
`'unsafe-inline'`. So: no inline `<script>`, no inline `<style>`, no `style=""`
attribute, no inline event handler. Set colours with a class (`hue-amber`, …)
and anything dynamic from a script through the CSSOM. `pnpm build` checks the
output and fails otherwise.

### Status page

`/api/status` is answered by the Worker, which probes the servers listed in
`worker/status.ts` itself and keeps the result for one minute. The page reads
that list at build time too, so the two cannot drift. Add a server or a check
there, with a test in `worker/index.spec.ts`.

## Deployment

Deployed to **Cloudflare Workers** (static assets + `worker/index.ts`), as the
Worker `brigid-site` with `brig.id` and `www.brig.id` as its custom domains
(`workers.dev` URLs are off; `www` redirects to the apex).

`.github/workflows/deploy.yml` tests, builds and deploys on every push to `main`
(and on demand). It is not Workers Builds: the Cloudflare dashboard has no Git
connection for this Worker.

`.github/workflows/preview.yml` publishes each pull request from this
repository as a Worker Preview at `https://pr-<number>.brig.id` (the `brig.id`
custom domain is enabled for Production and Preview in the dashboard, which
added a proxied `*.brig.id` DNS record), comments the URL on the pull request
and deletes the Preview when the pull request is closed. The Worker sends
`X-Robots-Tag: noindex, nofollow` on every host but `brig.id`.

Both workflows read two repository secrets, whose values are in OpenBao's `kv/orgs/brig-id`:
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The build itself needs no
secret.

The entry module of a Worker may export its handler and nothing else: keep
constants and helpers in other files of `worker/`.

## Common commands

```bash
pnpm install
pnpm dev             # Astro dev server (no Worker: no headers, no /api/status)
pnpm build           # Static build into dist/, then the CSP check
pnpm preview         # wrangler dev: serve dist/ through the Worker locally
pnpm typecheck       # astro check
pnpm lint
pnpm test
pnpm fmt
pnpm deploy          # wrangler deploy (normally done by the Deploy workflow on push to main)
```

`pnpm build.server` is an alias of `pnpm build`, kept because the organization's
shared CI workflow calls it.

## Commit conventions

Format: `type(scope): <emoji> description`

| Type     | Emoji | When                      |
| -------- | ----- | ------------------------- |
| `feat`   | ✨    | New feature               |
| `fix`    | 🐛    | Bug fix                   |
| `docs`   | 📝    | Documentation only        |
| `chore`  | 🔧    | Maintenance, config       |
| `ci`     | 👷    | CI/CD                     |
| `revert` | ⏪    | Reverts a previous commit |

### Allowed scopes

| Scope  | Maps to                                                           |
| ------ | ----------------------------------------------------------------- |
| `site` | Top-level site content/code, including `wrangler.jsonc`/`worker/` |
| `ci`   | `.github/workflows/`                                              |
| `deps` | Dependency bumps                                                  |

**Do not use a scope outside this list.** Update this table and `.vscode/settings.json`
together if a new top-level concern is added.
