# Demo 8 – Clean Code: Globals, `var`/`let`/`const` und Code Smells

## Ziel

Alle alten `var`-Deklarationen werden bewusst durch `const` oder `let` ersetzt. Außerdem werden
unnötige globale Zustände und konkrete Code Smells bereinigt, ohne neue Features einzubauen.

## Top-Level-Variablen im ursprünglichen `app.js`

Der Stand vor dem Module-Split aus Demo 1 enthielt folgende Top-Level-`var`-Bindings:

| Variable | Zustand nach dem Refactoring |
|---|---|
| `allEvidence` | `state.allEvidence` in `app/state.js` |
| `filteredEvidence` | `state.filteredEvidence` in `app/state.js` |
| `selectedEvidence` | modul-lokales `let` in `evidence.js` |
| `bookmarks` | `state.bookmarks` in `app/state.js` |
| `currentPage` | `state.currentPage` in `app/state.js` |
| `allPeople` | `state.allPeople` in `app/state.js` |
| `allLocations` | `state.allLocations` in `app/state.js` |
| `allTimeline` | `state.allTimeline` in `app/state.js` |
| `caseData` | `state.caseData` in `app/state.js` |
| `currentPeopleTab` | entfernt, weil der Wert nie gelesen wurde |
| `loadingStepsRemaining` | modul-lokales `let` in `app/data.js` |
| `evidenceViewLoading` | modul-lokales `let` in `evidence.js` |
| `viewRendered` | `state.viewRendered` in `app/state.js` |
| `notesStore` | `state.notesStore` in `app/state.js` |
| `modalCloseListenerCount` | mit dem fehlerhaften Listener-Zähler entfernt |
| `STORAGE_KEY_BOOKMARKS` | privates `const` in `shared/storage.js` |
| `STORAGE_KEY_NOTES` | privates `const` in `shared/storage.js` |
| `STORAGE_KEY_HYPOTHESIS` | gezielt exportiertes `const` in `shared/storage.js` |
| `latestSearchRequestId` | modul-lokales `let` in `evidence.js` |

Drei konkrete Kollisionsrisiken im alten klassischen Script:

- `currentPage` hätte von einem anderen Script für Pagination überschrieben werden können.
- `selectedEvidence` hätte mit einem gleich benannten Auswahlzustand einer anderen View kollidieren können.
- `loadingStepsRemaining` hätte ein zweiter Loader versehentlich zurücksetzen oder dekrementieren können.

ES-Module kapseln diese Namen pro Datei. Auf den gemeinsamen `state` kann weiterhin geschrieben
werden, aber nur nach einem expliziten Import; dadurch sind Abhängigkeiten sichtbar statt zufällig global.

## `var` durch `const` und `let` ersetzt

- `const` wird verwendet, wenn das Binding nicht neu zugewiesen wird, zum Beispiel für DOM-Elemente,
  Storage Keys und Arrays, die nur mit `push()` verändert werden.
- `let` wird nur für echte Neuzuweisungen verwendet: Zähler, Schleifenindizes, aufgebaute HTML-Strings,
  `hash`, Loading-State und den aktuell ausgewählten Evidence-Eintrag.
- Im gesamten Ordner `src` gibt es keine aktive `var`-Deklaration mehr.

Ein `const`-Array oder -Objekt darf weiterhin inhaltlich verändert werden. Verboten ist nur, das
Binding selbst auf ein anderes Array oder Objekt zu setzen.

## Behobene Code Smells

### 1. Doppelte Event Listener

`hashchange` wurde zweimal registriert. Außerdem besaß `filterStatus` gleichzeitig einen
`addEventListener` und ein stringbasiertes `onchange`, wodurch dieselbe Render-Funktion zweimal lief.
Beide Ereignisse werden jetzt genau einmal registriert; die dadurch unnötige globale
`window.renderEvidenceList`-Bridge wurde entfernt.

### 2. Akkumulierende Modal-Listener

Bei jedem Öffnen der Timeline-Schnellansicht wurde ein weiterer Click-Listener an dasselbe dauerhafte
Modal gehängt. Der Listener wird jetzt nur beim erstmaligen Erzeugen des Modals registriert. Der reine
Debug-Zähler `modalCloseListenerCount` und sein Log wurden entfernt.

### 3. Duplizierte Lookup-Schleifen und Dead State

Die drei fast identischen Suchschleifen für Evidence, People und Locations verwenden jetzt den privaten
Helper `findById(items, id)`. Ihre bisherigen öffentlichen Funktionen bleiben als sprechende Wrapper
erhalten. `currentPeopleTab` wurde entfernt, weil es nur beschrieben, aber nie gelesen wurde.

## Leitfragen

- **`var`, `let`, `const`:** `var` ist funktionsweit sichtbar, wird gehoistet und erlaubt Neuzuweisung
  sowie erneute Deklaration. `let` ist block-scoped und neu zuweisbar. `const` ist ebenfalls block-scoped,
  darf aber nicht neu gebunden werden. Der frühere Navigationsloop mit `for (var i ...)` teilte ein Binding
  zwischen allen Callbacks; nach dem Loop war `i === navButtons.length`. `let i` erzeugt dagegen pro
  Iteration ein eigenes Binding und verhindert genau diese Fehlerklasse.
- **Accidental global:** In einem klassischen Script ohne Strict Mode erzeugt beispielsweise
  `misspelledCount = 1` ohne Deklaration eine Eigenschaft auf `window`. ES-Module laufen immer im Strict
  Mode; derselbe Fehler wirft deshalb sofort einen `ReferenceError`. Ein bewusstes `window.foo = ...`
  bleibt möglich, ist aber ausdrücklich als globale Schnittstelle erkennbar.
- **Funktioniert, aber trotzdem unsauber:** Die drei separaten ID-Suchschleifen funktionierten, mussten
  aber bei jeder Änderung synchron gepflegt werden. Der gemeinsame private Helper reduziert
  Wiederholung, Review-Aufwand und das Risiko, dass eine Variante später anders reagiert.

## Verifikation

- `rg -n '\bvar\b' src` liefert keine Treffer.
- Alle 11 JavaScript-Dateien bestehen die Syntaxprüfung.
- Ein Headless-Browser-Smoke-Test rendert alle fünf Views mit ihren Daten (unter anderem 18
  Evidence-Karten).
- Nach zweimaligem Öffnen der Timeline-Schnellansicht existiert weiterhin genau ein Modal-Listener;
  auch `hashchange` und der Statusfilter besitzen jeweils genau einen Listener und keinen Inline-Handler.

## Ergebnis

Demo 8 ersetzt alle aktiven `var`-Deklarationen bewusst, kapselt veränderlichen Zustand besser und
entfernt mehrere konkrete Smells. Promise-Ketten und klassische Funktionssyntax bleiben unverändert,
weil sie erst in Demo 9 und Demo 10 behandelt werden.
