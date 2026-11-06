# Demo 5.6 – Fragen

## Frage 1
**Warum sollte ein tief verschachteltes Child den State eines entfernten Parents nicht direkt verändern? Was bringt ein Callback stattdessen?**

- Der Child besitzt diesen State nicht.
- Props sind read-only.
- Der Child ruft nur einen Callback auf.
- Der Parent entscheidet selbst, wie der State geändert wird.
- Dadurch bleibt der Datenfluss kontrolliert und es gibt eine klare Source of Truth.

### Kurzantwort
**Das Child verändert den Parent-State nicht direkt, sondern fordert die Änderung über einen Callback an.**

---

## Frage 2
**Wie läuft ein Callback von seiner Definition bis zu der Komponente, die ihn aufruft? Wie viele Ebenen werden durchlaufen? Ist das schon zu viel Prop Drilling?**

### Notes-Callback

`App.handleSaveNote`  
↓  
`AppRoutes.onSaveNote`  
↓  
`EvidencePage.onSaveNote`  
↓  
`EvidenceDetail.onSaveNote`  
↓  
`onSaveNote(evidence.id, draftNote)`

### Anzahl der Prop-Grenzen
3 Ebenen:

1. `App → AppRoutes`
2. `AppRoutes → EvidencePage`
3. `EvidencePage → EvidenceDetail`

### Bewertung
- Technisch ist das Prop Drilling.
- Bei nur drei Ebenen ist es noch gut überschaubar.
- In Demo 8 wird das mit Context verglichen.

### Kurzantwort
**Ja, es ist Prop Drilling, aber bei drei Ebenen noch kein echtes Problem.**