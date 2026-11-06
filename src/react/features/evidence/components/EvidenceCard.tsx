import type { KeyboardEvent, MouseEvent } from "react";
import type { Evidence } from "../../../../types.js";

type EvidenceCardProps = Readonly<{
  evidence: Evidence;
  isBookmarked: boolean;
  onOpen: (evidenceId: string) => void;
  onToggleBookmark: (evidenceId: string) => void;
}>;

export function EvidenceCard({
  evidence,
  isBookmarked,
  onToggleBookmark,
  onOpen,
}: EvidenceCardProps) {
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(evidence.id);
    }
  };

  const handleBookmarkClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleBookmark(evidence.id);
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
        className={isBookmarked ? "bookmark-btn active" : "bookmark-btn"}
        aria-label={`Toggle bookmark for ${evidence.title}`}
        aria-pressed={isBookmarked}
        onClick={handleBookmarkClick}
      >
        <span className="bookmark-icon" aria-hidden="true">
          {isBookmarked ? "★" : "☆"}
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
