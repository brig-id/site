import { withSecurityHeaders } from "./headers";
import { buildStatusReport } from "./status";

// The entry module exports the handler and nothing else: workerd refuses any
// other value among a Worker's exports.
export interface Env {
  ASSETS: Fetcher;
}

/** The production host. Every other host serving this Worker is a Preview. */
const PRODUCTION_HOST = "brig.id";

/** Seconds a status report is reused before the servers are probed again. */
const STATUS_TTL_SECONDS = 60;

async function statusResponse(
  request: Request,
  ctx: ExecutionContext,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  // One report per minute for everyone, however many visitors ask: the
  // status page must not turn into a way to hammer the servers it watches.
  const cacheKey = new Request(new URL("/api/status", request.url).href);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const report = await buildStatusReport(fetch);
  const response = new Response(JSON.stringify(report), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${STATUS_TTL_SECONDS}`,
    },
  });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    // One canonical host.
    if (url.hostname === "www.brig.id") {
      url.hostname = "brig.id";
      return withSecurityHeaders(
        new Response(null, { status: 301, headers: { Location: url.href } }),
        url.pathname,
      );
    }

    const response = withSecurityHeaders(
      url.pathname === "/api/status"
        ? await statusResponse(request, ctx)
        : await env.ASSETS.fetch(request),
      url.pathname,
    );

    // Pull request Previews (<name>.brig.id) are public: keep them out of
    // search results. Cloudflare only does this for workers.dev Previews.
    if (url.hostname !== PRODUCTION_HOST) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return response;
  },
};
