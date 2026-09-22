import { findById, formatDate } from "../../shared/utils.js";

export function createTimelineView() {
  function populateTimelineDropdowns(options) {
    var personSelect = document.getElementById("timelinePersonFilter");
    var locationSelect = document.getElementById("timelineLocationFilter");
    var typeSelect = document.getElementById("timelineTypeFilter");
    if (!personSelect || !locationSelect || !typeSelect) return;

    personSelect.innerHTML = '<option value="">All people</option>';
    for (var p = 0; p < options.people.length; p++) {
      personSelect.innerHTML += '<option value="' + options.people[p].id + '">' + options.people[p].name + "</option>";
    }

    locationSelect.innerHTML = '<option value="">All locations</option>';
    for (var l = 0; l < options.locations.length; l++) {
      locationSelect.innerHTML += '<option value="' + options.locations[l].id + '">' + options.locations[l].id + "</option>";
    }

    typeSelect.innerHTML = '<option value="">All event types</option>';
    for (var t = 0; t < options.types.length; t++) {
      typeSelect.innerHTML += '<option value="' + options.types[t] + '">' + options.types[t] + "</option>";
    }
  }

  function readTimelineFilters() {
    if (!document.getElementById("timelineContainer")) return null;

    return {
      order: document.getElementById("timelineOrder").value,
      personId: document.getElementById("timelinePersonFilter").value,
      locationId: document.getElementById("timelineLocationFilter").value,
      type: document.getElementById("timelineTypeFilter").value
    };
  }

  function certaintyBadgeClass(certainty) {
    if (certainty === "confirmed") return "reviewed";
    if (certainty === "contradictory") return "critical";
    if (certainty === "reported") return "flagged";
    return "unreviewed";
  }

  function renderTimeline(viewData, onEvidenceLink) {
    var container = document.getElementById("timelineContainer");
    var html = "";
    for (var e = 0; e < viewData.events.length; e++) {
      var item = viewData.events[e];
      html += '<div class="timeline-event certainty-' + item.certainty + '">';
      html += '<div class="timeline-time">' + formatDate(item.time) + '&nbsp;&middot;&nbsp;<span class="badge badge-' + certaintyBadgeClass(item.certainty) + '">' + item.certainty + "</span></div>";
      html += "<h3>" + item.title + "</h3>";
      html += "<p>" + item.description + "</p>";

      var eventLocationNames = [];
      for (var el = 0; el < item.locationIds.length; el++) {
        var eventLocation = findById(viewData.locations, item.locationIds[el]);
        eventLocationNames.push(eventLocation || item.locationIds[el]);
      }
      if (eventLocationNames.length > 0) {
        html += '<p class="evidence-meta">Location: ' + eventLocationNames.join(", ") + "</p>";
      }

      for (var ev = 0; ev < item.evidenceIds.length; ev++) {
        html += '<button type="button" class="evidence-link-btn" data-evidence-id="' + item.evidenceIds[ev] + '">View ' + item.evidenceIds[ev] + "</button>";
      }
      html += "</div>";
    }
    if (viewData.events.length === 0) {
      html = "<p>No timeline events match the current filters.</p>";
    }
    container.innerHTML = html;

    var linkButtons = container.querySelectorAll(".evidence-link-btn");
    for (var b = 0; b < linkButtons.length; b++) {
      linkButtons[b].addEventListener("click", function (event) {
        onEvidenceLink(event.target.getAttribute("data-evidence-id"));
      });
    }
  }

  function renderEvidenceModal(evidence) {
    var modal = document.getElementById("quickViewModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "quickViewModal";
      document.body.appendChild(modal);
    }

    modal.innerHTML =
      '<div class="modal-backdrop"><div class="modal-box">' +
      '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
      "<h3>" + evidence.title + "</h3>" +
      '<p class="evidence-meta">' + evidence.id + " &middot; " + evidence.type + " &middot; " + formatDate(evidence.timestamp) + "</p>" +
      "<p>" + evidence.summary + "</p>" +
      '<button type="button" class="btn btn-primary btn-small" data-open-full="' + evidence.id + '">Open full evidence</button>' +
      "</div></div>";

    return modal;
  }

  function addEvidenceModalClickListener(modal, onOpenFull) {
    modal.addEventListener("click", function (event) {
      if (event.target.classList.contains("modal-close-btn") || event.target.classList.contains("modal-backdrop")) {
        modal.innerHTML = "";
      }
      if (event.target.getAttribute && event.target.getAttribute("data-open-full")) {
        modal.innerHTML = "";
        onOpenFull(event.target.getAttribute("data-open-full"));
      }
    });
  }

  function bindTimelineControls(onChange) {
    document.getElementById("timelineOrder").addEventListener("change", onChange);
    document.getElementById("timelinePersonFilter").addEventListener("change", onChange);
    document.getElementById("timelineLocationFilter").addEventListener("change", onChange);
    document.getElementById("timelineTypeFilter").addEventListener("change", onChange);
  }

  return {
    populateTimelineDropdowns: populateTimelineDropdowns,
    readTimelineFilters: readTimelineFilters,
    renderTimeline: renderTimeline,
    renderEvidenceModal: renderEvidenceModal,
    addEvidenceModalClickListener: addEvidenceModalClickListener,
    bindTimelineControls: bindTimelineControls
  };
}
