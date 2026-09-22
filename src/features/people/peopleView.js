export function createPeopleView() {
  function switchPeopleTab(tab) {
    var peoplePanel = document.getElementById("peoplePanel");
    var locationsPanel = document.getElementById("locationsPanel");
    var peopleTabBtn = document.getElementById("tabPeopleBtn");
    var locationsTabBtn = document.getElementById("tabLocationsBtn");

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

  function renderPeople(cards, onViewEvidence) {
    var container = document.getElementById("peoplePanel");
    var html = "";
    for (var i = 0; i < cards.length; i++) {
      var person = cards[i].person;
      var count = cards[i].evidenceCount;

      html += '<div class="person-card">';
      html += '<div class="person-card-header">';
      html += '<img class="person-avatar" src="' + person.avatar + '" alt="Portrait of ' + person.name + '">';
      html += "<div><h3>" + person.name + "</h3><div class=\"person-role\">" + person.role + "</div></div>";
      html += "</div>";
      html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";
      html += "<ul>";
      for (var r = 0; r < person.responsibilities.length; r++) {
        html += "<li>" + person.responsibilities[r] + "</li>";
      }
      html += "</ul>";
      html += '<div class="person-statement">&ldquo;' + person.statement + "&rdquo;</div>";
      html += "<p>" + count + " related evidence item" + (count === 1 ? "" : "s") + " &mdash; ";
      html += '<button type="button" class="evidence-count-link" data-person-id="' + person.id + '">view</button></p>';
      html += "</div>";
    }
    container.innerHTML = html;

    var links = container.querySelectorAll(".evidence-count-link");
    for (var l = 0; l < links.length; l++) {
      links[l].addEventListener("click", function (event) {
        onViewEvidence(event.target.getAttribute("data-person-id"));
      });
    }
  }

  function renderLocations(locations) {
    var container = document.getElementById("locationsPanel");
    var html = "";
    for (var i = 0; i < locations.length; i++) {
      var location = locations[i];
      html += '<div class="location-card">';
      html += "<h3>" + location.id + " &mdash; " + location.name + "</h3>";
      html += "<p>" + location.description + "</p>";
      html += "<p><strong>Contains:</strong></p><ul>";
      for (var c = 0; c < location.contains.length; c++) {
        html += "<li>" + location.contains[c] + "</li>";
      }
      html += "</ul></div>";
    }
    container.innerHTML = html;
  }

  return {
    switchPeopleTab: switchPeopleTab,
    renderPeople: renderPeople,
    renderLocations: renderLocations
  };
}
