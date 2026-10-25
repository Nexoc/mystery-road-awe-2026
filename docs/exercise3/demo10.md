# Demo 10 – Migration des Dashboards zu React

## Ergebnis

Das Dashboard wird jetzt deklarativ mit React-Komponenten aufgebaut. Es verwendet dieselben
JSON-Dateien und denselben `localStorage`-Eintrag wie die Vanilla-Anwendung, importiert aber weder
deren globalen State noch ihre DOM-Renderer.

```text
loadInvestigationData()
  → App data prop
  → DashboardPage
     ├─ CaseSummary
     ├─ DashboardStats
     │  └─ StatCard × 5
     ├─ ReviewProgress
     ├─ RecentEvidence
     └─ RecentTimeline
```

## Woher kommen die Daten und wie gelangen sie zu den Komponenten?

`src/react/data.ts` lädt `case.json`, `evidence.json`, `people.json`, `locations.json` und
`timeline.json` parallel. Jede HTTP-Antwort und jede JSON-Struktur wird geprüft. Bookmark-IDs werden
defensiv aus `remotion_bookmarks` gelesen; ungültiges JSON ergibt eine leere Liste.

Der React Entry Point wartet einmal auf alle Daten und übergibt das fertige `InvestigationData`-Objekt
als Prop an `App`. `App` reicht es an `DashboardPage` weiter. Die kleineren Komponenten erhalten nur
die Werte, die sie tatsächlich darstellen. Die JSON-Requests liegen außerhalb des React-Renders,
deshalb werden sie durch `StrictMode` nicht doppelt ausgeführt und bei einem Hash-Wechsel nicht neu
gestartet.

Das ist eine bewusste Zwischenarchitektur. Für das nur lesende Dashboard sind unveränderliche Props
ausreichend. Wenn spätere Views Evidence, Bookmarks und Notes interaktiv verändern, soll gemeinsamer
React-State über einen Provider und einen Reducer verwaltet werden.

## Abgeleitete Werte

`DashboardPage` berechnet bei jedem Render aus den aktuellen Props:

- Anzahl der Evidence-, People-, Location- und Bookmark-Einträge;
- Anzahl der Evidence-Einträge mit Status `reviewed`, unabhängig von Groß-/Kleinschreibung;
- Review-Prozentwert; bei null Evidence ist er sicher `0`;
- die letzten fünf Evidence- und Timeline-Einträge.

Für die Recent-Listen wird zuerst `slice(-5)` verwendet und erst danach `reverse()`. Dadurch werden
die übergebenen Arrays nicht verändert. Listen verwenden ihre fachlichen IDs als stabile React-Keys.
Leere Listen zeigen einen verständlichen Hinweis.

## Warum entsteht der alte Stale-Data-Fehler nicht erneut?

Die Vanilla-Anwendung besaß einen manuellen `viewRendered`-Cache. War der Dashboard-Flag bereits
gesetzt, konnte ein notwendiger Aufruf von `renderDashboard()` ausbleiben und alte Zahlen blieben im
DOM stehen.

Die React-Version besitzt keinen solchen Flag und keine gespeicherte HTML-Kopie. Beim Anzeigen des
Dashboards rendert `DashboardPage` aus den aktuellen Props und berechnet Statistiken, Fortschritt und
Recent-Listen neu. React verhindert nicht automatisch jeden Stale-State-Fehler, aber dieser konkrete
manuelle Render-Cache existiert nicht mehr. Zukünftige State-Updates müssen weiterhin unveränderlich
erfolgen.

## Unterschied beim Zeitpunkt der Berechnung

Vanilla berechnete die Werte nur, wenn Code ausdrücklich `renderDashboard()` aufrief. React berechnet
sie immer dann, wenn `DashboardPage` rendert. Beim Wegnavigieren wird die Seite entfernt; bei der
Rückkehr wird sie aus denselben unveränderten Daten erneut aufgebaut. Es wird kein zusätzlicher State
für Prozentwerte oder Recent-Listen gespeichert.

## Überprüfung mit den aktuellen Daten

- Evidence: 18
- People: 6
- Locations: 6
- Reviewed: 1
- Review progress: 6 %
- Recent evidence: E18 bis E14
- Recent timeline: T15 bis T11

Dashboard → Placeholder → Dashboard sowie Browser Back/Forward verändern oder duplizieren die Daten
nicht. Die fünf JSON-Dateien werden nur beim Start der React-Anwendung geladen.
