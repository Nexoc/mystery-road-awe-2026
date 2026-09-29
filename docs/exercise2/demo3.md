# Demo 3 – Production Build und Preview

## Ziel

Den echten Production-Build erstellen, aus `dist/` starten und mit dem Dev-Modus vergleichen.

## Ausgangssituation

Die App lief mit `npm run dev`. Die fünf JSON-Dateien lagen aber im Root-Ordner `data/`.
Der Code lud sie mit relativen Pfaden wie `fetch("data/case.json")`.

## Umsetzung

### Schritt 1 – Production-Build erstellen

```bash
npm run build
```

Vite erstellte unter anderem:

- `dist/index.html`
- `dist/assets/index-[hash].css`
- `dist/assets/index-[hash].js`

### Schritt 2 – Build separat testen

```bash
npm run preview
```

Die Preview lief auf `localhost:4173`, aber die App blieb bei **Loading case file…** stehen.
In der Console stand:

```text
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Der zusätzliche `favicon.ico`-404 war nicht die Ursache.

### Schritt 3 – Ursache finden und beheben

Vite kopierte den Root-Ordner `data/` nicht nach `dist/`. Deshalb lieferte die Preview für
`data/*.json` den HTML-Fallback. `JSON.parse` bekam also `<!DOCTYPE ...` statt JSON.

Wir verschoben alle fünf Dateien nach `public/data/`:

- `case.json`, `evidence.json`, `locations.json`
- `people.json`, `timeline.json`

Vite kopiert Dateien aus `public/` ohne Transformation in das Root des Builds:
`public/data/case.json` wird zu `dist/data/case.json`. Die vorhandenen Fetch-Pfade konnten bleiben.

### Schritt 4 – Erneut prüfen

```bash
npm run build
npm run preview
npm run dev
```

Danach lagen alle fünf Dateien in `dist/data/`. Dashboard, Evidence, People, Timeline und
Workspace funktionierten in der Preview. Auch der Dev-Server funktionierte weiter.

## Beobachtete Build-Transformationen

1. Vite bündelte die Module zu wenigen Production-Dateien.
2. JavaScript und CSS wurden kompakter beziehungsweise minifiziert.
3. CSS und JavaScript bekamen Content-Hashes im Dateinamen.

Ein Content-Hash ändert sich mit dem Dateiinhalt. Browser können unveränderte Dateien lange
cachen; nach einem Update lädt ein neuer Dateiname sicher die neue Version.

## Warum nicht den Dev-Server deployen?

Der Dev-Server transformiert Dateien während der Entwicklung und enthält HMR-Funktionen.
Er ist für schnelles Debugging gebaut, nicht für Performance, Stabilität und sicheren Betrieb.
Deployt wird deshalb der optimierte Inhalt aus `dist/`.

## Ergebnis

Der Production-only-Fehler wurde gefunden und behoben. Die Demo zeigt, warum `build` und
`preview` zusätzlich zum Dev-Server geprüft werden müssen.
