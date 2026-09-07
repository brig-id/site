import { component$ } from "@builder.io/qwik";

export const SiteFooter = component$(() => {
  const year = new Date().getFullYear();

  return (
    <footer class="site-footer">
      <div class="site-footer-brand">brig·id</div>
      <nav class="site-footer-links">
        <a
          href="https://github.com/brig-id"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://github.com/brig-id/spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          Spec
        </a>
        <a
          href="https://github.com/brig-id/app"
          target="_blank"
          rel="noopener noreferrer"
        >
          App
        </a>
        <a
          href="https://github.com/brig-id/roots/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          LGPL-3.0-or-later
        </a>
      </nav>
      <div class="site-footer-copyright">
        © {year} brig·id — open source, self-hosted.
      </div>
    </footer>
  );
});
