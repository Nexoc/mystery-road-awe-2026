import { formatDate, getStatusBadgeClass } from "../../shared/utils.js";

function statCardHTML(value, label) {
  return '<div class="stat-card"><div class="stat-value">' + value + '</div><div class="stat-label">' + label + "</div></div>";
}

export function renderDashboard(snapshot) {
  var container = document.getElementById("dashboardContent");
  if (!container) return;

  var html = "";
  html += '<div class="case-summary-card">';
  html += "<h3>" + (snapshot.caseData.title || "Case") + "</h3>";
  html += '<p><span class="badge badge-flagged">' + (snapshot.caseData.status || "unknown").toUpperCase() + "</span></p>";
  html += "<p>" + (snapshot.caseData.summary || "") + "</p>";
  html += "</div>";

  html += '<div class="stat-grid">';
  html += statCardHTML(snapshot.evidenceCount, "Evidence items");
  html += statCardHTML(snapshot.peopleCount, "People");
  html += statCardHTML(snapshot.locationCount, "Locations");
  html += statCardHTML(snapshot.bookmarkCount, "Bookmarked");
  html += statCardHTML(snapshot.reviewedCount, "Reviewed");
  html += "</div>";

  html += '<div class="dashboard-panel">';
  html += "<h3>Review progress</h3>";
  html += '<div class="progress-bar-outer"><div class="progress-bar-inner" style="width:' + snapshot.progressPct + '%;"></div></div>';
  html += "<p>" + snapshot.progressPct + "% of evidence reviewed</p>";
  html += "</div>";

  html += '<div class="dashboard-columns">';

  html += '<div class="dashboard-panel"><h3>Recent evidence</h3>';
  if (snapshot.recentEvidence.length === 0) {
    html += "<p>No evidence loaded yet.</p>";
  }
  for (var e = 0; e < snapshot.recentEvidence.length; e++) {
    var ev = snapshot.recentEvidence[e];
    html += '<div class="mini-list-item"><strong>' + ev.id + "</strong> &mdash; " + ev.title +
      ' <span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span></div>";
  }
  html += "</div>";

  html += '<div class="dashboard-panel"><h3>Recent timeline events</h3>';
  if (snapshot.recentTimeline.length === 0) {
    html += "<p>No timeline events loaded yet.</p>";
  }
  for (var t = 0; t < snapshot.recentTimeline.length; t++) {
    var evt = snapshot.recentTimeline[t];
    html += '<div class="mini-list-item"><strong>' + formatDate(evt.time) + "</strong><br>" + evt.title + "</div>";
  }
  html += "</div>";

  html += "</div>"; // dashboard-columns

  container.innerHTML = html;
}
