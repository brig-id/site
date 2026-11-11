// Fills the status page from /api/status, which the Worker answers after
// probing the servers itself (worker/status.ts).

interface Check {
  id: string;
  state: "up" | "down";
  httpStatus?: number;
  ms: number;
}

interface Service {
  id: string;
  state: "operational" | "degraded" | "down";
  checks: Check[];
}

interface Report {
  checkedAt: string;
  overall: Service["state"];
  services: Service[];
}

const OVERALL: Record<Report["overall"], string> = {
  operational: "All systems operational",
  degraded: "Some checks are failing",
  down: "Services are down",
};

const SERVICE: Record<Service["state"], string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
};

const REFRESH_MS = 60_000;

const setState = (element: Element | null, state: string) => {
  element?.setAttribute("data-state", state);
};

const root = document.querySelector<HTMLElement>("[data-status]");

if (root) {
  const overall = root.querySelector<HTMLElement>("[data-overall]");
  const overallText = root.querySelector<HTMLElement>("[data-overall-text]");
  const checkedAt = root.querySelector<HTMLElement>("[data-checked-at]");
  const button = root.querySelector<HTMLButtonElement>("[data-refresh]");

  const unavailable = () => {
    setState(overall, "unknown");
    if (overallText) overallText.textContent = "Status unavailable";
    if (checkedAt) {
      checkedAt.textContent =
        "The status service did not answer. This website is up, since you are reading it.";
    }
    for (const element of root.querySelectorAll(
      "[data-service], [data-check]",
    )) {
      setState(element, "unknown");
    }
    for (const label of root.querySelectorAll(
      "[data-service-label], [data-check-label]",
    )) {
      label.textContent = "Unknown";
    }
  };

  const apply = (report: Report) => {
    setState(overall, report.overall);
    if (overallText) overallText.textContent = OVERALL[report.overall];
    if (checkedAt) {
      const time = new Date(report.checkedAt);
      checkedAt.textContent = `Checked at ${time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}, from Cloudflare's network. Results are reused for one minute.`;
    }
    for (const service of report.services) {
      const row = root.querySelector(`[data-service="${service.id}"]`);
      if (!row) continue;
      setState(row, service.state);
      const label = row.querySelector("[data-service-label]");
      if (label) label.textContent = SERVICE[service.state];
      for (const check of service.checks) {
        const item = row.querySelector(`[data-check="${check.id}"]`);
        if (!item) continue;
        setState(item, check.state);
        const text = item.querySelector("[data-check-label]");
        if (text) {
          text.textContent =
            check.state === "up"
              ? check.ms > 0
                ? `OK · ${check.ms} ms`
                : "OK"
              : check.httpStatus
                ? `Failing · HTTP ${check.httpStatus}`
                : "No answer";
        }
      }
    }
  };

  const load = async () => {
    button?.setAttribute("disabled", "");
    try {
      const response = await fetch("/api/status", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      apply((await response.json()) as Report);
    } catch {
      unavailable();
    } finally {
      button?.removeAttribute("disabled");
    }
  };

  button?.addEventListener("click", () => void load());
  window.setInterval(() => {
    if (document.visibilityState === "visible") void load();
  }, REFRESH_MS);
  void load();
}
