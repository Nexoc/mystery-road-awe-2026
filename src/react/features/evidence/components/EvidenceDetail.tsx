import type { FormEvent } from "react";
import { useState } from "react";
import { debugLog } from "../../../../shared/debug.js";
import type { Evidence } from "../../../../types.js";

// EvidenceDetail erhält das ausgewählte Evidence, die gespeicherte Note und den Save-Callback vom Parent
type EvidenceDetailProps = Readonly<{
  evidence: Evidence;
  savedNote: string;
  onClose: () => void;
  onSaveNote: (evidenceId: string, text: string) => void;
}>;

export function EvidenceDetail({
  evidence,
  savedNote,
  onClose,
  onSaveNote,
}: EvidenceDetailProps) {
  // Lokaler Draft-State: Änderungen beim Tippen werden zunächst nur hier gespeichert
  const [draftNote, setDraftNote] = useState(savedNote);

  // Beim Absenden wird der Parent über den Callback aufgefordert, den aktuellen Draft zu speichern
  const handleNoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    debugLog("5.6", "EvidenceDetail → save requested", {
      evidenceId: evidence.id,
      noteLength: draftNote.length,
    });

    // Das Child verändert den Parent-State nicht direkt, sondern fordert die Änderung über den Callback an
    onSaveNote(evidence.id, draftNote);
  };

  return (
    <section
      className="evidence-detail"
      aria-labelledby="evidence-detail-title"
    >
      <div className="evidence-detail-header">
        <div>
          <h2 id="evidence-detail-title">{evidence.title}</h2>

          <div className="evidence-meta">
            {evidence.id} · {evidence.type} · {evidence.timestamp}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {evidence.tags.includes("critical") && (
        <div className="warning-banner">
          This item is tagged as critical evidence.
        </div>
      )}

      <div className="detail-field">
        <strong>Summary</strong>
        {evidence.summary}
      </div>

      <div className="evidence-detail-content">{evidence.content}</div>

      <div className="detail-field">
        <strong>Tags</strong>

        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      {/* Controlled Input: Beim Tippen wird nur der lokale draftNote-State geändert.
          Der gemeinsame Notes-State in App bleibt zunächst unverändert. */}
      <form className="detail-field" onSubmit={handleNoteSubmit}>
        <label htmlFor={`evidence-note-${evidence.id}`}>
          <strong>Investigator note</strong>
        </label>

        <textarea
          id={`evidence-note-${evidence.id}`}
          name="note"
          className="note-textarea"
          rows={3}
          value={draftNote}
          onChange={(event) => setDraftNote(event.currentTarget.value)}
          placeholder="Add a private note about this evidence..."
        />

        {/* Beim Absenden wird handleNoteSubmit ausgeführt und damit die Callback-Kette gestartet */}
        <button
          type="submit"
          className="btn btn-primary btn-small"
          style={{ marginTop: 6 }}
        >
          Save note
        </button>
      </form>

      {/* Zeigt die gespeicherte Note aus dem gemeinsamen State in App.
          Dieser Wert wird nach dem State-Update neu über Props geliefert. */}
      <div className="detail-field" aria-live="polite">
        <strong>Saved note preview</strong>
        <div>{savedNote || "No saved note yet."}</div>
      </div>
    </section>
  );
}
