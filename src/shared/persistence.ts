const BOOKMARKS_STORAGE_KEY = "remotion_bookmarks";
const HYPOTHESIS_STORAGE_KEY = "remotion_hypothesis";
const NOTES_STORAGE_KEY = "remotion_notes";

export type HypothesisDraft = {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: number;
  explanation: string;
  alternative: string;
};

export type NotesByEvidenceId = Record<string, string>;

export type HypothesisSaveResult =
  | Readonly<{ ok: true; savedAt: string }>
  | Readonly<{ ok: false; message: string }>;

export type PersistenceWriteResult =
  Readonly<{ ok: true }> | Readonly<{ ok: false; message: string }>;

export function createEmptyHypothesisDraft(): HypothesisDraft {
  return {
    suspectId: "",
    nature: "",
    evidenceIds: [],
    confidence: 50,
    explanation: "",
    alternative: "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readBookmarkIds(): string[] {
  try {
    const rawValue = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : [];

    if (!Array.isArray(parsedValue)) return [];

    return [
      ...new Set(
        parsedValue.filter((item): item is string => typeof item === "string"),
      ),
    ];
  } catch (error: unknown) {
    console.warn("Could not read stored bookmarks.", error);
    return [];
  }
}

export function readNotes(): NotesByEvidenceId {
  try {
    const rawValue = localStorage.getItem(NOTES_STORAGE_KEY);

    if (!rawValue) return {};

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isRecord(parsedValue)) return {};

    return Object.fromEntries(
      Object.entries(parsedValue).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch (error: unknown) {
    console.warn("Could not read stored notes.", error);
    return {};
  }
}

export function writeBookmarkIds(
  bookmarkIds: readonly string[],
): PersistenceWriteResult {
  try {
    localStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify([...new Set(bookmarkIds)]),
    );

    return { ok: true };
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "Unknown error";

    return {
      ok: false,
      message: `Bookmarks changed for this session but could not be saved: ${reason}`,
    };
  }
}

export function writeNotes(
  notes: Readonly<NotesByEvidenceId>,
): PersistenceWriteResult {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));

    return { ok: true };
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "Unknown error";

    return {
      ok: false,
      message: `Notes changed for this session but could not be saved: ${reason}`,
    };
  }
}

function isHypothesisDraft(value: unknown): value is HypothesisDraft {
  if (!isRecord(value)) return false;

  return (
    typeof value.suspectId === "string" &&
    typeof value.nature === "string" &&
    Array.isArray(value.evidenceIds) &&
    value.evidenceIds.every((id) => typeof id === "string") &&
    typeof value.confidence === "number" &&
    Number.isFinite(value.confidence) &&
    value.confidence >= 0 &&
    value.confidence <= 100 &&
    typeof value.explanation === "string" &&
    typeof value.alternative === "string"
  );
}

export function readHypothesisDraft(): HypothesisDraft {
  try {
    const rawValue = localStorage.getItem(HYPOTHESIS_STORAGE_KEY);

    if (!rawValue) return createEmptyHypothesisDraft();

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isHypothesisDraft(parsedValue)) {
      console.warn("Invalid hypothesis draft was ignored.");
      return createEmptyHypothesisDraft();
    }

    return {
      ...parsedValue,
      evidenceIds: [...parsedValue.evidenceIds],
    };
  } catch (error: unknown) {
    console.warn("Could not read the hypothesis draft.", error);
    return createEmptyHypothesisDraft();
  }
}

export function writeHypothesisDraft(
  draft: HypothesisDraft,
): HypothesisSaveResult {
  const savedAt = new Date().toISOString();

  try {
    localStorage.setItem(
      HYPOTHESIS_STORAGE_KEY,
      JSON.stringify({
        ...draft,
        evidenceIds: [...draft.evidenceIds],
        savedAt,
      }),
    );

    return { ok: true, savedAt };
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "Unknown error";

    return {
      ok: false,
      message: `The draft is updated for this session but could not be saved: ${reason}`,
    };
  }
}
