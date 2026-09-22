import { createPeopleModel } from "./peopleModel.js";
import { createPeopleView } from "./peopleView.js";

export function createPeopleController(dependencies) {
  var model = createPeopleModel();
  var view = createPeopleView();

  function switchPeopleTab(tab) {
    model.setCurrentPeopleTab(tab);
    view.switchPeopleTab(tab);
  }

  function renderPeople() {
    view.renderPeople(model.getPeopleViewData(), function (personId) {
      dependencies.showEvidenceForPerson(personId);
    });
  }

  function renderLocations() {
    view.renderLocations(model.getLocations());
  }

  function renderPeopleAndLocations() {
    renderPeople();
    renderLocations();
  }

  return {
    loadPeopleData: model.loadPeopleData,
    loadLocationsData: model.loadLocationsData,
    switchPeopleTab: switchPeopleTab,
    renderPeople: renderPeople,
    renderLocations: renderLocations,
    renderPeopleAndLocations: renderPeopleAndLocations
  };
}
