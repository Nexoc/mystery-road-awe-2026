import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "success" | "warning" | "critical";

type BadgeProps = Readonly<{
  tone: BadgeTone;
  children: ReactNode;
}>;

const badgeClassByTone: Readonly<Record<BadgeTone, string>> = {
  neutral: "badge-unreviewed",
  success: "badge-reviewed",
  warning: "badge-flagged",
  critical: "badge-critical",
};

export function Badge({ tone, children }: BadgeProps) {
  const toneClass = badgeClassByTone[tone];

  return <span className={`badge ${toneClass}`}>{children}</span>;
}
