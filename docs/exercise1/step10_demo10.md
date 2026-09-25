# Demo 10 – Arrow Functions

## Änderungen

Drei passende Stellen wurden umgestellt:

- `findById` ist ein kleiner privater Lookup-Helper ohne eigenen Kontext.
- `statCardHTML` erzeugt nur einen String und wurde vor `renderDashboard` platziert.
- Der anonyme `input`-Listener für `hypConfidence` braucht nur sein `event` und ist jetzt ein Arrow Callback.

## Konkretes Beispiel

Vorher:

```js
function findById(items, id) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) return items[i];
  }
  return null;
}
```

Nachher:

```js
const findById = (items, id) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) return items[i];
  }
  return null;
};
```

Das Laufzeitverhalten bleibt gleich: Die Funktion nutzt weder `this`, `arguments` noch `new` und
wird nicht vor ihrer Initialisierung aufgerufen. Die Änderung verbessert hier nur Lesbarkeit und Stil.

## Bewusst regulär gelassen

Der Navigations-Listener bleibt eine normale Funktion:

```js
navButtons[i].addEventListener("click", function () {
  const targetView = this.getAttribute("data-view");
  console.log("nav clicked:", targetView);
});
```

Bei einem DOM-Listener setzt der Browser `this` auf das Element, an dem der Listener hängt. Eine
Arrow Function hätte kein eigenes `this`, sondern würde hier das äußere `undefined` übernehmen;
`this.getAttribute(...)` würde dann einen `TypeError` auslösen.

## Leitfragen

- **`this`:** Reguläre Funktionen erhalten `this` durch ihren Aufruf. Arrows übernehmen es aus dem
  äußeren Scope. Deshalb sind sie riskant als Objektmethoden oder DOM-Listener mit dynamischem
  `this`, aber praktisch für Callbacks, die nur Parameter und äußere Variablen brauchen.
- **`new` und `arguments`:** Arrows können nicht mit `new` aufgerufen werden und besitzen kein eigenes
  `arguments`. Das blockierte hier keine Umstellung, weil alle drei Kandidaten normale Parameter
  verwenden und keine Konstruktoren sind.
- **Hoisting:** Function Declarations sind vollständig gehoistet; ein `const`-Arrow befindet sich bis
  zur Initialisierung in der Temporal Dead Zone. Beide neuen benannten Arrows stehen vor ihren
  Aufrufern, daher entsteht kein früher Zugriff.
- **Team-Regel:** Kleine pure Helper und Callbacks ohne eigenes `this` schreiben wir als Arrows.
  Benannte oder exportierte Abläufe bleiben Function Declarations. Bei dynamischem `this`, eigenem
  `arguments` oder Konstruktoren verwenden wir reguläre Funktionen.

## Verifikation

- Alle 11 JavaScript-Dateien bestehen die Syntaxprüfung.
- Der Browser-Test rendert alle fünf Views: 5 Dashboard-Karten, 18 Evidence-Karten,
  6 Personen und 15 Timeline-Ereignisse sowie den Workspace.
- Der Slider aktualisiert den Wert auf `73`; der Navigations-Listener öffnet das Dashboard ohne
  Laufzeitfehler.

## Ergebnis

Zwei benannte Funktionen und ein `addEventListener`-Callback wurden sinnvoll umgestellt. Der
Navigations-Listener zeigt bewusst den Fall, in dem eine Arrow Function falsch wäre.
