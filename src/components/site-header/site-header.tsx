import { component$ } from "@builder.io/qwik";

export const SiteHeader = component$(() => {
  return (
    <header class="site-header">
      <a href="/" class="site-brand">
        brig·id
      </a>
      <nav class="site-nav">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a
          href="https://github.com/brig-id/spec"
          target="_blank"
          rel="noopener noreferrer"
        >
          Spec
        </a>
        <a
          href="https://github.com/brig-id"
          target="_blank"
          rel="noopener noreferrer"
          class="site-nav-icon"
          aria-label="brig·id on GitHub"
        >
          <i class="fa-brands fa-github" aria-hidden="true"></i>
        </a>
      </nav>
    </header>
  );
});
