// What brig·id is compared with, and on what.
//
// Rules of these pages:
// - Every entry says where the other product is ahead (`ahead` is never
//   empty): most of them are mature, and brig·id is pre-beta.
// - A fact about someone else's product comes from its own documentation or
//   repository, listed in `sources`. What could not be confirmed is marked
//   "unknown", not guessed.
// - No prices, no popularity figures: they go stale and prove nothing.
// - `CHECKED` is the date the sources were last read. Update it when you
//   re-check, not when you edit the wording.

export const CHECKED = { iso: "2026-11-12", text: "12 November 2026" };

export type Verdict = "yes" | "option" | "partial" | "no" | "unknown" | "na";

export const VERDICT_LABEL: Record<Verdict, string> = {
  yes: "Yes",
  option: "Optional",
  partial: "Partly",
  no: "No",
  unknown: "Not confirmed",
  na: "Not applicable",
};

export interface Fact {
  verdict: Verdict;
  /** A few words, for the overview table. */
  short: string;
  /** One or two sentences, for the product's own page. */
  note: string;
}

export type CategoryId = "self-hosted" | "cloud" | "platform" | "decentralised";

export interface Category {
  id: CategoryId;
  title: string;
  intro: string;
  hue: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "self-hosted",
    title: "Identity servers you run yourself",
    intro:
      "The closest relatives: software that signs people in, on a machine you control. Nearly all of them are years ahead of brig·id in maturity and features.",
    hue: "cyan",
  },
  {
    id: "cloud",
    title: "Identity as a service",
    intro:
      "A company runs the sign-in for you. Nothing to operate, and someone else holds the accounts.",
    hue: "violet",
  },
  {
    id: "platform",
    title: "“Sign in with…” buttons",
    intro:
      "The account you already have with a large platform, reused across the web. What most people use today.",
    hue: "amber",
  },
  {
    id: "decentralised",
    title: "Identity without a provider",
    intro:
      "Protocols where your identity is a domain or a key you hold. Close to brig·id in spirit, different in what they keep public.",
    hue: "green",
  },
];

/** The questions every product is asked, in the order they are shown. */
export const QUESTIONS = [
  {
    id: "selfHost",
    title: "Run it yourself",
    why: "Whoever runs the sign-in knows which identities are yours.",
  },
  {
    id: "signIn",
    title: "Signing in without a password",
    why: "A password can be guessed, reused, leaked or phished. A passkey cannot.",
  },
  {
    id: "identities",
    title: "Several identities per person",
    why: "One private account, and separate identities to show to different sites.",
  },
  {
    id: "perSite",
    title: "A different identifier for each site",
    why: "Two websites comparing their records should find nothing in common.",
  },
] as const;

export type QuestionId = (typeof QUESTIONS)[number]["id"];

export interface Competitor extends Record<QuestionId, Fact> {
  slug: string;
  name: string;
  category: CategoryId;
  url: string;
  /** What it is, in one neutral sentence. */
  what: string;
  licence: string;
  /** How far along it is. */
  maturity: string;
  /** Where it is ahead of brig·id today. Never empty. */
  ahead: string[];
  /** What brig·id does differently. */
  differs: string[];
  /** Who should pick it. */
  pickThem: string;
  /** Who might look at brig·id instead. */
  pickUs: string;
  sources: { label: string; href: string }[];
}

/** brig·id's own answers, with the status of each (see features.ts). */
export const BRIGID = {
  what: "A self-hosted identity server where one private account holds several identities, each shown to the websites you choose.",
  licence: "AGPL-3.0",
  maturity:
    "Pre-beta and not audited. Websites can sign people in with it; they receive an identifier and nothing else yet.",
  selfHost: {
    verdict: "yes",
    short: "Yes",
    note: "A single container, seedling. Nothing else is offered today.",
    feature: "seedling",
  },
  signIn: {
    verdict: "yes",
    short: "Passkeys only",
    note: "Passkeys are the only way in. There is no password to fall back on.",
    feature: "passkeys",
  },
  identities: {
    verdict: "yes",
    short: "Yes",
    note: "One private account; as many identities as you create, each with its own name, icon and description.",
    feature: "many-identities",
  },
  perSite: {
    verdict: "yes",
    short: "By design",
    note: "Derived per identity and per website with a secret only the server holds. Not optional.",
    feature: "pairwise",
  },
} as const satisfies Record<QuestionId, Fact & { feature: string }> & {
  what: string;
  licence: string;
  maturity: string;
};

const ONE_USER: Fact = {
  verdict: "no",
  short: "One per account",
  note: "An account is one user. A second identity means a second account, with its own credentials to manage.",
};

const APP_AUTH: Fact = {
  verdict: "na",
  short: "Per application",
  note: "It gives one application its own user base, so there is no identity shared between sites to keep apart.",
};

export const COMPETITORS: Competitor[] = [
  // -- Identity servers you run yourself -------------------------------------
  {
    slug: "keycloak",
    name: "Keycloak",
    category: "self-hosted",
    url: "https://www.keycloak.org/",
    what: "An open-source identity and access management server, a CNCF project that started at Red Hat.",
    licence: "Apache-2.0",
    maturity:
      "Mature and very widely deployed, from small teams to very large organisations.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Self-hosting is the normal way to run it, as a container or on Kubernetes.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords by default. Passkeys are officially supported since 26.4 (September 2025) and are switched on per realm.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "option",
      short: "Optional",
      note: "A pairwise subject mapper can be added to a client. Without it, every client receives the same subject.",
    },
    ahead: [
      "Speaks the protocols organisations need: OpenID Connect, OAuth 2.0 and SAML, with LDAP and Active Directory federation.",
      "Brokers other identity providers and social logins, with fine-grained authorisation and a full admin console.",
      "Years of production use, a large community, clustering and commercial support.",
    ],
    differs: [
      "brig·id has no password at all; in Keycloak passkeys sit next to passwords and are enabled by an administrator.",
      "Separate identities under one private account are the centre of brig·id. Keycloak models one user per realm.",
      "The per-site identifier is how brig·id works, not a mapper someone has to remember to add.",
    ],
    pickThem:
      "You need single sign-on for an organisation now, with SAML, LDAP or an existing directory.",
    pickUs:
      "You want a personal or community identity server built around several identities, and you can wait for it to mature.",
    sources: [
      { label: "keycloak.org", href: "https://www.keycloak.org/" },
      {
        label: "Passkeys support in Keycloak 26.4",
        href: "https://www.keycloak.org/2025/09/passkeys-support-26-4",
      },
      {
        label: "Pairwise subject mapper (API documentation)",
        href: "https://www.keycloak.org/docs-api/latest/javadocs/org/keycloak/protocol/oidc/mappers/SHA256PairwiseSubMapper.html",
      },
    ],
  },
  {
    slug: "authentik",
    name: "authentik",
    category: "self-hosted",
    url: "https://goauthentik.io/",
    what: "An open-source identity provider made for self-hosting, with an enterprise edition.",
    licence: "MIT core, separate licence for the enterprise parts",
    maturity:
      "Mature, popular with self-hosters and used in production by companies.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Designed for it, from a home lab to a production cluster.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords by default; WebAuthn passkeys can be used, including in passwordless flows an administrator builds.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "no",
      short: "Same for all",
      note: "The subject is derived from the user: a hash of the user ID by default, or the ID, username or email. It is the same for every application.",
    },
    ahead: [
      "OpenID Connect, OAuth 2.0, SAML, LDAP and RADIUS, plus a proxy that puts sign-in in front of applications that have none.",
      "Flows and policies an administrator can reshape entirely.",
      "A large community, many documented integrations and commercial support.",
    ],
    differs: [
      "brig·id is passkey-only by construction; authentik lets each installation decide.",
      "brig·id separates a private account from the identities shown to websites; authentik has one user object.",
      "brig·id gives every website its own identifier for you.",
    ],
    pickThem:
      "You self-host many applications and want one sign-in in front of all of them today.",
    pickUs:
      "What you want is separation between the faces you show to different sites, not a wider protocol list.",
    sources: [
      { label: "goauthentik.io", href: "https://goauthentik.io/" },
      {
        label: "OAuth2 provider documentation",
        href: "https://docs.goauthentik.io/add-secure-apps/providers/oauth2/",
      },
      {
        label: "LICENSE",
        href: "https://github.com/goauthentik/authentik/blob/main/LICENSE",
      },
    ],
  },
  {
    slug: "authelia",
    name: "Authelia",
    category: "self-hosted",
    url: "https://www.authelia.com/",
    what: "An open-source authentication and authorisation portal that works alongside a reverse proxy, and an OpenID Certified provider.",
    licence: "Apache-2.0",
    maturity: "Mature and widely used to protect self-hosted applications.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "A small single binary or container, next to your reverse proxy.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Username and password with a second factor by default. Passwordless sign-in with passkeys exists since 4.39 (March 2025).",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "option",
      short: "Optional",
      note: "Public subjects by default. A client configured with a sector identifier gets pairwise subjects.",
    },
    ahead: [
      "Protects applications that have no sign-in of their own, through the reverse proxy, with access rules per domain and path.",
      "Light on resources, simple to run, with file or LDAP user stores.",
      "OpenID Certified, with years of production use.",
    ],
    differs: [
      "brig·id has no password to fall back on.",
      "brig·id models several identities per person; Authelia has one user per entry in its user store.",
      "Per-site identifiers are the default in brig·id, an option per client in Authelia.",
    ],
    pickThem:
      "You want to put a login and a second factor in front of your self-hosted services this week.",
    pickUs:
      "You are after identities kept apart from each other, more than a gate in front of your own apps.",
    sources: [
      { label: "authelia.com", href: "https://www.authelia.com/" },
      {
        label: "4.39 release notes",
        href: "https://www.authelia.com/blog/4.39-release-notes/",
      },
      {
        label: "OpenID Connect clients configuration",
        href: "https://www.authelia.com/configuration/identity-providers/openid-connect/clients/",
      },
    ],
  },
  {
    slug: "zitadel",
    name: "ZITADEL",
    category: "self-hosted",
    url: "https://zitadel.com/",
    what: "An open-source identity and access management platform, self-hosted or as ZITADEL Cloud.",
    licence: "AGPL-3.0 since version 3 (March 2025)",
    maturity:
      "Mature, built for multi-tenant products, with a company behind it.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Self-hosted, or hosted for you on ZITADEL Cloud.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Username and password, with passkeys as a supported passwordless method.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "no",
      short: "User ID",
      note: "Tokens carry the user's ID as the subject. We found no per-application option in its documentation.",
    },
    ahead: [
      "Multi-tenancy as a first-class concept: instances, organisations and projects.",
      "OpenID Connect, SAML, SCIM and LDAP, with a complete audit trail of every change.",
      "A hosted offer and commercial support, next to the open-source server.",
    ],
    differs: [
      "brig·id is passkey-only.",
      "brig·id is built for people who hold several identities; ZITADEL for organisations that hold many users.",
      "brig·id hands each website a different identifier.",
    ],
    pickThem:
      "You are building a product with customers, organisations and roles, and need an identity platform under it.",
    pickUs:
      "You are an individual or a community that wants its own small identity server.",
    sources: [
      { label: "zitadel.com", href: "https://zitadel.com/" },
      {
        label: "Moving to AGPL 3.0",
        href: "https://zitadel.com/blog/apache-to-agpl",
      },
      {
        label: "Claims in ZITADEL",
        href: "https://zitadel.com/docs/apis/openidoauth/claims",
      },
    ],
  },
  {
    slug: "ory",
    name: "Ory",
    category: "self-hosted",
    url: "https://www.ory.com/",
    what: "Open-source building blocks for identity (Kratos), OAuth 2.0 and OpenID Connect (Hydra) and permissions, also offered hosted as Ory Network.",
    licence: "Apache-2.0",
    maturity: "Mature, OpenID Certified and run at very large scale.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Each component can be self-hosted; Ory Network runs them for you.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Kratos offers passwords, passkeys and other methods; the application chooses which to enable.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "option",
      short: "Optional",
      note: "Hydra supports two subject algorithms, public and pairwise. Public is the default.",
    },
    ahead: [
      "API-first and headless: you bring your own interface and compose the parts you need.",
      "Proven at very large scale, with a hosted offer.",
      "A permission system (Keto) and a full OAuth 2.0 server, beyond sign-in.",
    ],
    differs: [
      "brig·id is one server with its own interface, not a toolkit to assemble.",
      "brig·id is passkey-only and models several identities per person.",
      "Pairwise identifiers are the rule in brig·id, a setting in Hydra.",
    ],
    pickThem:
      "You are an engineering team building identity into a product and want components, not an application.",
    pickUs:
      "You want something to install and use, for people, not for an API.",
    sources: [
      { label: "ory.com", href: "https://www.ory.com/" },
      {
        label: "Subject identifier algorithms",
        href: "https://www.ory.com/docs/hydra/guides/openid",
      },
      { label: "Ory Kratos", href: "https://github.com/ory/kratos" },
    ],
  },
  {
    slug: "kanidm",
    name: "Kanidm",
    category: "self-hosted",
    url: "https://kanidm.com/",
    what: "An identity management platform written in Rust: accounts and groups, OAuth 2.0 and OpenID Connect, and sign-in for Linux machines.",
    licence: "MPL-2.0",
    maturity: "Stable releases, with a careful, security-first design.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Self-hosted, with replication between two nodes.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys first",
      note: "Passkeys are a first-class credential, including attested passkeys. Other credentials exist next to them.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "unknown",
      short: "Not confirmed",
      note: "We did not find a per-application subject option in its documentation.",
    },
    ahead: [
      "Covers machines as well as websites: Linux and Unix login, SSH key distribution, RADIUS, and a read-only LDAP gateway.",
      "Attested passkeys, for environments that must know which authenticators are in use.",
      "Replication and complete command-line tooling.",
    ],
    differs: [
      "brig·id stops at signing people in to websites; Kanidm manages an organisation's accounts and devices.",
      "brig·id separates a private account from the identities others see.",
      "Both are written in Rust and take passkeys seriously: the difference is the audience.",
    ],
    pickThem:
      "You administer servers, a network and web services, and want one identity system for all of it.",
    pickUs:
      "You want to keep the faces you show online apart, and have no machines to enrol.",
    sources: [
      { label: "kanidm.com", href: "https://kanidm.com/" },
      {
        label: "kanidm/kanidm",
        href: "https://github.com/kanidm/kanidm",
      },
    ],
  },
  {
    slug: "pocket-id",
    name: "Pocket ID",
    category: "self-hosted",
    url: "https://pocket-id.org/",
    what: "A small OpenID Connect Certified provider where people sign in with passkeys, and only with passkeys.",
    licence: "BSD-2-Clause",
    maturity:
      "In active use by self-hosters; deliberately small in scope, and it works today.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "A single container, made to be simple to run.",
    },
    signIn: {
      verdict: "yes",
      short: "Passkeys only",
      note: "Passkeys are the only way to sign in, by design. The same choice as brig·id.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "unknown",
      short: "Not confirmed",
      note: "We did not find a per-application subject option in its documentation.",
    },
    ahead: [
      "It is finished enough to use: your applications can sign people in through it now.",
      "OpenID Connect Certified, with users, groups and a clean interface.",
      "Simple by intention: a short path from install to first sign-in.",
    ],
    differs: [
      "The closest project in spirit. brig·id adds the layer above the passkey: a private account holding several identities.",
      "brig·id is designed so that each website receives an identifier unrelated to the others.",
      "brig·id plans a recovery code and hybrid post-quantum signatures; neither is finished.",
    ],
    pickThem:
      "You want passkey-only sign-in for your self-hosted applications, today, with as little to configure as possible.",
    pickUs:
      "You want the same passkey-only approach with separate identities, and can wait.",
    sources: [
      { label: "pocket-id.org", href: "https://pocket-id.org/" },
      {
        label: "pocket-id/pocket-id",
        href: "https://github.com/pocket-id/pocket-id",
      },
    ],
  },
  {
    slug: "rauthy",
    name: "Rauthy",
    category: "self-hosted",
    url: "https://github.com/sebadob/rauthy",
    what: "A lightweight single sign-on server written in Rust, for OpenID Connect, OAuth 2.0 and PAM.",
    licence: "Apache-2.0",
    maturity: "Actively developed, with regular releases.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "One small binary, with a high-availability mode built in.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Puts strong emphasis on passkeys and allows passkey-only accounts; passwords remain available.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "unknown",
      short: "Not confirmed",
      note: "We did not find a per-application subject option in its documentation.",
    },
    ahead: [
      "A working OpenID Connect provider with an admin interface, events and auditing.",
      "High availability without an external database.",
      "Client branding, translations and many configuration options.",
    ],
    differs: [
      "brig·id allows no password at all.",
      "brig·id models several identities per person.",
      "Both are Rust servers aiming to be small: Rauthy already is a complete provider.",
    ],
    pickThem:
      "You want a light, fast provider with strong defaults that you can deploy now.",
    pickUs:
      "Separate identities and per-site identifiers matter more to you than what is available today.",
    sources: [
      {
        label: "sebadob/rauthy",
        href: "https://github.com/sebadob/rauthy",
      },
      {
        label: "Rauthy documentation",
        href: "https://sebadob.github.io/rauthy/",
      },
    ],
  },
  {
    slug: "logto",
    name: "Logto",
    category: "self-hosted",
    url: "https://logto.io/",
    what: "Authentication and authorisation infrastructure for applications, open source and offered as a cloud service.",
    licence: "MPL-2.0",
    maturity: "Mature, aimed at teams building software products.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Self-hosted, or hosted on Logto Cloud.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords, codes and social sign-in. Passkey sign-in became a full method in 2026.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "unknown",
      short: "Not confirmed",
      note: "We did not find a per-application subject option in its documentation.",
    },
    ahead: [
      "Ready-made sign-in experience, SDKs for many frameworks and a management console.",
      "Multi-tenancy, organisations, role-based access control and enterprise single sign-on.",
      "OpenID Connect, OAuth 2.1 and SAML, with a hosted offer.",
    ],
    differs: [
      "Logto serves the developers of an application; brig·id serves the person signing in.",
      "brig·id is passkey-only and holds several identities per person.",
    ],
    pickThem:
      "You are adding sign-in, organisations and roles to a product you are building.",
    pickUs:
      "You want an identity of your own to take from site to site, not an auth layer for one product.",
    sources: [
      { label: "logto.io", href: "https://logto.io/" },
      {
        label: "Passkey sign-in",
        href: "https://docs.logto.io/end-user-flows/sign-up-and-sign-in/passkey-sign-in",
      },
      { label: "logto-io/logto", href: "https://github.com/logto-io/logto" },
    ],
  },
  {
    slug: "hanko",
    name: "Hanko",
    category: "self-hosted",
    url: "https://www.hanko.io/",
    what: "Open-source authentication and user management for applications, passkey-first, also offered as Hanko Cloud.",
    licence: "AGPL-3.0 backend, MIT front-end components",
    maturity: "Mature, with a company behind it.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "The backend can be self-hosted; Hanko Cloud runs it for you.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys first",
      note: "Passkeys come first and a passkey-only configuration exists; passwords, passcodes and social sign-in are supported too.",
    },
    identities: APP_AUTH,
    perSite: APP_AUTH,
    ahead: [
      "Drop-in web components that give an application a complete sign-in screen.",
      "Passwords, passcodes, social sign-in and SAML next to passkeys, for audiences not ready for passkeys alone.",
      "A hosted service and commercial licensing.",
    ],
    differs: [
      "Hanko is the login of one application. brig·id is an identity a person carries between sites.",
      "With brig·id, the server belongs to the person or their community, not to the application.",
    ],
    pickThem:
      "You are building an application and want passkey-first sign-in in it.",
    pickUs:
      "You are a person who wants one way in and several identities across many sites.",
    sources: [
      { label: "hanko.io", href: "https://www.hanko.io/" },
      {
        label: "teamhanko/hanko",
        href: "https://github.com/teamhanko/hanko",
      },
    ],
  },
  {
    slug: "supertokens",
    name: "SuperTokens",
    category: "self-hosted",
    url: "https://supertokens.com/",
    what: "Open-source authentication for applications, self-hosted or managed, with paid add-ons.",
    licence: "Apache-2.0 core, separate licence for the enterprise parts",
    maturity: "Mature, aimed at application developers.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "The core can be self-hosted; a managed service exists.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Email and password, passwordless codes, social sign-in, and passkeys through its WebAuthn recipe.",
    },
    identities: APP_AUTH,
    perSite: APP_AUTH,
    ahead: [
      "Session management, SDKs and prebuilt interfaces for many stacks.",
      "Multi-tenancy, account linking and a user management dashboard.",
      "A managed service for teams that do not want to operate it.",
    ],
    differs: [
      "SuperTokens gives an application its user base. brig·id gives a person their identities.",
      "brig·id is passkey-only.",
    ],
    pickThem: "You need sessions and sign-in inside your own application.",
    pickUs: "You want a sign-in that follows you, not one per application.",
    sources: [
      { label: "supertokens.com", href: "https://supertokens.com/" },
      {
        label: "supertokens-core licence",
        href: "https://github.com/supertokens/supertokens-core/blob/master/LICENSE.md",
      },
    ],
  },
  {
    slug: "fusionauth",
    name: "FusionAuth",
    category: "self-hosted",
    url: "https://fusionauth.io/",
    what: "A customer identity platform you can download and run, with paid plans and a hosted option.",
    licence: "Proprietary, with a free Community edition",
    maturity: "Mature commercial product.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Can be self-hosted, or hosted by FusionAuth.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords, passwordless options and WebAuthn passkeys.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "unknown",
      short: "Not confirmed",
      note: "We did not find a per-application subject option in its documentation.",
    },
    ahead: [
      "A broad feature set for customer identity: OAuth 2.0, OpenID Connect, SAML, multi-tenancy, themes.",
      "Commercial support and service-level agreements.",
      "Extensive documentation and client libraries.",
    ],
    differs: [
      "brig·id is open source; FusionAuth's source is not.",
      "brig·id is passkey-only and models several identities per person.",
    ],
    pickThem:
      "You want a supported commercial identity product that you may still run on your own machines.",
    pickUs: "Open source and separate identities are requirements for you.",
    sources: [{ label: "fusionauth.io", href: "https://fusionauth.io/" }],
  },
  {
    slug: "casdoor",
    name: "Casdoor",
    category: "self-hosted",
    url: "https://casdoor.org/",
    what: "An open-source identity and access management platform with a web interface and a long protocol list.",
    licence: "Apache-2.0",
    maturity: "Mature and widely used.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Self-hosted from a container or a binary.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords, email or SMS codes, WebAuthn and many social providers.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "unknown",
      short: "Not confirmed",
      note: "We did not find a per-application subject option in its documentation.",
    },
    ahead: [
      "One user directory reachable over OAuth 2.0, OpenID Connect, SAML, CAS, LDAP and SCIM.",
      "Many social and enterprise providers out of the box.",
      "Everything configurable from a web interface.",
    ],
    differs: [
      "brig·id is passkey-only.",
      "brig·id models several identities per person and gives each site its own identifier.",
    ],
    pickThem:
      "You have a mix of modern and legacy applications that must share one set of accounts.",
    pickUs: "You want fewer protocols and stricter separation.",
    sources: [
      { label: "casdoor.org", href: "https://casdoor.org/" },
      {
        label: "casdoor/casdoor",
        href: "https://github.com/casdoor/casdoor",
      },
    ],
  },

  // -- Identity as a service ---------------------------------------------------
  {
    slug: "auth0",
    name: "Auth0",
    category: "cloud",
    url: "https://auth0.com/",
    what: "A hosted identity platform for developers, part of Okta.",
    licence: "Proprietary service",
    maturity: "Mature, one of the most widely used identity services.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "Auth0 runs it. The accounts live in a tenant on its infrastructure.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords, social and enterprise connections. Passkeys can be enabled on database connections, with the password kept as a fallback.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "no",
      short: "User ID",
      note: "The subject is the user's ID, by default the same for the applications of a tenant.",
    },
    ahead: [
      "Nothing to operate: sign-in, user store and security updates are someone else's job.",
      "A very large catalogue of integrations, SDKs and extension points.",
      "Enterprise features, compliance certifications and support contracts.",
    ],
    differs: [
      "With brig·id the server is yours; with Auth0 the accounts are held by a company.",
      "brig·id is passkey-only and models several identities per person.",
      "brig·id gives each website a different identifier.",
    ],
    pickThem:
      "You are shipping a product and want identity handled by a vendor, with support.",
    pickUs: "You do not want a third party between you and your own sign-in.",
    sources: [
      { label: "auth0.com", href: "https://auth0.com/" },
      {
        label: "Passkeys for database connections",
        href: "https://auth0.com/docs/authenticate/database-connections/passkeys",
      },
    ],
  },
  {
    slug: "okta",
    name: "Okta",
    category: "cloud",
    url: "https://www.okta.com/",
    what: "A hosted identity service for workforces: single sign-on, directories and device-aware access for organisations.",
    licence: "Proprietary service",
    maturity: "Mature, a standard choice in large organisations.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "A cloud service operated by Okta.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords and many authenticators; passkeys are supported as a FIDO2 WebAuthn authenticator.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "unknown",
      short: "Not confirmed",
      note: "We did not find a per-application subject option in its documentation.",
    },
    ahead: [
      "Thousands of ready-made integrations with business applications.",
      "Lifecycle management, provisioning and policy for a whole workforce.",
      "Compliance certifications and enterprise support.",
    ],
    differs: [
      "Okta is run by an employer for its employees. brig·id is run by people for themselves.",
      "In brig·id the work identity is one identity among yours, not the account everything hangs from.",
    ],
    pickThem: "You manage access for a company's employees and applications.",
    pickUs:
      "You are an individual, a family or an association, not an IT department.",
    sources: [
      { label: "okta.com", href: "https://www.okta.com/" },
      {
        label: "Passkeys (FIDO2 WebAuthn) support",
        href: "https://help.okta.com/oie/en-us/content/topics/security/mfa/webauthn-compatibility.htm",
      },
    ],
  },
  {
    slug: "microsoft-entra-id",
    name: "Microsoft Entra ID",
    category: "cloud",
    url: "https://www.microsoft.com/security/business/identity-access/microsoft-entra-id",
    what: "Microsoft's cloud identity service, formerly Azure Active Directory, behind Microsoft 365 and many organisations' sign-in.",
    licence: "Proprietary service",
    maturity: "Mature, among the largest identity systems in the world.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "A cloud service operated by Microsoft.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords with several passwordless methods, passkeys among them, decided by the organisation's administrators.",
    },
    identities: ONE_USER,
    perSite: {
      verdict: "partial",
      short: "Partly",
      note: "The subject is pairwise: two applications receive different values. They can also receive the object ID, which is the same for all applications.",
    },
    ahead: [
      "Deep integration with Microsoft 365, Windows and Azure.",
      "Conditional access, device management and governance for whole organisations.",
      "A pairwise subject is already the documented default for the `sub` claim.",
    ],
    differs: [
      "Entra ID gives an application a different `sub`, and also offers an identifier that is the same everywhere. brig·id has only the first kind.",
      "The directory belongs to the organisation. With brig·id, the account belongs to the person.",
    ],
    pickThem: "Your organisation runs on Microsoft 365 or Azure.",
    pickUs:
      "You want an identity that is not issued by an employer or a vendor.",
    sources: [
      {
        label: "ID token claims reference",
        href: "https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference",
      },
    ],
  },
  {
    slug: "clerk",
    name: "Clerk",
    category: "cloud",
    url: "https://clerk.com/",
    what: "Hosted authentication and user management for web applications, with ready-made interface components.",
    licence: "Proprietary service",
    maturity: "Mature, popular with teams building on modern web frameworks.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "A cloud service operated by Clerk.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords, codes, social sign-in and passkeys.",
    },
    identities: APP_AUTH,
    perSite: APP_AUTH,
    ahead: [
      "Sign-in, sign-up and profile screens you drop into an application.",
      "Organisations, roles and billing-aware user management.",
      "Very little to build or operate.",
    ],
    differs: [
      "Clerk is the user system of one application. brig·id is an identity a person carries between sites.",
      "With brig·id nothing is hosted by a vendor.",
    ],
    pickThem:
      "You are building a web application and want its sign-in done quickly.",
    pickUs: "You want to own your sign-in, as a person or a community.",
    sources: [
      { label: "clerk.com", href: "https://clerk.com/" },
      {
        label: "Passkeys are generally available",
        href: "https://clerk.com/changelog/2024-07-24-passkeys-ga",
      },
    ],
  },
  {
    slug: "amazon-cognito",
    name: "Amazon Cognito",
    category: "cloud",
    url: "https://aws.amazon.com/cognito/",
    what: "The user directory and sign-in service of Amazon Web Services, for applications built on AWS.",
    licence: "Proprietary service",
    maturity: "Mature, integrated with the rest of AWS.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "A cloud service operated by AWS.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "Passwords, with passwordless sign-in including passkeys.",
    },
    identities: APP_AUTH,
    perSite: APP_AUTH,
    ahead: [
      "Ties sign-in directly to AWS permissions and services.",
      "Scales with the platform it runs on.",
      "Federation with social and enterprise identity providers.",
    ],
    differs: [
      "Cognito holds the users of an application. brig·id holds the identities of a person.",
      "With brig·id the data stays on a server you chose.",
    ],
    pickThem: "Your application already lives on AWS.",
    pickUs: "You want sign-in that depends on no cloud provider.",
    sources: [
      {
        label: "aws.amazon.com/cognito",
        href: "https://aws.amazon.com/cognito/",
      },
    ],
  },

  // -- "Sign in with…" ----------------------------------------------------------
  {
    slug: "sign-in-with-google",
    name: "Sign in with Google",
    category: "platform",
    url: "https://developers.google.com/identity",
    what: "Signing in to third-party websites with a Google Account.",
    licence: "Proprietary service",
    maturity: "Used by a very large share of the web.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "Google is the identity provider. Every sign-in goes through it.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "A Google Account can be protected by a passkey; a password usually exists too.",
    },
    identities: {
      verdict: "no",
      short: "One per account",
      note: "One Google Account is one identity. A second face means a second account, signed in separately.",
    },
    perSite: {
      verdict: "no",
      short: "Same for all",
      note: "The subject is one identifier per Google Account, and websites usually receive the email address as well.",
    },
    ahead: [
      "One click, on almost every website, with an account people already have.",
      "Strong account security and recovery, run by a large security team.",
      "No server to run, nothing to learn.",
    ],
    differs: [
      "Google sees every website you sign in to. A brig·id server you run yourself reports to no one.",
      "Websites receive the same identifier and usually your email address; with brig·id each receives an unrelated identifier and nothing else.",
      "brig·id lets one sign-in hold several identities.",
    ],
    pickThem:
      "Convenience matters most, and you are comfortable with Google knowing where you sign in.",
    pickUs:
      "You want the same convenience without a single company in the middle of every sign-in.",
    sources: [
      {
        label: "OpenID Connect reference",
        href: "https://developers.google.com/identity/openid-connect/reference",
      },
    ],
  },
  {
    slug: "sign-in-with-apple",
    name: "Sign in with Apple",
    category: "platform",
    url: "https://developer.apple.com/sign-in-with-apple/",
    what: "Signing in to third-party apps and websites with an Apple Account, with the option to hide your email address.",
    licence: "Proprietary service",
    maturity: "Built into every Apple device.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "Apple is the identity provider. An Apple Account is required.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "The Apple Account is unlocked by the device: Face ID, Touch ID or a passkey, with a password behind it.",
    },
    identities: {
      verdict: "no",
      short: "One per account",
      note: "One Apple Account, one person. You may edit the name and hide the email for each app, but not hold separate identities.",
    },
    perSite: {
      verdict: "yes",
      short: "Per developer",
      note: "The user identifier and the relay email address are specific to each developer team. All the apps of one team see the same person.",
    },
    ahead: [
      "It already gives each developer a different identifier and a relay email address, and has for years.",
      "Works out of the box on devices people own, with no setup.",
      "Account security and recovery handled by Apple.",
    ],
    differs: [
      "The idea is close. The difference is who sits in the middle: Apple, or a server you run.",
      "Apple offers one person with a hidden email; brig·id offers several identities, each with its own name and face.",
      "brig·id is open source and not tied to a brand of device.",
    ],
    pickThem:
      "You live in Apple's ecosystem and want privacy from websites with no effort.",
    pickUs:
      "You want that privacy to hold towards the provider too, and across all your devices.",
    sources: [
      {
        label: "Sign in with Apple",
        href: "https://developer.apple.com/sign-in-with-apple/",
      },
      {
        label: "Transferring your apps and users to another team",
        href: "https://developer.apple.com/documentation/signinwithapple/transferring-your-apps-and-users-to-another-team",
      },
    ],
  },
  {
    slug: "facebook-login",
    name: "Facebook Login",
    category: "platform",
    url: "https://developers.facebook.com/docs/facebook-login/",
    what: "Signing in to third-party apps and websites with a Facebook account.",
    licence: "Proprietary service",
    maturity: "Used across the web and mobile apps for well over a decade.",
    selfHost: {
      verdict: "no",
      short: "No",
      note: "Meta is the identity provider.",
    },
    signIn: {
      verdict: "option",
      short: "Passkeys + passwords",
      note: "A Facebook account is a password account, with passkeys and other protections available on top.",
    },
    identities: {
      verdict: "no",
      short: "One per account",
      note: "The login shares the profile of one Facebook account.",
    },
    perSite: {
      verdict: "partial",
      short: "Per app",
      note: "Each app receives an app-scoped ID. Apps owned by the same business can map a person across them.",
    },
    ahead: [
      "An account a very large number of people already have.",
      "Per-app identifiers have been the rule there since 2014.",
      "Nothing to install or run.",
    ],
    differs: [
      "Meta sees where you sign in, and apps commonly receive your name and picture. A brig·id website receives an identifier.",
      "brig·id has no profile behind the identity beyond what you wrote in it.",
    ],
    pickThem: "The app you want only offers this, and you are fine with that.",
    pickUs: "You would rather your social profile were not your passport.",
    sources: [
      {
        label: "Mapping users across apps and pages",
        href: "https://developers.facebook.com/docs/facebook-login/guides/map-users",
      },
    ],
  },

  // -- Identity without a provider ------------------------------------------------
  {
    slug: "indieauth",
    name: "IndieAuth",
    category: "decentralised",
    url: "https://indieauth.net/",
    what: "A sign-in protocol built on OAuth 2.0 in which your identity is a web address you control, usually your own domain.",
    licence: "Open specification",
    maturity:
      "A stable specification with several implementations, used across the IndieWeb community.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "Your domain points to an authorisation endpoint you run, or one you delegate to.",
    },
    signIn: {
      verdict: "option",
      short: "Up to your endpoint",
      note: "The protocol does not say how you prove you own the address. Your endpoint decides: a passkey, a password, an email link.",
    },
    identities: {
      verdict: "partial",
      short: "By hand",
      note: "One address is one identity. Several identities means several addresses, which nothing manages together.",
    },
    perSite: {
      verdict: "no",
      short: "Public by design",
      note: "Your address is your identifier on every site. Being recognisable is the purpose.",
    },
    ahead: [
      "It exists and works, with no new server software to wait for.",
      "Your identity is a domain name: nothing more durable or more yours on the web.",
      "A small protocol, simple to implement.",
    ],
    differs: [
      "IndieAuth is for being known under your own name everywhere. brig·id is for choosing who you are in each place.",
      "brig·id adds the private account behind the identities, and identifiers that do not match between sites.",
    ],
    pickThem:
      "You have a personal website and want to sign in as it, publicly.",
    pickUs:
      "You want some of your identities to stay unconnected to your name.",
    sources: [
      { label: "indieauth.net", href: "https://indieauth.net/" },
      {
        label: "IndieAuth specification",
        href: "https://indieauth.spec.indieweb.org/",
      },
    ],
  },
  {
    slug: "solid",
    name: "Solid",
    category: "decentralised",
    url: "https://solidproject.org/",
    what: "A set of open specifications, started by Tim Berners-Lee, for storing your data in a pod you control and signing in with a WebID.",
    licence: "Open specifications",
    maturity:
      "Specifications and several implementations, with real deployments; still far from mainstream.",
    selfHost: {
      verdict: "yes",
      short: "Yes",
      note: "You can run your own pod and identity provider, or use a pod provider.",
    },
    signIn: {
      verdict: "option",
      short: "Up to your provider",
      note: "Sign-in uses OpenID Connect; how you authenticate depends on the identity provider behind your WebID.",
    },
    identities: {
      verdict: "partial",
      short: "By hand",
      note: "A WebID is one identity. You may hold several, managed separately.",
    },
    perSite: {
      verdict: "no",
      short: "Public by design",
      note: "A WebID is a web address that identifies you to every application.",
    },
    ahead: [
      "A much larger ambition: your data, not only your sign-in, stays with you.",
      "Backed by open specifications and more than one independent implementation.",
      "Applications can share data through your pod with your permission.",
    ],
    differs: [
      "Solid moves your data to a place you control. brig·id only handles who you are when you arrive.",
      "A WebID is meant to be linkable; brig·id identities are meant not to be.",
    ],
    pickThem:
      "You want applications to work on data that stays in a store you control.",
    pickUs: "You only want sign-in, with identities that cannot be joined.",
    sources: [{ label: "solidproject.org", href: "https://solidproject.org/" }],
  },
  {
    slug: "nostr",
    name: "Nostr",
    category: "decentralised",
    url: "https://github.com/nostr-protocol/nips",
    what: "An open protocol for social applications in which your identity is a cryptographic key pair and your messages are relayed by servers anyone can run.",
    licence: "Open protocol",
    maturity:
      "A live network with many clients and relays, and a fast-moving set of conventions.",
    selfHost: {
      verdict: "yes",
      short: "No server needed",
      note: "The identity is a key you hold. There is no account on a server; relays only carry messages.",
    },
    signIn: {
      verdict: "yes",
      short: "A key, no password",
      note: "You sign with your private key, held by an app, a browser extension or a remote signer.",
    },
    identities: {
      verdict: "partial",
      short: "By hand",
      note: "One key pair is one identity. You can create as many as you like and must keep each key yourself.",
    },
    perSite: {
      verdict: "no",
      short: "Public by design",
      note: "Your public key is your name in every application.",
    },
    ahead: [
      "No provider at all: nobody can close the account or see where you sign in.",
      "A working network and many applications today.",
      "Portability is complete: the key is the identity.",
    ],
    differs: [
      "Lose the key and the identity is gone; leak it and it is someone else's. brig·id keeps the keys in passkeys and plans a recovery code.",
      "A Nostr key is the same everywhere; a brig·id identity gives each site a different identifier.",
      "brig·id signs you in to ordinary websites through OpenID Connect; Nostr is its own ecosystem.",
    ],
    pickThem:
      "You want a public, censorship-resistant identity and accept managing a key.",
    pickUs:
      "You want passkey comfort, recovery, and identities that are not linkable.",
    sources: [
      {
        label: "Nostr implementation possibilities (NIPs)",
        href: "https://github.com/nostr-protocol/nips",
      },
    ],
  },
  {
    slug: "sign-in-with-ethereum",
    name: "Sign-In with Ethereum",
    category: "decentralised",
    url: "https://eips.ethereum.org/EIPS/eip-4361",
    what: "A standard (EIP-4361) for signing in to a website by signing a message with an Ethereum account.",
    licence: "Open standard",
    maturity:
      "A published Ethereum standard, common in blockchain applications.",
    selfHost: {
      verdict: "yes",
      short: "No server needed",
      note: "The account is a key in your wallet. No identity provider is involved.",
    },
    signIn: {
      verdict: "yes",
      short: "A key, no password",
      note: "The wallet signs a message for the website. No password is exchanged.",
    },
    identities: {
      verdict: "partial",
      short: "By hand",
      note: "One account is one identity. A wallet can hold several, which you keep track of yourself.",
    },
    perSite: {
      verdict: "no",
      short: "Public by design",
      note: "Every website sees the same address, and with it the public history of that account on the blockchain.",
    },
    ahead: [
      "A published standard with wide wallet support.",
      "No provider, and one account that also carries assets and permissions.",
      "Works today wherever a wallet is available.",
    ],
    differs: [
      "An Ethereum address brings its whole public history to every site. A brig·id identifier brings nothing.",
      "brig·id needs no wallet and no blockchain: a passkey is enough.",
    ],
    pickThem:
      "The website is a blockchain application and the account is the point.",
    pickUs:
      "You want to sign in without showing a ledger of what you did elsewhere.",
    sources: [
      {
        label: "EIP-4361",
        href: "https://eips.ethereum.org/EIPS/eip-4361",
      },
    ],
  },
];

export function competitorsOf(category: CategoryId): Competitor[] {
  return COMPETITORS.filter((item) => item.category === category);
}

/** Tools that solve a neighbouring problem and work well next to brig·id. */
export const NEIGHBOURS = [
  {
    title: "Password managers",
    text: "Bitwarden, 1Password, Proton Pass, or the one built into your phone: this is where your passkeys live. brig·id relies on them and replaces none.",
  },
  {
    title: "Email aliases",
    text: "Hide My Email, SimpleLogin, Firefox Relay, addy.io: they keep your address from linking your accounts. brig·id keeps your sign-in from doing so. Use both.",
  },
  {
    title: "Private browsing tools",
    text: "Tracker blockers, VPNs and Tor deal with your network traces. brig·id does not touch those, and says so.",
  },
];
