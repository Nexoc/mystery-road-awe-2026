# Demo 7 – Vollständige TypeScript-Migration

## Ziel

Alle übrigen JavaScript-Module nach TypeScript migrieren, echte Typfehler lösen und das bisherige
Verhalten der Anwendung erhalten.

## Ausgangssituation

`state`, `utils` und `storage` waren bereits TypeScript. Acht Module waren noch JavaScript:
`dashboard`, `people`, `timeline`, `workspace`, `evidence`, `data`, `navigation` und `main`.

## Umsetzung

### Schritt 1 – Alle Module migrieren

Die acht `.js`-Dateien wurden zu `.ts`. `index.html` lädt jetzt `src/main.ts`. Im Ordner `src`
gibt es keine JavaScript-Dateien mehr.

### Schritt 2 – Typen und Daten-Grenzen ergänzen

- Funktionen haben konkrete Parameter- und Rückgabetypen.
- `Evidence` bekam das reale optionale Feld `bookmarked?: boolean`.
- View-Namen nutzen den Union Type `ViewName`.
- Ergebnisse von `fetch().json()` werden zuerst als `unknown` behandelt.
- Runtime Type Guards prüfen Case, People, Locations, Evidence und Timeline.

Es wurde kein `any` benutzt.

### Schritt 3 – DOM-Zugriffe absichern

DOM-Elemente können `null` sein und `EventTarget` ist zunächst sehr allgemein. Deshalb prüfen die
Module Elemente mit `instanceof` oder brechen bei fehlenden Elementen kontrolliert ab.

### Schritt 4 – ESM-Importe und Inline-Handler erhalten

Die physischen Dateien heißen `.ts`, aber interne Imports enden weiter auf `.js`, zum Beispiel
`./state.js`. Das passt zum erzeugten JavaScript und braucht kein `allowImportingTsExtensions`.

Die vorhandenen Inline-Handler bleiben über `window` erreichbar. Ihre Typen stehen zentral in
`src/global.d.ts`.

### Schritt 5 – Tooling anpassen

- ESLint prüft jetzt auch `.ts` über `typescript-eslint`.
- `npm run typecheck` führt `tsc --noEmit` aus.
- `npm run build` startet zuerst den Typecheck und danach Vite.
- TypeScript 6 wurde verwendet, weil es zum unterstützten Bereich von `typescript-eslint` passt.

## Drei wichtige Compiler-Stellen

1. **Nullable DOM und `EventTarget`:** Das war ein reales Risiko für Runtime-Fehler. Die Werte
   werden jetzt vor der Nutzung geprüft.
2. **Sortierung mit `Date`:** JavaScript erlaubt indirekte Umwandlung bei der Subtraktion.
   TypeScript verlangte `getTime()`. Das war hauptsächlich mehr Klarheit, kein beobachteter Bug.
3. **Dynamisches `bookmarked`:** Das Feld existierte zur Laufzeit, aber nicht im Datenmodell.
   `bookmarked?: boolean` behebt diese echte Lücke im Typmodell.

## Production-Problem bei der Prüfung

Die sechs Personenbilder wurden nicht nach `dist` kopiert, weil ihre Pfade nur aus JSON kamen.
Sie wurden nach `public/assets/people` verschoben. Die JSON-Pfade blieben unverändert und Vite
kopiert die PNG-Dateien jetzt in den Production-Build.

## Prüfung

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

Ergebnis:

- 0 TypeScript- und ESLint-Fehler
- alle fünf Views funktionieren
- 5 Statistik-Karten, 18 Evidence-Karten, 6 Personen und 6 Orte
- 15 Timeline-Ereignisse
- Sortierung, Evidence-Details, Timeline-Modal und Hypothesis-Speicherung funktionieren
- keine Runtime-Fehler in der Console

## Ergebnis

Die Anwendung ist vollständig in TypeScript migriert und verhält sich wie vorher. Architektur und
Framework wurden nicht geändert.

Commit: `d501cfe – refactor: complete TypeScript migration`
