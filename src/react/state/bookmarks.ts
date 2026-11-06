import type { Evidence } from "../../types.js";

export function normalizeBookmarkIds(
  bookmarkIds: readonly string[],
  evidence: readonly Evidence[],
): string[] {
  const evidenceIds = new Set(evidence.map((item) => item.id));

  return [...new Set(bookmarkIds)].filter((id) => evidenceIds.has(id));
}

export function toggleBookmarkId(
  currentIds: readonly string[],
  evidenceId: string,
): string[] {
  const nextIds = currentIds.includes(evidenceId)
    ? currentIds.filter((id) => id !== evidenceId)
    : [...currentIds, evidenceId];

  return nextIds;
}
