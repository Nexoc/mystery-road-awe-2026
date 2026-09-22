import { state } from "../../app/state.js";
import {
  readBookmarks,
  readHypothesis,
  readNotes,
  writeBookmarks,
  writeHypothesis,
  writeNotes
} from "../../shared/storage.js";

export function createWorkspaceModel() {
  function loadPersistentState() {
    state.bookmarks = readBookmarks();
    state.notesStore = readNotes();
  }

  function saveBookmarks(bookmarks) {
    writeBookmarks(bookmarks);
  }

  function saveNote(evidenceId, text) {
    state.notesStore[evidenceId] = text;
    writeNotes(state.notesStore);
  }

  function loadNote(evidenceId) {
    return state.notesStore[evidenceId] || "";
  }

  function loadNoteAsync(evidenceId) {
    return new Promise(function (resolve) {
      resolve(state.notesStore[evidenceId] || "");
    });
  }

  function getBookmarkedItems() {
    return state.allEvidence.filter(function (evidence) {
      return evidence.bookmarked;
    });
  }

  function getNoteEntries() {
    var noteEntries = [];
    for (var i = 0; i < state.allEvidence.length; i++) {
      var note = state.notesStore[state.allEvidence[i].id];
      if (note) {
        noteEntries.push({
          index: i,
          evidenceId: state.allEvidence[i].id,
          title: state.allEvidence[i].title,
          text: note
        });
      }
    }
    return noteEntries;
  }

  return {
    loadPersistentState: loadPersistentState,
    saveBookmarks: saveBookmarks,
    saveNote: saveNote,
    loadNote: loadNote,
    loadNoteAsync: loadNoteAsync,
    getBookmarkedItems: getBookmarkedItems,
    getNoteEntries: getNoteEntries,
    getHypothesisOptions: function () {
      return {
        people: state.allPeople,
        evidence: state.allEvidence
      };
    },
    loadHypothesisDraft: readHypothesis,
    storeHypothesisDraft: writeHypothesis
  };
}
