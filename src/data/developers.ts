// The developer section: its pages, in the order of the side menu. Written
// for people who integrate brig·id or run it; unlike the product pages, it
// links to the specification and the source.

import { SPEC } from "./nav";

export interface DevPage {
  href: string;
  title: string;
  /** One line, on the section's home page. */
  summary: string;
  icon: string;
}

export const DEV_PAGES: DevPage[] = [
  {
    href: "/developers/",
    title: "Overview",
    summary: "What brig·id is to a developer, and where to start.",
    icon: "compass-duotone",
  },
  {
    href: "/developers/websites/",
    title: "Sign in on a website",
    summary: "Publish one document, use OpenID Connect, register on no server.",
    icon: "globe-hemisphere-west-duotone",
  },
  {
    href: "/developers/apps/",
    title: "Desktop and mobile apps",
    summary:
      "The same, for an application people install: no secret, the system's browser.",
    icon: "device-mobile-duotone",
  },
  {
    href: "/developers/servers/",
    title: "Run a server",
    summary:
      "seedling on one machine, grove in a container: install, settings, operator commands.",
    icon: "hard-drives-duotone",
  },
  {
    href: "/developers/reference/",
    title: "Reference",
    summary:
      "Endpoints, parameters, the client document, the ID token, the errors.",
    icon: "book-open-text-duotone",
  },
  {
    href: "/developers/trust/",
    title: "Security and trust",
    summary:
      "What a site can trust of a server, what a server does to protect itself, how to report a flaw.",
    icon: "shield-check-duotone",
  },
];

export const DEMO = "https://demo.brig.id";
export const DEMO_SOURCE = "https://github.com/brig-id/demo";
export const INSTALL =
  "https://github.com/brig-id/server-seedling/blob/main/docs/install.md";
export const GROVE = "https://github.com/brig-id/server-grove";
export const PROTOCOL = `${SPEC}/blob/main/protocol.md`;
export const SECURITY_MODEL = `${SPEC}/blob/main/security-model.md`;
export const SECURITY_POLICY =
  "https://github.com/brig-id/server-seedling/security/policy";
