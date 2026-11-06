import { debugLog } from "../../../../shared/debug.js";
import type { NotesByEvidenceId } from "../../../../shared/persistence.js";
import type { Evidence } from "../../../../types.js";

type NotesListProps = Readonly<{
  evidence: readonly Evidence[];
  notes: Readonly<NotesByEvidenceId>;
}>;

export function NotesList({ evidence, notes }: NotesListProps) {
  const noteEntries = evidence.flatMap((item) => {
    const text = notes[item.id];

    return text?.trim() ? [{ evidence: item, text }] : [];
  });

  debugLog("5.6", "NotesList → rendered with updated notes", {
    noteCount: noteEntries.length,
  });

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
