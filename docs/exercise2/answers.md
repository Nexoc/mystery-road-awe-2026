# Antworten zu Demo 1–7

## Demo 1 – npm und Projekt-Metadaten

1. **Was löst ein Package Manager?**  
   npm installiert direkte und indirekte Abhängigkeiten, verwaltet Versionen und startet Projekt-Scripts. Manuelle Downloads wären schwer reproduzierbar.

2. **Was ist der Unterschied zwischen `dependencies` und `devDependencies`?**  
   `dependencies` braucht die App zur Laufzeit. Vite, ESLint, Prettier und TypeScript sind Build- und Entwicklungswerkzeuge und gehören zu `devDependencies`.

3. **Wozu dient `package-lock.json`?**  
   Das Lockfile speichert den genauen Dependency Tree. Team und CI installieren dadurch dieselben Versionen.

4. **Was wäre bei pnpm anders?**  
   pnpm nutzt einen gemeinsamen Paket-Speicher und Links. Das spart bei großen Projekten Platz und Zeit; npm war hier bereits vorhanden und ausreichend.

## Demo 2 – Vite Development Server

1. **Was macht Vite zusätzlich zu einem Static Server?**  
   Ein Static Server liefert nur Dateien. Vite versteht den Modul-Graphen, transformiert Quellcode und bietet HMR.

2. **Was wurde bei HMR beobachtet?**  
   Nach einer Änderung von `--color-bg` wurde nur das CSS aktualisiert. Es gab kein manuelles F5, keinen kompletten Reload und der App-Zustand blieb erhalten.

3. **Warum passen ES-Module gut zu Vite?**  
   Vite kann Imports verfolgen und gezielt betroffene Module aktualisieren. Die Modul-Struktur existierte bereits seit Exercise 1.

## Demo 3 – Production Build und Preview

1. **Welche Transformationen wurden beobachtet?**  
   Vite bündelte Module, minifizierte JavaScript und CSS und erzeugte Dateien mit Content-Hash.

2. **Warum enthalten Production-Dateien einen Hash?**  
   Unveränderte Dateien können im Browser-Cache bleiben. Bei geändertem Inhalt entsteht ein neuer Name und der Browser lädt die neue Version.

3. **Warum wird der Dev-Server nicht deployt?**  
   Er transformiert Dateien während der Entwicklung und enthält HMR. Für echte Nutzer wird der optimierte und stabile Inhalt aus `dist/` ausgeliefert.

## Demo 4 – ESLint und Prettier

1. **Was ist der Unterschied zwischen Linter und Formatter?**  
   ESLint fand unbenutzte Werte wie `selectedEvidence`. Prettier änderte nur Formatierung wie Einrückung, Abstände und Zeilenumbrüche.

2. **Warum gibt es `lint` und `lint:fix` getrennt?**  
   `lint` prüft ohne Änderungen und passt zu Reviews oder CI. `lint:fix` verändert nur automatisch lösbare Stellen; logische Fehler brauchen eine Entscheidung.

3. **Was macht `npm run lint`?**  
   npm liest das Script aus `package.json` und startet das lokale ESLint aus `node_modules/.bin`. Eine globale Installation wäre nicht reproduzierbar.

## Demo 5 – TypeScript Setup

1. **Was aktiviert `strict`?**  
   Unter anderem `noImplicitAny` und `strictNullChecks`. Fehlende Typen und mögliche `null`-Werte werden dadurch früh sichtbar.

2. **Compile-Time-Fehler oder Runtime-Fehler?**  
   TypeScript kann falsche Variablen- und Werttypen vor dem Start finden. Falsche Lade-Reihenfolgen oder Fachlogik müssen weiterhin im Browser getestet werden.

3. **Warum wurde kein `any` benutzt?**  
   `any` schaltet die Prüfung für einen Wert praktisch aus. Konkrete Typen, Generics und `unknown` mit Prüfungen erhalten die Typsicherheit.

## Demo 6 – Domain-Daten

1. **Welches Feld war inkonsistent?**  
   `personIds` enthält meistens IDs wie `nova-byte`, in E04 aber den Namen `Nova Byte`. Für Kompatibilität blieb es `string[]`; der Helper prüft ID und Name.

2. **Was kann TypeScript bei externem JSON nicht garantieren?**  
   Interfaces prüfen nicht automatisch die Daten einer Fetch-Antwort. Dafür braucht man Runtime Type Guards oder einen Schema-Validator.

3. **`interface` oder `type`?**  
   `interface` passt gut zu erweiterbaren Objektformen. `type` kann zusätzlich Unions und Tuples beschreiben. Für diese Domain-Objekte wären beide möglich.

## Demo 7 – Vollständige Migration

1. **Welcher Typfehler brauchte eine echte Entscheidung?**  
   DOM-Elemente können `null` sein und `EventTarget` ist nicht automatisch ein Input. Wir nutzten Prüfungen mit `instanceof` statt `any` oder `!`.

2. **Wann wäre `any` sinnvoll?**  
   Nur kurzfristig an einer wirklich untypisierten Fremd-Schnittstelle. In diesem Projekt wurden JSON und `localStorage` als `unknown` behandelt und geprüft.

3. **Wurde ein echtes Problem gefunden?**  
   Ja. `bookmarked` wurde zur Laufzeit an Evidence-Objekte geschrieben, fehlte aber im Modell. `bookmarked?: boolean` bildet den echten Zustand jetzt ab.
