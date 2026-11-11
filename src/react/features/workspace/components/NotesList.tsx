import { debugLog } from "../../../../shared/debug.js";
import type { NotesByEvidenceId } from "../../../../shared/persistence.js";
import type { Evidence } from "../../../../types.js";

/*
NotesList erhält die aktuellen notes
↓
filtert vorhandene Notes
↓
rendert sie im Workspace

1. notes + Evidence-Daten von WorkspacePage erhalten
2. nur Evidence mit gespeicherten Notes auswählen
3. gespeicherte Notes im Workspace anzeigen
4. NotesList verändert den State nicht selbst

*/

// NotesList erhält die Evidence-Daten und den aktuellen gemeinsamen Notes-State
type NotesListProps = Readonly<{
  evidence: readonly Evidence[];
  notes: Readonly<NotesByEvidenceId>;
}>;

// Liste aller Evidence-Elemente erzeugen, für die eine gespeicherte Note vorhanden ist
export function NotesList({ evidence, notes }: NotesListProps) {
  const noteEntries = evidence.flatMap((item) => {
    const text = notes[item.id];

    return text?.trim() ? [{ evidence: item, text }] : [];
  });

  // Im Console-Log sichtbar machen, dass NotesList mit dem aktuellen Notes-State neu gerendert wurde
  debugLog("5.6", "NotesList → rendered with updated notes", {
    noteCount: noteEntries.length,
  });

  // Hinweis anzeigen, wenn noch keine gespeicherten Notes vorhanden sind
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
