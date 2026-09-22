import { createApplication } from "./app/bootstrap.js";

var app = createApplication();

// Temporary bridge for the inline handlers that are still present in the HTML.
window.navigateTo = app.navigateTo;
window.handleSortChange = app.handleSortChange;
window.switchPeopleTab = app.switchPeopleTab;
window.saveHypothesis = app.saveHypothesis;
window.closeEvidenceDetail = app.closeEvidenceDetail;
window.saveCurrentNote = app.saveCurrentNote;
window.renderEvidenceList = app.renderEvidenceList;

window.addEventListener("DOMContentLoaded", app.start);
window.addEventListener("hashchange", app.handleHashChange);
