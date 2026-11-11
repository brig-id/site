import { deriveIdentifier } from "~/lib/derive";

// Fills the table of identifiers on the Identities page. Everything happens
// here, in the page: the secret is random, kept in memory and never sent.

const hex = (bytes: Uint8Array) =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const root = document.querySelector<HTMLElement>("[data-derive]");

if (root && "subtle" in crypto) {
  const cells = [...root.querySelectorAll<HTMLElement>("[data-cell]")];
  const secretOut = root.querySelector<HTMLElement>("[data-secret]");
  const full = root.querySelector<HTMLElement>("[data-full]");
  const reroll = root.querySelector<HTMLButtonElement>("[data-reroll]");
  const again = root.querySelector<HTMLButtonElement>("[data-again]");

  // One random id per identity, as the server would have given them.
  const identityIds = new Map<string, string>();
  for (const cell of cells) {
    const identity = cell.dataset.identity ?? "";
    if (!identityIds.has(identity))
      identityIds.set(identity, crypto.randomUUID());
  }

  let secret = crypto.getRandomValues(new Uint8Array(32));

  const render = async () => {
    if (secretOut) secretOut.textContent = `${hex(secret.slice(0, 6))}…`;
    await Promise.all(
      cells.map(async (cell) => {
        const identity = identityIds.get(cell.dataset.identity ?? "") ?? "";
        const value = await deriveIdentifier(
          secret,
          identity,
          cell.dataset.site ?? "",
        );
        cell.dataset.value = value;
        cell.textContent = `${value.slice(0, 8)}…`;
        cell.classList.remove("flash");
        // Restart the animation on the next frame.
        requestAnimationFrame(() => cell.classList.add("flash"));
      }),
    );
    root.dataset.ready = "";
  };

  const show = (cell: HTMLElement) => {
    if (!full || !cell.dataset.value) return;
    full.textContent = `${cell.dataset.identityName} at ${cell.dataset.site}: ${cell.dataset.value}`;
  };

  for (const cell of cells) {
    cell.addEventListener("pointerenter", () => show(cell));
    cell.addEventListener("focus", () => show(cell));
  }

  reroll?.addEventListener("click", () => {
    secret = crypto.getRandomValues(new Uint8Array(32));
    void render();
  });
  again?.addEventListener("click", () => void render());

  void render();
}
