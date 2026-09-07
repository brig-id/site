export interface Env {
  ASSETS: Fetcher;
}

// Security headers layered on top of the static assets Cloudflare serves
// from dist/ — the build output itself carries no headers of its own.
// The FontAwesome Kit script (kit.fontawesome.com) and Unsplash (images +
// api.unsplash.com) are the only third-party origins this site talks to;
// everything else stays same-origin. Tighten or loosen this list from real
// browser console CSP violations rather than guessing further up front —
// server-leaf's own CSP went through the same iteration.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "img-src 'self' data: https://images.unsplash.com",
  "connect-src 'self' https://api.unsplash.com",
  "script-src 'self' https://kit.fontawesome.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' https://ka-f.fontawesome.com",
].join("; ");

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
