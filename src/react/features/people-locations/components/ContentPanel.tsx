import type { ReactNode } from "react";

type ContentPanelProps = Readonly<{
  title: string;
  children: ReactNode;
}>;

export function ContentPanel({ title, children }: ContentPanelProps) {
  return (
    <section className="dashboard-panel">
      <h3>{title}</h3>

      {children}
    </section>
  );
}
