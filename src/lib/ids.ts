// Names for what SVG can only reach by name (a gradient, a mask). A drawing
// that appears twice on a page, like the mark in the header and in the footer,
// needs a different one each time.

const counts = new Map<string, number>();

/**
 * A name no other element of the page carries: `mark-1`, then `mark-2`, …
 * Counted page by page, so that a page is built the same way every time.
 */
export function freshId(prefix: string, page: string): string {
  const key = `${page} ${prefix}`;
  const next = (counts.get(key) ?? 0) + 1;
  counts.set(key, next);
  return `${prefix}-${next}`;
}
