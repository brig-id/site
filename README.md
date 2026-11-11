# site

The public website of brig·id, at [brig.id](https://brig.id).

A static Astro site with hand-written CSS, served by a Cloudflare Worker that
adds the security headers and answers the status page. It loads nothing from a
third party. See [AGENTS.md](AGENTS.md) for the layout, the rules about
feature statuses, deployment and commit conventions.

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build && pnpm preview   # the built site, through the Worker
```
