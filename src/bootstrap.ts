import { debugLog } from "./shared/debug.js";

const params = new URLSearchParams(window.location.search);
const isReactMode = params.get("react") === "1";

debugLog("3.9", "BOOTSTRAP → URL inspected", {
  search: window.location.search,
  hash: window.location.hash,
  isReactMode,
});

const vanillaRoot = document.getElementById("vanilla-root");
const reactRoot = document.getElementById("react-root");

if (!vanillaRoot || !reactRoot) {
  throw new Error("Missing application mount point");
}

vanillaRoot.hidden = isReactMode;
reactRoot.hidden = !isReactMode;

debugLog("3.9", "BOOTSTRAP → application root selected", {
  vanillaRootHidden: vanillaRoot.hidden,
  reactRootHidden: reactRoot.hidden,
});

if (isReactMode) {
  debugLog("3.9", "BOOTSTRAP → loading React entry point");
  await import("./react/main.js");
} else {
  await import("./main.js");
}
