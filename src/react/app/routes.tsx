import { Link, Navigate, Route, Routes } from "react-router-dom";
import { debugLog } from "../../shared/debug.js";
import type { InvestigationData } from "../../types.js";
import { DashboardPage } from "../features/dashboard/DashboardPage.js";
import { KeyIdentityDemo } from "../features/key-identity/KeyIdentityDemo.js";
import { PeopleLocationsLayout } from "../features/people-locations/PeopleLocationsLayout.js";
import { PersonDetailsPage } from "../features/people-locations/PersonDetailsPage.js";
import { LocationsSection } from "../features/people-locations/components/LocationsSection.js";
import { PeopleSection } from "../features/people-locations/components/PeopleSection.js";
import { TimelinePage } from "../features/timeline/TimelinePage.js";

type AppRoutesProps = Readonly<{
  data: InvestigationData;
}>;

type PlaceholderPageProps = Readonly<{
  title: string;
  description: string;
}>;

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section>
      <h2>{title}</h2>

      <div className="intro-card">
        <p>{description}</p>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section>
      <h2>Page not found</h2>
      <p>The requested route does not exist.</p>
      <Link to="/dashboard">Return to Dashboard</Link>
    </section>
  );
}

export function AppRoutes({ data }: AppRoutesProps) {
  debugLog("4.8", "ROUTES → route table rendered");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<DashboardPage data={data} />} />

      <Route
        path="/evidence"
        element={
          <PlaceholderPage
            title="Evidence Catalogue"
            description="The Evidence view will be migrated in Exercise 5."
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
          <PlaceholderPage
            title="Investigator Workspace"
            description="The Workspace view will be migrated in Exercise 5."
          />
        }
      />

      <Route path="/key-demo" element={<KeyIdentityDemo />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
