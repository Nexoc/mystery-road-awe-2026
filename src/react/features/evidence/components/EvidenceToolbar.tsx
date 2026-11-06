import type { Evidence, Location, Person } from "../../../../types.js";

type EvidenceToolbarProps = Readonly<{
  evidence: readonly Evidence[];
  people: readonly Person[];
  locations: readonly Location[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}>;

export function EvidenceToolbar({
  evidence,
  people,
  locations,
  searchTerm,
  onSearchChange,
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
          value={searchTerm}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Search evidence by title, summary, or tag…"
          autoComplete="off"
        />

        <label htmlFor="filterType" className="visually-hidden">
          Filter by type
        </label>
        <select id="filterType" defaultValue="">
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
        <select id="filterPerson" defaultValue="">
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
        <select id="filterLocation" defaultValue="">
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
        <select id="filterStatus" defaultValue="">
          <option value="">All statuses</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>

        <label htmlFor="filterRelevance" className="visually-hidden">
          Filter by relevance
        </label>
        <select id="filterRelevance" defaultValue="">
          <option value="">All relevance</option>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>

        <label htmlFor="sortEvidence" className="visually-hidden">
          Sort evidence
        </label>
        <select id="sortEvidence" defaultValue="date-desc">
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
        </select>

        <button
          type="button"
          className="btn btn-secondary"
          disabled
          title="Filter actions are implemented in later demos"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
