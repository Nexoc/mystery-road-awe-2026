import { debugLog } from "../../../../shared/debug.js";
import type { Location, Person } from "../../../../types.js";

type TimelineFiltersProps = Readonly<{
  people: readonly Person[];
  locations: readonly Location[];
  eventTypes: readonly string[];
  selectedPersonId: string | undefined;
}>;

export function TimelineFilters({
  people,
  locations,
  eventTypes,
  selectedPersonId,
}: TimelineFiltersProps) {
  debugLog("4.10", "TIMELINE FILTERS → visual controls rendered", {
    selectedPersonId,
    peopleCount: people.length,
    locationCount: locations.length,
    eventTypeCount: eventTypes.length,
  });

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <label htmlFor="react-timeline-order" className="visually-hidden">
          Timeline order
        </label>
        <select id="react-timeline-order" defaultValue="asc">
          <option value="asc">Oldest first</option>
          <option value="desc">Newest first</option>
        </select>

        <label htmlFor="react-timeline-person" className="visually-hidden">
          Filter by person
        </label>
        <select
          key={selectedPersonId ?? "all-people"}
          id="react-timeline-person"
          defaultValue={selectedPersonId ?? ""}
        >
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <label htmlFor="react-timeline-location" className="visually-hidden">
          Filter by location
        </label>
        <select id="react-timeline-location" defaultValue="">
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>

        <label htmlFor="react-timeline-type" className="visually-hidden">
          Filter by event type
        </label>
        <select id="react-timeline-type" defaultValue="">
          <option value="">All event types</option>
          {eventTypes.map((eventType) => (
            <option key={eventType} value={eventType}>
              {eventType}
            </option>
          ))}
        </select>
      </div>

      <p className="hint-text timeline-filter-hint">
        The person filter is initialized from the URL. Interactive controls will
        be implemented in Exercise 5.
      </p>
    </div>
  );
}
