import { state } from "../../app/state.js";
import {
  loadNoteForEvidence,
  saveBookmarksToStorage,
  saveNoteForEvidence,
} from "../../shared/storage.js";
import {
  evidenceMentionsPerson,
  findEvidenceById,
  findLocationById,
  findPersonById,
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
} from "../../shared/utils.js";
import type { Evidence } from "../../types.js";

let evidenceViewLoading = true;
let latestSearchRequestId = 0;

export function finishEvidenceLoading(): void {
  evidenceViewLoading = false;
}

export function populateEvidenceDropdowns(): void {
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  if (
    !(typeSelect instanceof HTMLSelectElement) ||
    !(personSelect instanceof HTMLSelectElement) ||
    !(locationSelect instanceof HTMLSelectElement)
  ) {
    return;
  }

  const types: string[] = [];
  for (const evidence of state.allEvidence) {
    const t = evidence.type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (const type of types) {
    typeSelect.innerHTML +=
      '<option value="' + type + '">' + type + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of state.allPeople) {
    personSelect.innerHTML +=
      '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const location of state.allLocations) {
    locationSelect.innerHTML +=
      '<option value="' +
      location.id +
      '">' +
      location.id +
      " - " +
      location.name +
      "</option>";
  }
}

function getSelectValue(id: string): string {
  const select = document.getElementById(id);
  return select instanceof HTMLSelectElement ? select.value : "";
}

function getFilteredEvidence(): Evidence[] {
  const searchBox = document.getElementById("evidenceSearch");
  const searchTerm =
    searchBox instanceof HTMLInputElement
      ? searchBox.value.toLowerCase().trim()
      : "";
  const typeVal = getSelectValue("filterType");
  const personVal = getSelectValue("filterPerson");
  const locationVal = getSelectValue("filterLocation");
  const statusVal = getSelectValue("filterStatus");
  const relevanceVal = getSelectValue("filterRelevance");

  const results: Evidence[] = [];
  for (const item of state.allEvidence) {
    let matches = true;

    if (searchTerm) {
      const haystack = (
        item.title +
        " " +
        item.summary +
        " " +
        item.tags.join(" ")
      ).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal)
      matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds.indexOf(locationVal) === -1)
      matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal)
      matches = false;
    if (
      matches &&
      relevanceVal &&
      (item.relevance || "").toLowerCase() !== relevanceVal
    )
      matches = false;

    if (matches) results.push(item);
  }

  return results;
}

export function renderEvidenceList(): void {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  let results = getFilteredEvidence();
  results = sortEvidence(results);
  state.filteredEvidence = results;

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (const evidence of results) {
    html += renderEvidenceCardHTML(evidence);
  }
  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener("click", handleEvidenceListClick);
}

function sortEvidence(items: Evidence[]): Evidence[] {
  const sortValue = getSelectValue("sortEvidence");
  const sortedItems = items.slice();

  if (sortValue === "title-asc") {
    sortedItems.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === "title-desc") {
    sortedItems.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === "date-asc") {
    sortedItems.sort(function (a, b) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } else {
    sortedItems.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  return sortedItems;
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = state.bookmarks.indexOf(ev.id) !== -1;
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html +=
    '<span class="badge ' +
    getStatusBadgeClass(ev.status) +
    '">' +
    ev.status +
    "</span>";
  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(ev.relevance) +
    '">' +
    ev.relevance +
    "</span>";
  html += "<div>";
  for (const tag of ev.tags) {
    html += '<span class="tag-chip">' + tag + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

function handleEvidenceListClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.action === "bookmark") {
    event.stopPropagation();
    const evidenceId = target.dataset.id;
    if (evidenceId) handleBookmarkClick(evidenceId);
    return;
  }

  const card = target.closest(".evidence-card");
  if (card) {
    const evidenceId = card.getAttribute("data-id");
    if (evidenceId) openEvidenceDetail(evidenceId);
  }
}

function handleBookmarkClick(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (state.bookmarks.indexOf(evidenceId) === -1) {
    state.bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    state.bookmarks = state.bookmarks.filter(function (id) {
      return id !== evidenceId;
    });
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (state.currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags(): void {
  for (const evidence of state.allEvidence) {
    evidence.bookmarked = state.bookmarks.indexOf(evidence.id) !== -1;
  }
}

export function handleSortChange(): void {
  renderEvidenceList();
}

function clearControlValue(id: string): void {
  const control = document.getElementById(id);
  if (
    control instanceof HTMLInputElement ||
    control instanceof HTMLSelectElement
  ) {
    control.value = "";
  }
}

export function clearFilters(): void {
  clearControlValue("evidenceSearch");
  clearControlValue("filterType");
  clearControlValue("filterPerson");
  clearControlValue("filterLocation");
  clearControlValue("filterStatus");
  clearControlValue("filterRelevance");
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise(function (resolve: (value: string) => void) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

export function handleSearchInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const term = target.value;
  const requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(function () {
    // Only apply this response if nothing newer has been typed meanwhile.
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}

export function openEvidenceDetail(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  const section = document.getElementById("evidenceDetailSection");
  if (!section) return;
  section.classList.remove("hidden");

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function closeEvidenceDetail(): void {
  const section = document.getElementById("evidenceDetailSection");
  if (!section) return;
  section.classList.add("hidden");
  section.innerHTML = "";
}

function renderEvidenceDetail(ev: Evidence): void {
  const section = document.getElementById("evidenceDetailSection");
  if (!section) return;

  const personNames: string[] = [];
  for (const personId of ev.personIds) {
    const person = findPersonById(personId);
    personNames.push(person ? person.name : personId);
  }

  const locationNames: string[] = [];
  for (const locationId of ev.locationIds) {
    const loc = findLocationById(locationId);
    locationNames.push(loc ? loc.id + " - " + loc.name : locationId);
  }

  let tagsHtml = "";
  for (const tag of ev.tags) {
    tagsHtml += '<span class="tag-chip">' + tag + "</span>";
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";
  html +=
    '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';
  html += "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html +=
      '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html +=
    '<div class="detail-field"><strong>Summary</strong>' +
    ev.summary +
    "</div>";
  html += '<div class="evidence-detail-content">' + ev.content + "</div>";
  html +=
    '<div class="detail-field"><strong>Related people</strong>' +
    personNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");
  html += statusOptionHTML(ev.status, "flagged", "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");
  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");
  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    storedNote +
    "</textarea>";
  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';
  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    storedNote +
    "</div></div>";

  section.innerHTML = html;

  const statusSelect = document.getElementById("detailStatusSelect");
  if (statusSelect instanceof HTMLSelectElement) {
    statusSelect.addEventListener("change", function (event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      ev.status = target.value; // direct mutation of the loaded evidence object
      renderEvidenceDetail(ev);
      if (state.viewRendered.evidence) renderEvidenceList();
    });
  }

  const relevanceSelect = document.getElementById("detailRelevanceSelect");
  if (relevanceSelect instanceof HTMLSelectElement) {
    relevanceSelect.addEventListener("change", function (event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      ev.relevance = target.value;
      renderEvidenceDetail(ev);
      if (state.viewRendered.evidence) renderEvidenceList();
    });
  }
}

function statusOptionHTML(
  current: string,
  value: string,
  label: string,
): string {
  const currentLower = (current || "").toLowerCase();
  const selected = currentLower === value ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

export function saveCurrentNote(): void {
  const textarea = document.getElementById("evidenceNoteInput");
  if (!(textarea instanceof HTMLTextAreaElement)) return;
  const evidenceId = textarea.getAttribute("data-evidence-id"); // note id is read back off the DOM
  if (!evidenceId) return;
  const text = textarea.value;
  saveNoteForEvidence(evidenceId, text);
  const preview = document.getElementById("notePreview");
  if (preview) preview.innerHTML = text; // unsafe on purpose, see above
}
