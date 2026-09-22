import { createTimelineModel } from "./timelineModel.js";
import { createTimelineView } from "./timelineView.js";

export function createTimelineController(dependencies) {
  var model = createTimelineModel();
  var view = createTimelineView();

  function populateTimelineDropdowns() {
    view.populateTimelineDropdowns(model.getFilterOptions());
  }

  function renderTimeline() {
    var filters = view.readTimelineFilters();
    if (!filters) return;

    view.renderTimeline(model.getTimelineViewData(filters), openEvidenceModal);
  }

  function openEvidenceModal(evidenceId) {
    var evidence = model.findEvidence(evidenceId);
    if (!evidence) return;

    var modal = view.renderEvidenceModal(evidence);
    var listenerCount = model.recordModalOpened();
    console.log("modal opened, active close listeners:", listenerCount);

    view.addEvidenceModalClickListener(modal, function (id) {
      dependencies.openEvidenceFromAnotherFeature(id);
    });
  }

  function loadTimelineData() {
    return model.fetchTimelineData()
      .then(function (data) {
        model.setTimelineData(data);
        dependencies.renderDashboard();
        if (model.isTimelineRouteActive()) renderTimeline();
        dependencies.populateAllDropdowns();
      })
      .catch(function (err) {
        console.log("timeline load error", err);
      })
      .finally(function () {
        dependencies.hideLoadingStep();
      });
  }

  function setupEventListeners() {
    view.bindTimelineControls(renderTimeline);
  }

  return {
    loadTimelineData: loadTimelineData,
    populateTimelineDropdowns: populateTimelineDropdowns,
    renderTimeline: renderTimeline,
    setupEventListeners: setupEventListeners
  };
}
