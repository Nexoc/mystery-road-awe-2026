# Demo 1 Refactoring Plan — Split the App into ES Modules

## Scope

Split the existing `app.js` into native ES modules without changing application behavior. Existing bugs, loading order, and Promise behavior must remain unchanged.

## Plan

1. Record the current application behavior and create a baseline commit.
2. Define module boundaries, exports, imports, and dependency direction.
3. Move shared application state to `src/app/state.js`.
4. Move reusable helpers to `src/shared/utils.js` and persistence helpers to `src/shared/storage.js`.
5. Move feature-specific code into the dashboard, evidence, people, timeline, and workspace modules.
6. Move data loading to `src/app/data.js`.
7. Move hash routing to `src/app/navigation.js`.
8. Use `src/main.js` to connect initialization, event listeners, storage, data loading, and navigation.
9. Preserve the behavior of existing inline event handlers when moving to module scope.
10. Update `index.html` to load `src/main.js` with `<script type="module">`.
11. Test every view, filter, navigation path, and local-storage feature.
12. Confirm that no bugs, Promise timing, or user-visible behavior changed.
13. Create a dedicated commit for Demo 1.

## Ergebnis und Architektur

Die Anwendung wurde als reines Refactoring ohne beabsichtigte Verhaltensänderungen aus dem bisherigen `app.js` in native ES-Module aufgeteilt. `index.html` lädt jetzt `src/main.js` mit `type="module"`; das nicht mehr benötigte `app.js` wurde entfernt.

- `src/main.js`: Einstiegspunkt der Anwendung. Verbindet Initialisierung, Event Listener, Local Storage, Datenladen und Routing. Es stellt außerdem die weiterhin benötigten Funktionen für bestehende Inline-Handler über `window` bereit.
- `src/app/state.js`: Enthält den gemeinsam genutzten Anwendungszustand, zum Beispiel Evidence, People, Locations, Timeline, Bookmarks und Render-Status.
- `src/app/data.js`: Lädt die JSON-Dateien, schreibt die Ergebnisse in den State und startet abhängige Render- und Dropdown-Funktionen.
- `src/app/navigation.js`: Verarbeitet den URL-Hash, aktiviert die passende View und ruft deren Render-Funktion auf.
- `src/modules/dashboard/dashboard.js`: Rendert Fallübersicht, Statistiken, Review-Fortschritt sowie aktuelle Evidence- und Timeline-Einträge.
- `src/modules/evidence/evidence.js`: Verantwortlich für Katalog, Filter, Sortierung, Suche, Bookmarks und Evidence-Detailansicht.
- `src/modules/people/people.js`: Rendert Personen und Orte, verwaltet die Tabs und verbindet Personen mit ihren Evidence-Einträgen.
- `src/modules/timeline/timeline.js`: Rendert und filtert die Timeline und verwaltet die Evidence-Schnellansicht.
- `src/modules/workspace/workspace.js`: Rendert Bookmarks und Notizen und verwaltet den Hypothesen-Entwurf.
- `src/shared/storage.js`: Kapselt den Zugriff auf `localStorage` für Bookmarks, Notizen und Hypothesen.
- `src/shared/utils.js`: Enthält gemeinsam verwendete Such-, Zuordnungs-, Datums- und Badge-Hilfsfunktionen.

Der Startablauf bleibt erhalten: `DOMContentLoaded` → `initApp()` → gespeicherte Daten laden → Event Listener registrieren → JSON-Daten laden → Hash auswerten → passende View rendern. Bekannte Fehler und auffälliges Promise-Verhalten wurden für die späteren Übungen bewusst nicht verändert.

## Out of Scope

- Bug fixes
- Replacing `var` with `let` or `const`
- Refactoring Promises to `async`/`await`
- Converting functions to arrow functions
- TypeScript, frameworks, bundlers, build tools, or new features

## Completion Criteria

- The application runs through a local HTTP server.
- `index.html` loads the ES-module entry point.
- All existing features behave exactly as before.
- Every import and export has a clear reason.
- No Demo 2–10 changes are included.
