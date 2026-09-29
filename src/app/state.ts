import type { Evidence, Location, Person } from "../types.js";

export const state = {
  allEvidence: [] as Evidence[],
  filteredEvidence: [] as Evidence[],
  bookmarks: [] as string[],
  currentPage: "dashboard",

  allPeople: [] as Person[],
  allLocations: [] as Location[],
  allTimeline: [],
  caseData: {},

  viewRendered: {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false,
  },

  notesStore: {} as Record<string, string>,
};