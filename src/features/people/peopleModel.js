import { state } from "../../app/state.js";
import { evidenceMentionsPerson } from "../../shared/utils.js";

export function createPeopleModel() {
  function loadPeopleData() {
    return fetch("data/people.json").then(function (response) {
      return response.json().then(function (data) {
        state.allPeople = data;
      });
    });
  }

  function loadLocationsData() {
    return fetch("data/locations.json").then(function (response) {
      return response.json().then(function (data) {
        state.allLocations = data;
      });
    });
  }

  function countEvidenceForPerson(person) {
    var count = 0;
    for (var i = 0; i < state.allEvidence.length; i++) {
      if (evidenceMentionsPerson(state.allEvidence[i], person)) count++;
    }
    return count;
  }

  function getPeopleViewData() {
    var cards = [];
    for (var i = 0; i < state.allPeople.length; i++) {
      cards.push({
        person: state.allPeople[i],
        evidenceCount: countEvidenceForPerson(state.allPeople[i])
      });
    }
    return cards;
  }

  return {
    loadPeopleData: loadPeopleData,
    loadLocationsData: loadLocationsData,
    getPeopleViewData: getPeopleViewData,
    getLocations: function () { return state.allLocations; },
    setCurrentPeopleTab: function (tab) { state.currentPeopleTab = tab; }
  };
}
