# Demo 5 – React Introduction

## Ziel

Ich zeige an einer kleinen Komponente, was React, JSX und eine pure Component Function bedeuten.
Der React-Einstiegspunkt und die Migration des Projekts beginnen erst in Demo 6.

## Praktisches Beispiel

Der selbst geschriebene Code liegt in [CaseTitle.tsx](CaseTitle.tsx):

```tsx
export function CaseTitle() {
  const title = "Project ReMotion";

  return (
    <section>
      <h2>{title}</h2>
      <p>Investigation Portal</p>
    </section>
  );
}
```

Die Datei ist ein eigenständiges Lernbeispiel unter `docs/`. Sie wird noch nicht von Vite eingebunden
oder im Browser gemountet; das folgt in Demo 6. Die Funktion verwendet weder Props noch State und
verändert den DOM nicht direkt.

## Was ist eine React-Komponente?

Eine Function Component ist eine Funktion, die React während des Renderings aufruft. Sie beschreibt
einen Teil der gewünschten UI aus ihren Inputs. Wiederverwendung ist ein Vorteil, aber keine Pflicht.
Der Großbuchstabe in `CaseTitle` unterscheidet die Komponente von nativen HTML-Tags.

```text
JavaScript-Wert → Component Function → JSX → React Elements → DOM
```

## Was ist JSX?

JSX ist eine JavaScript-Syntaxerweiterung für UI-Beschreibungen. Es sieht wie HTML aus, ist aber weder
ein HTML-String noch ein fertiger DOM-Knoten. Der Browser versteht JSX nicht direkt.

Vite transformiert `<h2>{title}</h2>` konzeptionell in JavaScript-Aufrufe wie
`React.createElement(...)` oder die Funktionen des modernen JSX Runtime. Das Ergebnis sind React
Elements: JavaScript-Objekte, die die gewünschte UI beschreiben.

Geschweifte Klammern enthalten JavaScript Expressions. Deshalb wird `{title}` ausgewertet. In JSX
heißt `class` außerdem `className`, und Events erhalten Funktionen wie `onClick={handleClick}`.

## Vergleich mit `renderEvidenceCardHTML()`

Die Vanilla-Version arbeitet so:

```text
renderEvidenceCardHTML(ev) → HTML-String → innerHTML → HTML Parser → DOM
```

`renderEvidenceList()` verbindet die Strings aller Cards und ersetzt den Container über `innerHTML`.

Die React-Version arbeitet so:

```text
EvidenceCard(props) → JSX → React Elements → Reconciliation → DOM-Änderungen
```

Die Vanilla-Funktion liefert Text, der als HTML geparst wird. Eine React-Komponente liefert eine
strukturierte UI-Beschreibung, die React rendert und mit dem vorherigen Ergebnis vergleicht.

## Warum muss Rendering pure sein?

React entscheidet, wann und wie oft eine Component Function ausgeführt wird. Initial Render, State
Update oder Parent Render können sie erneut aufrufen. Deshalb gilt:

```text
gleiche Inputs → gleiche UI-Beschreibung
```

Während des Renderings darf eine Komponente keinen globalen Wert verändern, nicht direkt den DOM
manipulieren und nicht in `localStorage` schreiben. Sonst hängt das Ergebnis von der Anzahl der
Aufrufe ab. Lokale Berechnungen sind erlaubt. Side Effects gehören in Event Handler oder, wenn nötig,
in einen passenden Effect.

## Kurzfassung für die Präsentation

> `CaseTitle` ist eine React Function Component. Sie gibt JSX und keinen HTML-String zurück. Vite
> transformiert JSX in JavaScript, das React Elements erzeugt. React verwendet diese Beschreibung,
> um den DOM zu aktualisieren. Die Component Function muss pure bleiben, weil React sie mehrfach
> ausführen kann.
