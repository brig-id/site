// The three editions of the server, and what is decided about each. They do
// not differ in what an identity is, nor in what they cost: all three are free
// software. They differ by who runs them and by what an outage costs. grove and
// forest do not exist yet: a cell describes what is decided, and the page marks
// them as planned.

export interface Edition {
  id: "seedling" | "grove" | "forest";
  line: string;
  audience: string;
  price: string;
  priceNote: string;
}

export const EDITIONS: Edition[] = [
  {
    id: "seedling",
    line: "The smallest, for you and yours.",
    audience: "Yourself, a family.",
    price: "Free",
    priceNote: "Free software, for anyone.",
  },
  {
    id: "grove",
    line: "For a community.",
    audience: "A community or an association.",
    price: "Free",
    priceNote: "Free software, like seedling.",
  },
  {
    id: "forest",
    line: "For a company.",
    audience: "A company, in its own infrastructure.",
    price: "Free",
    priceNote: "Free software too. Help is what is paid.",
  },
];

export interface EditionRow {
  label: string;
  why?: string;
  /** seedling, grove, forest. */
  cells: [string, string, string];
}

export const EDITION_ROWS: EditionRow[] = [
  {
    label: "Made for",
    cells: [
      "Yourself or a family",
      "A community or an association",
      "A company",
    ],
  },
  {
    label: "Looked after by",
    cells: [
      "One person",
      "A volunteer or a small team",
      "A team whose job it is",
    ],
  },
  {
    label: "What it needs",
    cells: [
      "Very little: a corner of a small machine",
      "A machine of its own",
      "A cluster, in the company's infrastructure",
    ],
  },
  {
    label: "How it is run",
    cells: [
      "One container, with its database inside",
      "One container, the same engine, its data copied elsewhere as it changes",
      "Several servers that stand in for one another",
    ],
  },
  {
    label: "If the machine stops",
    why: "What an outage costs is what separates the editions.",
    cells: [
      "Sign-in stops; you restore a backup",
      "Sign-in stops for a moment; nothing recent is lost",
      "Sign-in goes on",
    ],
  },
  {
    label: "Licence",
    cells: [
      "AGPL-3.0, free software",
      "AGPL-3.0, free software",
      "AGPL-3.0, free software",
    ],
  },
  {
    label: "Price",
    why: "What can be paid for is help: support, hosting, extra modules.",
    cells: ["Free", "Free", "Free"],
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
    text: "The model is the same on a seedling and on a forest.",
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
