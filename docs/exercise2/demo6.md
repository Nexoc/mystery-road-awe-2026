# Demo 6 – Domain-Daten typisieren

## Ziel

Die Datenmodelle aus den JSON-Dateien beschreiben und den zentralen State genauer typisieren.

## Ausgangssituation

`Evidence`, `Person` und `Location` existierten bereits. Für Falldaten und Timeline fehlten noch
eigene Typen.

## Umsetzung

### Schritt 1 – Fehlende Interfaces ergänzen

In `src/types.ts` kamen zwei Interfaces dazu:

- `TimelineEvent` mit `id`, Zeit, Text, Typ, Sicherheit und den drei ID-Listen
- `CaseData` mit Fall-ID, Titel, Status, Datum, Zusammenfassung, Ort und Ermittlungsdaten

Die Felder wurden aus `public/data/timeline.json` und `public/data/case.json` abgeleitet.

### Schritt 2 – State typisieren

```ts
allTimeline: [] as TimelineEvent[]
caseData: {} as CaseData
```

Damit kennt der Compiler die Form dieser Werte im gesamten Projekt.

### Schritt 3 – Echte Inkonsistenz in den Daten

Normalerweise enthält `personIds` IDs wie `"nova-byte"`. In Evidence `E04` steht aber der
Anzeigename `"Nova Byte"`. JavaScript akzeptiert beide Werte ohne Prüfung.

Der Typ `string[]` sagt nur, dass alle Werte Strings sind. Er garantiert nicht, dass jeder String
eine vorhandene Person-ID ist. Für diesen Stand blieb das Feld deshalb `string[]`; der Helper
`evidenceMentionsPerson` prüfte ID und Name. Eine saubere Lösung braucht später eine Normalisierung
auf IDs und eine Runtime-Prüfung beim Laden der JSON-Dateien.

## Was statische Typen nicht prüfen

TypeScript prüft Quellcode, aber nicht automatisch den Inhalt einer Datei, die erst im Browser mit
`fetch()` geladen wird. Dafür braucht man Type Guards oder einen Schema-Validator. Erst danach darf
das Ergebnis sicher als `Evidence[]`, `Person[]` usw. verwendet werden.

Die Migration von `data.js` wurde wegen seiner Abhängigkeiten erst in Demo 7 abgeschlossen. Im
finalen `data.ts` liefert `readJson()` zuerst `unknown`. Type Guards prüfen die Struktur der
JSON-Daten, bevor sie dem typisierten State zugewiesen werden.

## `interface` und `type`

Ein `interface` beschreibt gut erweiterbare Objektformen und kann durch weitere Deklarationen
ergänzt werden. Ein `type` kann zusätzlich Unions, Tuples und andere Kombinationen ausdrücken.
Für die Domain-Objekte wurden Interfaces benutzt; bei diesen einfachen Objektformen wären beide
Varianten möglich.

## Prüfung

```bash
npx tsc --noEmit
npm run build
npm run lint
```

Ergebnis: 0 TypeScript-Fehler, erfolgreicher Build mit 15 Modulen und keine Lint-Fehler. Vor dem
Commit waren nur `src/types.ts` und `src/app/state.ts` geändert.

## Commit

`70ca5e0 – Add domain data types`
