# Demo 1 – Historische Entwicklung des Webs

## Ziel

Ich erkläre kurz, wie sich Webanwendungen entwickelt haben, und ordne unser Projekt ein.

## Kurze Zeitleiste

1. **1990er: statische Webseiten**  
   Der Server lieferte fertige HTML-Dateien. Die Seiten zeigten hauptsächlich Dokumente und Links.

2. **Ende der 1990er und Anfang der 2000er: dynamische Serverseiten**  
   PHP, JSP oder ähnliche Technologien erzeugten HTML auf dem Server. Fast jede Aktion lud eine
   komplett neue Seite.

3. **Ab Mitte der 2000er: AJAX und jQuery**  
   JavaScript konnte Daten im Hintergrund laden und nur einen Teil der Seite aktualisieren. jQuery
   vereinfachte DOM-Zugriffe, Events und Unterschiede zwischen Browsern.

4. **Ab den 2010ern: Single-Page Applications**  
   Frameworks wie Angular, React und Vue organisierten UI, State und Navigation. Der Browser lud meist
   nur ein HTML-Dokument; weitere Ansichten entstanden im Client.

5. **Heute: hybride Architekturen**  
   Moderne Anwendungen kombinieren CSR, SSR, statische Generierung und Hydration je nach Bedarf.

## Wo steht unser Projekt?

Unser Projekt ist eine kleine clientseitige SPA ohne Framework:

- `index.html` wird nur einmal geladen;
- die Daten kommen danach als JSON über `fetch()`;
- TypeScript erzeugt und aktualisiert Teile des DOM;
- `#dashboard`, `#evidence` und weitere Hashes steuern die Ansicht;
- bei der Navigation gibt es keinen vollständigen Page Reload.

Die Struktur gehört deshalb zur SPA-Ära. Die Implementierung ist aber noch handgemacht: State,
Routing und DOM-Updates werden ohne React verwaltet. Exercise 3 modernisiert genau diesen Teil.

## Frage 1: Welches Problem löste AJAX?

Vor AJAX musste der Browser für neue Daten meistens eine komplette Seite vom Server laden. AJAX
ermöglichte Hintergrund-Requests und kleine Aktualisierungen ohne Page Reload. Dadurch reagierten
Webseiten schneller und fühlten sich mehr wie Desktop-Anwendungen an.

Dabei entstanden neue Probleme:

- UI und Daten-State mussten manuell synchron bleiben;
- viele DOM-Änderungen und Callbacks wurden schwer überschaubar;
- Browser-History, Links und Back Button mussten extra behandelt werden;
- parallele Requests konnten Race Conditions verursachen;
- ähnliche UI-Bausteine wurden oft mehrfach implementiert.

SPA-Frameworks versuchten diese Probleme mit Komponenten, deklarativem Rendering, State Management
und Routing besser zu strukturieren.

## Frage 2: Zu welcher Zeit gehört Hash-Routing?

Hash-Routing wurde besonders in der frühen SPA-Zeit, etwa Ende der 2000er und Anfang der 2010er,
häufig verwendet. Der Teil nach `#` wird nicht als neuer Pfad an den Server gesendet. Deshalb konnte
JavaScript die Ansicht wechseln, ohne dass der Server besondere Routen kennen musste.

Bei unserem Projekt zeigt das Hash-Routing: Es ist eine clientseitige Anwendung mit einem einzigen
HTML-Dokument und selbst gebauter Navigation. Dieses Verfahren funktioniert auch auf einfachem
statischem Hosting wie GitHub Pages.

## Kurzer Abschluss für die Präsentation

Unser Projekt ist also keine klassische Multi-Page-Anwendung. Es nutzt bereits das SPA-Prinzip, aber
noch mit manuellen DOM-Updates und eigenem Hash-Routing. React soll in den nächsten Demos die Struktur
der Oberfläche verbessern, nicht erst das SPA-Prinzip erfinden.
