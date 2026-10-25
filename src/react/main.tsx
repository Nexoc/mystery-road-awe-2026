import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { debugLog } from "../shared/debug.js";
import { loadInvestigationData } from "./data.js";

import { App } from "../app/App.js";

const container = document.getElementById("react-root");

if (!container) {
  throw new Error("Missing #react-root mount point");
}

debugLog("3.9", "REACT ENTRY → mount point found", {
  elementId: container.id,
});

const data = await loadInvestigationData();

debugLog("3.10", "REACT ENTRY → investigation data ready", {
  caseId: data.caseData.caseId,
  evidenceCount: data.evidence.length,
  timelineCount: data.timeline.length,
});

debugLog("3.9", "REACT ENTRY → React render requested");

createRoot(container).render(
  <StrictMode>
    <App data={data} />
  </StrictMode>,
);
