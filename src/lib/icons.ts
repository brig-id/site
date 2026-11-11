import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// Phosphor icons (MIT), read from the Iconify JSON at build time and inlined
// as SVG: no icon font, no request to anyone, nothing to run in the browser.
interface IconSet {
  width: number;
  height: number;
  icons: Record<string, { body: string }>;
}

let cache: IconSet | undefined;

function iconSet(): IconSet {
  if (!cache) {
    const require = createRequire(import.meta.url);
    const file = require.resolve("@iconify-json/ph/icons.json");
    cache = JSON.parse(readFileSync(file, "utf8")) as IconSet;
  }
  return cache;
}

/** The inner SVG markup of a Phosphor icon; an unknown name fails the build. */
export function iconBody(name: string): string {
  const icon = iconSet().icons[name];
  if (!icon) throw new Error(`Unknown Phosphor icon "${name}"`);
  return icon.body;
}
