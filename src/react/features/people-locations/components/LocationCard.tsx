import type { Location } from "../../../../types.js";

type LocationCardProps = Readonly<{
  location: Location;
}>;

export function LocationCard({ location }: LocationCardProps) {
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
