import { Link, useSearchParams } from "react-router-dom";
import { debugLog } from "../../../shared/debug.js";

type KeyDemoItem = Readonly<{
  id: string;
  name: string;
}>;

const keyDemoItems: readonly KeyDemoItem[] = [
  { id: "alpha", name: "Alpha" },
  { id: "bravo", name: "Bravo" },
  { id: "charlie", name: "Charlie" },
];

export function KeyIdentityDemo() {
  const [searchParams] = useSearchParams();
  const isReversed = searchParams.get("order") === "reverse";
  const visibleItems = isReversed ? [...keyDemoItems].reverse() : keyDemoItems;
  const nextUrl = isReversed ? "/key-demo" : "/key-demo?order=reverse";

  debugLog("4.4", "KEY DEMO → list rendered with array-index keys", {
    order: isReversed ? "reverse" : "normal",
    visibleIds: visibleItems.map((item) => item.id),
    keyStrategy: "array index (intentionally wrong)",
  });

  return (
    <section>
      <h2>Demo 4.4 — Key Identity</h2>

      <div className="key-demo-warning">
        <strong>Intentionally broken version:</strong> this list currently uses{" "}
        <code>key={"{index}"}</code> so that the identity bug is visible.
      </div>

      <ol className="key-demo-steps">
        <li>Change the value in the Alpha input.</li>
        <li>Click Reverse order without reloading the page.</li>
        <li>
          Notice that the edited value stays in position 1, although Charlie is
          now shown there.
        </li>
      </ol>

      <div className="key-demo-toolbar">
        <span>
          Current order: <strong>{isReversed ? "reverse" : "normal"}</strong>
        </span>

        <Link
          className="nav-btn key-demo-action"
          to={nextUrl}
          onClick={() => {
            debugLog("4.4", "KEY DEMO → order change requested", {
              from: isReversed ? "reverse" : "normal",
              to: isReversed ? "normal" : "reverse",
            });
          }}
        >
          {isReversed ? "Restore normal order" : "Reverse order"}
        </Link>
      </div>

      <div className="key-demo-list">
        {visibleItems.map((item, index) => (
          <div
            // Correct final version: key={item.id}
            // Intentionally wrong for the first half of Demo 4.4.
            key={index}
            className="key-demo-row"
          >
            <div className="key-demo-position">Position {index + 1}</div>

            <label htmlFor={`key-demo-${item.id}`}>
              Record: <strong>{item.name}</strong>
            </label>

            <input
              id={`key-demo-${item.id}`}
              className="key-demo-input"
              defaultValue={item.name}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
