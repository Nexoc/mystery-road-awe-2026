import { navigateTo } from "../../app/navigation.js";
import { state } from "../../app/state.js";
import { STORAGE_KEY_HYPOTHESIS } from "../../shared/storage.js";
import { openEvidenceDetail } from "../evidence/evidence.js";

interface HypothesisDraft {
  suspectId?: string;
  nature?: string;
  evidenceIds?: string[];
  confidence?: string | number;
  explanation?: string;
  alternative?: string;
  savedAt?: string;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isHypothesisDraft(value: unknown): value is HypothesisDraft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const draft = value as Record<string, unknown>;
  return (
    isOptionalString(draft.suspectId) &&
    isOptionalString(draft.nature) &&
    (draft.evidenceIds === undefined ||
      (Array.isArray(draft.evidenceIds) &&
        draft.evidenceIds.every((id) => typeof id === "string"))) &&
    (draft.confidence === undefined ||
      typeof draft.confidence === "string" ||
      typeof draft.confidence === "number") &&
    isOptionalString(draft.explanation) &&
    isOptionalString(draft.alternative) &&
    isOptionalString(draft.savedAt)
  );
}

export function renderWorkspace(): void {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList(): void {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarkedItems = state.allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (const ev of bookmarkedItems) {
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll("[data-open-evidence]");
  for (const button of openButtons) {
    button.addEventListener("click", function (event) {
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      const id = target.getAttribute("data-open-evidence");
      if (!id) return;

      navigateTo("evidence");
      setTimeout(function () {
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

function renderNotesList(): void {
  const container = document.getElementById("notesList");
  if (!container) return;

  const noteEntries: Array<{
    index: number;
    evidenceId: string;
    title: string;
    text: string;
  }> = [];
  for (const [index, evidence] of state.allEvidence.entries()) {
    const note = state.notesStore[evidence.id];
    if (note) {
      noteEntries.push({
        index,
        evidenceId: evidence.id,
        title: evidence.title,
        text: note,
      });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML =
      "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (const entry of noteEntries) {
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;
    html +=
      '<div id="noteText-' + entry.index + '">' + entry.text + "</div></div>"; // unsafe innerHTML rendering, same as the note preview
  }
  container.innerHTML = html;
}

export function populateHypothesisDropdowns(): void {
  const suspectSelect = document.getElementById("hypSuspect");
  const evidenceSelect = document.getElementById("hypEvidence");
  if (
    !(suspectSelect instanceof HTMLSelectElement) ||
    !(evidenceSelect instanceof HTMLSelectElement)
  ) {
    return;
  }

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (const person of state.allPeople) {
    suspectSelect.innerHTML +=
      '<option value="' + person.id + '">' + person.name + "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  for (const evidence of state.allEvidence) {
    evidenceSelect.innerHTML +=
      '<option value="' +
      evidence.id +
      '">' +
      evidence.id +
      " - " +
      evidence.title +
      "</option>";
  }
}

export function saveHypothesis(): void {
  const suspectSelect = document.getElementById("hypSuspect");
  const natureInput = document.getElementById("hypNature");
  const evidenceSelect = document.getElementById("hypEvidence");
  const confidenceInput = document.getElementById("hypConfidence");
  const explanationInput = document.getElementById("hypExplanation");
  const alternativeInput = document.getElementById("hypAlternative");
  if (
    !(suspectSelect instanceof HTMLSelectElement) ||
    !(natureInput instanceof HTMLSelectElement) ||
    !(evidenceSelect instanceof HTMLSelectElement) ||
    !(confidenceInput instanceof HTMLInputElement) ||
    !(explanationInput instanceof HTMLTextAreaElement) ||
    !(alternativeInput instanceof HTMLTextAreaElement)
  ) {
    return;
  }

  const draft: HypothesisDraft = {
    suspectId: suspectSelect.value,
    nature: natureInput.value,
    evidenceIds: getSelectedOptions(evidenceSelect),
    confidence: confidenceInput.value,
    explanation: explanationInput.value,
    alternative: alternativeInput.value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = document.getElementById("hypothesisSavedMsg");
  if (!msg) return;

  msg.classList.remove("hidden");
  setTimeout(function () {
    msg.classList.add("hidden");
  }, 2000);
}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  const result: string[] = [];
  for (const option of selectEl.options) {
    if (option.selected) result.push(option.value);
  }
  return result;
}

function loadHypothesisFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (err) {
    console.warn("Invalid hypothesis data was ignored.", err);
    return;
  }

  if (!isHypothesisDraft(parsed)) {
    console.warn("Invalid hypothesis data was ignored.");
    return;
  }

  const suspectSelect = document.getElementById("hypSuspect");
  const natureInput = document.getElementById("hypNature");
  const confidenceInput = document.getElementById("hypConfidence");
  const confidenceValue = document.getElementById("hypConfidenceValue");
  const explanationInput = document.getElementById("hypExplanation");
  const alternativeInput = document.getElementById("hypAlternative");
  const evidenceSelect = document.getElementById("hypEvidence");
  if (
    !(suspectSelect instanceof HTMLSelectElement) ||
    !(natureInput instanceof HTMLSelectElement) ||
    !(confidenceInput instanceof HTMLInputElement) ||
    !confidenceValue ||
    !(explanationInput instanceof HTMLTextAreaElement) ||
    !(alternativeInput instanceof HTMLTextAreaElement) ||
    !(evidenceSelect instanceof HTMLSelectElement)
  ) {
    return;
  }

  const draft = parsed;
  const confidence = String(draft.confidence || 50);
  suspectSelect.value = draft.suspectId || "";
  natureInput.value = draft.nature || "";
  confidenceInput.value = confidence;
  confidenceValue.textContent = confidence;
  explanationInput.value = draft.explanation || "";
  alternativeInput.value = draft.alternative || "";

  const savedIds = draft.evidenceIds || [];
  for (const option of evidenceSelect.options) {
    option.selected = savedIds.indexOf(option.value) !== -1;
  }
}
