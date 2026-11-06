import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Evidence, Location, Person } from "../../../types.js";
import { toggleBookmarkId } from "./bookmarkState.js";
import { EvidenceCard } from "./components/EvidenceCard.js";
import { EvidenceDetail } from "./components/EvidenceDetail.js";
import { EvidenceToolbar } from "./components/EvidenceToolbar.js";

type EvidencePageProps = Readonly<{
  evidence: readonly Evidence[];
  people: readonly Person[];
  locations: readonly Location[];
  initialBookmarkIds: readonly string[];
}>;

type NotesByEvidenceId = Record<string, string>;

export function EvidencePage({
  evidence,
  people,
  locations,
  initialBookmarkIds,
}: EvidencePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [bookmarkIds, setBookmarkIds] = useState<string[]>([
    ...initialBookmarkIds,
  ]);
  const [notes, setNotes] = useState<NotesByEvidenceId>({});
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleEvidence = normalizedSearchTerm
    ? evidence.filter((item) => {
        const searchableText = [item.title, item.summary, ...item.tags]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearchTerm);
      })
    : evidence;

  const selectedEvidenceId = searchParams.get("item");

  const selectedEvidence = selectedEvidenceId
    ? evidence.find((item) => item.id === selectedEvidenceId)
    : undefined;

  const handleToggleBookmark = (evidenceId: string) => {
    setBookmarkIds((currentIds) => toggleBookmarkId(currentIds, evidenceId));
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

  const handleSaveNote = (evidenceId: string, text: string) => {
    setNotes((currentNotes) => ({
      ...currentNotes,
      [evidenceId]: text,
    }));
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
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="evidence-grid">
        {visibleEvidence.map((item) => (
          <EvidenceCard
            key={item.id}
            evidence={item}
            isBookmarked={bookmarkIds.includes(item.id)}
            onOpen={handleOpenEvidence}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}

        {visibleEvidence.length === 0 && (
          <p>No evidence matches the current search.</p>
        )}
      </div>

      {selectedEvidence && (
        <EvidenceDetail
          key={selectedEvidence.id}
          evidence={selectedEvidence}
          savedNote={notes[selectedEvidence.id] ?? ""}
          onClose={handleCloseEvidence}
          onSaveNote={handleSaveNote}
        />
      )}
    </section>
  );
}
