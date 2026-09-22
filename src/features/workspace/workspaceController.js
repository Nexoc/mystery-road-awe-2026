import { createWorkspaceView } from "./workspaceView.js";

export function createWorkspaceController(model, dependencies) {
  var view = createWorkspaceView();

  function populateHypothesisDropdowns() {
    view.populateHypothesisDropdowns(model.getHypothesisOptions());
  }

  function loadHypothesisFromStorage() {
    var draft = model.loadHypothesisDraft();
    if (draft === undefined) return;
    view.applyHypothesisDraft(draft);
  }

  function renderWorkspace() {
    view.renderBookmarksList(model.getBookmarkedItems(), function (evidenceId) {
      dependencies.openEvidenceFromAnotherFeature(evidenceId);
    });
    view.renderNotesList(model.getNoteEntries());
    populateHypothesisDropdowns();
    loadHypothesisFromStorage();
  }

  function saveHypothesis() {
    var draft = view.readHypothesisDraft();

    try {
      model.storeHypothesisDraft(draft);
    } catch (err) {
      console.error("Could not save hypothesis draft", err);
      alert("Your hypothesis could not be saved to local storage.");
      return;
    }

    view.showHypothesisSaved();
  }

  function setupEventListeners() {
    view.bindConfidenceInput();
  }

  return {
    renderWorkspace: renderWorkspace,
    populateHypothesisDropdowns: populateHypothesisDropdowns,
    saveHypothesis: saveHypothesis,
    setupEventListeners: setupEventListeners
  };
}
