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

function setupEventListeners() {
  const navButtons = document.querySelectorAll(".nav-btn");
  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
      const targetView = this.getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  document
    .getElementById("evidenceSearch")
    .addEventListener("input", handleSearchInput);

  document
    .getElementById("filterType")
    .addEventListener("change", renderEvidenceList);
  document
    .getElementById("filterPerson")
    .addEventListener("change", renderEvidenceList);
  document
    .getElementById("filterLocation")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("filterStatus")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("filterRelevance")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("clearFiltersBtn")
    .addEventListener("click", clearFilters);

  document
    .getElementById("timelineOrder")
    .addEventListener("change", renderTimeline);
  document
    .getElementById("timelinePersonFilter")
    .addEventListener("change", renderTimeline);
  document
    .getElementById("timelineLocationFilter")
    .addEventListener("change", renderTimeline);
  document
    .getElementById("timelineTypeFilter")
    .addEventListener("change", renderTimeline);

  document
    .getElementById("hypConfidence")
    .addEventListener("input", (event) => {
      document.getElementById("hypConfidenceValue").textContent =
        event.target.value;
    });
}

function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(function () {
    handleHashChange();
    const firstNote = loadNoteAsync("E01");
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);
