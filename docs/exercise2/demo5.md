# Demo 5 – TypeScript einrichten und erste Module migrieren

## Ziel

TypeScript streng konfigurieren und die kleinen Module `utils`, `state` und `storage` ohne `any`
nach TypeScript migrieren.

## Ausgangssituation

Das Projekt bestand aus ES-Modulen in JavaScript. Nach `npx tsc --init` zeigte VS Code zuerst
`No inputs were found`, weil es in `src` noch keine `.ts`-Datei gab. Das war kein App-Fehler.

## Umsetzung

### Schritt 1 – TypeScript installieren

```bash
npm install --save-dev typescript
npx tsc --version
```

Bei dieser Demo war die Version `7.0.2`. Diese Angabe beschreibt bewusst den historischen Stand
dieses Schritts; spätere Tool-Versionen gehören nicht zu Demo 5.

### Schritt 2 – `tsconfig.json` an die Browser-App anpassen

Die automatisch erzeugte Konfiguration war allgemein und enthielt auch Node-, React- und Library-Optionen.
Die aktuelle Konfiguration enthält nur passende Einstellungen:

- `target: ES2022`, `module: ESNext`
- `lib: ES2022, DOM, DOM.Iterable`
- `moduleResolution: Bundler`, `noEmit: true`, `sourceMap: true`
- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- `verbatimModuleSyntax`, `isolatedModules`, `moduleDetection: force`
- `skipLibCheck: true`, `include: ["src"]`

`strict` blieb aktiv. Es umfasst zum Beispiel `noImplicitAny` und `strictNullChecks`. So werden
fehlende Parametertypen und mögliche `null`-Werte früh sichtbar.

### Schritt 3 – Erste Fehler sichtbar machen

Nach `utils.js` → `utils.ts` meldete der Compiler 11 Fehler: fehlende Typen für `items`, `id`,
`person`, `status` usw. und keine Declaration für `state.js`. Nach `state.js` → `state.ts` waren es
noch 10 Fehler.

### Schritt 4 – Typen statt `any`

In `src/types.ts` entstanden zuerst `Evidence`, `Person` und `Location`. `findById` wurde generisch:

```ts
const findById = <T extends { id: string }>(items: T[], id: string): T | null => { /* ... */ };
```

Damit bleibt der konkrete Rückgabetyp erhalten. Kein Fehler wurde mit `any` versteckt.

### Schritt 5 – ESM-Importe richtig schreiben

Die physischen Dateien heißen `.ts`, die Import-Specifier bleiben aber `.js`, zum Beispiel
`../app/state.js`. Ein Import mit `.ts` führte zu `TS5097`. `allowImportingTsExtensions` wurde dafür
nicht aktiviert.

### Schritt 6 – Storage typisieren

`storage.js` wurde zu `storage.ts`. Ergebnisse von `JSON.parse` werden als `unknown` behandelt und
vor der Nutzung geprüft. Für Notizen nutzt der State `Record<string, string>`, damit ein dynamischer
String-Key immer einen String-Wert liefert.

## Prüfung

```bash
npx tsc --noEmit
npm run build
npm run lint
npm run dev
```

Ergebnis: 11 → 10 → 0 TypeScript-Fehler. Dashboard, Evidence und People liefen weiter.
Im Demo-5-Commit wurde `tsc` noch separat ausgeführt; das damalige `build`-Script startete nur Vite.
Die Integration in das Build-Tooling wurde in Demo 7 abgeschlossen. Aktuell startet `npm run build`
zuerst `npm run typecheck` und nur bei Erfolg danach `vite build`.

## Antworten auf die Fragen

- Den Off-by-one-Fehler im Navigations-Loop hätte `noUncheckedIndexedAccess` durch den möglichen
  Wert `undefined` sichtbar machen können. Fehlerhafte Lade-Reihenfolgen, überschriebene Sortierung
  und ungültige Runtime-Daten erkennt TypeScript allein dagegen nicht zuverlässig.
- `any` schaltet die Typprüfung für diesen Wert praktisch aus und verteilt Unsicherheit weiter.
  Deshalb wurden Generics, konkrete Domain-Typen und `unknown` mit Prüfungen verwendet.
- `noEmit` ist passend, weil Vite den Build erzeugt; TypeScript prüft hier nur die Typen.

## Commit

`79f191c – Add TypeScript setup and migrate utility modules`
