export type DemoId = `${number}.${number}`;

type DebugFilter = DemoId | "all";
type DebugScope = DemoId | readonly DemoId[];

/*
 * Меняю только эту строку:
 *
 * []                  — debug выключен
 * ["3.9"]             — только Demo 3.9
 * ["3.10"]            — только Demo 3.10
 * ["4.1"]             — только Demo 4.1
 * ["3.9", "3.10"]     — несколько Demo
 * ["all"]             — все логи
 */
const ACTIVE_DEBUG_DEMOS: readonly DebugFilter[] = ["4.10"];

function normalizeScopes(scope: DebugScope): readonly DemoId[] {
  return typeof scope === "string" ? [scope] : scope;
}

function isDebugEnabled(demoIds: readonly DemoId[]): boolean {
  if (ACTIVE_DEBUG_DEMOS.includes("all")) {
    return true;
  }

  return demoIds.some((demoId) => ACTIVE_DEBUG_DEMOS.includes(demoId));
}

export function debugLog(
  scope: DebugScope,
  message: string,
  details?: unknown,
): void {
  const demoIds = normalizeScopes(scope);

  if (!isDebugEnabled(demoIds)) return;

  const label = `[${demoIds.map((demoId) => `Demo ${demoId}`).join(" + ")}]`;

  const badgeStyle = [
    "background: #6d28d9",
    "color: white",
    "font-weight: 700",
    "padding: 2px 6px",
    "border-radius: 4px",
  ].join(";");

  if (details === undefined) {
    console.log(`%c${label}%c ${message}`, badgeStyle, "");
  } else {
    console.log(`%c${label}%c ${message}`, badgeStyle, "", details);
  }
}
