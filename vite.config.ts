import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// React plugin enables JSX/TSX and Fast Refresh.
// GitHub Pages serves the app from the repository subpath.
export default defineConfig({
  base: "/mystery-road-awe-2026/",
  plugins: [react()],
});
