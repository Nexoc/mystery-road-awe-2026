// Composition root: creates controllers and injects callbacks between features.
// Feature modules stay independent and never import one another directly.

import { hideLoadingStep, showLoadingOverlay } from "./appView.js";
import { configureRouter, handleHashChange, navigateTo } from "./router.js";
import { state } from "./state.js";
import * as dashboardController from "../features/dashboard/dashboardController.js";
import { createEvidenceController } from "../features/evidence/evidenceController.js";
import { createPeopleController } from "../features/people/peopleController.js";
import { createTimelineController } from "../features/timeline/timelineController.js";
import { createWorkspaceController } from "../features/workspace/workspaceController.js";
import { createWorkspaceModel } from "../features/workspace/workspaceModel.js";

export function createApplication() {
  var workspaceModel = createWorkspaceModel();
  var evidenceController;
  var peopleController;
  var timelineController;
  var workspaceController;

  function populateAllDropdowns() {
    evidenceController.populateEvidenceDropdowns();
    timelineController.populateTimelineDropdowns();
    workspaceController.populateHypothesisDropdowns();
  }

  evidenceController = createEvidenceController({
    saveBookmarks: workspaceModel.saveBookmarks,
    saveNote: workspaceModel.saveNote,
    loadNote: workspaceModel.loadNote,
    navigateTo: navigateTo,
    renderDashboard: dashboardController.renderDashboard,
    populateAllDropdowns: populateAllDropdowns
  });

  peopleController = createPeopleController({
    showEvidenceForPerson: evidenceController.showForPerson
  });

  timelineController = createTimelineController({
    openEvidenceFromAnotherFeature: evidenceController.openFromAnotherFeature,
    renderDashboard: dashboardController.renderDashboard,
    populateAllDropdowns: populateAllDropdowns,
    hideLoadingStep: hideLoadingStep
  });

  workspaceController = createWorkspaceController(workspaceModel, {
    openEvidenceFromAnotherFeature: evidenceController.openFromAnotherFeature
  });

  configureRouter({
    dashboard: dashboardController.renderDashboard,
    evidence: evidenceController.renderEvidenceList,
    people: peopleController.renderPeopleAndLocations,
    timeline: timelineController.renderTimeline,
    workspace: workspaceController.renderWorkspace
  });

  function setupEventListeners() {
    window.addEventListener("hashchange", handleHashChange);

    var navButtons = document.querySelectorAll(".nav-btn");
    for (var i = 0; i < navButtons.length; i++) {
      navButtons[i].addEventListener("click", function () {
        var targetView = navButtons[i].getAttribute("data-view");
        console.log("nav clicked:", targetView);
      });
    }

    evidenceController.setupEventListeners();
    timelineController.setupEventListeners();
    workspaceController.setupEventListeners();
  }

  function loadCorePeopleAndLocations() {
    return dashboardController.loadCaseData().then(function () {
      return peopleController.loadPeopleData().then(function () {
        return peopleController.loadLocationsData().then(function () {
          hideLoadingStep();
          dashboardController.renderDashboard();
          populateAllDropdowns();
        });
      });
    });
  }

  function loadAllData() {
    showLoadingOverlay("Loading case file…");
    state.loadingStepsRemaining = 2;

    return loadCorePeopleAndLocations().then(function () {
      evidenceController.loadEvidenceData();
      timelineController.loadTimelineData();
    });
  }

  function start() {
    workspaceModel.loadPersistentState();
    setupEventListeners();

    loadAllData().then(function () {
      handleHashChange();
      var firstNote = workspaceModel.loadNoteAsync("E01");
      console.log("First note preview:", firstNote);
    });
  }

  return {
    start: start,
    handleHashChange: handleHashChange,
    navigateTo: navigateTo,
    renderEvidenceList: evidenceController.renderEvidenceList,
    handleSortChange: evidenceController.handleSortChange,
    closeEvidenceDetail: evidenceController.closeEvidenceDetail,
    saveCurrentNote: evidenceController.saveCurrentNote,
    switchPeopleTab: peopleController.switchPeopleTab,
    saveHypothesis: workspaceController.saveHypothesis
  };
}
