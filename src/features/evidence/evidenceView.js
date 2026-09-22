import {
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass
} from "../../shared/utils.js";

export function createEvidenceView() {
  function hasFilterDropdowns() {
    return Boolean(
      document.getElementById("filterType") &&
      document.getElementById("filterPerson") &&
      document.getElementById("filterLocation")
    );
  }

  function hasListContainer() {
    return Boolean(document.getElementById("evidenceList"));
  }

  function populateDropdowns(options) {
    var typeSelect = document.getElementById("filterType");
    var personSelect = document.getElementById("filterPerson");
    var locationSelect = document.getElementById("filterLocation");
    if (!typeSelect || !personSelect || !locationSelect) return;

    typeSelect.innerHTML = '<option value="">All types</option>';
    for (var ti = 0; ti < options.types.length; ti++) {
      typeSelect.innerHTML += '<option value="' + options.types[ti] + '">' + options.types[ti] + "</option>";
    }

    personSelect.innerHTML = '<option value="">All people</option>';
    for (var p = 0; p < options.people.length; p++) {
      personSelect.innerHTML += '<option value="' + options.people[p].id + '">' + options.people[p].name + "</option>";
    }

    locationSelect.innerHTML = '<option value="">All locations</option>';
    for (var l = 0; l < options.locations.length; l++) {
      locationSelect.innerHTML += '<option value="' + options.locations[l].id + '">' + options.locations[l].id + " - " + options.locations[l].name + "</option>";
    }
  }

  function readFilterCriteria() {
    var searchBox = document.getElementById("evidenceSearch");
    return {
      searchTerm: searchBox ? searchBox.value.toLowerCase().trim() : "",
      type: document.getElementById("filterType").value,
      personId: document.getElementById("filterPerson").value,
      locationId: document.getElementById("filterLocation").value,
      status: document.getElementById("filterStatus").value,
      relevance: document.getElementById("filterRelevance").value
    };
  }

  function renderEvidenceCardHTML(evidence, bookmarks) {
    var isBookmarked = bookmarks.indexOf(evidence.id) !== -1;
    var html = '<div class="evidence-card" data-id="' + evidence.id + '">';
    html += '<button class="bookmark-btn ' + (isBookmarked ? "active" : "") + '" data-action="bookmark" data-id="' + evidence.id + '" aria-label="Toggle bookmark for ' + evidence.title + '"><span class="bookmark-icon">' + (isBookmarked ? "★" : "☆") + "</span></button>";
    html += "<h3>" + evidence.title + "</h3>";
    html += '<div class="evidence-meta">' + evidence.id + " &middot; " + evidence.type + " &middot; " + formatDate(evidence.timestamp) + "</div>";
    html += '<div class="evidence-summary">' + evidence.summary + "</div>";

    if (evidence.tags.indexOf("critical") !== -1) {
      html += '<span class="badge badge-critical">Critical</span>';
    }
    html += '<span class="badge ' + getStatusBadgeClass(evidence.status) + '">' + evidence.status + "</span>";
    html += '<span class="badge ' + getRelevanceBadgeClass(evidence.relevance) + '">' + evidence.relevance + "</span>";
    html += "<div>";
    for (var t = 0; t < evidence.tags.length; t++) {
      html += '<span class="tag-chip">' + evidence.tags[t] + "</span>";
    }
    html += "</div>";
    html += "</div>";
    return html;
  }

  function renderEvidenceList(isLoading, results, bookmarks, onListClick) {
    var container = document.getElementById("evidenceList");
    if (!container) return;

    var loadingIndicator = document.getElementById("evidenceLoadingIndicator");
    if (isLoading) {
      if (loadingIndicator) loadingIndicator.classList.remove("hidden");
      container.innerHTML = "";
      return;
    }
    if (loadingIndicator) loadingIndicator.classList.add("hidden");

    var html = "";
    if (results.length === 0) {
      html = "<p>No evidence matches the current filters.</p>";
    }
    for (var i = 0; i < results.length; i++) {
      html += renderEvidenceCardHTML(results[i], bookmarks);
    }
    container.innerHTML = html;

    // Keep the original delegated listener behavior.
    container.addEventListener("click", onListClick);
  }

  function clearFilters() {
    document.getElementById("evidenceSearch").value = "";
    document.getElementById("filterType").value = "";
    document.getElementById("filterPerson").value = "";
    document.getElementById("filterLocation").value = "";
    document.getElementById("filterStatus").value = "";
    document.getElementById("filterRelevance").value = "";
  }

  function statusOptionHTML(current, value, label) {
    var currentLower = (current || "").toLowerCase();
    var selected = currentLower === value ? " selected" : "";
    return '<option value="' + value + '"' + selected + ">" + label + "</option>";
  }

  function renderEvidenceDetail(detail, storedNote, actions) {
    var section = document.getElementById("evidenceDetailSection");
    var evidence = detail.evidence;

    var tagsHtml = "";
    for (var t = 0; t < evidence.tags.length; t++) {
      tagsHtml += '<span class="tag-chip">' + evidence.tags[t] + "</span>";
    }

    var html = "";
    html += '<div class="evidence-detail-header">';
    html += "<div><h2>" + evidence.title + "</h2>";
    html += '<div class="evidence-meta">' + evidence.id + " &middot; " + evidence.type + " &middot; " + formatDate(evidence.timestamp) + "</div></div>";
    html += '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';
    html += "</div>";

    if (evidence.tags.indexOf("critical") !== -1) {
      html += '<div class="warning-banner">This item is tagged as critical evidence.</div>';
    }

    html += '<div class="detail-field"><strong>Summary</strong>' + evidence.summary + "</div>";
    html += '<div class="evidence-detail-content">' + evidence.content + "</div>";
    html += '<div class="detail-field"><strong>Related people</strong>' + detail.personNames.join(", ") + "</div>";
    html += '<div class="detail-field"><strong>Related locations</strong>' + detail.locationNames.join(", ") + "</div>";
    html += '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

    html += '<div class="detail-field"><strong>Review status</strong>';
    html += '<select id="detailStatusSelect">';
    html += statusOptionHTML(evidence.status, "unreviewed", "Unreviewed");
    html += statusOptionHTML(evidence.status, "reviewed", "Reviewed");
    html += statusOptionHTML(evidence.status, "flagged", "Flagged");
    html += "</select></div>";

    html += '<div class="detail-field"><strong>Relevance</strong>';
    html += '<select id="detailRelevanceSelect">';
    html += statusOptionHTML(evidence.relevance, "unknown", "Unknown");
    html += statusOptionHTML(evidence.relevance, "relevant", "Relevant");
    html += statusOptionHTML(evidence.relevance, "irrelevant", "Irrelevant");
    html += "</select></div>";

    html += '<div class="detail-field"><strong>Investigator note</strong>';
    html += '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' + evidence.id + '" placeholder="Add a private note about this evidence...">' + storedNote + "</textarea>";
    html += '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';
    html += "</div>";

    html += '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' + storedNote + "</div></div>";

    section.innerHTML = html;

    document.getElementById("detailStatusSelect").addEventListener("change", function (event) {
      actions.onStatusChange(evidence, event.target.value);
    });
    document.getElementById("detailRelevanceSelect").addEventListener("change", function (event) {
      actions.onRelevanceChange(evidence, event.target.value);
    });
  }

  return {
    hasFilterDropdowns: hasFilterDropdowns,
    hasListContainer: hasListContainer,
    populateDropdowns: populateDropdowns,
    readFilterCriteria: readFilterCriteria,
    renderEvidenceList: renderEvidenceList,
    getSortValue: function () { return document.getElementById("sortEvidence").value; },
    clearFilters: clearFilters,
    setPersonFilter: function (personId) { document.getElementById("filterPerson").value = personId; },
    showDetail: function () { document.getElementById("evidenceDetailSection").classList.remove("hidden"); },
    hideDetail: function () {
      var section = document.getElementById("evidenceDetailSection");
      section.classList.add("hidden");
      section.innerHTML = "";
    },
    scrollToDetail: function () {
      document.getElementById("evidenceDetailSection").scrollIntoView({ behavior: "smooth", block: "start" });
    },
    renderEvidenceDetail: renderEvidenceDetail,
    readCurrentNote: function () {
      var textarea = document.getElementById("evidenceNoteInput");
      if (!textarea) return null;
      return {
        evidenceId: textarea.getAttribute("data-evidence-id"),
        text: textarea.value
      };
    },
    updateNotePreview: function (text) {
      var preview = document.getElementById("notePreview");
      if (preview) preview.innerHTML = text;
    }
  };
}
