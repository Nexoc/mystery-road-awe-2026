import { readFile } from "node:fs/promises";

const dataFileUrls = Object.freeze({
  case: new URL("../public/data/case.json", import.meta.url),
  evidence: new URL("../public/data/evidence.json", import.meta.url),
  people: new URL("../public/data/people.json", import.meta.url),
  locations: new URL("../public/data/locations.json", import.meta.url),
  timeline: new URL("../public/data/timeline.json", import.meta.url),
});

async function readJson(fileUrl) {
  const json = await readFile(fileUrl, "utf8");
  return JSON.parse(json);
}

export async function loadDataStore() {
  const entries = await Promise.all(
    Object.entries(dataFileUrls).map(async ([resource, fileUrl]) => [
      resource,
      await readJson(fileUrl),
    ]),
  );

  return Object.freeze(Object.fromEntries(entries));
}
