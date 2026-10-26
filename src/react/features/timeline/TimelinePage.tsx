import { Link, useSearchParams } from "react-router-dom";
import { debugLog } from "../../../shared/debug.js";
import type { Location, Person, TimelineEvent } from "../../../types.js";
import { TimelineEventCard } from "./components/TimelineEventCard.js";
import { TimelineFilters } from "./components/TimelineFilters.js";

type TimelinePageProps = Readonly<{
  events: readonly TimelineEvent[];
  people: readonly Person[];
  locations: readonly Location[];
}>;

export function TimelinePage({ events, people, locations }: TimelinePageProps) {
  const [searchParams] = useSearchParams();
  const rawPersonId = searchParams.get("person");
  const requestedPersonId = rawPersonId?.trim() ?? "";
  const selectedPerson =
    requestedPersonId === ""
      ? undefined
      : people.find((person) => person.id === requestedPersonId);
  const hasInvalidPersonFilter =
    requestedPersonId !== "" && selectedPerson === undefined;
  const visibleEvents = selectedPerson
    ? events.filter((event) => event.personIds.includes(selectedPerson.id))
    : events;
  const eventTypes = Array.from(
    new Set(events.map((event) => event.type)),
  ).sort((first, second) => first.localeCompare(second));
  const hasEvents = visibleEvents.length > 0;

  debugLog("4.3", "TIMELINE LIST → collection received", {
    eventCount: events.length,
    eventIds: events.map((event) => event.id),
  });

  debugLog("4.10", "QUERY PARAM → Timeline person filter resolved", {
    rawPersonId,
    requestedPersonId,
    selectedPersonId: selectedPerson?.id,
    hasInvalidPersonFilter,
    totalEventCount: events.length,
    visibleEventIds: visibleEvents.map((event) => event.id),
  });

  return (
    <section>
      <h2>Investigation Timeline</h2>

      <TimelineFilters
        people={people}
        locations={locations}
        eventTypes={eventTypes}
        selectedPersonId={selectedPerson?.id}
      />

      {hasInvalidPersonFilter && (
        <div className="timeline-filter-message timeline-filter-warning">
          Unknown person filter: <strong>{requestedPersonId}</strong>. Showing
          all events.
        </div>
      )}

      {selectedPerson && (
        <div className="timeline-filter-message timeline-filter-summary">
          <span>
            Showing {visibleEvents.length} of {events.length} events for{" "}
            <strong>{selectedPerson.name}</strong>.
          </span>
          <Link to="/timeline">Show all events</Link>
        </div>
      )}

      {hasEvents ? (
        <div className="timeline-container">
          {/*
            1. events — весь массив событий.
            2. map берёт из массива одно событие за раз.
            3. Текущее событие называется event.
            4. Для него создаётся TimelineEventCard.
            5. event передаётся в карточку как prop.
            6. key содержит стабильный ID для React.
            7. map возвращает массив React-компонентов.
            */}
          {visibleEvents.map((event) => (
            <TimelineEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No timeline events match the selected person.</p>
      )}
    </section>
  );
}
