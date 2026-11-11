import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTENT_SECURITY_POLICY } from "./headers";
import worker, { type Env } from "./index";
import { buildStatusReport, SERVICES } from "./status";

const ctx = {
  waitUntil: () => undefined,
  passThroughOnException: () => undefined,
} as unknown as ExecutionContext;

function envServing(body: string, init?: ResponseInit): Env {
  return {
    ASSETS: {
      fetch: async () => new Response(body, init),
    } as unknown as Fetcher,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** A helm.brig.id that answers every probe the way a healthy server does. */
const healthyServer: typeof fetch = async (input) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.endsWith("/health")) return json({ status: "ok" });
  if (url.endsWith("/jwks.json")) return json({ keys: [{ kid: "v1" }] });
  if (url.endsWith("/did.json")) {
    return json({ verificationMethod: [{ id: "did:web:helm.brig.id#key-1" }] });
  }
  return new Response("not found", { status: 404 });
};

describe("static pages", () => {
  it("adds the security headers to a page", async () => {
    const response = await worker.fetch(
      new Request("https://brig.id/"),
      envServing("<!doctype html>", {
        headers: { "Content-Type": "text/html" },
      }),
      ctx,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Security-Policy")).toBe(
      CONTENT_SECURITY_POLICY,
    );
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Strict-Transport-Security")).toBe(
      "max-age=63072000",
    );
    expect(response.headers.get("Cache-Control")).toBeNull();
  });

  it("allows no inline script, no inline style and no other origin", () => {
    expect(CONTENT_SECURITY_POLICY).not.toContain("unsafe-inline");
    expect(CONTENT_SECURITY_POLICY).not.toContain("unsafe-eval");
    expect(CONTENT_SECURITY_POLICY).not.toContain("http");
  });

  it("caches hashed assets for a year, but not a missing one", async () => {
    const found = await worker.fetch(
      new Request("https://brig.id/_astro/site.abc123.css"),
      envServing("body{}"),
      ctx,
    );
    expect(found.headers.get("Cache-Control")).toBe(
      "public, max-age=31536000, immutable",
    );

    const missing = await worker.fetch(
      new Request("https://brig.id/_astro/gone.css"),
      envServing("not found", { status: 404 }),
      ctx,
    );
    expect(missing.status).toBe(404);
    expect(missing.headers.get("Cache-Control")).toBeNull();
  });

  it("keeps the status of a page that does not exist", async () => {
    const response = await worker.fetch(
      new Request("https://brig.id/nope/"),
      envServing("<!doctype html>", { status: 404 }),
      ctx,
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Security-Policy")).not.toBeNull();
  });

  it("redirects www to the apex, path and query kept", async () => {
    const response = await worker.fetch(
      new Request("https://www.brig.id/identities/?a=1"),
      envServing("unused"),
      ctx,
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("Location")).toBe(
      "https://brig.id/identities/?a=1",
    );
    expect(response.headers.get("Strict-Transport-Security")).not.toBeNull();
  });
});

describe("status report", () => {
  it("is operational when every probe answers as expected", async () => {
    const report = await buildStatusReport(healthyServer);

    expect(report.overall).toBe("operational");
    expect(report.services.map((service) => service.id)).toEqual([
      "site",
      "helm",
    ]);
    const helm = report.services.find((service) => service.id === "helm");
    expect(helm?.checks.map((check) => check.state)).toEqual([
      "up",
      "up",
      "up",
    ]);
    expect(Number.isNaN(Date.parse(report.checkedAt))).toBe(false);
  });

  it("is degraded when one probe fails, and names it", async () => {
    const report = await buildStatusReport(async (input, init) => {
      const url = String(input instanceof Request ? input.url : input);
      if (url.endsWith("/jwks.json")) return json({ keys: [] });
      return healthyServer(input, init);
    });

    expect(report.overall).toBe("degraded");
    const helm = report.services.find((service) => service.id === "helm");
    expect(helm?.state).toBe("degraded");
    expect(helm?.checks.find((check) => check.id === "jwks")?.state).toBe(
      "down",
    );
    expect(helm?.checks.find((check) => check.id === "health")?.state).toBe(
      "up",
    );
  });

  it("marks a server down when it cannot be reached at all", async () => {
    const report = await buildStatusReport(async () => {
      throw new TypeError("connection refused");
    });

    const helm = report.services.find((service) => service.id === "helm");
    expect(helm?.state).toBe("down");
    expect(helm?.checks.every((check) => check.httpStatus === undefined)).toBe(
      true,
    );
    // The website answered, so the whole is degraded, not down.
    expect(report.overall).toBe("degraded");
  });

  it("does not take an error page with a 200 for a healthy server", async () => {
    const report = await buildStatusReport(
      async () =>
        new Response("<html>maintenance</html>", {
          headers: { "Content-Type": "text/html" },
        }),
    );
    const helm = report.services.find((service) => service.id === "helm");
    expect(helm?.state).toBe("down");
    expect(helm?.checks[0]?.httpStatus).toBe(200);
  });

  it("probes only https URLs of the declared host", () => {
    for (const service of SERVICES) {
      for (const probe of service.probes) {
        expect(new URL(probe.url).protocol).toBe("https:");
        expect(new URL(probe.url).hostname).toBe(service.host);
      }
    }
  });
});

describe("/api/status", () => {
  const stored = new Map<string, Response>();

  beforeEach(() => {
    stored.clear();
    vi.stubGlobal("caches", {
      default: {
        match: async (key: Request) => stored.get(key.url)?.clone(),
        put: async (key: Request, value: Response) => {
          stored.set(key.url, value);
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the report as JSON and probes once for two requests", async () => {
    const probe = vi.fn<typeof fetch>(healthyServer);
    vi.stubGlobal("fetch", probe);

    const first = await worker.fetch(
      new Request("https://brig.id/api/status"),
      envServing("unused"),
      {
        ...ctx,
        waitUntil: (promise: Promise<unknown>) => void promise,
      } as unknown as ExecutionContext,
    );
    expect(first.headers.get("Content-Type")).toContain("application/json");
    expect(first.headers.get("Cache-Control")).toBe("public, max-age=60");
    expect(first.headers.get("Content-Security-Policy")).not.toBeNull();
    const report = (await first.json()) as { overall: string };
    expect(report.overall).toBe("operational");

    await Promise.resolve();
    const callsAfterFirst = probe.mock.calls.length;
    expect(callsAfterFirst).toBe(3);

    const second = await worker.fetch(
      new Request("https://brig.id/api/status?nocache=1"),
      envServing("unused"),
      ctx,
    );
    expect(((await second.json()) as { overall: string }).overall).toBe(
      "operational",
    );
    expect(probe.mock.calls.length).toBe(callsAfterFirst);
  });

  it("refuses anything but GET and HEAD", async () => {
    const response = await worker.fetch(
      new Request("https://brig.id/api/status", { method: "POST" }),
      envServing("unused"),
      ctx,
    );
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
  });
});

describe("worker module", () => {
  it("exports only the handler, as workerd requires", async () => {
    const module = await import("./index");
    expect(Object.keys(module)).toEqual(["default"]);
  });
});
