import { Link, Navigate, Route, Routes } from "react-router-dom";
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

// App
// ↓
// AppRoutes
// ↓
// EvidencePage

// 1. notes + Callback von App erhalten
// 2. notes + Callback an EvidencePage weitergeben
// 3. notes an WorkspacePage weitergeben
// 4. AppRoutes verändert den State nicht selbst

// Props von App: gemeinsamer State sowie Callbacks für Änderungen
type AppRoutesProps = Readonly<{
  data: InvestigationData;
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

// AppRoutes erhält den gemeinsamen Notes-State und die Callbacks von App
export function AppRoutes({ data, notes, onSaveNote }: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<DashboardPage data={data} />} />

      {/* Notes-State und Save-Callback werden unverändert an EvidencePage weitergegeben */}
      <Route
        path="/evidence"
        element={
          <EvidencePage
            evidence={data.evidence}
            people={data.people}
            locations={data.locations}
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

      {/* Der aktuelle Notes-State wird an WorkspacePage weitergegeben,
          damit die gespeicherten Notes dort angezeigt werden können */}
      <Route
        path="/workspace"
        element={
          <WorkspacePage
            evidence={data.evidence}
            people={data.people}
            notes={notes}
          />
        }
      />

      <Route path="/key-demo" element={<KeyIdentityDemo />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
