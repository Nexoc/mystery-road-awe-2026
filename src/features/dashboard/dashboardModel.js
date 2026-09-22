import { state } from "../../app/state.js";

function countReviewedEvidence(evidence) {
  var reviewedCount = 0;
  for (var i = 0; i < evidence.length; i++) {
    if ((evidence[i].status || "").toLowerCase() === "reviewed") reviewedCount++;
  }
  return reviewedCount;
}

export function loadCaseData() {
  return fetch("data/case.json").then(function (response) {
    return response.json().then(function (data) {
      state.caseData = data;
    });
  });
}

export function getDashboardSnapshot() {
  var reviewedCount = countReviewedEvidence(state.allEvidence);
  var progressPct = state.allEvidence.length === 0
    ? 0
    : Math.round((reviewedCount / state.allEvidence.length) * 100);

  return {
    caseData: state.caseData,
    evidenceCount: state.allEvidence.length,
    peopleCount: state.allPeople.length,
    locationCount: state.allLocations.length,
    bookmarkCount: state.bookmarks.length,
    reviewedCount: reviewedCount,
    progressPct: progressPct,
    recentEvidence: state.allEvidence.slice(-5).reverse(),
    recentTimeline: state.allTimeline.slice(-5).reverse()
  };
}
