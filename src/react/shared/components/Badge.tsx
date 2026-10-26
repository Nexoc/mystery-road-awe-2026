import type { ReactNode } from "react";
import { debugLog } from "../../../shared/debug.js";

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

  debugLog("4.7", "BADGE → shared component rendered", {
    tone,
    toneClass,
  });

  return <span className={`badge ${toneClass}`}>{children}</span>;
}
