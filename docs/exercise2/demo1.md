# Demo 1 – npm und Projekt-Metadaten

## Ziel

Das Projekt bekommt einen Package Manager, klare Metadaten und reproduzierbare Installationen.

## Ausgangssituation

- Das Projekt aus Exercise 1 hatte bereits ES-Module.
- Node.js 22.14.0 war für den Kurs zu alt. Gefordert war eine Version über 22.16.0.

## Umsetzung

### Schritt 1 – Umgebung prüfen und aktualisieren

Verwendete Versionen:

- Node.js: 22.23.2
- npm: 10.9.8

```bash
node --version
npm --version
```

### Schritt 2 – npm initialisieren

```bash
npm init
```

Wichtige Angaben in `package.json`:

- Name: `mystery-road-awe-2026`
- Version: `1.0.0`
- Beschreibung: Untersuchung eines Fehlers eines KI-Rehabilitationsroboters
- Autor: Marat Davletshin
- Lizenz: ISC
- Keywords: `web-engineering`, `vite`, `typescript`
- `private: true`, weil das Projekt nicht als npm-Paket veröffentlicht wird
- `type: module`, weil das Projekt ES-Module benutzt

Der unnötige Eintrag `main: index.js` und das leere Test-Script wurden entfernt.

### Schritt 3 – generierte Ordner ignorieren

`.gitignore` enthält:

```gitignore
node_modules/
dist/
```

`node_modules` enthält lokal installierte Pakete. `dist` ist das generierte Build-Ergebnis. Beide
Ordner werden nicht committed.

### Schritt 4 – Vite installieren

```bash
npm install --save-dev vite
```

Vite steht in `devDependencies`. Die Installation erzeugte `package-lock.json`; dieses Lockfile
wurde committed.

## Antworten auf die Fragen

### Was löst ein Package Manager?

npm lädt Pakete und ihre Abhängigkeiten automatisch, prüft Versionen und führt Projekt-Scripts aus.
Bei manuellen Downloads wären Versionen und Unterabhängigkeiten schwer reproduzierbar.

### `dependencies` oder `devDependencies`?

`dependencies` braucht die Anwendung zur Laufzeit. `devDependencies` braucht man nur für Entwicklung,
Prüfung oder Build. Vite, ESLint, Prettier und TypeScript gehören deshalb zu `devDependencies`.

### Warum wird das Lockfile committed?

`package.json` erlaubt Versionsbereiche. `package-lock.json` speichert den genauen Dependency Tree.
Damit installieren Team und CI dieselben Versionen. Ohne Lockfile können Installationen später andere
Versionen enthalten und unterschiedlich funktionieren.

### Warum npm statt pnpm?

npm war bereits mit Node.js installiert und reicht für dieses kleine Projekt. pnpm nutzt einen
gemeinsamen Paket-Speicher und Links. Bei großen Projekten kann das Platz und Installationszeit sparen,
aber es wäre hier ein zusätzliches Werkzeug für das Team.

## Ergebnis

Das Projekt besitzt gültige Metadaten, Vite als erste echte `devDependency` und ein committed
`package-lock.json`. Demo 1 wurde committed und gepusht.
