// The example identities used across the site. Public, Personal and Work are
// the three a new account starts with; the fourth is one a person might add.

export interface ExampleIdentity {
  id: string;
  name: string;
  icon: string;
  hue: string;
  /** What this identity is for. */
  role: string;
  /** A website that would meet it. */
  site: string;
  /** What that website would hold as an identifier (made up, for show). */
  sample: string;
}

export const IDENTITIES: ExampleIdentity[] = [
  {
    id: "public",
    name: "Public",
    icon: "globe-hemisphere-west-duotone",
    hue: "amber",
    role: "Your name in the open: blog, code, talks.",
    site: "blog.example",
    sample: "q7Zf…m2Ka",
  },
  {
    id: "personal",
    name: "Personal",
    icon: "house-line-duotone",
    hue: "rose",
    role: "Friends, family, the club's website.",
    site: "club.example",
    sample: "D1xw…9tPb",
  },
  {
    id: "work",
    name: "Work",
    icon: "briefcase-duotone",
    hue: "cyan",
    role: "The tools your employer runs.",
    site: "intranet.example",
    sample: "hY48…Rc0e",
  },
  {
    id: "night-owl",
    name: "Night owl",
    icon: "mask-happy-duotone",
    hue: "violet",
    role: "A pseudonym for forums and games.",
    site: "forum.example",
    sample: "Lp3u…Xv6s",
  },
];
