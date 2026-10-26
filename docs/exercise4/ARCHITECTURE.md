# React-Architektur

## Überblick

Das Projekt hat zwei Versionen:

- die alte Vanilla-Version;
- die neue React-Version mit `?react=1`.

`src/bootstrap.ts` startet die richtige Version.

## React-Struktur

```text
src/react/
├── main.tsx
├── data.ts
├── app/
│   └── App.tsx
└── features/
    ├── dashboard/
    ├── people-locations/
    │   └── components/
    └── timeline/
        └── components/
```

## Ordner-Regeln

- `app` enthält die gemeinsame App-Struktur.
- `features` enthält die einzelnen Bereiche der Anwendung.
- Ein lokaler Baustein bleibt in seinem Feature.
- Ein Shared-Baustein wird in mindestens zwei Features benutzt.

Beispiele:

- `PersonCard` gehört zu `people-locations`.
- `TimelineEventCard` gehört zu `timeline`.
- Gemeinsame Typen und Hilfsfunktionen liegen in `src/shared`.

## Komponenten

Feature- und Container-Komponenten:

- `App`;
- `DashboardPage`;
- `PeopleLocationsPage`;
- `TimelinePage`.

Darstellungs-Komponenten:

- `PeopleSection` und `LocationsSection`;
- `PersonCard` und `LocationCard`;
- `TimelineEventCard`;
- `ContentPanel`.

## Alte Version

`src/modules` gehört zur Vanilla-Version und wird nicht gelöscht. React importiert keinen Code aus diesem Ordner.
