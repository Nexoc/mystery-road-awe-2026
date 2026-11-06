import { Link, Navigate, Route, Routes } from "react-router-dom";
import { debugLog } from "../../shared/debug.js";
import type { NotesByEvidenceId } from "../../shared/persistence.js";
import type { InvestigationData } from "../../types.js";
import { DashboardPage } from "../features/dashboard/DashboardPage.js";
import { EvidencePage } from "../features/evidence/EvidencePage.js";
import { KeyIdentityDemo } from "../features/key-identity/KeyIdentityDemo.js";
import { PeopleLocationsLayout } from "../features/people-locations/PeopleLocationsLayout.js";
import { PersonDetailsPage } from "../features/people-locations/PersonDetailsPage.js";
import { LocationsSection } from "../features/people-locations/components/LocationsSection.js";
import { PeopleSection } from "../features/people-locations/components/PeopleSection.js";
import { TimelinePage } from "../features/timeline/TimelinePage.js";
import { WorkspacePage } from "../features/workspace/WorkspacePage.js";

// Props received from App, including shared state and callbacks
type AppRoutesProps = Readonly<{
  data: InvestigationData;
  bookmarkIds: readonly string[];
  onToggleBookmark: (evidenceId: string) => void;
  notes: Readonly<NotesByEvidenceId>;
  onSaveNote: (evidenceId: string, text: string) => void;
}>;

function NotFoundPage() {
  return (
    <section>
      <h2>Page not found</h2>
      <p>The requested route does not exist.</p>
      <Link to="/dashboard">Return to Dashboard</Link>
    </section>
  );
}

// Receive shared notes state and callbacks from App
export function AppRoutes({
  data,
  bookmarkIds,
  onToggleBookmark,
  notes,
  onSaveNote,
}: AppRoutesProps) {
  debugLog("4.8", "ROUTES → route table rendered");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={<DashboardPage data={data} bookmarkIds={bookmarkIds} />}
      />

      <Route
        path="/evidence"
        element={
          // Forward notes state and save callback to EvidencePage
          <EvidencePage
            evidence={data.evidence}
            people={data.people}
            locations={data.locations}
            bookmarkIds={bookmarkIds}
            onToggleBookmark={onToggleBookmark}
            notes={notes}
            onSaveNote={onSaveNote}
          />
        }
      />

      <Route path="/team" element={<PeopleLocationsLayout />}>
        <Route index element={<Navigate to="people" replace />} />

        <Route path="people" element={<PeopleSection people={data.people} />} />

        <Route
          path="people/:personId"
          element={<PersonDetailsPage people={data.people} />}
        />

        <Route
          path="locations"
          element={<LocationsSection locations={data.locations} />}
        />
      </Route>

      <Route
        path="/timeline"
        element={
          <TimelinePage
            events={data.timeline}
            people={data.people}
            locations={data.locations}
          />
        }
      />

      <Route
        path="/workspace"
        element={
          // Pass current notes to Workspace for display
          <WorkspacePage
            evidence={data.evidence}
            people={data.people}
            bookmarkIds={bookmarkIds}
            notes={notes}
          />
        }
      />

      <Route path="/key-demo" element={<KeyIdentityDemo />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
