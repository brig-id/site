// The little that runs on every page. The site reads fine without it.

const header = document.querySelector<HTMLElement>("[data-header]");
if (header) {
  const update = () => {
    header.toggleAttribute("data-scrolled", window.scrollY > 24);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

// Cards are lit from where the pointer is.
if (window.matchMedia("(hover: hover)").matches) {
  document.addEventListener(
    "pointermove",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest<HTMLElement>(".card");
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
    },
    { passive: true },
  );
}

// The small-screen menu closes on Escape and when the page is left.
const menu = document.querySelector<HTMLDetailsElement>("details.nav-narrow");
if (menu) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") menu.open = false;
  });
  window.addEventListener("pageshow", () => {
    menu.open = false;
  });
}
