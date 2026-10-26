import { debugLog } from "../../../shared/debug.js";
import type { TimelineEvent } from "../../../types.js";
import { TimelineEventCard } from "./components/TimelineEventCard.js";

type TimelinePageProps = Readonly<{
  events: readonly TimelineEvent[];
}>;

export function TimelinePage({ events }: TimelinePageProps) {
  const hasEvents = events.length > 0;

  debugLog("4.3", "TIMELINE LIST → collection received", {
    eventCount: events.length,
    eventIds: events.map((event) => event.id),
  });

  return (
    <section>
      <h2>Investigation Timeline</h2>

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
          {events.map((event) => (
            <TimelineEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>No timeline events available.</p>
      )}
    </section>
  );
}
