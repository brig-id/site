/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { defineConfig } from "vitest/config";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

type PkgDep = Record<string, string>;
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

/**
 * Note that Vite normally starts from `index.html` but the qwikCity plugin makes start at `src/entry.ssr.tsx` instead.
 */
export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths({ root: "." })],
    // Vite only exposes `VITE_`-prefixed env vars to `import.meta.env` by
    // default. UNSPLASH_ACCESS_KEY and FONT_AWESOME_KIT_ID are both
    // meant to ship in the client bundle (Unsplash's own public/client-facing
    // "Demo" key, and a Font Awesome Kit ID, which is not a secret — the
    // matching *_SECRET_KEY/*_NPM_TOKEN counterparts never go through this).
    envPrefix: ["VITE_", "UNSPLASH_", "FONT_AWESOME_KIT_ID"],
    optimizeDeps: {
      exclude: [],
    },
    server: {
      // Vite's default dev host isn't reachable through the devcontainer's
      // port forwarding — same reasoning as app's vite.config.ts.
      host: "0.0.0.0",
    },
    test: {
      environment: "node",
      include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
      passWithNoTests: true,
    },
  };
});

// *** utils ***

/**
 * Function to identify duplicate dependencies and throw an error
 * @param {Object} devDependencies - List of development dependencies
 * @param {Object} dependencies - List of production dependencies
 */
function errorOnDuplicatesPkgDeps(
  devDependencies: PkgDep,
  dependencies: PkgDep,
) {
  let msg = "";
  const duplicateDeps = Object.keys(devDependencies).filter(
    (dep) => dependencies[dep],
  );

  const qwikPkg = Object.keys(dependencies).filter((value) =>
    /qwik/i.test(value),
  );

  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;

  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }

  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;

  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
