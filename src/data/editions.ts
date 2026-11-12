// The three editions of the server, and what is known about each. grove and
// forest do not exist yet: a cell says "To be defined" rather than promise
// something nobody has designed.

export interface Edition {
  id: "leaf" | "grove" | "forest";
  line: string;
  audience: string;
  price: string;
  priceNote: string;
}

export const EDITIONS: Edition[] = [
  {
    id: "leaf",
    line: "One server, one container.",
    audience: "A person, a family, a small association or team.",
    price: "Free",
    priceNote: "Open source, for anyone.",
  },
  {
    id: "grove",
    line: "Several servers as one.",
    audience: "A non-profit or a community that has outgrown one machine.",
    price: "Free",
    priceNote: "Open source, like leaf.",
  },
  {
    id: "forest",
    line: "Identity as critical infrastructure.",
    audience: "Companies that cannot afford their sign-in to be down.",
    price: "Paid",
    priceNote: "Commercial licence. Contact us.",
  },
];

export interface EditionRow {
  label: string;
  why?: string;
  /** leaf, grove, forest. */
  cells: [string, string, string];
}

export const EDITION_ROWS: EditionRow[] = [
  {
    label: "Made for",
    cells: [
      "A person, a family, a small association or team",
      "A non-profit or a community that has outgrown one machine",
      "Companies for which sign-in is critical",
    ],
  },
  {
    label: "Shape",
    why: "What you have to run.",
    cells: [
      "One server, in one container",
      "Several servers behind one domain, with Docker Compose",
      "A cluster, on Kubernetes",
    ],
  },
  {
    label: "Database",
    cells: [
      "Embedded, in a single file (SQLite)",
      "PostgreSQL, with Redis for shared sessions",
      "To be defined",
    ],
  },
  {
    label: "If a machine fails",
    cells: [
      "Sign-in is down until it is back",
      "The other servers take over",
      "High availability, by design",
    ],
  },
  {
    label: "Licence",
    cells: [
      "LGPL-3.0, open source",
      "LGPL-3.0, open source",
      "Commercial; terms not published yet",
    ],
  },
  {
    label: "Price",
    cells: ["Free", "Free", "Paid, on quotation"],
  },
];

/** What an identity is does not depend on the size of the server. */
export const SAME_EVERYWHERE = [
  {
    icon: "fingerprint-duotone",
    title: "Passkeys only",
    text: "No edition adds a password.",
  },
  {
    icon: "users-three-duotone",
    title: "One private account, several identities",
    text: "The model is the same on a leaf and on a forest.",
  },
  {
    icon: "arrows-split-duotone",
    title: "A different identifier per website",
    text: "Derived the same way, with a secret the server keeps.",
  },
  {
    icon: "lock-key-duotone",
    title: "Encrypted storage",
    text: "Sensitive fields are encrypted before they are written, whatever the database.",
  },
];
