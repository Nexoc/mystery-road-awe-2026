import express from "express";
import { loadDataStore } from "./dataStore.js";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 3001;
const MAX_DELAY_MS = 10_000;

function parsePort(rawPort) {
  if (rawPort === undefined) return DEFAULT_PORT;

  if (!/^\d+$/.test(rawPort)) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  const port = Number(rawPort);

  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function parseDelay(rawDelay) {
  if (rawDelay === undefined) return 0;
  if (typeof rawDelay !== "string" || !/^\d+$/.test(rawDelay)) return null;

  const delay = Number(rawDelay);

  return Number.isSafeInteger(delay) && delay <= MAX_DELAY_MS ? delay : null;
}

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function applySimulationControls(request, response, next) {
  const delay = parseDelay(request.query.delay);

  if (delay === null) {
    response.status(400).json({
      error: `delay must be an integer between 0 and ${MAX_DELAY_MS}`,
    });
    return;
  }

  if (delay > 0) {
    await wait(delay);
  }

  if (request.query.fail === "1") {
    response.status(500).json({ error: "Simulated backend failure" });
    return;
  }

  next();
}

async function startServer() {
  const port = parsePort(process.env.PORT);
  const dataStore = await loadDataStore();
  const app = express();

  app.disable("x-powered-by");

  app.use("/api", (_request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
  });

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true });
  });

  for (const [resource, data] of Object.entries(dataStore)) {
    app.get(
      `/api/${resource}`,
      applySimulationControls,
      (_request, response) => {
        response.json(data);
      },
    );
  }

  app.use("/api", (_request, response) => {
    response.status(404).json({ error: "API endpoint not found" });
  });

  app.use((error, _request, response, _next) => {
    console.error("Backend request failed.", error);
    response.status(500).json({ error: "Internal server error" });
  });

  app.listen(port, HOST, () => {
    console.log(`Exercise 6 API listening on http://${HOST}:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Could not start Exercise 6 API.", error);
  process.exitCode = 1;
});
