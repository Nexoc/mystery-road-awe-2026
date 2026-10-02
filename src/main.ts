import { loadAllData } from "./app/data.js";
import { handleHashChange, navigateTo } from "./app/navigation.js";
import {
  clearFilters,
  closeEvidenceDetail,
  handleSearchInput,
  handleSortChange,
  renderEvidenceList,
  saveCurrentNote,
} from "./modules/evidence/evidence.js";
import { switchPeopleTab } from "./modules/people/people.js";
import { renderTimeline } from "./modules/timeline/timeline.js";
import { saveHypothesis } from "./modules/workspace/workspace.js";
import {
  loadBookmarksFromStorage,
  loadNoteAsync,
  loadNotesFromStorage,
} from "./shared/storage.js";

// Compatibility bridge for the existing inline handlers.
window.navigateTo = navigateTo;
window.handleSortChange = handleSortChange;
window.switchPeopleTab = switchPeopleTab;
window.saveHypothesis = saveHypothesis;
window.closeEvidenceDetail = closeEvidenceDetail;
window.saveCurrentNote = saveCurrentNote;

function getRequiredElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing required element #${id}`);
  return element;
}

function setupEventListeners(): void {
  const navButtons = document.querySelectorAll<HTMLButtonElement>(".nav-btn");
  for (const navButton of navButtons) {
    navButton.addEventListener("click", function (this: HTMLButtonElement) {
      const targetView = this.getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  getRequiredElement("evidenceSearch").addEventListener(
    "input",
    handleSearchInput,
  );

  getRequiredElement("filterType").addEventListener(
    "change",
    renderEvidenceList,
  );
  getRequiredElement("filterPerson").addEventListener(
    "change",
    renderEvidenceList,
  );
  getRequiredElement("filterLocation").addEventListener(
    "change",
    renderEvidenceList,
  );
  getRequiredElement("filterStatus").addEventListener(
    "change",
    renderEvidenceList,
  );
  getRequiredElement("filterRelevance").addEventListener(
    "change",
    renderEvidenceList,
  );

  getRequiredElement("clearFiltersBtn").addEventListener("click", clearFilters);

  getRequiredElement("timelineOrder").addEventListener(
    "change",
    renderTimeline,
  );
  getRequiredElement("timelinePersonFilter").addEventListener(
    "change",
    renderTimeline,
  );
  getRequiredElement("timelineLocationFilter").addEventListener(
    "change",
    renderTimeline,
  );
  getRequiredElement("timelineTypeFilter").addEventListener(
    "change",
    renderTimeline,
  );

  getRequiredElement("hypConfidence").addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    getRequiredElement("hypConfidenceValue").textContent = event.target.value;
  });
}

function initApp(): void {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(function () {
    handleHashChange();
    const firstNote = loadNoteAsync(101);
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);
