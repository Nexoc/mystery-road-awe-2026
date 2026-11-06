export function toggleBookmarkId(
  currentIds: readonly string[],
  evidenceId: string,
): string[] {
  const nextIds = currentIds.includes(evidenceId)
    ? currentIds.filter((id) => id !== evidenceId)
    : [...currentIds, evidenceId];

  return nextIds;
}
