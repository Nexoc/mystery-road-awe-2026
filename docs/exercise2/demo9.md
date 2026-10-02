# Demo 9 – Automatisches Deployment mit GitHub Pages

## Ziel

Nach jedem Push auf `exercise-2` wird die Anwendung geprüft, gebaut und automatisch auf GitHub
Pages veröffentlicht.

## Workflow

Der zweite Workflow liegt unter:

```text
.github/workflows/deploy.yml
```

Er startet bei:

- Push auf `exercise-2`
- manuellem Start mit `workflow_dispatch`

Ein Pull Request löst kein Deployment aus, weil ungeprüfter PR-Code nicht veröffentlicht werden
soll.

## Build-Job

Der Job `build` führt diese Schritte aus:

```text
Checkout
Setup Node.js 22.23.2 mit npm cache
npm ci
npm run lint
npm run format:check
npm run build
Upload von dist/ als github-pages Artifact
```

`npm run build` startet zuerst TypeScript mit `tsc --noEmit` und danach den Vite Build.

## Vite Base Path

Die Pages-Adresse enthält den Repository-Namen:

```text
https://nexoc.github.io/mystery-road-awe-2026/
```

Darum setzt `vite.config.ts`:

```ts
base: "/mystery-road-awe-2026/";
```

So zeigen JavaScript, CSS, JSON-Dateien und Bilder auf den richtigen Unterpfad.

## Deploy-Job

Der Job `deploy` läuft nur nach einem erfolgreichen `build`. `upload-pages-artifact` packt `dist/`
als Artifact. `deploy-pages` veröffentlicht dieses Artifact über die GitHub Pages API. Es wird kein
`gh-pages` Branch erzeugt.

Benötigte Rechte:

- `contents: read` und `pages: read` für den Build
- `pages: write` für die Veröffentlichung
- `id-token: write` für die sichere OIDC-Prüfung

Ein eigenes Secret ist dafür nicht nötig. GitHub stellt `GITHUB_TOKEN` automatisch bereit.

## Warum erneut prüfen und bauen?

Der Deploy-Workflow läuft auf einem neuen, sauberen Runner. Ergebnisse aus Demo 8 werden nicht
automatisch übernommen. Deshalb prüft der Workflow genau den Commit, der veröffentlicht wird.

## Anderer Static Host

Checkout, Installation, Lint und Build bleiben gleich. Nur die Pages-Schritte, Rechte, Zugangsdaten
und eventuell der Vite Base Path werden für Netlify, Vercel oder SFTP ersetzt.

## Live-Demo

1. In GitHub unter `Settings → Pages` als Source `GitHub Actions` wählen.
2. Workflow pushen und den erfolgreichen Deploy öffnen.
3. Dashboard, Evidence, People, Timeline und Workspace testen.
4. Im Network-Tab JSON-Dateien und Personenbilder mit Status `200` prüfen.
5. Eine sichtbare Änderung pushen und prüfen, dass sie ohne manuellen Deploy online erscheint.
