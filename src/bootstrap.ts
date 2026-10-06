const params = new URLSearchParams(window.location.search);
const isReactMode = params.get("react") === "1";

const vanillaRoot = document.getElementById("vanilla-root");
const reactRoot = document.getElementById("react-root");

if (!vanillaRoot || !reactRoot) {
  throw new Error("Missing application mount point");
}

vanillaRoot.hidden = isReactMode;
reactRoot.hidden = !isReactMode;

if (isReactMode) {
  await import("./react/main.js");
} else {
  await import("./main.js");
}
