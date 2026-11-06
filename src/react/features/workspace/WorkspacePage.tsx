import type { NotesByEvidenceId } from "../../../shared/persistence.js";
import type { Evidence, Person } from "../../../types.js";
import { BookmarksList } from "./components/BookmarksList.js";
import { HypothesisForm } from "./components/HypothesisForm.js";
import { NotesList } from "./components/NotesList.js";

// Receive shared notes state from parent
type WorkspacePageProps = Readonly<{
  evidence: readonly Evidence[];
  people: readonly Person[];
  bookmarkIds: readonly string[];
  notes: Readonly<NotesByEvidenceId>;
}>;

// Get current shared notes from App through props
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

        // Pass current notes to NotesList for display
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
