// What /api/status reports. The probes run in the Worker, not in the visitor's
// browser: the page stays within `connect-src 'self'`, and the probed server
// never sees who is looking at the status page.

export type CheckState = "up" | "down";
export type Overall = "operational" | "degraded" | "down";

export interface CheckResult {
  id: string;
  label: string;
  state: CheckState;
  /** HTTP status of the probe, absent when the request itself failed. */
  httpStatus?: number;
  /** Round trip in milliseconds, as seen from the Worker. */
  ms: number;
}

export interface ServiceResult {
  id: string;
  name: string;
  host: string;
  description: string;
  state: Overall;
  checks: CheckResult[];
}

export interface StatusReport {
  checkedAt: string;
  overall: Overall;
  services: ServiceResult[];
}

interface Probe {
  id: string;
  label: string;
  url: string;
  /** Says whether the answer is the expected one. */
  accept: (response: Response) => Promise<boolean>;
}

interface Service {
  id: string;
  name: string;
  host: string;
  description: string;
  probes: Probe[];
}

const PROBE_TIMEOUT_MS = 5000;

async function isJsonWith(
  response: Response,
  test: (body: unknown) => boolean,
): Promise<boolean> {
  if (!response.ok) return false;
  try {
    return test(await response.json());
  } catch {
    return false;
  }
}

function hasNonEmptyArray(body: unknown, key: string): boolean {
  if (typeof body !== "object" || body === null) return false;
  const value = (body as Record<string, unknown>)[key];
  return Array.isArray(value) && value.length > 0;
}

export const SERVICES: Service[] = [
  {
    id: "helm",
    name: "helm.brig.id",
    host: "helm.brig.id",
    description:
      "The project's own brig·id server, a single seedling. Pre-beta: it is where each release is tried first.",
    probes: [
      {
        id: "health",
        label: "Server health",
        url: "https://helm.brig.id/health",
        accept: (response) =>
          isJsonWith(
            response,
            (body) =>
              typeof body === "object" &&
              body !== null &&
              (body as Record<string, unknown>).status === "ok",
          ),
      },
      {
        id: "jwks",
        label: "Signing keys (JWKS)",
        url: "https://helm.brig.id/.well-known/jwks.json",
        accept: (response) =>
          isJsonWith(response, (body) => hasNonEmptyArray(body, "keys")),
      },
      {
        id: "did",
        label: "Server DID document",
        url: "https://helm.brig.id/.well-known/did.json",
        accept: (response) =>
          isJsonWith(response, (body) =>
            hasNonEmptyArray(body, "verificationMethod"),
          ),
      },
    ],
  },
];

async function runProbe(
  probe: Probe,
  fetcher: typeof fetch,
): Promise<CheckResult> {
  const started = Date.now();
  try {
    const response = await fetcher(probe.url, {
      headers: { "User-Agent": "brig.id-status/1" },
      redirect: "manual",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    const ok = await probe.accept(response);
    return {
      id: probe.id,
      label: probe.label,
      state: ok ? "up" : "down",
      httpStatus: response.status,
      ms: Date.now() - started,
    };
  } catch {
    return {
      id: probe.id,
      label: probe.label,
      state: "down",
      ms: Date.now() - started,
    };
  }
}

function summarize(states: CheckState[]): Overall {
  if (states.every((state) => state === "up")) return "operational";
  if (states.every((state) => state === "down")) return "down";
  return "degraded";
}

export async function buildStatusReport(
  fetcher: typeof fetch,
  services: Service[] = SERVICES,
): Promise<StatusReport> {
  const results = await Promise.all(
    services.map(async (service): Promise<ServiceResult> => {
      const checks = await Promise.all(
        service.probes.map((probe) => runProbe(probe, fetcher)),
      );
      return {
        id: service.id,
        name: service.name,
        host: service.host,
        description: service.description,
        state: summarize(checks.map((check) => check.state)),
        checks,
      };
    }),
  );

  // This Worker answering is the check of the website itself.
  const website: ServiceResult = {
    id: "site",
    name: "brig.id",
    host: "brig.id",
    description: "This website, served from Cloudflare's edge.",
    state: "operational",
    checks: [{ id: "edge", label: "Website", state: "up", ms: 0 }],
  };

  const all = [website, ...results];
  const states = all.flatMap((service) =>
    service.checks.map((check) => check.state),
  );
  return {
    checkedAt: new Date().toISOString(),
    overall: summarize(states),
    services: all,
  };
}
