import { state } from "./state.js";
import { activateView } from "./appView.js";

var routeHandlers = {};

export function configureRouter(handlers) {
  routeHandlers = handlers;
}

export function navigateTo(viewName) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange() {
  var hash = window.location.hash.replace("#", "");
  var validViews = ["dashboard", "evidence", "people", "timeline", "workspace"];
  if (validViews.indexOf(hash) === -1) {
    hash = "dashboard";
  }
  state.currentPage = hash;

  activateView(hash);

  if (hash === "dashboard" && !state.viewRendered.dashboard) {
    routeHandlers.dashboard();
    state.viewRendered.dashboard = true;
  } else if (hash === "evidence" && !state.viewRendered.evidence) {
    routeHandlers.evidence();
    state.viewRendered.evidence = true;
  } else if (hash === "people" && !state.viewRendered.people) {
    routeHandlers.people();
    state.viewRendered.people = true;
  } else if (hash === "timeline" && !state.viewRendered.timeline) {
    routeHandlers.timeline();
    state.viewRendered.timeline = true;
  } else if (hash === "workspace") {
    // workspace is cheap enough that it always re-renders
    routeHandlers.workspace();
  }
}
