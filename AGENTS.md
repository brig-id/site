# AGENTS.md — brig·id `site`

This repository is a **placeholder** for the public marketing/landing site.

## Language

**All content must be in English** — code, comments, docs, issues. No exceptions.

## Status

Not started. Tech stack not yet decided — this is intentionally *not* a Qwik
project by default: unlike `brig-id/app` (login, register, account
management), this site has no WebAuthn/API same-origin constraint, so a
plain static-site generator (Astro, 11ty, or even hand-written HTML) is a
reasonable default worth considering before reaching for the same stack as
`app`.

## Planned scope (future)

- Public landing page: what brig·id is, how it works, links to
  [`spec`](https://github.com/brig-id/spec) for technical readers, and a
  call to action toward the real app (`brig-id/app`).
- Possibly the demo experience — see the open design questions in
  [`app#9`](https://github.com/brig-id/app/issues/9) (landing page) and
  [`app#10`](https://github.com/brig-id/app/issues/10) (demo site).

Do not add product code to this repository until the tech stack is decided.

## Commit conventions

Format: `type(scope): <emoji> description`

| Type | Emoji | When |
| --- | --- | --- |
| `feat` | ✨ | New feature |
| `fix` | 🐛 | Bug fix |
| `docs` | 📝 | Documentation only |
| `chore` | 🔧 | Maintenance, config |
| `ci` | 👷 | CI/CD |
| `revert` | ⏪ | Reverts a previous commit |

### Allowed scopes

| Scope | Maps to |
| --- | --- |
| `site` | Top-level site content/code |
| `ci` | `.github/workflows/` |
| `deps` | Dependency bumps |

**Do not use a scope outside this list.** Update this table and `.vscode/settings.json`
once a tech stack is picked and implementation begins.
