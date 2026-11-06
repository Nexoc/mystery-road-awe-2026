import type { FormEvent } from "react";
import { useState } from "react";
import { debugLog } from "../../../../shared/debug.js";
import type { Evidence } from "../../../../types.js";

// Receive selected evidence, saved note and save callback from parent
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

  // Local draft state for editing before save
  const [draftNote, setDraftNote] = useState(savedNote);

  // Request the parent to save the current draft
  const handleNoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    debugLog("5.6", "EvidenceDetail → save requested", {
      evidenceId: evidence.id,
      noteLength: draftNote.length,
    });

    // Child requests a state change via the callback
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

      // Controlled textarea updates only the local draft
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

        // Submit the draft and trigger the callback chain
        <button
          type="submit"
          className="btn btn-primary btn-small"
          style={{ marginTop: 6 }}
        >
          Save note
        </button>
      </form>

        // Display the saved shared state received from App
      <div className="detail-field" aria-live="polite">
        <strong>Saved note preview</strong>
        <div>{savedNote || "No saved note yet."}</div>
      </div>
    </section>
  );
}
