# AGENTS.md — brig·id `site`

This repository is the **public marketing/landing site** for brig·id.

## Language

**All content must be in English** — code, comments, docs, issues. No exceptions.

## Stack

Same stack as [`brig-id/app`](https://github.com/brig-id/app):

- **Qwik + Qwik City**, built as a fully static site (SSG, no server runtime) —
  a landing page has no WebAuthn/API same-origin constraint, so there's nothing
  server-side to do here.
- **WebAwesome Pro** for components/theming (same Kit as `app`).
- **Font Awesome** (Kit script, `FONT_AWESOME_KIT_ID`) for icons.
- **Unsplash** for the hero's daily-rotating background photo, same pattern as
  `app`'s login/register pages (`src/lib/unsplash.ts`).

## Deployment

Deployed to **Cloudflare Workers** (static assets + a small `worker/index.ts`
that layers security headers on top of the built `dist/`), as the Worker `site`
with `brig.id` and `www.brig.id` as its custom domains (`workers.dev` and preview
URLs are off).

`.github/workflows/deploy.yml` builds and deploys on every push to `main`
(and on demand). It is not Workers Builds: the Cloudflare dashboard has no Git
connection for this Worker, and PRs get no preview deployment. The workflow
reads these repository and organization secrets, whose values are in
OpenBao's `kv/orgs/brig-id`: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`WEBAWESOME_NPM_TOKEN`, `UNSPLASH_ACCESS_KEY` and `FONT_AWESOME_KIT_ID` (the last
two are inlined into the client bundle at build time, same as `app`'s Docker
build-arg).

## Common commands

```bash
pnpm install
pnpm dev            # Vite dev server
pnpm build           # Qwik build (client + SSR)
pnpm build.server    # Static adapter — produces dist/
pnpm typecheck
pnpm lint
pnpm test
pnpm dev.cf          # wrangler dev — serve dist/ through the Worker locally
pnpm deploy          # wrangler deploy (manual deploy; normally done by the Deploy workflow on push to main)
```

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
