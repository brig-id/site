import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { HeroBackground } from "~/components/hero-background/hero-background";
import { wa } from "~/lib/wa";

const FEATURES = [
  {
    icon: "fingerprint",
    title: "Passkey-only",
    body: "No passwords, ever. Sign in with the authenticator you already use — a phone, a security key, a password manager.",
  },
  {
    icon: "server",
    title: "Self-hosted",
    body: "Run your own brig·id server. Your identities and keys stay on infrastructure you control, not a third party's database.",
  },
  {
    icon: "id-badge",
    title: "Decentralized identities",
    body: "Each identity is a DID you own — public, personal, work, or anything in between — not a single account tied to one face.",
  },
  {
    icon: "code-branch",
    title: "Open source",
    body: "Licensed LGPL-3.0-or-later. Read the code, read the spec, or run it exactly as published — nothing is hidden.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Deploy a server",
    body: "Stand up a brig·id leaf server — a single Docker image, one master key, and your own domain.",
  },
  {
    number: "2",
    title: "Register with a passkey",
    body: "Create your account with the authenticator built into your device or browser. No password to remember or leak.",
  },
  {
    number: "3",
    title: "Create your identities",
    body: "Split yourself into as many identities as you need — each with its own name, look, and connected accounts.",
  },
];

export default component$(() => {
  useVisibleTask$(() => {
    void Promise.all([wa.card(), wa.button(), wa.icon()]);
  });

  return (
    <>
      <section class="hero">
        <HeroBackground />
        <div class="hero-content">
          <h1 class="hero-title">Own your identity.</h1>
          <p class="hero-subtitle">
            brig·id is a self-hosted, passkey-only identity server. Split
            yourself into as many decentralized identities as you need — public,
            personal, work — without handing a single company the keys to all of
            them.
          </p>
          <div class="hero-actions">
            <a href="https://github.com/brig-id" class="wa-button-link">
              <wa-button variant="brand" size="l">
                <i class="fa-brands fa-github" slot="start"></i>
                View on GitHub
              </wa-button>
            </a>
            <a href="https://github.com/brig-id/spec" class="wa-button-link">
              <wa-button variant="neutral" appearance="outlined" size="l">
                Read the spec
              </wa-button>
            </a>
          </div>
        </div>
      </section>

      <section id="features" class="features">
        <h2 class="section-title">Why brig·id</h2>
        <div class="features-grid">
          {FEATURES.map((feature) => (
            <wa-card key={feature.title} class="feature-card">
              <i
                class={`fa-solid fa-${feature.icon} feature-icon`}
                aria-hidden="true"
              ></i>
              <h3 class="feature-title">{feature.title}</h3>
              <p class="feature-body">{feature.body}</p>
            </wa-card>
          ))}
        </div>
      </section>

      <section id="how-it-works" class="steps">
        <h2 class="section-title">How it works</h2>
        <div class="steps-grid">
          {STEPS.map((step) => (
            <div key={step.number} class="step">
              <div class="step-number">{step.number}</div>
              <h3 class="step-title">{step.title}</h3>
              <p class="step-body">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section class="cta">
        <h2 class="cta-title">Ready to run your own?</h2>
        <p class="cta-body">
          brig·id is early-stage and self-hosted by design. Read the technical
          spec, follow along on GitHub, or deploy a server yourself.
        </p>
        <a href="https://github.com/brig-id/server-leaf" class="wa-button-link">
          <wa-button variant="brand" size="l">
            Get started
          </wa-button>
        </a>
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: "brig·id — own your identity",
  meta: [
    {
      name: "description",
      content:
        "brig·id is a self-hosted, passkey-only identity server built on decentralized identities (DIDs). Split yourself into as many identities as you need, without a single company holding the keys.",
    },
  ],
};
