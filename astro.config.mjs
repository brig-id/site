import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Fully static site. The Worker in worker/index.ts serves dist/ and sends a
// Content-Security-Policy that allows no inline script and no inline style:
// both settings below keep the build output within it (scripts/check-dist.mjs
// fails the build if a page ends up with either).
export default defineConfig({
  site: "https://brig.id",
  trailingSlash: "always",
  // Compression drops the line break between a word and a tag that starts the
  // next line, which glues the two together ("under theLGPL"). Cloudflare
  // compresses the response anyway.
  compressHTML: false,
  build: {
    format: "directory",
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  server: { host: "0.0.0.0" },
});
