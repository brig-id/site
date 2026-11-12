import { describe, expect, it } from "vitest";
import {
  BRIGID,
  CATEGORIES,
  CHECKED,
  COMPETITORS,
  QUESTIONS,
  VERDICT_LABEL,
  competitorsOf,
} from "./competitors";
import { feature } from "./features";

describe("comparisons", () => {
  it("gives every product a unique slug that works as a URL", () => {
    const slugs = COMPETITORS.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      slugs.filter((slug) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)),
    ).toEqual([]);
  });

  it("puts every product in a family, and leaves no family empty", () => {
    const families = new Set<string>(CATEGORIES.map((category) => category.id));
    expect(COMPETITORS.filter((item) => !families.has(item.category))).toEqual(
      [],
    );
    expect(
      CATEGORIES.filter((category) => competitorsOf(category.id).length === 0),
    ).toEqual([]);
  });

  it("says where every product is ahead of brig·id", () => {
    // The pages are only honest if this list is never empty.
    expect(
      COMPETITORS.filter((item) => item.ahead.length < 2).map(
        (item) => item.slug,
      ),
    ).toEqual([]);
    expect(COMPETITORS.filter((item) => item.differs.length === 0)).toEqual([]);
  });

  it("answers every question for every product, with a known verdict", () => {
    const known = Object.keys(VERDICT_LABEL);
    const gaps = COMPETITORS.flatMap((item) =>
      QUESTIONS.filter((question) => {
        const fact = item[question.id];
        return !known.includes(fact.verdict) || !fact.short || !fact.note;
      }).map((question) => `${item.slug}.${question.id}`),
    );
    expect(gaps).toEqual([]);
  });

  it("backs every product with at least one https source", () => {
    const bad = COMPETITORS.filter(
      (item) =>
        item.sources.length === 0 ||
        item.sources.some((source) => !source.href.startsWith("https://")) ||
        !item.url.startsWith("https://"),
    );
    expect(bad.map((item) => item.slug)).toEqual([]);
  });

  it("quotes no price and no popularity figure", () => {
    const text = JSON.stringify(COMPETITORS);
    expect(text).not.toMatch(/[$€£]\s?\d/);
    expect(text).not.toMatch(/\d+\s?(k\b|stars|users\b)/i);
  });

  it("ties each of brig·id's own answers to a feature with a status", () => {
    for (const question of QUESTIONS) {
      expect(() => feature(BRIGID[question.id].feature)).not.toThrow(
        "Unknown feature",
      );
    }
  });

  it("carries a valid date for the last check of the sources", () => {
    expect(Number.isNaN(Date.parse(CHECKED.iso))).toBe(false);
  });
});
