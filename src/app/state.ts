import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
  ViewName,
} from "../types.js";

export const state = {
  allEvidence: [] as Evidence[],
  filteredEvidence: [] as Evidence[],
  bookmarks: [] as string[],
  currentPage: "dashboard" as ViewName,

  allPeople: [] as Person[],
  allLocations: [] as Location[],
  allTimeline: [] as TimelineEvent[],
  caseData: {} as CaseData,

  viewRendered: {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false,
  },

  notesStore: {} as Record<string, string>,
};
