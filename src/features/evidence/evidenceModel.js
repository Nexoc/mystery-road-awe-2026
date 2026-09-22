import { state } from "../../app/state.js";
import { evidenceMentionsPerson, findById } from "../../shared/utils.js";

export function createEvidenceModel() {
  function fetchEvidenceData() {
    return fetch("data/evidence.json").then(function (res) {
      return res.json();
    });
  }

  function setEvidenceData(data) {
    state.allEvidence = data;
  }

  function useAllEvidenceAsFiltered() {
    state.filteredEvidence = state.allEvidence;
  }

  function findEvidence(evidenceId) {
    return findById(state.allEvidence, evidenceId);
  }

  function getFilterOptions() {
    var types = [];
    for (var i = 0; i < state.allEvidence.length; i++) {
      var type = state.allEvidence[i].type.toLowerCase();
      if (types.indexOf(type) === -1) types.push(type);
    }

    return {
      types: types,
      people: state.allPeople,
      locations: state.allLocations
    };
  }

  function filterEvidence(criteria) {
    var results = [];
    for (var i = 0; i < state.allEvidence.length; i++) {
      var item = state.allEvidence[i];
      var matches = true;

      if (criteria.searchTerm) {
        var haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
        if (haystack.indexOf(criteria.searchTerm) === -1) matches = false;
      }
      if (matches && criteria.type && item.type.toLowerCase() !== criteria.type) matches = false;
      if (matches && criteria.personId) {
        var person = findById(state.allPeople, criteria.personId);
        if (!person || !evidenceMentionsPerson(item, person)) matches = false;
      }
      if (matches && criteria.locationId && item.locationIds.indexOf(criteria.locationId) === -1) matches = false;
      if (matches && criteria.status && (item.status || "").toLowerCase() !== criteria.status) matches = false;
      if (matches && criteria.relevance && (item.relevance || "").toLowerCase() !== criteria.relevance) matches = false;

      if (matches) results.push(item);
    }

    state.filteredEvidence = results;
    return results;
  }

  function sortFilteredEvidence(sortValue) {
    if (sortValue === "title-asc") {
      state.filteredEvidence.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    } else if (sortValue === "title-desc") {
      state.filteredEvidence.sort(function (a, b) {
        return b.title.localeCompare(a.title);
      });
    } else if (sortValue === "date-asc") {
      state.filteredEvidence.sort(function (a, b) {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
    } else {
      state.filteredEvidence.sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    }
  }

  function toggleBookmark(evidenceId) {
    var evidence = findEvidence(evidenceId);
    if (!evidence) return false;

    if (state.bookmarks.indexOf(evidenceId) === -1) {
      state.bookmarks.push(evidenceId);
      evidence.bookmarked = true;
    } else {
      state.bookmarks = state.bookmarks.filter(function (id) {
        return id !== evidenceId;
      });
      evidence.bookmarked = false;
    }
    return true;
  }

  function applyStoredBookmarkFlags() {
    for (var i = 0; i < state.allEvidence.length; i++) {
      state.allEvidence[i].bookmarked = state.bookmarks.indexOf(state.allEvidence[i].id) !== -1;
    }
  }

  function getDetailData(evidence) {
    var personNames = [];
    for (var p = 0; p < evidence.personIds.length; p++) {
      var person = findById(state.allPeople, evidence.personIds[p]);
      personNames.push(person ? person.name : evidence.personIds[p]);
    }

    var locationNames = [];
    for (var l = 0; l < evidence.locationIds.length; l++) {
      var location = findById(state.allLocations, evidence.locationIds[l]);
      locationNames.push(location ? location.id + " - " + location.name : evidence.locationIds[l]);
    }

    return {
      evidence: evidence,
      personNames: personNames,
      locationNames: locationNames
    };
  }

  function updateEvidenceStatus(evidence, value) {
    evidence.status = value;
  }

  function updateEvidenceRelevance(evidence, value) {
    evidence.relevance = value;
  }

  function simulateAsyncSearch(term) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(term);
      }, 300);
    });
  }

  function startSearchRequest() {
    state.latestSearchRequestId++;
    return state.latestSearchRequestId;
  }

  function isLatestSearchRequest(requestId) {
    return requestId === state.latestSearchRequestId;
  }

  return {
    fetchEvidenceData: fetchEvidenceData,
    setEvidenceData: setEvidenceData,
    useAllEvidenceAsFiltered: useAllEvidenceAsFiltered,
    findEvidence: findEvidence,
    getFilterOptions: getFilterOptions,
    filterEvidence: filterEvidence,
    sortFilteredEvidence: sortFilteredEvidence,
    toggleBookmark: toggleBookmark,
    applyStoredBookmarkFlags: applyStoredBookmarkFlags,
    getDetailData: getDetailData,
    updateEvidenceStatus: updateEvidenceStatus,
    updateEvidenceRelevance: updateEvidenceRelevance,
    simulateAsyncSearch: simulateAsyncSearch,
    startSearchRequest: startSearchRequest,
    isLatestSearchRequest: isLatestSearchRequest,
    getBookmarks: function () { return state.bookmarks; },
    isLoading: function () { return state.evidenceViewLoading; },
    isEvidenceRouteActive: function () { return state.currentPage === "evidence"; },
    wasEvidenceRendered: function () { return state.viewRendered.evidence; },
    selectEvidence: function (evidence) { state.selectedEvidence = evidence; }
  };
}
