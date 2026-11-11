// The Worker sends `script-src 'self'; style-src 'self'`: an inline script, an
// inline <style> or a style="" attribute would be blocked in the browser, and
// silently. This fails the build instead.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));

const RULES = [
  { name: "inline <script>", test: /<script\b(?![^>]*\bsrc=)[^>]*>/i },
  { name: "inline <style>", test: /<style\b/i },
  { name: "style attribute", test: /<[^>]+\sstyle\s*=/i },
  { name: "inline event handler", test: /<[^>]+\son[a-z]+\s*=/i },
  { name: "javascript: URL", test: /(?:href|src)\s*=\s*["']?\s*javascript:/i },
];

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

const files = htmlFiles(dist);
const problems = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const rule of RULES) {
    const match = rule.test.exec(html);
    if (match) {
      problems.push(
        `${relative(dist, file)}: ${rule.name}: ${match[0].slice(0, 120)}`,
      );
    }
  }
}

if (files.length === 0) {
  console.error("check-dist: no HTML file in dist/, nothing was built.");
  process.exit(1);
}
if (problems.length > 0) {
  console.error(
    "check-dist: the build output breaks the Content-Security-Policy:",
  );
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(
  `check-dist: ${files.length} pages, none needs an inline script or style.`,
);
