import { state } from "../app/state.js";
import type { Evidence, Location, Person } from "../types.js";

const findById = <T extends { id: string }>(
  items: T[],
  id: string,
): T | null => {
  for (let i = 0; i < items.length; i++) {
    if (items[i]?.id === id) return items[i] ?? null;
  }
  return null;
};

export function findEvidenceById(id: string): Evidence | null {
  return findById(state.allEvidence, id);
}

export function findPersonById(id: string): Person | null {
  return findById(state.allPeople, id);
}

export function findLocationById(id: string): Location | null {
  return findById(state.allLocations, id);
}

export function evidenceMentionsPerson(ev: Evidence, person: Person): boolean {
  if (!ev.personIds) return false;

  return (
    ev.personIds.indexOf(person.id) !== -1 ||
    ev.personIds.indexOf(person.name) !== -1
  );
}

export function formatDate(ts: string | null | undefined): string {
  if (!ts) return "Unknown date";

  const d = new Date(ts);

  if (isNaN(d.getTime())) return ts;

  return (
    d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

export function getStatusBadgeClass(status: string | null | undefined): string {
  const s = (status || "").toLowerCase();

  if (s === "reviewed") return "badge-reviewed";
  if (s === "flagged") return "badge-flagged";

  return "badge-unreviewed";
}

export function getRelevanceBadgeClass(
  relevance: string | null | undefined,
): string {
  const r = (relevance || "").toLowerCase();

  if (r === "relevant") return "badge-relevant";

  return "badge-unreviewed";
}
