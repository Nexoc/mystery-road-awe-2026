# Demo 7 – Komponentenarchitektur für die ganze Anwendung

## Ziel

Ich plane die React-Komponenten für alle fünf Views, obwohl in Exercise 3 zunächst nur Shell und
Dashboard umgesetzt werden.

## Architekturprinzip

```text
Feature-Based Architecture
+ React Component Tree
+ klare State Ownership
+ typisierte Props
+ leichtes MVC nur dort, wo es hilft
```

React-Komponenten bilden die View-Schicht. Models und Selectors berechnen Daten. Ein Controller wird
nur für koordinierte Aktionen verwendet, zum Beispiel Bookmark ändern oder Note speichern.

## State Ownership

Der `InvestigationProvider` ist die einzige Quelle für gemeinsam verwendeten State:

```text
InvestigationProvider
├─ case
├─ evidence
├─ people
├─ locations
├─ timeline
├─ bookmarks
└─ notes
```

Evidence-Filter, ausgewählte Evidence, offene Modals und nicht gespeicherte Formularfelder bleiben
lokaler UI-State. Der Hypothesenentwurf gehört zur Workspace-Feature.

`localStorage` besitzt den State nicht. Es lädt gespeicherte Werte in den React-State und persistiert
bewusste Änderungen. Actions aktualisieren den Provider unveränderlich über `dispatch`; danach rendert
React die betroffenen Komponenten neu.

## Component Tree

`CurrentPage` steht immer für genau eine der fünf Seiten:

```text
App
└─ InvestigationProvider
   └─ AppShell
      ├─ Header
      ├─ Navigation
      ├─ CurrentPage
      │  ├─ DashboardPage
      │  │  ├─ CaseSummary
      │  │  ├─ StatCards
      │  │  │  └─ StatCard × n
      │  │  ├─ ReviewProgress
      │  │  ├─ Panel
      │  │  │  └─ RecentEvidence
      │  │  │     └─ EvidenceListItem
      │  │  └─ Panel
      │  │     └─ RecentTimeline
      │  │        └─ TimelineListItem
      │  ├─ EvidencePage
      │  │  ├─ EvidenceFilters
      │  │  ├─ EvidenceList
      │  │  │  └─ EvidenceCard
      │  │  │     ├─ Badge
      │  │  │     └─ BookmarkButton
      │  │  └─ EvidenceDetail
      │  │     └─ NoteEditor
      │  ├─ PeoplePage
      │  │  ├─ TabBar
      │  │  ├─ PeopleList
      │  │  │  └─ PersonCard
      │  │  └─ LocationList
      │  │     └─ LocationCard
      │  ├─ TimelinePage
      │  │  ├─ TimelineFilters
      │  │  ├─ TimelineList
      │  │  │  └─ TimelineEventCard
      │  │  └─ TimelineEvidenceModal
      │  └─ WorkspacePage
      │     ├─ BookmarkedEvidence
      │     │  └─ EvidenceListItem
      │     ├─ NotesList
      │     └─ HypothesisForm
      └─ Footer
```

People und Locations bleiben eine View mit zwei Tabs. Es gibt keinen sechsten Route.

## Full und Compact Components

`EvidenceCard` und `TimelineEventCard` zeigen vollständige Informationen in ihren Hauptseiten.
`EvidenceListItem` und `TimelineListItem` sind kompakte Darstellungen für Dashboard oder Workspace.
So entstehen keine Komponenten mit vielen Flags wie `compact`, `small` oder `hideDescription`.

Generische Elemente wie `Panel`, `Button`, `Badge` und `ProgressBar` liegen in `shared`. Komponenten
mit Domain-Wissen bleiben in ihrer Feature und werden über deren `index.ts` öffentlich exportiert.

## Props und Datenquellen

| Komponente | Props / Daten | Quelle |
|---|---|---|
| `StatCard` | `label`, `value` | Dashboard Selectors |
| `ReviewProgress` | `reviewed`, `total` | Dashboard Selectors |
| `EvidenceCard` | `evidence`, `bookmarked`, Callbacks | Provider + Controller Hook |
| `EvidenceFilters` | `filters`, `onChange` | lokaler Evidence UI-State |
| `PersonCard` | `person` | InvestigationProvider |
| `LocationCard` | `location` | InvestigationProvider |
| `TimelineEventCard` | `event` | InvestigationProvider |
| `NoteEditor` | `note`, `onSave` | Provider + Controller Hook |
| `HypothesisForm` | `draft`, `onChange` | lokaler Workspace-State |

Props sind read-only Verträge. TypeScript erkennt fehlende, falsch geschriebene oder inkompatible
Werte bereits an der Aufrufstelle.

## Composition mit `children`

```tsx
import type { ReactNode } from "react";

type PanelProps = Readonly<{
  title: string;
  children: ReactNode;
}>;
```

```tsx
<Panel title="Recent evidence">
  <RecentEvidence evidence={recentEvidence} />
</Panel>
```

`Panel` bestimmt Struktur und Überschrift. Der Parent liefert den konkreten Inhalt als `children`.

## Wann wird etwas eine eigene Komponente?

Eine Grenze ist sinnvoll, wenn mindestens ein Punkt erfüllt ist:

- wiederverwendbares visuelles oder funktionales Konzept;
- sinnvoller typisierter Vertrag;
- eigene Verantwortung oder eigenes Data Ownership;
- unabhängig veränderbarer oder testbarer Teil;
- der Parent wird dadurch deutlich verständlicher.

Kleine einmalige Fragmente bleiben inline. Einzelne Titel, IDs oder Datumsfelder brauchen nicht
automatisch eigene Komponenten.

## Wiederverwendung gegenüber Vanilla

`Panel` wird für Recent Evidence und Recent Timeline verwendet. In der Vanilla-Version wurden
`dashboard-panel`, Überschrift und Inhalt mehrfach als HTML-Strings zusammengesetzt. Jetzt definiert
`Panel` die gemeinsame Struktur einmal; unterschiedlicher Inhalt kommt über `children`.

Das verhindert Markup-Duplikation und Änderungen am gemeinsamen Layout erfolgen an einer Stelle.

## Warum planen wir die ganze Hierarchie jetzt?

Damit erkennen wir gemeinsame Komponenten, Datenbesitz und Abhängigkeiten vor der Migration. So
vermeiden wir doppelte Komponenten und widersprüchlichen State, obwohl in Exercise 3 zunächst nur
Shell und Dashboard gebaut werden.

## Kurzfassung für die Präsentation

> Die Anwendung behält eine Feature-Based Architecture. React-Komponenten bilden die View-Schicht.
> Der InvestigationProvider besitzt den gemeinsamen State, während temporärer UI-State lokal bleibt.
> Typisierte Props machen den Datenfluss sichtbar. Controller Hooks werden nur für koordinierte
> Aktionen verwendet, und generische UI-Komponenten liegen in `shared`.

## Geplante Ordnerstruktur

Die Ordnerstruktur bildet die beschriebene Architektur ab, ohne für jede Feature unnötige Schichten
zu erzeugen:

```text
src/
├─ app/
│  ├─ App.tsx
│  ├─ AppShell.tsx
│  ├─ Header.tsx
│  ├─ Navigation.tsx
│  ├─ Footer.tsx
│  ├─ routing/
│  │  ├─ routes.ts
│  │  └─ navigation.ts
│  └─ state/
│     ├─ InvestigationProvider.tsx
│     ├─ investigationReducer.ts
│     └─ investigationActions.ts
├─ features/
│  ├─ dashboard/
│  │  ├─ components/
│  │  │  ├─ DashboardPage.tsx
│  │  │  ├─ CaseSummary.tsx
│  │  │  ├─ StatCards.tsx
│  │  │  ├─ StatCard.tsx
│  │  │  ├─ ReviewProgress.tsx
│  │  │  ├─ RecentEvidence.tsx
│  │  │  └─ RecentTimeline.tsx
│  │  ├─ model/
│  │  │  ├─ dashboardSelectors.ts
│  │  │  └─ dashboardTypes.ts
│  │  └─ index.ts
│  ├─ evidence/
│  │  ├─ components/
│  │  │  ├─ EvidencePage.tsx
│  │  │  ├─ EvidenceFilters.tsx
│  │  │  ├─ EvidenceList.tsx
│  │  │  ├─ EvidenceCard.tsx
│  │  │  ├─ EvidenceListItem.tsx
│  │  │  ├─ EvidenceDetail.tsx
│  │  │  ├─ NoteEditor.tsx
│  │  │  └─ BookmarkButton.tsx
│  │  ├─ controller/
│  │  │  └─ useEvidenceController.ts
│  │  ├─ model/
│  │  │  ├─ evidenceSelectors.ts
│  │  │  ├─ evidenceUiState.ts
│  │  │  └─ evidenceTypes.ts
│  │  └─ index.ts
│  ├─ people/
│  │  ├─ components/
│  │  │  ├─ PeoplePage.tsx
│  │  │  ├─ TabBar.tsx
│  │  │  ├─ PeopleList.tsx
│  │  │  ├─ PersonCard.tsx
│  │  │  ├─ LocationList.tsx
│  │  │  └─ LocationCard.tsx
│  │  ├─ model/
│  │  │  └─ peopleSelectors.ts
│  │  └─ index.ts
│  ├─ timeline/
│  │  ├─ components/
│  │  │  ├─ TimelinePage.tsx
│  │  │  ├─ TimelineFilters.tsx
│  │  │  ├─ TimelineList.tsx
│  │  │  ├─ TimelineEventCard.tsx
│  │  │  ├─ TimelineListItem.tsx
│  │  │  └─ TimelineEvidenceModal.tsx
│  │  ├─ model/
│  │  │  ├─ timelineSelectors.ts
│  │  │  └─ timelineTypes.ts
│  │  └─ index.ts
│  └─ workspace/
│     ├─ components/
│     │  ├─ WorkspacePage.tsx
│     │  ├─ BookmarkedEvidence.tsx
│     │  ├─ NotesList.tsx
│     │  └─ HypothesisForm.tsx
│     ├─ controller/
│     │  └─ useWorkspaceController.ts
│     ├─ model/
│     │  ├─ workspaceSelectors.ts
│     │  └─ workspaceTypes.ts
│     └─ index.ts
├─ shared/
│  ├─ components/
│  │  ├─ Panel.tsx
│  │  ├─ Button.tsx
│  │  ├─ Badge.tsx
│  │  ├─ ProgressBar.tsx
│  │  ├─ LoadingState.tsx
│  │  └─ EmptyState.tsx
│  ├─ types/
│  │  └─ domain.ts
│  ├─ data/
│  │  └─ loadCaseData.ts
│  ├─ storage/
│  │  └─ localStorage.ts
│  └─ utils/
│     ├─ dates.ts
│     ├─ filters.ts
│     └─ format.ts
└─ main.tsx
```

### Wichtige Regeln

- `app/` enthält Shell, Routing und den gemeinsamen Investigation-State.
- `features/` enthält die fachlichen Teile der Anwendung.
- `shared/` enthält nur generische UI, gemeinsame Types, Utilities, Data Loading und Storage.
- `controller/` existiert nur bei echter Aktions- und Zustandskoordination.
- `model/` enthält Selectors und Feature-spezifische Types, aber keine Kopien der Domain Entities.
- `domain.ts` definiert `Evidence`, `Person`, `Location`, `TimelineEvent`, `Note` und `CaseData` einmal.

Der Component Tree zeigt die UI-Hierarchie. Die Ordnerstruktur zeigt, wie derselbe Entwurf im Code
organisiert wird.
