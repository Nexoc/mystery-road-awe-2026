import { useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import type { NotesByEvidenceId } from "../../../shared/persistence.js";
import type { Evidence, Location, Person } from "../../../types.js";
import { EvidenceCard } from "./components/EvidenceCard.js";
import { EvidenceDetail } from "./components/EvidenceDetail.js";
import { EvidenceToolbar } from "./components/EvidenceToolbar.js";
import {
  evidenceFiltersReducer,
  getVisibleEvidence,
  initialEvidenceFilters,
  type EvidenceFilterName,
  type EvidenceFilters,
  type EvidenceSortOrder,
} from "./evidenceFilters.js";

// EvidencePage erhält notes + Callback
// ↓
// gibt beides an EvidenceDetail weiter

// 1. notes + Callback von AppRoutes erhalten
// 2. gespeicherte Note für das ausgewählte Evidence lesen
// 3. savedNote + Callback an EvidenceDetail weitergeben
// 4. EvidencePage verändert den State nicht selbst

// Props enthalten den gemeinsamen Notes-State und die Callbacks der übergeordneten Komponenten
type EvidencePageProps = Readonly<{
  evidence: readonly Evidence[];
  people: readonly Person[];
  locations: readonly Location[];
  notes: Readonly<NotesByEvidenceId>;
  onSaveNote: (evidenceId: string, text: string) => void;
}>;

// EvidencePage erhält den gemeinsamen State und die Callbacks über Props von oben
export function EvidencePage({
  evidence,
  people,
  locations,
  notes,
  onSaveNote,
}: EvidencePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, dispatchFilters] = useReducer(
    evidenceFiltersReducer,
    initialEvidenceFilters,
  );

  const visibleEvidence = getVisibleEvidence(evidence, people, filters);
  const selectedEvidenceId = searchParams.get("item");
  const selectedEvidence = selectedEvidenceId
    ? evidence.find((item) => item.id === selectedEvidenceId)
    : undefined;

  const handleFilterChange = <Name extends EvidenceFilterName>(
    name: Name,
    value: EvidenceFilters[Name],
  ) => {
    dispatchFilters({ type: "SET_FILTER", name, value });
  };

  const handleSortChange = (sortOrder: EvidenceSortOrder) => {
    dispatchFilters({ type: "SET_SORT", sortOrder });
  };

  const handleOpenEvidence = (evidenceId: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("item", evidenceId);
    setSearchParams(nextSearchParams);
  };

  const handleCloseEvidence = () => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete("item");
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <section>
      <h2>Evidence Catalogue</h2>

      <p className="hint-text">
        Loaded: {evidence.length} evidence items, {people.length} people and{" "}
        {locations.length} locations.
      </p>

      <EvidenceToolbar
        evidence={evidence}
        people={people}
        locations={locations}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClearFilters={() => dispatchFilters({ type: "CLEAR_FILTERS" })}
      />

      <p className="hint-text">
        Showing {visibleEvidence.length} of {evidence.length} evidence items.
      </p>

      <div className="evidence-grid">
        {visibleEvidence.map((item) => (
          <EvidenceCard
            key={item.id}
            evidence={item}
            onOpen={handleOpenEvidence}
          />
        ))}

        {visibleEvidence.length === 0 && (
          <p>No evidence matches the current filters.</p>
        )}
      </div>

      {/*
      Die gespeicherte Note und der Save-Callback werden an EvidenceDetail weitergegeben.
          EvidencePage verändert den gemeinsamen Notes-State nicht selbst.
          */}
      {selectedEvidence && (
        <EvidenceDetail
          key={selectedEvidence.id}
          evidence={selectedEvidence}
          savedNote={notes[selectedEvidence.id] ?? ""}
          onClose={handleCloseEvidence}
          onSaveNote={onSaveNote}
        />
      )}
    </section>
  );
}
