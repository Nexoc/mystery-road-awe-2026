import type { Evidence, Location, Person } from "../../../../types.js";
import type {
  EvidenceFilterName,
  EvidenceFilters,
  EvidenceSortOrder,
} from "../evidenceFilters.js";

type EvidenceToolbarProps = Readonly<{
  evidence: readonly Evidence[];
  people: readonly Person[];
  locations: readonly Location[];
  filters: EvidenceFilters;
  onFilterChange: <Name extends EvidenceFilterName>(
    name: Name,
    value: EvidenceFilters[Name],
  ) => void;
  onSortChange: (sortOrder: EvidenceSortOrder) => void;
  onClearFilters: () => void;
}>;

export function EvidenceToolbar({
  evidence,
  people,
  locations,
  filters,
  onFilterChange,
  onSortChange,
  onClearFilters,
}: EvidenceToolbarProps) {
  const evidenceTypes = [
    ...new Set(evidence.map((item) => item.type.toLowerCase())),
  ].sort();

  return (
    <div className="toolbar" aria-label="Evidence filters">
      <div className="toolbar-row">
        <label htmlFor="evidenceSearch" className="visually-hidden">
          Search evidence
        </label>
        <input
          type="text"
          id="evidenceSearch"
          value={filters.searchTerm}
          onChange={(event) =>
            onFilterChange("searchTerm", event.currentTarget.value)
          }
          placeholder="Search evidence by title, summary, or tag…"
          autoComplete="off"
        />

        <label htmlFor="filterType" className="visually-hidden">
          Filter by type
        </label>
        <select
          id="filterType"
          value={filters.type}
          onChange={(event) =>
            onFilterChange("type", event.currentTarget.value)
          }
        >
          <option value="">All types</option>
          {evidenceTypes.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="filterPerson" className="visually-hidden">
          Filter by person
        </label>
        <select
          id="filterPerson"
          value={filters.personId}
          onChange={(event) =>
            onFilterChange("personId", event.currentTarget.value)
          }
        >
          <option value="">All people</option>
          {people.map((person) => (
            <option value={person.id} key={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <label htmlFor="filterLocation" className="visually-hidden">
          Filter by location
        </label>
        <select
          id="filterLocation"
          value={filters.locationId}
          onChange={(event) =>
            onFilterChange("locationId", event.currentTarget.value)
          }
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option value={location.id} key={location.id}>
              {location.id} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-row">
        <label htmlFor="filterStatus" className="visually-hidden">
          Filter by status
        </label>
        <select
          id="filterStatus"
          value={filters.status}
          onChange={(event) =>
            onFilterChange("status", event.currentTarget.value)
          }
        >
          <option value="">All statuses</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>

        <label htmlFor="filterRelevance" className="visually-hidden">
          Filter by relevance
        </label>
        <select
          id="filterRelevance"
          value={filters.relevance}
          onChange={(event) =>
            onFilterChange("relevance", event.currentTarget.value)
          }
        >
          <option value="">All relevance</option>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>

        <label htmlFor="sortEvidence" className="visually-hidden">
          Sort evidence
        </label>
        <select
          id="sortEvidence"
          value={filters.sortOrder}
          onChange={(event) =>
            onSortChange(event.currentTarget.value as EvidenceSortOrder)
          }
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
        </select>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
