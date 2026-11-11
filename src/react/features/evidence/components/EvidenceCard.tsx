import type { KeyboardEvent, MouseEvent } from "react";
import { debugLog } from "../../../../shared/debug.js";
import type { Evidence } from "../../../../types.js";
import { useBookmarks } from "../../../state/BookmarkContext.js";

type EvidenceCardProps = Readonly<{
  evidence: Evidence;
  onOpen: (evidenceId: string) => void;
}>;

export function EvidenceCard({ evidence, onOpen }: EvidenceCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(evidence.id);

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(evidence.id);
    }
  };

  const handleBookmarkClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    debugLog("5.6", "EvidenceCard → bookmark toggle requested", {
      evidenceId: evidence.id,
    });

    toggleBookmark(evidence.id);
  };

  return (
    <article
      className="evidence-card"
      role="button"
      tabIndex={0}
      aria-label={`Open ${evidence.title}`}
      onClick={() => onOpen(evidence.id)}
      onKeyDown={handleCardKeyDown}
    >
      <button
        type="button"
        className={bookmarked ? "bookmark-btn active" : "bookmark-btn"}
        aria-label={`Toggle bookmark for ${evidence.title}`}
        aria-pressed={bookmarked}
        onClick={handleBookmarkClick}
      >
        <span className="bookmark-icon" aria-hidden="true">
          {bookmarked ? "★" : "☆"}
        </span>
      </button>

      <h3>{evidence.title}</h3>

      <div className="evidence-meta">
        {evidence.id} · {evidence.type}
      </div>

      <div className="evidence-summary">{evidence.summary}</div>

      <div>
        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
