import { useEffect, useState } from "react";
import { debugLog } from "../../shared/debug.js";
import type { InvestigationData } from "../../types.js";
import { loadInvestigationData } from "../data.js";
import { App } from "./App.js";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Could not load case data";
}

export function InvestigationApp() {
  const [data, setData] = useState<InvestigationData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    debugLog("6.5", "InvestigationApp → request effect started");

    loadInvestigationData()
      .then((nextData) => {
        debugLog("6.5", "InvestigationApp → data state update scheduled", {
          caseId: nextData.caseData.caseId,
          evidenceCount: nextData.evidence.length,
        });
        setData(nextData);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        const message = getErrorMessage(error);

        debugLog("6.5", "InvestigationApp → request failed", { message });
        setData(null);
        setLoadError(message);
      });
  }, []);

  if (loadError !== null) {
    return (
      <main className="app-main">
        <section role="alert">
          <h2>Could not load case data</h2>
          <p>{loadError}</p>
          <p>Check that the local Exercise 6 backend is running.</p>
        </section>
      </main>
    );
  }

  if (data === null) {
    return (
      <main className="app-main">
        <section aria-live="polite">
          <h2>Loading case data…</h2>
          <p>Waiting for the local Exercise 6 backend.</p>
        </section>
      </main>
    );
  }

  return <App data={data} />;
}
