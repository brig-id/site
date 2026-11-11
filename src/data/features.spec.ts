import { describe, expect, it } from "vitest";
import { iconBody } from "~/lib/icons";
import {
  FEATURES,
  GROUPS,
  STATUS_LABEL,
  feature,
  featuresOf,
} from "./features";

describe("features", () => {
  it("gives every feature a unique id", () => {
    const ids = FEATURES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("puts every feature in a declared group, and leaves no group empty", () => {
    const groups = GROUPS.map((group) => group.id);
    for (const item of FEATURES) expect(groups).toContain(item.group);
    for (const group of GROUPS) {
      expect(featuresOf(group.id).length).toBeGreaterThan(0);
    }
  });

  it("gives every feature a known status", () => {
    const known = Object.keys(STATUS_LABEL);
    expect(FEATURES.filter((item) => !known.includes(item.status))).toEqual([]);
  });

  it("gives every feature an icon that exists", () => {
    const missing = FEATURES.filter((item) => {
      try {
        iconBody(item.icon);
        return false;
      } catch {
        return true;
      }
    });
    expect(missing.map((item) => item.icon)).toEqual([]);
  });

  it("links references to https or to a page of this site", () => {
    const hrefs = FEATURES.flatMap((item) => (item.ref ? [item.ref.href] : []));
    const allowed = /^(https:\/\/|\/[a-z-]+\/$)/;
    expect(hrefs.filter((href) => !allowed.test(href))).toEqual([]);
  });

  it("finds a feature by id and refuses an unknown one", () => {
    expect(feature("passkeys").status).toBe("available");
    expect(() => feature("teleportation")).toThrow("Unknown feature");
  });
});
