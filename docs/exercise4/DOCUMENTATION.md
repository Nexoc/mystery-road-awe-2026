# Übung 4 – Änderungen und Antworten

Diese Dokumentation folgt den zehn Demos aus `EXERCISE_4 (1).md`. Zu jeder Demo steht kurz, was wir
geändert haben und wie wir die Fragen beantworten.

Die React-Version läuft unter `/?react=1`.

## Demo 1 – JSX, Komponenten, Props und `children`

### Was haben wir geändert?

- Wir haben `PersonCard`, `LocationCard`, `TimelineEventCard`, `PeopleSection`, `LocationsSection`
  und `TimelineFilters` erstellt.
- Alle Props sind mit TypeScript typisiert. Es gibt kein `any`.
- `ContentPanel` erhält einen benannten Prop `title` und den Seiteninhalt über `children`.

### Antworten

1. **Was darf in `{...}` stehen?**
   Zum Beispiel `{person.name}`, `{people.length}` oder ein ternärer Ausdruck. Erlaubt sind
   JavaScript-Ausdrücke, die einen Wert liefern. Anweisungen wie `if`, `for`, `switch` oder eine
   Variablendeklaration müssen vor dem JSX stehen.

2. **Was prüft TypeScript bei Props?**
   `PersonCard` erwartet ein vollständiges `Person`-Objekt. Der temporäre Test
   `<PersonCard person="Nova" />` erzeugt einen Typfehler, weil ein String kein `Person` ist. Dieser
   falsche Test darf nicht im fertigen Code bleiben.

3. **Benannter Prop oder `children`?**
   Ein benannter Prop hat eine feste Bedeutung, zum Beispiel `title` oder `person`. `children` ist
   flexibler Inhalt zwischen den Tags. Bei `ContentPanel` ist der Titel fest definiert, aber der
   Inhalt der Panel-Hülle kann unterschiedlich sein.

4. **Warum keine direkte DOM-Manipulation?**
   React geht davon aus, dass React den DOM-Bereich innerhalb des Root-Elements verwaltet. Manuelle
   Änderungen mit `innerHTML`, `classList` oder `appendChild` können dem React-Baum widersprechen und
   beim nächsten Render überschrieben werden.

## Demo 2 – Bedingtes Rendern

### Was haben wir geändert?

- Leere People- und Locations-Listen zeigen einen Hinweis statt eines leeren Grids.
- Verantwortlichkeiten werden nur angezeigt, wenn sie vorhanden sind.
- Die Timeline zeigt abhängig von der URL eine Filter-Zusammenfassung oder eine Warnung.
- `getCertaintyTone()` bestimmt die Farbe des Timeline-Badges.

### Antworten

1. **Wo verwenden wir `&&`?**
   In `PersonCard` steht `hasResponsibilities && (...)`. `hasResponsibilities` ist durch
   `length > 0` ein Boolean. Bei `0 && <Component />` könnte React dagegen die Zahl `0` anzeigen.

2. **Warum `null` statt eines leeren `<div>`?**
   `null` erzeugt kein DOM-Element. Ein leeres `<div>` erzeugt einen unnötigen Knoten und kann das
   Layout beeinflussen. Im aktuellen Code verwenden wir kein `null`, weil bei fehlenden Daten ein
   verständlicher Hinweis angezeigt wird. Optionale Blöcke werden mit `&&` ausgelassen.

## Demo 3 – Collections rendern

### Was haben wir geändert?

- People werden mit `person.id`, Locations mit `location.id` und Timeline Events mit `event.id` als
  `key` gerendert.

### Antwort

React benutzt `key`, um ein Element unter seinen Geschwistern zwischen zwei Render-Vorgängen
wiederzuerkennen. Dadurch kann React Einfügen, Entfernen und Verschieben korrekt behandeln und den
passenden DOM- und Komponenten-Zustand erhalten. `key` wird nicht als normaler Prop weitergegeben.

## Demo 4 – Stabile Keys und Identität

### Was haben wir geändert?

- Wir haben die Lernroute `/key-demo` erstellt.
- Die Demo verwendet unkontrollierte Inputs und dreht die Liste über `?order=reverse` um.
- `key={index}` bleibt dort absichtlich sichtbar, damit die falsche Zuordnung gezeigt werden kann.
- Alle echten Listen verwenden stabile IDs.

### Antworten

1. **Was passiert bei fehlenden, doppelten oder Index-Keys?**
   Ohne Keys warnt React und ordnet Elemente hauptsächlich nach Position zu. Doppelte Keys machen
   die Identität mehrdeutig. Ein Index-Key gehört zur Position und nicht zum Datensatz. Nach Sortieren
   oder Filtern können deshalb DOM-Zustand, Fokus oder Eingabewerte zum falschen Datensatz wechseln.

2. **Ist der Fehler für Benutzer sichtbar?**
   Ja. Wenn wir den Text im ersten Input ändern und danach die Liste umdrehen, bleibt der Text an
   Position 1, obwohl dort jetzt ein anderer Datensatz steht. Das ist mehr als nur eine Warnung in der
   Konsole.

3. **Wann ist `key={index}` erlaubt?**
   Nur bei einer vollständig statischen Liste ohne stabile IDs, die nie sortiert, gefiltert,
   erweitert oder gelöscht wird und keinen eigenen Elementzustand besitzt. In diesem Projekt haben
   die echten Daten bereits IDs.

> **Offener Punkt:** Für den endgültig korrigierten Stand muss in `KeyIdentityDemo` nach der
> Demonstration `key={index}` durch `key={item.id}` ersetzt werden. Aktuell steht die richtige Lösung
> nur im Kommentar.

## Demo 5 – Presentational und Feature Components

### Was haben wir geändert?

Wir haben große Bereiche in kleinere Komponenten geteilt. Besonders die Timeline besteht jetzt aus
`TimelinePage`, `TimelineFilters` und `TimelineEventCard`.

### Einteilung

- **Feature-/Container-Komponenten:** `App`, `AppRoutes`, `Navigation`, `DashboardPage`,
  `PeopleLocationsLayout`, `PersonDetailsPage`, `TimelinePage`, `KeyIdentityDemo`.
- **Presentational Components:** `Header`, `Footer`, `PlaceholderPage`, `NotFoundPage`, die kleinen
  Dashboard-Komponenten, `PeopleSection`, `LocationsSection`, `PersonCard`, `LocationCard`,
  `ContentPanel`, `TimelineFilters`, `TimelineEventCard` und `Badge`.

### Antworten

1. **Welche Verantwortung haben die getrennten Teile?**
   `TimelinePage` liest den Query-Parameter und bereitet die sichtbaren Daten vor.
   `TimelineFilters` zeichnet die Filter. `TimelineEventCard` zeigt ein Ereignis. Das Markup einer
   Karte kann geändert werden, ohne die Filterlogik zu ändern, solange der Props-Vertrag gleich
   bleibt.

2. **Welche Regel trennt Feature und Darstellung?**
   Ein Feature-/Container-Component kennt URL, Auswahl oder Datenvorbereitung. Ein
   Presentational Component erhält fertige Props und stellt hauptsächlich UI dar.

## Demo 6 – Feature-orientierte Ordnerstruktur

### Was haben wir geändert?

```text
src/react/
├── app/
├── features/
│   ├── dashboard/
│   ├── key-identity/
│   ├── people-locations/
│   └── timeline/
└── shared/components/
```

### Antworten

1. **Struktur nach Typ oder nach Feature?**
   Bei „nach Typ“ liegen zum Beispiel alle Komponenten in einem Ordner. Bei „nach Feature“ liegen
   alle Dateien eines Bereichs zusammen. Die Feature-Struktur passt hier besser, weil Dashboard,
   People & Locations und Timeline getrennte Bereiche sind.

2. **Wann ist etwas `shared`?**
   Ein Baustein bleibt lokal, wenn nur ein Feature ihn braucht, zum Beispiel `PersonCard` oder
   `ContentPanel`. Er kommt nach `shared`, wenn verschiedene Features ihn wirklich verwenden. `Badge`
   wird im Dashboard und in der Timeline benutzt.

## Demo 7 – Wiederverwendbare UI-Elemente

### Was haben wir geändert?

Wir haben die typisierte `Badge`-Komponente erstellt. Sie wird in `CaseSummary`, `RecentEvidence` und
`TimelineEventCard` verwendet.

### Antworten

1. **Was ändert sich über Props und was bleibt fest?**
   `tone` und `children` ändern Farbe und Text. Das `<span>`, die Basisklasse `badge` und die Zuordnung
   von `tone` zu einer CSS-Klasse bleiben in der Komponente fest.

2. **Vorteil gegenüber kopierten Template-Strings?**
   `Badge` bietet eine zentrale Implementierung und eine typisierte API. Stil oder Markup werden nur
   an einer Stelle geändert. Kopierte HTML-Strings können leicht unterschiedlich werden.

## Demo 8 – Routing

### Was haben wir geändert?

- Wir haben React Router und `HashRouter` verwendet.
- Dashboard, People, Locations und Timeline besitzen echte Routen.
- People und Locations sind verschachtelte Routen mit `NavLink` und `Outlet`.
- Die Route `*` zeigt `NotFoundPage`.

### Antworten

1. **Warum echte Routen statt lokalem Tab-State?**
   Der Benutzer kann eine URL speichern, teilen, neu laden oder in einem neuen Tab öffnen. Außerdem
   funktionieren die Browser-Tasten Zurück und Vorwärts.

2. **Was passiert bei einer unbekannten URL?**
   React zeigt eine Not-found-Seite mit einem Link zum Dashboard. Die Vanilla-Version leitete einen
   falschen Hash dagegen still auf das Dashboard um.

## Demo 9 – Route-Parameter

### Was haben wir geändert?

- Die Route `/team/people/:personId` wurde hinzugefügt.
- Jede `PersonCard` verlinkt auf die passende Detailseite.
- `PersonDetailsPage` liest die ID und behandelt fehlende oder unbekannte IDs.

### Antworten

1. **Wie lesen und prüfen wir den Parameter?**
   `const { personId } = useParams<"personId">()` liefert `string | undefined`. Zuerst prüfen wir
   `undefined`, danach suchen wir mit `people.find(...)`. Eine unbekannte ID zeigt „Person not found“
   statt eines Absturzes.

2. **Route-Parameter oder Query-Parameter?**
   `/team/people/nova-byte` bezeichnet eine konkrete Person als Hauptressource der Seite.
   `?person=nova-byte` ist eine optionale Einstellung oder ein Filter einer bestehenden Seite. Darum
   verwendet die Detailseite einen Route-Parameter und die Timeline einen Query-Parameter.

## Demo 10 – Query-Parameter und Abschluss

### Was haben wir geändert?

- `TimelinePage` liest `?person=...` mit `useSearchParams`.
- Eine gültige ID filtert die sichtbaren Events und setzt den anfänglichen Select-Wert.
- Eine unbekannte ID zeigt eine Warnung und anschließend alle Events.
- Dashboard, People & Locations und Timeline sind React-Routen ohne manuelle DOM-Erzeugung.

### Antworten

1. **Warum ist das noch keine echte Interaktivität?**
   Die Ansicht wird direkt aus URL und Props berechnet. Es gibt keinen eigenen veränderbaren
   Filter-State und keine `onChange`-Handler für die Selects. Damit beschreibt die URL nur die
   dargestellte Ausgangsansicht.

2. **Was brauchen funktionierende Filter?**
   Wir brauchen `onChange`, kontrollierte `value`-Props und Zustand über `useState` oder
   `useReducer`. Aus diesem Zustand muss anschließend die sichtbare Liste berechnet werden. Optional
   kann der Zustand wieder in die URL geschrieben werden.

3. **Welche doppelte Logik wurde noch nicht extrahiert?**
   `DashboardPage` besitzt eine lokale `formatDate`-Funktion, während die Timeline die gemeinsame
   Funktion aus `src/shared/utils.ts` nutzt. Wir haben das zunächst nicht geändert, um den Umfang der
   Migration klein zu halten. Später sollte auch das Dashboard die gemeinsame Funktion verwenden.

## Prüfung

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

`src/react/main.tsx` verwendet `document.getElementById` nur einmal für den React-Mount-Punkt. Die
migrierten Views selbst verwenden kein `innerHTML`, `document.createElement`, `appendChild` oder
manuelles `classList`.
