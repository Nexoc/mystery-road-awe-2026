import { debugLog } from "../../shared/debug.js";
import type { Location, Person } from "../../types.js";
import { ContentPanel } from "./components/ContentPanel.js";
import { LocationCard } from "./components/LocationCard.js";
import { PersonCard } from "./components/PersonCard.js";

type PeopleLocationsPageProps = Readonly<{
  people: readonly Person[];
  locations: readonly Location[];
}>;

export function PeopleLocationsPage({
  people,
  locations,
}: PeopleLocationsPageProps) {
  const hasPeople = people.length > 0;
  debugLog("4.2", "CONDITIONAL → people list evaluated", {
    peopleCount: people.length,
    hasPeople,
  });

  const hasLocations = locations.length > 0;
  debugLog("4.2", "CONDITIONAL → locations list evaluated", {
    locationsCount: locations.length,
    hasLocations,
  });

  debugLog("4.1", "PEOPLE & LOCATIONS PAGE → component rendered", {
    peopleCount: people.length,
    locationsCount: locations.length,
  });

  return (
    <section>
      <h2>People &amp; Locations</h2>

      <ContentPanel title={`People (${people.length})`}>
        {hasPeople ? (
          <div className="people-grid">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <p>No people available.</p>
        )}
      </ContentPanel>

      <ContentPanel title={`Locations (${locations.length})`}>
        {hasLocations ? (
          <div className="locations-grid">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
              />
            ))}
          </div>
        ) : (
          <p>No locations available.</p>
        )}
      </ContentPanel>

    </section>
  );
}
