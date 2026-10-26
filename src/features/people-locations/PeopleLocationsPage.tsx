import { debugLog } from "../../shared/debug.js";
import type { Location, Person } from "../../types.js";
import { LocationsSection } from "./components/LocationsSection.js";
import { PeopleSection } from "./components/PeopleSection.js";

type PeopleLocationsPageProps = Readonly<{
  people: readonly Person[];
  locations: readonly Location[];
}>;

export function PeopleLocationsPage({
  people,
  locations,
}: PeopleLocationsPageProps) {
  debugLog(
    "4.5",
    "FEATURE → PeopleLocationsPage composing sections",
    {
      peopleCount: people.length,
      locationsCount: locations.length,
    },
  );

  return (
    <section>
      <h2>People &amp; Locations</h2>

      <PeopleSection people={people} />

      <LocationsSection locations={locations} />
    </section>
  );
}