var STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
var STORAGE_KEY_NOTES = "remotion_notes";
var STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function writeBookmarks(bookmarks) {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function readBookmarks() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    var parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    return [];
  }
}

export function writeNotes(notes) {
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
}

export function readNotes() {
  var raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) return {};
  return JSON.parse(raw);
}

export function writeHypothesis(draft) {
  localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
}

export function readHypothesis() {
  var raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return undefined;
  return JSON.parse(raw);
}
