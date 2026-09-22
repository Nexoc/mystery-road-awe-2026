import { state } from "../../app/state.js";
import { findById } from "../../shared/utils.js";

export function createTimelineModel() {
  function fetchTimelineData() {
    return fetch("data/timeline.json").then(function (response) {
      return response.json();
    });
  }

  function getFilterOptions() {
    var types = [];
    for (var i = 0; i < state.allTimeline.length; i++) {
      if (types.indexOf(state.allTimeline[i].type) === -1) types.push(state.allTimeline[i].type);
    }

    return {
      people: state.allPeople,
      locations: state.allLocations,
      types: types
    };
  }

  function getTimelineViewData(filters) {
    var events = [];
    for (var i = 0; i < state.allTimeline.length; i++) {
      var event = state.allTimeline[i];
      if (filters.personId && event.personIds.indexOf(filters.personId) === -1) continue;
      if (filters.locationId && event.locationIds.indexOf(filters.locationId) === -1) continue;
      if (filters.type && event.type !== filters.type) continue;
      events.push(event);
    }

    events = events.slice().sort(function (a, b) {
      var diff = new Date(a.time) - new Date(b.time);
      return filters.order === "desc" ? -diff : diff;
    });

    return {
      events: events,
      locations: state.allLocations
    };
  }

  return {
    fetchTimelineData: fetchTimelineData,
    setTimelineData: function (data) { state.allTimeline = data; },
    getFilterOptions: getFilterOptions,
    getTimelineViewData: getTimelineViewData,
    findEvidence: function (evidenceId) { return findById(state.allEvidence, evidenceId); },
    isTimelineRouteActive: function () { return state.currentPage === "timeline"; },
    recordModalOpened: function () {
      state.modalCloseListenerCount++;
      return state.modalCloseListenerCount;
    }
  };
}
