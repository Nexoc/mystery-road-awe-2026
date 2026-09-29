import { state } from "../../app/state.js";
import { navigateTo } from "../../app/navigation.js";
import { renderEvidenceList } from "../evidence/evidence.js";
import { evidenceMentionsPerson } from "../../shared/utils.js";
import type { Person } from "../../types.js";

export function switchPeopleTab(tab: "people" | "locations"): void {
  const peoplePanel = document.getElementById("peoplePanel");
  const locationsPanel = document.getElementById("locationsPanel");
  const peopleTabBtn = document.getElementById("tabPeopleBtn");
  const locationsTabBtn = document.getElementById("tabLocationsBtn");
  if (!peoplePanel || !locationsPanel || !peopleTabBtn || !locationsTabBtn) {
    return;
  }

  if (tab === "people") {
    peoplePanel.classList.remove("hidden");
    locationsPanel.classList.add("hidden");
    peopleTabBtn.classList.add("active");
    locationsTabBtn.classList.remove("active");
  } else {
    peoplePanel.classList.add("hidden");
    locationsPanel.classList.remove("hidden");
    peopleTabBtn.classList.remove("active");
    locationsTabBtn.classList.add("active");
  }
}

function countEvidenceForPerson(person: Person): number {
  let count = 0;
  for (const evidence of state.allEvidence) {
    if (evidenceMentionsPerson(evidence, person)) count++;
  }
  return count;
}

export function renderPeople(): void {
  const container = document.getElementById("peoplePanel");
  if (!container) return;

  let html = "";
  for (const person of state.allPeople) {
    const count = countEvidenceForPerson(person);

    html += '<div class="person-card">';
    html += '<div class="person-card-header">';
    html +=
      '<img class="person-avatar" src="' +
      person.avatar +
      '" alt="Portrait of ' +
      person.name +
      '">';
    html +=
      "<div><h3>" +
      person.name +
      '</h3><div class="person-role">' +
      person.role +
      "</div></div>";
    html += "</div>";
    html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";
    html += "<ul>";
    for (const responsibility of person.responsibilities) {
      html += "<li>" + responsibility + "</li>";
    }
    html += "</ul>";
    html +=
      '<div class="person-statement">&ldquo;' +
      person.statement +
      "&rdquo;</div>";
    html +=
      "<p>" +
      count +
      " related evidence item" +
      (count === 1 ? "" : "s") +
      " &mdash; ";
    html +=
      '<button type="button" class="evidence-count-link" data-person-id="' +
      person.id +
      '">view</button></p>';
    html += "</div>";
  }
  container.innerHTML = html;

  const links = container.querySelectorAll(".evidence-count-link");
  for (const link of links) {
    link.addEventListener("click", function (event) {
      const target = event.currentTarget;
      const filterPerson = document.getElementById("filterPerson");
      if (!(target instanceof HTMLElement)) return;
      if (!(filterPerson instanceof HTMLSelectElement)) return;

      const personId = target.getAttribute("data-person-id");
      if (!personId) return;

      filterPerson.value = personId;
      navigateTo("evidence");
      setTimeout(function () {
        renderEvidenceList();
      }, 0);
    });
  }
}

export function renderLocations(): void {
  const container = document.getElementById("locationsPanel");
  if (!container) return;

  let html = "";
  for (const loc of state.allLocations) {
    html += '<div class="location-card">';
    html += "<h3>" + loc.id + " &mdash; " + loc.name + "</h3>";
    html += "<p>" + loc.description + "</p>";
    html += "<p><strong>Contains:</strong></p><ul>";
    for (const containedItem of loc.contains) {
      html += "<li>" + containedItem + "</li>";
    }
    html += "</ul></div>";
  }
  container.innerHTML = html;
}
