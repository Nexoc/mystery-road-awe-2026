import { debugLog } from "../../../shared/debug.js";
import { formatDate } from "../../../shared/utils.js";
import type { TimelineEvent } from "../../../types.js";

type TimelineEventCardProps = Readonly<{
  event: TimelineEvent;
}>;

export function TimelineEventCard({ event, }: TimelineEventCardProps) {
  debugLog("4.3", "TIMELINE ITEM → component rendered", {
    eventId: event.id,
    title: event.title,
  });

  return (
    <article
      className={`timeline-event certainty-${event.certainty}`}
    >
      <div className="timeline-time">
        {formatDate(event.time)} &middot; {event.certainty}
      </div>

      <h3>{event.title}</h3>

      <p>{event.description}</p>
    </article>
  );
}