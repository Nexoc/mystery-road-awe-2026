import { debugLog } from "../../../../shared/debug.js";
import { formatDate } from "../../../../shared/utils.js";
import type { TimelineEvent } from "../../../../types.js";
import { Badge, type BadgeTone } from "../../../shared/components/Badge.js";

type TimelineEventCardProps = Readonly<{
  event: TimelineEvent;
}>;

function getCertaintyTone(certainty: string): BadgeTone {
  if (certainty === "confirmed") return "success";
  if (certainty === "reported") return "warning";
  if (certainty === "contradictory") return "critical";

  return "neutral";
}

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  debugLog("4.3", "TIMELINE ITEM → component rendered", {
    eventId: event.id,
    title: event.title,
  });

  const certaintyTone = getCertaintyTone(event.certainty);

  debugLog("4.7", "TIMELINE → certainty mapped to badge tone", {
    eventId: event.id,
    certainty: event.certainty,
    certaintyTone,
  });

  return (
    <article className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)} &middot;{" "}
        <Badge tone={certaintyTone}>{event.certainty}</Badge>
      </div>

      <h3>{event.title}</h3>

      <p>{event.description}</p>
    </article>
  );
}
