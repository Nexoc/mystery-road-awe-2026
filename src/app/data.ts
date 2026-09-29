import { renderDashboard } from "../modules/dashboard/dashboard.js";
import {
  applyStoredBookmarkFlags,
  finishEvidenceLoading,
  populateEvidenceDropdowns,
  renderEvidenceList,
} from "../modules/evidence/evidence.js";
import {
  populateTimelineDropdowns,
  renderTimeline,
} from "../modules/timeline/timeline.js";
import { populateHypothesisDropdowns } from "../modules/workspace/workspace.js";
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../types.js";
import { state } from "./state.js";

let loadingStepsRemaining = 2;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isCaseData(value: unknown): value is CaseData {
  if (!isRecord(value)) return false;

  return (
    typeof value.caseId === "string" &&
    typeof value.title === "string" &&
    typeof value.subtitle === "string" &&
    typeof value.status === "string" &&
    typeof value.opened === "string" &&
    typeof value.summary === "string" &&
    typeof value.location === "string" &&
    typeof value.leadInvestigator === "string" &&
    typeof value.notes === "string"
  );
}

function isPerson(value: unknown): value is Person {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.role === "string" &&
    typeof value.speciality === "string" &&
    isStringArray(value.responsibilities) &&
    typeof value.statement === "string" &&
    typeof value.background === "string" &&
    typeof value.avatar === "string"
  );
}

function isLocation(value: unknown): value is Location {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    isStringArray(value.contains)
  );
}

function isEvidence(value: unknown): value is Evidence {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    typeof value.title === "string" &&
    typeof value.timestamp === "string" &&
    typeof value.summary === "string" &&
    typeof value.content === "string" &&
    isStringArray(value.personIds) &&
    isStringArray(value.locationIds) &&
    isStringArray(value.tags) &&
    typeof value.status === "string" &&
    typeof value.relevance === "string"
  );
}

function isTimelineEvent(value: unknown): value is TimelineEvent {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.time === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.type === "string" &&
    typeof value.certainty === "string" &&
    isStringArray(value.personIds) &&
    isStringArray(value.locationIds) &&
    isStringArray(value.evidenceIds)
  );
}

function isPersonArray(value: unknown): value is Person[] {
  return Array.isArray(value) && value.every(isPerson);
}

function isLocationArray(value: unknown): value is Location[] {
  return Array.isArray(value) && value.every(isLocation);
}

function isEvidenceArray(value: unknown): value is Evidence[] {
  return Array.isArray(value) && value.every(isEvidence);
}

function isTimelineEventArray(value: unknown): value is TimelineEvent[] {
  return Array.isArray(value) && value.every(isTimelineEvent);
}

async function readJson(response: Response): Promise<unknown> {
  const data: unknown = await response.json();
  return data;
}

function showLoadingOverlay(message: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = message;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep(): void {
  loadingStepsRemaining--;
  if (loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

function populateAllDropdowns(): void {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

async function loadCorePeopleAndLocations(): Promise<void> {
  const caseRes = await fetch("data/case.json");
  const caseJson = await readJson(caseRes);
  if (!isCaseData(caseJson)) throw new TypeError("Invalid data/case.json");
  state.caseData = caseJson;

  const peopleRes = await fetch("data/people.json");
  const peopleJson = await readJson(peopleRes);
  if (!isPersonArray(peopleJson))
    throw new TypeError("Invalid data/people.json");
  state.allPeople = peopleJson;

  const locationsRes = await fetch("data/locations.json");
  const locationsJson = await readJson(locationsRes);
  if (!isLocationArray(locationsJson)) {
    throw new TypeError("Invalid data/locations.json");
  }
  state.allLocations = locationsJson;

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

function loadEvidenceData(): Promise<void> {
  return fetch("data/evidence.json")
    .then(readJson)
    .then(function (data) {
      if (!isEvidenceArray(data)) {
        throw new TypeError("Invalid data/evidence.json");
      }

      state.allEvidence = data;
      applyStoredBookmarkFlags();
      state.filteredEvidence = state.allEvidence.slice(); // shallow copy [demo 2]
      finishEvidenceLoading();
      renderDashboard();
      populateAllDropdowns();
      if (state.currentPage === "evidence") renderEvidenceList();
    })
    .catch(function (error: unknown) {
      console.error("Failed to load evidence.json", error);
      alert("Evidence could not be loaded. Some views may be incomplete.");
    });
}

async function loadTimelineData(): Promise<void> {
  try {
    const response = await fetch("data/timeline.json");
    const data = await readJson(response);
    if (!isTimelineEventArray(data)) {
      throw new TypeError("Invalid data/timeline.json");
    }

    state.allTimeline = data;
    renderDashboard();
    if (state.currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (error: unknown) {
    console.log("timeline load error", error);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");
  loadingStepsRemaining = 2;

  await loadCorePeopleAndLocations();
  // Wait for all feature data before the initial render.
  await Promise.all([loadEvidenceData(), loadTimelineData()]);
}
