import type { APIRoute } from "astro";
import DottedMap from "dotted-map";

const round = (value: number) => Math.round(value * 100) / 100;

// A dotted map of the world, drawn once at build time. Each dot is a
// zero-length stroke with round caps, which keeps the file small. The page
// uses it as a mask, so the colour comes from the stylesheet.
export const GET: APIRoute = () => {
  const map = new DottedMap({ height: 56, grid: "diagonal" });
  const points = map.getPoints() as { x: number; y: number }[];
  const width = Math.ceil(Math.max(...points.map((point) => point.x))) + 1;
  const height = Math.ceil(Math.max(...points.map((point) => point.y))) + 1;
  const dots = points
    .map((point) => `M${round(point.x)} ${round(point.y)}h0`)
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${width + 1} ${height + 1}">` +
    `<path d="${dots}" fill="none" stroke="#fff" stroke-width=".46" stroke-linecap="round"/>` +
    `</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
};
