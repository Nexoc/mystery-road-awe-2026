import { navigateTo } from "../../app/navigation.js";
import { state } from "../../app/state.js";
import {
  findEvidenceById,
  findLocationById,
  formatDate,
} from "../../shared/utils.js";
import { openEvidenceDetail } from "../evidence/evidence.js";
import type { TimelineEvent } from "../../types.js";

export function populateTimelineDropdowns(): void {
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");
  if (
    !(personSelect instanceof HTMLSelectElement) ||
    !(locationSelect instanceof HTMLSelectElement) ||
    !(typeSelect instanceof HTMLSelectElement)
  ) {
    return;
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of state.allPeople) {
    personSelect.innerHTML +=
      '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const location of state.allLocations) {
    locationSelect.innerHTML +=
      '<option value="' + location.id + '">' + location.id + "</option>";
  }

  const types: string[] = [];
  for (const event of state.allTimeline) {
    if (types.indexOf(event.type) === -1) types.push(event.type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (const type of types) {
    typeSelect.innerHTML +=
      '<option value="' + type + '">' + type + "</option>";
  }
}

export function renderTimeline(): void {
  const container = document.getElementById("timelineContainer");
  if (!container) return;

  const orderSelect = document.getElementById("timelineOrder");
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");
  if (
    !(orderSelect instanceof HTMLSelectElement) ||
    !(personSelect instanceof HTMLSelectElement) ||
    !(locationSelect instanceof HTMLSelectElement) ||
    !(typeSelect instanceof HTMLSelectElement)
  ) {
    return;
  }

  const order = orderSelect.value;
  const personFilter = personSelect.value;
  const locationFilter = locationSelect.value;
  const typeFilter = typeSelect.value;

  let events: TimelineEvent[] = [];
  for (const evt of state.allTimeline) {
    if (personFilter && evt.personIds.indexOf(personFilter) === -1) continue;
    if (locationFilter && evt.locationIds.indexOf(locationFilter) === -1)
      continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events = events.slice().sort(function (a, b) {
    const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
    return order === "desc" ? -diff : diff;
  });

  let html = "";
  for (const item of events) {
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames = [];
    for (const locationId of item.locationIds) {
      const evtLoc = findLocationById(locationId);
      eventLocationNames.push(evtLoc ? evtLoc.name : locationId);
    }
    if (eventLocationNames.length > 0) {
      html +=
        '<p class="evidence-meta">Location: ' +
        eventLocationNames.join(", ") +
        "</p>";
    }

    for (const evidenceId of item.evidenceIds) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        evidenceId +
        '">View ' +
        evidenceId +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  const linkButtons = container.querySelectorAll(".evidence-link-btn");
  for (const button of linkButtons) {
    button.addEventListener("click", function (event) {
      const target = event.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      const evidenceId = target.getAttribute("data-evidence-id");
      if (evidenceId) openEvidenceModal(evidenceId);
    });
  }
}

function certaintyBadgeClass(certainty: string): string {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
}

// --- Quick-view modal (used from the timeline) -------------------------
function openEvidenceModal(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);

    const createdModal = modal;
    createdModal.addEventListener("click", function (event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (
        target.classList.contains("modal-close-btn") ||
        target.classList.contains("modal-backdrop")
      ) {
        createdModal.innerHTML = "";
      }
      const fullEvidenceId = target.getAttribute("data-open-full");
      if (fullEvidenceId) {
        createdModal.innerHTML = "";
        navigateTo("evidence");
        setTimeout(function () {
          openEvidenceDetail(fullEvidenceId);
        }, 0);
      }
    });
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";
}
