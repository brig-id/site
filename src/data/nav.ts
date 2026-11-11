export interface NavLink {
  href: string;
  label: string;
}

export const GITHUB = "https://github.com/brig-id";
export const SPEC = "https://github.com/brig-id/spec";

/** The three pages that explain brig·id. */
export const PRIMARY: NavLink[] = [
  { href: "/features/", label: "Features" },
  { href: "/identities/", label: "Identities" },
];

/** The pages around them. */
export const SECONDARY: NavLink[] = [
  { href: "/manifesto/", label: "Manifesto" },
  { href: "/history/", label: "History" },
  { href: "/status/", label: "Status" },
  { href: "/servers/", label: "Servers" },
];
