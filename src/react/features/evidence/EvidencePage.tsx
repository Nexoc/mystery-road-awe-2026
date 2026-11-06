import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { NotesByEvidenceId } from "../../../shared/persistence.js";
import type { Evidence, Location, Person } from "../../../types.js";
import { EvidenceCard } from "./components/EvidenceCard.js";
import { EvidenceDetail } from "./components/EvidenceDetail.js";
import { EvidenceToolbar } from "./components/EvidenceToolbar.js";
import {
  getVisibleEvidence,
  initialEvidenceFilters,
  type EvidenceFilterName,
  type EvidenceFilters,
} from "./evidenceFilters.js";

// Receive shared notes state and callbacks from parent components
type EvidencePageProps = Readonly<{
  evidence: readonly Evidence[];
  people: readonly Person[];
  locations: readonly Location[];
  bookmarkIds: readonly string[];
  onToggleBookmark: (evidenceId: string) => void;
  notes: Readonly<NotesByEvidenceId>;
  onSaveNote: (evidenceId: string, text: string) => void;
}>;

// Get shared state and callbacks from App through props
export function EvidencePage({
  evidence,
  people,
  locations,
  bookmarkIds,
  onToggleBookmark,
  notes,
  onSaveNote,
}: EvidencePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<EvidenceFilters>(
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
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
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
        onClearFilters={() => setFilters(initialEvidenceFilters)}
      />

      <p className="hint-text">
        Showing {visibleEvidence.length} of {evidence.length} evidence items.
      </p>

      <div className="evidence-grid">
        {visibleEvidence.map((item) => (
          <EvidenceCard
            key={item.id}
            evidence={item}
            isBookmarked={bookmarkIds.includes(item.id)}
            onOpen={handleOpenEvidence}
            onToggleBookmark={onToggleBookmark}
          />
        ))}

        {visibleEvidence.length === 0 && (
          <p>No evidence matches the current filters.</p>
        )}
      </div>

      {selectedEvidence && (
        // Pass the saved note and save callback down to EvidenceDetail
        <EvidenceDetail
          key={selectedEvidence.id}
          evidence={selectedEvidence}

          // Read the saved note for the currently selected evidence
          savedNote={notes[selectedEvidence.id] ?? ""}
          onClose={handleCloseEvidence}

          // Forward the save callback to EvidenceDetail
          onSaveNote={onSaveNote}
        />
      )}
    </section>
  );
}
