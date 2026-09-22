export function createWorkspaceView() {
  function renderBookmarksList(bookmarkedItems, onOpenEvidence) {
    var container = document.getElementById("bookmarksList");
    if (!container) return;

    if (bookmarkedItems.length === 0) {
      container.innerHTML = "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
      return;
    }

    var html = "";
    for (var i = 0; i < bookmarkedItems.length; i++) {
      var evidence = bookmarkedItems[i];
      html += '<div class="mini-list-item"><strong>' + evidence.id + "</strong> &mdash; " + evidence.title +
        ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' + evidence.id + '">Open</button></div>';
    }
    container.innerHTML = html;

    var openButtons = container.querySelectorAll("[data-open-evidence]");
    for (var b = 0; b < openButtons.length; b++) {
      openButtons[b].addEventListener("click", function (event) {
        onOpenEvidence(event.target.getAttribute("data-open-evidence"));
      });
    }
  }

  function renderNotesList(noteEntries) {
    var container = document.getElementById("notesList");
    if (!container) return;

    if (noteEntries.length === 0) {
      container.innerHTML = "<p>No notes yet. Add one from an evidence item's detail view.</p>";
      return;
    }

    var html = "";
    for (var n = 0; n < noteEntries.length; n++) {
      var entry = noteEntries[n];
      html += '<div class="mini-list-item"><strong>' + entry.evidenceId + "</strong> &mdash; " + entry.title;
      html += '<div id="noteText-' + entry.index + '">' + entry.text + "</div></div>";
    }
    container.innerHTML = html;
  }

  function populateHypothesisDropdowns(options) {
    var suspectSelect = document.getElementById("hypSuspect");
    var evidenceSelect = document.getElementById("hypEvidence");
    if (!suspectSelect || !evidenceSelect) return;

    var currentSuspect = suspectSelect.value;
    suspectSelect.innerHTML = '<option value="">Select a person…</option>';
    for (var p = 0; p < options.people.length; p++) {
      suspectSelect.innerHTML += '<option value="' + options.people[p].id + '">' + options.people[p].name + "</option>";
    }
    suspectSelect.value = currentSuspect;

    evidenceSelect.innerHTML = "";
    for (var i = 0; i < options.evidence.length; i++) {
      evidenceSelect.innerHTML += '<option value="' + options.evidence[i].id + '">' + options.evidence[i].id + " - " + options.evidence[i].title + "</option>";
    }
  }

  function getSelectedOptions(selectElement) {
    var result = [];
    for (var i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].selected) result.push(selectElement.options[i].value);
    }
    return result;
  }

  function readHypothesisDraft() {
    return {
      suspectId: document.getElementById("hypSuspect").value,
      nature: document.getElementById("hypNature").value,
      evidenceIds: getSelectedOptions(document.getElementById("hypEvidence")),
      confidence: document.getElementById("hypConfidence").value,
      explanation: document.getElementById("hypExplanation").value,
      alternative: document.getElementById("hypAlternative").value,
      savedAt: new Date().toISOString()
    };
  }

  function applyHypothesisDraft(draft) {
    document.getElementById("hypSuspect").value = draft.suspectId || "";
    document.getElementById("hypNature").value = draft.nature || "";
    document.getElementById("hypConfidence").value = draft.confidence || 50;
    document.getElementById("hypConfidenceValue").textContent = draft.confidence || 50;
    document.getElementById("hypExplanation").value = draft.explanation || "";
    document.getElementById("hypAlternative").value = draft.alternative || "";

    var evidenceSelect = document.getElementById("hypEvidence");
    var savedIds = draft.evidenceIds || [];
    for (var i = 0; i < evidenceSelect.options.length; i++) {
      evidenceSelect.options[i].selected = savedIds.indexOf(evidenceSelect.options[i].value) !== -1;
    }
  }

  function showHypothesisSaved() {
    var message = document.getElementById("hypothesisSavedMsg");
    message.classList.remove("hidden");
    setTimeout(function () {
      message.classList.add("hidden");
    }, 2000);
  }

  function bindConfidenceInput() {
    document.getElementById("hypConfidence").addEventListener("input", function (event) {
      document.getElementById("hypConfidenceValue").textContent = event.target.value;
    });
  }

  return {
    renderBookmarksList: renderBookmarksList,
    renderNotesList: renderNotesList,
    populateHypothesisDropdowns: populateHypothesisDropdowns,
    readHypothesisDraft: readHypothesisDraft,
    applyHypothesisDraft: applyHypothesisDraft,
    showHypothesisSaved: showHypothesisSaved,
    bindConfidenceInput: bindConfidenceInput
  };
}
