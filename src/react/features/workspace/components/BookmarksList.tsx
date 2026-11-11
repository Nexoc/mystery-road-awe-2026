import { Link } from "react-router-dom";
import type { Evidence } from "../../../../types.js";
import { useBookmarks } from "../../../state/BookmarkContext.js";

type BookmarksListProps = Readonly<{
  evidence: readonly Evidence[];
}>;

export function BookmarksList({ evidence }: BookmarksListProps) {
  const { isBookmarked } = useBookmarks();
  const bookmarkedEvidence = evidence.filter((item) => isBookmarked(item.id));

  if (bookmarkedEvidence.length === 0) {
    return (
      <p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>
    );
  }

  return (
    <>
      {bookmarkedEvidence.map((item) => (
        <div className="mini-list-item" key={item.id}>
          <strong>{item.id}</strong> &mdash; {item.title}{" "}
          <Link
            className="btn btn-small btn-secondary"
            to={`/evidence?item=${encodeURIComponent(item.id)}`}
          >
            Open
          </Link>
        </div>
      ))}
    </>
  );
}
