export const state = {
  allEvidence: [],
  filteredEvidence: [],
  bookmarks: [],
  currentPage: "dashboard",

  allPeople: [],
  allLocations: [],
  allTimeline: [],
  caseData: {},

  viewRendered: {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false
  },

  notesStore: {}
};
