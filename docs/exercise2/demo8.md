# Demo 8 – GitHub Actions Quality Workflow

## Ziel

Die Qualitätsprüfungen sollen bei Push und Pull Request automatisch auf GitHub laufen. Fehler werden
vor Deployment oder Merge sichtbar.

## Umsetzung

### Schritt 1 – Workflow anlegen

Der CI-Workflow liegt unter:

```text
.github/workflows/quality.yml
```

### Schritt 2 – Trigger konfigurieren

Der Workflow startet bei:

- Push auf `exercise-2`
- Pull Request mit Ziel `exercise-2`
- manuellem Start über `workflow_dispatch`

### Schritt 3 – Minimale Berechtigung setzen

```yaml
permissions:
  contents: read
```

Der Quality-Job muss den Repository-Inhalt nur lesen.

### Schritt 4 – Umgebung vorbereiten

Der Job läuft auf `ubuntu-latest` und verwendet:

- `actions/checkout@v7`
- `actions/setup-node@v6`
- Node.js `22.23.2`
- npm cache

Danach installiert `npm ci` exakt die Versionen aus `package-lock.json`.

### Schritt 5 – Quality Checks ausführen

```text
npm run lint
npm run format:check
npm run build
```

`npm run build` startet zuerst `tsc --noEmit` und danach den Vite Production-Build. Der Workflow
verändert keine Source-Dateien und verwendet deshalb nicht `lint:fix` oder `prettier --write`.

### Schritt 6 – Format-Check ergänzen

In `package.json` wurde ein nicht veränderndes Script ergänzt:

```json
"format:check": "prettier --check \"src/**/*.{js,ts}\" \"*.{js,json,html,css}\""
```

`.prettierrc.json` verwendet `endOfLine: auto`, damit LF und Windows-CRLF nicht zu unnötigen
Unterschieden führen.

## Failed/Passed-Demonstration

1. Einen sichtbaren Format- oder Lint-Fehler erstellen.
2. Commit und Push ausführen.
3. Den fehlgeschlagenen Workflow und den betroffenen Step zeigen.
4. Den Fehler lokal korrigieren.
5. Erneut committen und pushen.
6. Den erfolgreichen Workflow mit denselben Steps zeigen.

## Begriffe

- **Workflow:** die komplette Datei `quality.yml`.
- **Job:** die Aufgabe `quality` auf einem Runner.
- **Step:** ein einzelner Schritt wie Checkout, `npm ci` oder Lint.
- **Cache:** speichert npm-Downloads, aber nicht `node_modules`; `npm ci` bleibt notwendig.

## Warum CI zusätzlich lokal prüfen muss

CI läuft in einer sauberen und reproduzierbaren Umgebung. Es erkennt vergessene Prüfungen,
abweichende lokale Installationen und Fehler aus einem Push oder Pull Request.

## Lokale Prüfung

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Alle vier lokalen Prüfungen liefen erfolgreich.
