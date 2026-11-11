import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { debugLog } from "../shared/debug.js";
import { InvestigationApp } from "./app/InvestigationApp.js";

const container = document.getElementById("react-root");

if (!container) {
  throw new Error("Missing #react-root mount point");
}

debugLog("3.9", "REACT ENTRY → mount point found", {
  elementId: container.id,
});

debugLog("3.9", "REACT ENTRY → React render requested");

debugLog("4.8", "ROUTER → HashRouter enabled");

createRoot(container).render(
  <StrictMode>
    <HashRouter>
      <InvestigationApp />
    </HashRouter>
  </StrictMode>,
);
