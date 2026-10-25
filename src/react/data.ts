import { debugLog } from "../shared/debug.js";
import type {
  CaseData,
  Evidence,
  InvestigationData,
  Location,
  Person,
  TimelineEvent,
} from "../types.js";

const BOOKMARKS_STORAGE_KEY = "remotion_bookmarks";

type Validator<T> = (value: unknown) => value is T;

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
    typeof value.relevance === "string" &&
    (value.bookmarked === undefined || typeof value.bookmarked === "boolean")
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

function isEvidenceArray(value: unknown): value is Evidence[] {
  return Array.isArray(value) && value.every(isEvidence);
}

function isPersonArray(value: unknown): value is Person[] {
  return Array.isArray(value) && value.every(isPerson);
}

function isLocationArray(value: unknown): value is Location[] {
  return Array.isArray(value) && value.every(isLocation);
}

function isTimelineEventArray(value: unknown): value is TimelineEvent[] {
  return Array.isArray(value) && value.every(isTimelineEvent);
}

async function loadJson<T>(
  fileName: string,
  validator: Validator<T>,
): Promise<T> {
  const url = `${import.meta.env.BASE_URL}data/${fileName}`;

  debugLog("3.10", "DATA → request started", {
    fileName,
    url,
  });

  const response = await fetch(url);

  debugLog("3.10", "DATA → response received", {
    fileName,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new Error(`Could not load ${fileName}: ${response.status}`);
  }

  const value: unknown = await response.json();

  if (!validator(value)) {
    throw new TypeError(`Invalid data/${fileName}`);
  }

  debugLog("3.10", "DATA → JSON validated", {
    fileName,
    itemCount: Array.isArray(value) ? value.length : 1,
  });

  return value;
}

function loadBookmarkIds(): string[] {
  try {
    const rawValue = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : [];
    const bookmarkIds = Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];

    debugLog("3.10", "STORAGE → bookmarks read", {
      bookmarkCount: bookmarkIds.length,
    });

    return bookmarkIds;
  } catch (error: unknown) {
    debugLog("3.10", "STORAGE → invalid bookmarks ignored", {
      reason: error instanceof Error ? error.message : String(error),
    });

    return [];
  }
}

export async function loadInvestigationData(): Promise<InvestigationData> {
  debugLog("3.10", "DATA → dashboard data loading started");

  const [caseData, evidence, people, locations, timeline] = await Promise.all([
    loadJson("case.json", isCaseData),
    loadJson("evidence.json", isEvidenceArray),
    loadJson("people.json", isPersonArray),
    loadJson("locations.json", isLocationArray),
    loadJson("timeline.json", isTimelineEventArray),
  ]);

  const bookmarkIds = loadBookmarkIds();
  const data: InvestigationData = {
    caseData,
    evidence,
    people,
    locations,
    timeline,
    bookmarkIds,
  };

  debugLog("3.10", "DATA → all dashboard data ready", {
    caseId: caseData.caseId,
    evidenceCount: evidence.length,
    peopleCount: people.length,
    locationCount: locations.length,
    timelineCount: timeline.length,
    bookmarkCount: bookmarkIds.length,
  });

  return data;
}
