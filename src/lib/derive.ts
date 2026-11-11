// The per-site identifier, as a demonstration that runs in the browser.
//
// It follows the shape of the server's formula (ADR-007): a keyed, one-way
// derivation from an identity's random id and the website's client id. Two
// differences, both because of what browsers offer: the hash is SHA-256
// (WebCrypto has no SHA-3), and the secret is a throwaway made for the page.

const LABEL = new TextEncoder().encode("brigid-vsid-demo");

/** Bytes of a UUID written in the usual 8-4-4-4-12 form. */
export function uuidBytes(uuid: string): Uint8Array {
  const hex = uuid.replaceAll("-", "");
  if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error(`Not a UUID: ${uuid}`);
  const bytes = new Uint8Array(16);
  for (let index = 0; index < 16; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

/** `label ‖ identity (16 bytes) ‖ u32_be(len(site)) ‖ site`: unambiguous. */
export function derivationInfo(identity: string, site: string): Uint8Array {
  const id = uuidBytes(identity);
  const client = new TextEncoder().encode(site);
  const info = new Uint8Array(LABEL.length + id.length + 4 + client.length);
  info.set(LABEL, 0);
  info.set(id, LABEL.length);
  new DataView(info.buffer).setUint32(LABEL.length + id.length, client.length);
  info.set(client, LABEL.length + id.length + 4);
  return info;
}

export function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

/** 32 bytes derived from the secret, the identity and the site: 43 characters. */
export async function deriveIdentifier(
  secret: Uint8Array,
  identity: string,
  site: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    secret as BufferSource,
    "HKDF",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(32),
      info: derivationInfo(identity, site) as BufferSource,
    },
    key,
    256,
  );
  return base64url(new Uint8Array(bits));
}
