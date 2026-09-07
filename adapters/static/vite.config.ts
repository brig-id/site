import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { staticAdapter } from "@builder.io/qwik-city/adapters/static/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The real public domain isn't decided yet (see AGENTS.md) — this only
// feeds the `<link rel="canonical">` tag (see
// `src/components/router-head/router-head.tsx`) and the generated sitemap,
// neither of which matter until the site has a real domain to publish under.
export default extendConfig(baseConfig, () => {
  return {
    // qwikCity()'s routesDir defaults to resolve(root, "src/routes"), and
    // Vite's `root` itself defaults to `process.cwd()` when unset — fine
    // when this config is loaded via `vite build -c adapters/static/vite.config.ts`
    // from the package root (pnpm's cwd), but any tool that spawns Vite
    // with cwd set to this file's own directory instead (e.g. the VS Code
    // Vitest extension resolving every vite.config.ts it finds) then looks
    // for routes under adapters/static/src/routes, which doesn't exist.
    // Pinning root to this file's real ancestor makes resolution
    // independent of the caller's cwd.
    root: resolve(__dirname, "../.."),
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@qwik-city-plan"],
      },
    },
    plugins: [
      staticAdapter({
        origin: "https://brigid.invalid",
      }),
    ],
  };
});
