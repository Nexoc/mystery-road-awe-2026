# Demo 2 – Vite Development Server

## Ziel

Die bestehende ES-Modul-Anwendung soll über Vite laufen. Alle Views und HMR müssen funktionieren.

## Ausgangssituation

Exercise 1 hatte die Anwendung bereits in ES-Module aufgeteilt. Vite hat diese Architektur nicht
eingeführt, sondern ergänzt sie als Entwicklungs- und Build-Werkzeug.

## Umsetzung

### Schritt 1 – npm-Scripts ergänzen

In `package.json` wurden diese Scripts ergänzt:

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

Eine eigene `vite.config` war nicht nötig: `index.html` liegt im Projekt-Root und ist der Einstieg.

### Schritt 2 – Development Server starten

```bash
npm run dev
```

Ergebnis:

- Vite 8.3.1 startete auf `http://localhost:5173`.
- Das bestehende Modul-System wurde geladen.
- Dashboard, Evidence, People, Timeline und Workspace funktionierten.

### Schritt 3 – HMR zeigen

In `styles.css` wurde die Variable `--color-bg` geändert. Die Hintergrundfarbe erschien sofort im
Browser, ohne manuelles F5 und ohne kompletten Seiten-Reload. Die alternative Farbe blieb als kurzer
Demo-Kommentar im Stylesheet. Der aktuelle Zustand der App blieb dabei erhalten.

## Antworten auf die Fragen

### Static Server und Vite

Ein einfacher Static Server liefert Dateien unverändert aus. Vite analysiert zusätzlich den
Modul-Graphen, transformiert Quellcode und aktualisiert geänderte Module oder Styles per HMR.

### Was ist HMR?

HMR bedeutet Hot Module Replacement. Beim Test wurde nur das geänderte CSS im laufenden Browser
aktualisiert. Die ganze Seite wurde nicht neu geladen und die Anwendung musste nicht neu gestartet
werden.

### Warum passen ES-Module gut zu Vite?

Vite kann Imports als Modul-Graphen verfolgen und gezielt nur betroffene Module aktualisieren. Die
Aufteilung aus Exercise 1 passte deshalb direkt. Bei der früheren einzelnen `app.js` wäre diese
Grenze zwischen Modulen nicht vorhanden gewesen.

## Ergebnis

Der Development Server und alle fünf Views liefen. CSS-HMR wurde praktisch geprüft.

Commit: `5f69d0d Configure Vite development server`
