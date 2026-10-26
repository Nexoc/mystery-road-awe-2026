import type { ReactNode } from "react";
import { debugLog } from "../../../../shared/debug.js";

type ContentPanelProps = Readonly<{
  title: string;
  children: ReactNode;
}>;

export function ContentPanel({ title, children }: ContentPanelProps) {
  debugLog("4.1", "CONTENT PANEL → component rendered", {
    title,
  });

  return (
    <section className="dashboard-panel">
      <h3>{title}</h3>

      {children}
    </section>
  );
}
