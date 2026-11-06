const HYPOTHESIS_STORAGE_KEY = "remotion_hypothesis";

export type HypothesisDraft = {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: number;
  explanation: string;
  alternative: string;
};

export type HypothesisSaveResult =
  | Readonly<{ ok: true; savedAt: string }>
  | Readonly<{ ok: false; message: string }>;

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
