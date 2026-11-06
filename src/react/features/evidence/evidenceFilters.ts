import type { Evidence, Person } from "../../../types.js";

export type EvidenceSortOrder =
  "date-desc" | "date-asc" | "title-asc" | "title-desc";

export type EvidenceFilters = Readonly<{
  searchTerm: string;
  type: string;
  personId: string;
  locationId: string;
  status: string;
  relevance: string;
  sortOrder: EvidenceSortOrder;
}>;

export type EvidenceFilterName = keyof EvidenceFilters;

export const initialEvidenceFilters: EvidenceFilters = {
  searchTerm: "",
  type: "",
  personId: "",
  locationId: "",
  status: "",
  relevance: "",
  sortOrder: "date-desc",
};

function matchesPerson(
  evidence: Evidence,
  personId: string,
  people: readonly Person[],
): boolean {
  if (!personId) return true;

  const person = people.find((candidate) => candidate.id === personId);

  if (!person) return false;

  return evidence.personIds.some(
    (value) => value === person.id || value === person.name,
  );
}

function getTimestamp(timestamp: string): number {
  const value = new Date(timestamp).getTime();

  return Number.isNaN(value) ? 0 : value;
}

export function getVisibleEvidence(
  evidence: readonly Evidence[],
  people: readonly Person[],
  filters: EvidenceFilters,
): Evidence[] {
  const normalizedSearchTerm = filters.searchTerm.trim().toLowerCase();

  const filteredEvidence = evidence.filter((item) => {
    const searchableText = [
      item.id,
      item.type,
      item.title,
      item.summary,
      ...item.tags,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!normalizedSearchTerm ||
        searchableText.includes(normalizedSearchTerm)) &&
      (!filters.type || item.type.toLowerCase() === filters.type) &&
      matchesPerson(item, filters.personId, people) &&
      (!filters.locationId || item.locationIds.includes(filters.locationId)) &&
      (!filters.status || item.status.toLowerCase() === filters.status) &&
      (!filters.relevance || item.relevance.toLowerCase() === filters.relevance)
    );
  });

  const sortedEvidence = [...filteredEvidence];

  sortedEvidence.sort((first, second) => {
    switch (filters.sortOrder) {
      case "date-asc":
        return getTimestamp(first.timestamp) - getTimestamp(second.timestamp);
      case "title-asc":
        return first.title.localeCompare(second.title);
      case "title-desc":
        return second.title.localeCompare(first.title);
      case "date-desc":
      default:
        return getTimestamp(second.timestamp) - getTimestamp(first.timestamp);
    }
  });

  return sortedEvidence;
}
