export {};

declare global {
  interface Window {
    navigateTo: typeof import("./app/navigation.js").navigateTo;
    handleSortChange: typeof import("./modules/evidence/evidence.js").handleSortChange;
    switchPeopleTab: typeof import("./modules/people/people.js").switchPeopleTab;
    saveHypothesis: typeof import("./modules/workspace/workspace.js").saveHypothesis;
    closeEvidenceDetail: typeof import("./modules/evidence/evidence.js").closeEvidenceDetail;
    saveCurrentNote: typeof import("./modules/evidence/evidence.js").saveCurrentNote;
  }
}
