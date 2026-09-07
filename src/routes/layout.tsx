import { component$, Slot } from "@builder.io/qwik";
import { SiteHeader } from "~/components/site-header/site-header";
import { SiteFooter } from "~/components/site-footer/site-footer";

export default component$(() => {
  return (
    <>
      <SiteHeader />
      <main>
        <Slot />
      </main>
      <SiteFooter />
    </>
  );
});
