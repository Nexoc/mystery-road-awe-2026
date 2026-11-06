import { debugLog } from "../../../../shared/debug.js";
import type { NotesByEvidenceId } from "../../../../shared/persistence.js";
import type { Evidence } from "../../../../types.js";

// Receive evidence data and current shared notes
type NotesListProps = Readonly<{
  evidence: readonly Evidence[];
  notes: Readonly<NotesByEvidenceId>;
}>;

// Build a list of evidence items that have a saved note
export function NotesList({ evidence, notes }: NotesListProps) {
  const noteEntries = evidence.flatMap((item) => {
    const text = notes[item.id];

    return text?.trim() ? [{ evidence: item, text }] : [];
  });

  // Show in console that NotesList rendered with current notes
  debugLog("5.6", "NotesList → rendered with updated notes", {
    noteCount: noteEntries.length,
  });

  // Show a fallback message when no notes exist
  if (noteEntries.length === 0) {
    return <p>No notes yet. Add one from an evidence detail view.</p>;
  }

  return (
    <>
      {noteEntries.map((entry) => (
        <div className="mini-list-item" key={entry.evidence.id}>
          <strong>{entry.evidence.id}</strong> &mdash; {entry.evidence.title}
          <div>{entry.text}</div>
        </div>
      ))}
    </>
  );
}
