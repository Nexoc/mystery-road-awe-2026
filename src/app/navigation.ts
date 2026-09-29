import { renderDashboard } from "../modules/dashboard/dashboard.js";
import { renderEvidenceList } from "../modules/evidence/evidence.js";
import { renderLocations, renderPeople } from "../modules/people/people.js";
import { renderTimeline } from "../modules/timeline/timeline.js";
import { renderWorkspace } from "../modules/workspace/workspace.js";
import type { ViewName } from "../types.js";
import { state } from "./state.js";

const VALID_VIEWS: readonly ViewName[] = [
  "dashboard",
  "evidence",
  "people",
  "timeline",
  "workspace",
];

function isViewName(value: string): value is ViewName {
  return VALID_VIEWS.some((viewName) => viewName === value);
}

function getRequiredElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing required element #${id}`);
  return element;
}

export function navigateTo(viewName: ViewName): void {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange(): void {
  const hashValue = window.location.hash.replace("#", "");
  const viewName: ViewName = isViewName(hashValue) ? hashValue : "dashboard";
  state.currentPage = viewName;

  const sections = document.querySelectorAll(".view");
  for (let i = 0; i < sections.length; i++) {
    sections[i]?.classList.remove("active");
  }
  getRequiredElement(`view-${viewName}`).classList.add("active");

  const navButtons = document.querySelectorAll(".nav-btn");
  for (let index = 0; index < navButtons.length; index++) {
    const navButton = navButtons[index];
    if (!navButton) continue;

    navButton.classList.remove("active");
    if (navButton.getAttribute("data-view") === viewName) {
      navButton.classList.add("active");
    }
  }

  if (viewName === "dashboard") {
    renderDashboard();
  } else if (viewName === "evidence" && !state.viewRendered.evidence) {
    renderEvidenceList();
    state.viewRendered.evidence = true;
  } else if (viewName === "people" && !state.viewRendered.people) {
    renderPeople();
    renderLocations();
    state.viewRendered.people = true;
  } else if (viewName === "timeline" && !state.viewRendered.timeline) {
    renderTimeline();
    state.viewRendered.timeline = true;
  } else if (viewName === "workspace") {
    // workspace is cheap enough that it always re-renders
    renderWorkspace();
  }
}
