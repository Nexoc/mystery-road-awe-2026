import type { NotesByEvidenceId } from "../../../shared/persistence.js";
import type { Evidence, Person } from "../../../types.js";
import { BookmarksList } from "./components/BookmarksList.js";
import { HypothesisForm } from "./components/HypothesisForm.js";
import { NotesList } from "./components/NotesList.js";

/*

WorkspacePage erhält notes
↓
gibt sie an NotesList weiter

App
↓
AppRoutes
↓
WorkspacePage
↓
NotesList


1. notes von AppRoutes erhalten
2. notes an NotesList weitergeben
3. WorkspacePage verändert den State nicht selbst
4. Workspace zeigt nur die aktuellen gespeicherten Notes an

*/


// WorkspacePage erhält den gemeinsamen Notes-State von der übergeordneten Komponente
type WorkspacePageProps = Readonly<{
  evidence: readonly Evidence[];
  people: readonly Person[];
  bookmarkIds: readonly string[];
  notes: Readonly<NotesByEvidenceId>;
}>;

// Der aktuelle Notes-State wird über Props bis zu WorkspacePage weitergegeben
export function WorkspacePage({
  evidence,
  people,
  bookmarkIds,
  notes,
}: WorkspacePageProps) {
  return (
    <section>
      <h2>Investigator Workspace</h2>

      <div className="workspace-grid">
        <div className="workspace-col">
          <h3>Bookmarked Evidence</h3>
          <div className="bookmarks-list">
            <BookmarksList evidence={evidence} bookmarkIds={bookmarkIds} />
          </div>
        </div>

        {/*

        Der aktuelle Notes-State wird an NotesList weitergegeben.
        WorkspacePage verändert die Notes nicht, sondern reicht sie nur zur Anzeige weiter.
        */}

        <div className="workspace-col">
          <h3>Personal Notes</h3>
          <p className="hint-text">
            Notes are attached to the selected item in the Evidence view.
          </p>

          <div className="notes-list">
            <NotesList evidence={evidence} notes={notes} />
          </div>
        </div>
      </div>

      <HypothesisForm people={people} evidence={evidence} />
    </section>
  );
}
