// The three editions of the server, and what is known about each. They differ
// in the volume they carry and in how they fit into what you already run, not
// in what an identity is. grove and forest do not exist yet: a cell says "To
// be defined" rather than promise something nobody has designed.

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
    line: "Light, for private use.",
    audience: "Yourself, a family, a handful of users.",
    price: "Free",
    priceNote: "Open source, for anyone.",
  },
  {
    id: "grove",
    line: "A dedicated server, for non-profits.",
    audience: "An association or a community.",
    price: "Free",
    priceNote: "Open source, like leaf.",
  },
  {
    id: "forest",
    line: "For companies, at scale.",
    audience: "Companies, in their own cloud.",
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
      "Private use: yourself, a family, a few people",
      "Non-profit use: an association, a community",
      "Companies",
    ],
  },
  {
    label: "Volume",
    why: "How many people it is sized for.",
    cells: ["A handful of users", "An organisation's users", "Large volumes"],
  },
  {
    label: "What it needs",
    cells: [
      "Very little: a corner of a small machine",
      "A dedicated server is recommended",
      "A cluster, in the company's cloud",
    ],
  },
  {
    label: "How it is run",
    cells: [
      "One container, with an embedded database (SQLite)",
      "Docker Compose, with PostgreSQL and Redis",
      "Kubernetes, for high availability",
    ],
  },
  {
    label: "Fits into",
    why: "What it has to live with.",
    cells: [
      "Nothing: it stands alone",
      "Nothing: it stands alone",
      "A company's existing infrastructure",
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
    title: "Nothing to remember",
    text: "You sign in with a gesture. No edition adds a password.",
  },
  {
    icon: "users-three-duotone",
    title: "One private self, several identities",
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
