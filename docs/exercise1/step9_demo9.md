# Demo 9 – Verschachtelte Promises zu `async`/`await`

## Ausgangslage

Die tiefste Promise-Kette stand in `loadCorePeopleAndLocations()`. Sie enthielt sechs
verschachtelte `.then()`-Callbacks: Für `case.json`, `people.json` und `locations.json` wurden
jeweils zuerst `fetch()` und danach `response.json()` abgewartet.

```text
case fetch → case JSON
                     → people fetch → people JSON
                                                 → locations fetch → locations JSON
```

Jeder Schritt startete erst nach dem vorherigen. Die drei Requests liefen also bewusst seriell.

## Refactoring

`loadCorePeopleAndLocations()` ist jetzt eine `async`-Funktion mit sechs aufeinanderfolgenden
`await`-Ausdrücken. Reihenfolge, State-Updates und die anschließenden Aufrufe von
`hideLoadingStep()`, `renderDashboard()` und `populateAllDropdowns()` blieben gleich.

Als zweite Stelle wurde `loadTimelineData()` umgestellt:

- die beiden `.then()`-Schritte wurden zu zwei `await`-Ausdrücken;
- das bisherige `.catch()` wurde zu `try...catch` mit derselben Log-Ausgabe;
- das bisherige `.finally()` blieb als `finally` erhalten und ruft weiterhin bei Erfolg und Fehler
  `hideLoadingStep()` auf.

Es wurden bewusst keine `response.ok`-Prüfungen ergänzt. `loadAllData()` wartet weiterhin zuerst
auf die Core-Daten. Erst danach starten Evidence und Timeline wie zuvor gemeinsam über
`Promise.all()`. Die Parallelität wurde nicht verändert.

## Debugger-Demo

Am ersten `await` in `loadCorePeopleAndLocations()` wurde ein echter Breakpoint gesetzt. Beim
ersten Stop zeigte der Call Stack `loadCorePeopleAndLocations → loadAllData → initApp`. Nach einem
Step over stand die Ausführung bei `caseRes.json()` und `caseRes.url` zeigte auf `case.json`. Nach
dem nächsten Step over enthielt `caseJson.title` bereits den korrekten Falltitel.

Für die Live-Wiederholung:

1. App über `py -m http.server 8080` öffnen und in DevTools unter Sources `src/app/data.js` wählen.
2. Breakpoint am ersten `await` setzen und neu laden.
3. Mit Step over über die `await`-Zeilen gehen und Call Stack sowie Watch geöffnet lassen.
4. `state.caseData.title`, `state.allPeople.length` und `state.allLocations.length` beobachten:
   Case-Titel → `6` People → `6` Locations.
5. Erst nach Abschluss der Core-Funktion starten Evidence und Timeline.

## Test ohne ein `await`

Testweise wurde vor `caseRes.json()` das `await` entfernt:

```js
const caseJson = caseRes.json();
state.caseData = caseJson;
```

Danach enthielt `state.caseData` ein Promise statt des geparsten Objekts. Im Browser zeigte das
Dashboard deshalb `Case` und `UNKNOWN` statt der echten Falldaten. Das ist dieselbe Fehlerklasse wie
bei früheren Async-Bugs: Noch nicht aufgelöste Daten werden wie fertige Daten behandelt. Anschließend
wurde das `await` wieder eingesetzt; der fehlerhafte Stand ist nicht im finalen Code enthalten.

## Leitfragen

- **Warum war die `.then()`-Kette schwerer lesbar?** Die sechs abhängigen Schritte waren über
  mehrere Einrückungsebenen, Callbacks und notwendige `return`-Anweisungen verteilt. Mit `await`
  stehen dieselben Schritte linear in ihrer tatsächlichen Reihenfolge; State-Änderungen und
  Fehlerfluss sind leichter zu erkennen.
- **Was macht `await`?** Es pausiert nur die umgebende `async`-Funktion, bis das Promise erfüllt
  oder abgelehnt ist. Browser, Netzwerk, Rendering, Events und anderer JavaScript-Code können
  weiterlaufen. Danach wird die Fortsetzung als Microtask eingeplant.
- **Was liefert eine `async`-Funktion?** Immer ein Promise. Ein `.then()` auf dem Ergebnis läuft
  nach ihrem Abschluss und erhält den zurückgegebenen Wert. Da die beiden Ladefunktionen keinen
  expliziten Wert zurückgeben, erhält der Callback hier `undefined`. Ein temporärer Test bestätigte
  `loadCorePeopleAndLocations() instanceof Promise === true` und folgenden Output:

  ```js
  loadCorePeopleAndLocations().then(function (value) {
    console.log(value); // undefined
  });
  ```
- **Was entspricht `.catch()`?** Ein `try...catch` um das `await`; `.finally()` entspricht
  weiterhin `finally`. Ohne Behandlung wird das Promise der `async`-Funktion abgelehnt. Behandelt
  auch der Aufrufer es nicht, erscheint typischerweise `Uncaught (in promise)`.
- **Ist `async`/`await` schneller?** Nein. Es ist Syntax auf Basis von Promises. Requests,
  JSON-Parsing, Abhängigkeiten und beobachtbare Reihenfolge bleiben gleich; Fortsetzungen laufen
  weiterhin asynchron über den Microtask-Mechanismus. Schneller würde es erst durch geänderte
  Parallelität; genau das war hier nicht Teil des Refactorings.
- **Was passiert ohne ein `await`?** `response.json()` liefert ein Promise, das fälschlich als
  fertiges Datenobjekt gespeichert wird. Das entspricht der bereits untersuchten Kategorie
  „Promise wird wie aufgelöster Wert verwendet“.

## Automatische Regression

Ein Browser-Smoke-Test über die Performance API bestätigte dieselbe Reihenfolge: Case endete vor
People, People vor Locations und beide Feature-Requests starteten erst danach. Evidence und Timeline
starteten nur `0,1 ms` auseinander, also weiterhin gemeinsam. Das Dashboard zeigte alle `18`
Evidence-Einträge und das Loading Overlay wurde ausgeblendet.

## Ergebnis

Die tief verschachtelte Kette ist linear lesbar. Ladefolge, Parallelität und Fehlerbehandlung sind
unverändert. Arrow Functions wurden nicht eingeführt, weil sie erst zu Demo 10 gehören.
