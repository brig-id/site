export interface NavLink {
  href: string;
  label: string;
}

export const GITHUB = "https://github.com/brig-id";
export const SPEC = "https://github.com/brig-id/spec";

/** The pages that explain brig·id and what it costs. */
export const PRIMARY: NavLink[] = [
  { href: "/features/", label: "Features" },
  { href: "/identities/", label: "Identities" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/compare/", label: "Compare" },
];

/** The pages around them. */
export const SECONDARY: NavLink[] = [
  { href: "/manifesto/", label: "Manifesto" },
  { href: "/history/", label: "History" },
  { href: "/status/", label: "Status" },
  { href: "/servers/", label: "Servers" },
];

/**
 * Where "Contact us" leads. brig·id has no public address yet: the
 * organisation's support file sends organisation-level questions to the
 * `.github` repository. Replace this with a `mailto:` when one exists, and
 * adjust the sentence on the pricing page that says the channel is public.
 */
export const CONTACT = {
  href: "https://github.com/brig-id/.github/issues/new",
  isPublic: true,
};
