import {
  type PropFunction,
  type Signal,
  useVisibleTask$,
} from "@builder.io/qwik";

/**
 * Static, cherry-picked WebAwesome component loaders. Each is a literal
 * dynamic import so Vite/Rolldown can code-split it into its own chunk —
 * routes call only the ones they actually render, on visibility.
 */
export const wa = {
  page: () =>
    import("@web.awesome.me/webawesome-pro/dist/components/page/page.js"),
  card: () =>
    import("@web.awesome.me/webawesome-pro/dist/components/card/card.js"),
  button: () =>
    import("@web.awesome.me/webawesome-pro/dist/components/button/button.js"),
  icon: () =>
    import("@web.awesome.me/webawesome-pro/dist/components/icon/icon.js"),
};

/** Same idea as an onClick$ binding, for wa-button — it isn't a native
 * <button>, so Qwik's JSX sugar (which only targets intrinsic elements)
 * doesn't apply to it. Bind through a ref instead. */
export function useWaClick(
  ref: Signal<HTMLElement | undefined>,
  handler?: PropFunction<() => void>,
) {
  useVisibleTask$(({ cleanup }) => {
    const el = ref.value;
    if (!el || !handler) return;
    const handleClick = () => void handler();
    el.addEventListener("click", handleClick);
    cleanup(() => el.removeEventListener("click", handleClick));
  });
}
