import { useEffect, useState } from "react";
import { debugLog } from "../../../shared/debug.js";

export function EffectLifecycleDemo() {
  const [count, setCount] = useState(0);
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    debugLog("6.2", "Effect without dependency array ran", {
      count,
      renderTick,
    });
  });

  useEffect(() => {
    debugLog("6.2", "Effect with empty dependency array ran");
  }, []);

  useEffect(() => {
    debugLog("6.2", "Effect with count dependency ran", { count });
  }, [count]);

  return (
    <section>
      <h2>Demo 6.2 — Effect Dependencies</h2>

      <p className="hint-text">
        Open the browser Console and compare which effects run after each
        button.
      </p>

      <div className="dashboard-panel">
        <p>
          Tracked count: <strong>{count}</strong>
        </p>
        <p>
          Unrelated render tick: <strong>{renderTick}</strong>
        </p>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setCount((currentCount) => currentCount + 1)}
          >
            Increment tracked count
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setRenderTick((currentTick) => currentTick + 1)}
          >
            Trigger unrelated render
          </button>
        </div>
      </div>
    </section>
  );
}
