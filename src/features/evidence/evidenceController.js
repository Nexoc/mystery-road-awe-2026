import { createEvidenceModel } from "./evidenceModel.js";
import { createEvidenceView } from "./evidenceView.js";

export function createEvidenceController(dependencies) {
  var model = createEvidenceModel();
  var view = createEvidenceView();

  function populateEvidenceDropdowns() {
    if (!view.hasFilterDropdowns()) return;
    view.populateDropdowns(model.getFilterOptions());
  }

  function renderEvidenceList() {
    if (!view.hasListContainer()) return;

    if (model.isLoading()) {
      view.renderEvidenceList(true, [], model.getBookmarks(), handleEvidenceListClick);
      return;
    }

    var results = model.filterEvidence(view.readFilterCriteria());
    view.renderEvidenceList(false, results, model.getBookmarks(), handleEvidenceListClick);
  }

  function handleEvidenceListClick(event) {
    var target = event.target;

    if (target.dataset && target.dataset.action === "bookmark") {
      event.stopPropagation();
      handleBookmarkClick(target.dataset.id);
      return;
    }

    var card = target.closest(".evidence-card");
    if (card) {
      openEvidenceDetail(card.getAttribute("data-id"));
    }
  }

  function handleBookmarkClick(evidenceId) {
    if (!model.toggleBookmark(evidenceId)) return;

    dependencies.saveBookmarks(model.getBookmarks());
    if (model.isEvidenceRouteActive()) renderEvidenceList();
  }

  function handleSortChange() {
    model.sortFilteredEvidence(view.getSortValue());
    renderEvidenceList();
  }

  function clearFilters() {
    view.clearFilters();
    renderEvidenceList();
  }

  function handleSearchInput(event) {
    var term = event.target.value;
    var requestId = model.startSearchRequest();

    model.simulateAsyncSearch(term).then(function (resolvedTerm) {
      // Only apply this response if nothing newer has been typed meanwhile.
      if (!model.isLatestSearchRequest(requestId)) return;
      renderEvidenceList();
    });
  }

  function renderEvidenceDetail(evidence) {
    var detail = model.getDetailData(evidence);
    var storedNote = dependencies.loadNote(evidence.id);

    view.renderEvidenceDetail(detail, storedNote, {
      onStatusChange: function (changedEvidence, value) {
        model.updateEvidenceStatus(changedEvidence, value);
        renderEvidenceDetail(changedEvidence);
        if (model.wasEvidenceRendered()) renderEvidenceList();
      },
      onRelevanceChange: function (changedEvidence, value) {
        model.updateEvidenceRelevance(changedEvidence, value);
        renderEvidenceDetail(changedEvidence);
        if (model.wasEvidenceRendered()) renderEvidenceList();
      }
    });
  }

  function openEvidenceDetail(evidenceId) {
    var evidence = model.findEvidence(evidenceId);
    if (!evidence) return;
    model.selectEvidence(evidence);

    view.showDetail();
    renderEvidenceDetail(evidence);
    view.scrollToDetail();
  }

  function closeEvidenceDetail() {
    view.hideDetail();
    model.selectEvidence(null);
  }

  function saveCurrentNote() {
    var note = view.readCurrentNote();
    if (!note) return;

    dependencies.saveNote(note.evidenceId, note.text);
    view.updateNotePreview(note.text);
  }

  function showForPerson(personId) {
    view.setPersonFilter(personId);
    dependencies.navigateTo("evidence");
    setTimeout(function () {
      renderEvidenceList();
    }, 0);
  }

  function openFromAnotherFeature(evidenceId) {
    dependencies.navigateTo("evidence");
    setTimeout(function () {
      openEvidenceDetail(evidenceId);
    }, 0);
  }

  function loadEvidenceData() {
    model.fetchEvidenceData()
      .then(function (data) {
        model.setEvidenceData(data);
        model.applyStoredBookmarkFlags();
        model.useAllEvidenceAsFiltered();
        dependencies.renderDashboard();
        dependencies.populateAllDropdowns();
        if (model.isEvidenceRouteActive()) renderEvidenceList();
      })
      .catch(function (err) {
        console.error("Failed to load evidence.json", err);
        alert("Evidence could not be loaded. Some views may be incomplete.");
      });
  }

  function setupEventListeners() {
    document.getElementById("evidenceSearch").addEventListener("input", handleSearchInput);

    document.getElementById("filterType").addEventListener("change", renderEvidenceList);
    document.getElementById("filterPerson").addEventListener("change", renderEvidenceList);
    document.getElementById("filterLocation").addEventListener("change", renderEvidenceList);

    document.getElementById("filterStatus").addEventListener("change", renderEvidenceList);
    document.getElementById("filterStatus").setAttribute("onchange", "renderEvidenceList()");

    document.getElementById("filterRelevance").addEventListener("change", renderEvidenceList);
    document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
  }

  return {
    loadEvidenceData: loadEvidenceData,
    populateEvidenceDropdowns: populateEvidenceDropdowns,
    renderEvidenceList: renderEvidenceList,
    setupEventListeners: setupEventListeners,
    handleSortChange: handleSortChange,
    openEvidenceDetail: openEvidenceDetail,
    closeEvidenceDetail: closeEvidenceDetail,
    saveCurrentNote: saveCurrentNote,
    showForPerson: showForPerson,
    openFromAnotherFeature: openFromAnotherFeature
  };
}
