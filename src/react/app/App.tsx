import { useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { debugLog } from "../../shared/debug.js";
import {
  readNotes,
  writeBookmarkIds,
  writeNotes,
  type NotesByEvidenceId,
} from "../../shared/persistence.js";
import type { InvestigationData } from "../../types.js";
import { BookmarkProvider } from "../state/BookmarkContext.js";
import { normalizeBookmarkIds, toggleBookmarkId } from "../state/bookmarks.js";
import { AppRoutes } from "./routes.js";

// App besitzt notes
// ↓
// Callback geht nach unten
// ↓
// Child ruft ihn auf
// ↓
// App aktualisiert notes

// 1. notes-State speichern
// 2. handleSaveNote-Callback definieren
// 3. neues nextNotes-Objekt erzeugen
// 4. State mit setNotes aktualisieren
// 5. Notes im localStorage speichern
// 6. notes + Callback über Props an AppRoutes weitergeben

type NavigationItem = Readonly<{
  to: string;
  label: string;
  end: boolean;
}>;

const navigationItems: readonly NavigationItem[] = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/evidence", label: "Evidence", end: true },
  { to: "/team", label: "People & Locations", end: false },
  { to: "/timeline", label: "Timeline", end: true },
  { to: "/workspace", label: "Workspace", end: true },
  { to: "/key-demo", label: "Key Demo 4.4", end: true },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard" || pathname === "/") return "Dashboard";
  if (pathname === "/evidence") return "Evidence";
  if (pathname.startsWith("/team")) return "People & Locations";
  if (pathname === "/timeline") return "Timeline";
  if (pathname === "/workspace") return "Workspace";
  if (pathname === "/effects-demo") return "Effects Demo";
  if (pathname === "/key-demo") return "Key Demo";

  return "Page not found";
}

function DocumentTitleSync() {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    document.title = `${pageTitle} | Project ReMotion`;
  }, [pageTitle]);

  return null;
}

function Navigation() {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? "nav-btn active" : "nav-btn"
          }
          onClick={() => {
            debugLog("4.8", "NAVIGATION → NavLink selected", {
              destination: item.to,
            });
          }}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function Header() {
  const logoUrl = `${import.meta.env.BASE_URL}assets/logo/logo.svg`;

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <img
            src={logoUrl}
            alt="Project ReMotion logo"
            className="brand-logo"
          />

          <div>
            <h1>Project ReMotion</h1>
            <p className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </p>
          </div>
        </div>

        <Navigation />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <p>
        Project ReMotion Investigation Portal — Research Center AI, Software and
        IT-Security of HCW (fictional case study)
      </p>
    </footer>
  );
}

type AppProps = Readonly<{
  data: InvestigationData;
}>;

export function App({ data }: AppProps) {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>(() =>
    normalizeBookmarkIds(data.bookmarkIds, data.evidence),
  );
  const [bookmarkStorageError, setBookmarkStorageError] = useState<
    string | null
  >(null);

  // App besitzt den gemeinsamen Notes-State, da dieser von mehreren Komponenten benötigt wird
  const [notes, setNotes] = useState<NotesByEvidenceId>(() => readNotes());

  const [notesStorageError, setNotesStorageError] = useState<string | null>(
    null,
  );

  const handleToggleBookmark = useCallback(
    (evidenceId: string) => {
      debugLog("5.6", "App → handleToggleBookmark received", {
        evidenceId,
      });

      const nextBookmarkIds = toggleBookmarkId(bookmarkIds, evidenceId);

      setBookmarkIds(nextBookmarkIds);

      debugLog("5.6", "App → bookmark state update scheduled", {
        evidenceId,
        bookmarkCount: nextBookmarkIds.length,
      });

      const result = writeBookmarkIds(nextBookmarkIds);
      setBookmarkStorageError(result.ok ? null : result.message);
    },
    [bookmarkIds],
  );

  // Parent-Callback:
  // Child-Komponenten können damit eine Änderung des gemeinsamen Notes-States anfordern
  // Speichert eine Note:
  // 1. neues Notes-Objekt ohne Mutation erzeugen
  // 2. React-State mit setNotes aktualisieren
  // 3. aktualisierte Notes im localStorage speichern
  const handleSaveNote = (evidenceId: string, text: string) => {
    debugLog("5.6", "App → handleSaveNote received", {
      evidenceId,
      noteLength: text.length,
    });

    // 1. Neues Notes-Objekt erzeugen, ohne den bestehenden State direkt zu verändern
    const nextNotes = { ...notes, [evidenceId]: text };

    // 2. React-State aktualisieren;
    setNotes(nextNotes);

    debugLog("5.6", "App → notes state update scheduled", {
      evidenceId,
      noteCount: Object.values(nextNotes).filter((note) => note.trim()).length,
    });

    // 3. Aktualisierte Notes zusätzlich im localStorage speichern
    const result = writeNotes(nextNotes);
    setNotesStorageError(result.ok ? null : result.message);
  };

  return (
    <>
      <DocumentTitleSync />
      <Header />

      <main className="app-main">
        {bookmarkStorageError && (
          <div className="timeline-filter-warning" role="alert">
            {bookmarkStorageError}
          </div>
        )}

        {notesStorageError && (
          <div className="timeline-filter-warning" role="alert">
            {notesStorageError}
          </div>
        )}

        {/* Der gemeinsame Notes-State und der Save-Callback werden über Props
            an AppRoutes weitergegeben. App bleibt Besitzer des States. */}
        <BookmarkProvider
          bookmarkIds={bookmarkIds}
          onToggleBookmark={handleToggleBookmark}
        >
          <AppRoutes data={data} notes={notes} onSaveNote={handleSaveNote} />
        </BookmarkProvider>
      </main>

      <Footer />
    </>
  );
}
