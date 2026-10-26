import { debugLog } from "../../../../shared/debug.js";
import type { Location } from "../../../../types.js";
import { ContentPanel } from "./ContentPanel.js";
import { LocationCard } from "./LocationCard.js";

type LocationsSectionProps = Readonly<{
  locations: readonly Location[];
}>;

export function LocationsSection({ locations }: LocationsSectionProps) {
  const hasLocations = locations.length > 0;

  debugLog(
    ["4.2", "4.5"],
    "LOCATIONS SECTION → presentational component rendered",
    {
      locationsCount: locations.length,
      hasLocations,
    },
  );

  return (
    <ContentPanel title={`Locations (${locations.length})`}>
      {hasLocations ? (
        <div className="locations-grid">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      ) : (
        <p>No locations available.</p>
      )}
    </ContentPanel>
  );
}
