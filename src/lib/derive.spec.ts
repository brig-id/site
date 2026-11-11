import { describe, expect, it } from "vitest";
import {
  base64url,
  derivationInfo,
  deriveIdentifier,
  uuidBytes,
} from "./derive";

const secret = new Uint8Array(32).fill(7);
const otherSecret = new Uint8Array(32).fill(8);
const personal = "3f2b8c1e-5a4d-4e6f-9b7a-0c1d2e3f4a5b";
const work = "9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d";

describe("per-site identifier demo", () => {
  it("gives the same identifier for the same identity and site", async () => {
    const first = await deriveIdentifier(secret, personal, "forum.example");
    const second = await deriveIdentifier(secret, personal, "forum.example");
    expect(first).toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("gives unrelated identifiers on two sites", async () => {
    const forum = await deriveIdentifier(secret, personal, "forum.example");
    const shop = await deriveIdentifier(secret, personal, "shop.example");
    expect(forum).not.toBe(shop);
  });

  it("gives unrelated identifiers to two identities on one site", async () => {
    const one = await deriveIdentifier(secret, personal, "forum.example");
    const two = await deriveIdentifier(secret, work, "forum.example");
    expect(one).not.toBe(two);
  });

  it("changes every identifier with the server secret", async () => {
    const one = await deriveIdentifier(secret, personal, "forum.example");
    const two = await deriveIdentifier(otherSecret, personal, "forum.example");
    expect(one).not.toBe(two);
  });

  it("length-prefixes the site, so inputs cannot run into each other", () => {
    const short = derivationInfo(personal, "a");
    const long = derivationInfo(personal, "ab");
    // 16 label bytes, 16 identity bytes, then the length on 4 bytes.
    expect(new DataView(short.buffer).getUint32(32)).toBe(1);
    expect(new DataView(long.buffer).getUint32(32)).toBe(2);
    expect(long.length).toBe(short.length + 1);
  });

  it("reads a UUID as 16 bytes and refuses anything else", () => {
    expect(uuidBytes(personal)).toHaveLength(16);
    expect(uuidBytes(personal)[0]).toBe(0x3f);
    expect(() => uuidBytes("swift-otter-4821")).toThrow("Not a UUID");
  });

  it("encodes without padding or URL-unsafe characters", () => {
    expect(base64url(new Uint8Array([251, 255, 254]))).toBe("-__-");
    expect(base64url(new Uint8Array([1]))).toBe("AQ");
  });
});
