import { state } from "../app/state.js";

const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function saveBookmarksToStorage(): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(state.bookmarks));
}

export function loadBookmarksFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    state.bookmarks = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch (err: unknown) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    state.bookmarks = [];
  }
}

export function saveNoteForEvidence(evidenceId: string, text: string): void {
  state.notesStore[evidenceId] = text;

  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(state.notesStore));
}

export function loadNoteForEvidence(evidenceId: string): string {
  return state.notesStore[evidenceId] || "";
}

export function loadNotesFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);

  if (!raw) {
    state.notesStore = {};
    return;
  }

  const parsed: unknown = JSON.parse(raw);

  if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
    state.notesStore = Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } else {
    state.notesStore = {};
  }
}

export function loadNoteAsync(evidenceId: string): Promise<string> {
  return Promise.resolve(state.notesStore[evidenceId] || "");
}
