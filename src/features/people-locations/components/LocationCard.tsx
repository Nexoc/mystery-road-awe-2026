import { debugLog } from "../../../shared/debug.js";
import type { Location } from "../../../types.js";

type LocationCardProps = Readonly<{
  location: Location;
}>;

export function LocationCard({ location }: LocationCardProps) {
  debugLog("4.1", "LOCATION CARD → component rendered", {
    locationId: location.id,
    locationName: location.name,
  });

  return (
    <article className="location-card">
      <h3>{location.name}</h3>

      <p>{location.description}</p>

      <p>
        <strong>Contains:</strong> {location.contains.join(", ")}
      </p>
    </article>
  );
}
