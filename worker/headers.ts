// The site loads nothing from anywhere else: fonts, icons, styles and scripts
// are all built into dist/. So the policy is "this origin only", with no
// inline script and no inline style (scripts/check-dist.mjs keeps the build
// within that). `data:` images are the film grain in the stylesheet.
export const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
].join("; ");

const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "browsing-topics=()",
  "camera=()",
  "geolocation=()",
  "gyroscope=()",
  "microphone=()",
  "payment=()",
  "usb=()",
].join(", ");

export function withSecurityHeaders(
  response: Response,
  pathname: string,
): Response {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  // Two years, the value the HSTS preload list asks for. Limited to this
  // host: subdomains such as helm.brig.id set their own policy.
  headers.set("Strict-Transport-Security", "max-age=63072000");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  // Astro puts a content hash in every file name under /_astro/.
  if (pathname.startsWith("/_astro/") && response.ok) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
