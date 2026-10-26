import { useEffect, useState } from "react";
import { DashboardPage } from "../features/dashboard/DashboardPage.js";
import { PeopleLocationsPage } from "../features/people-locations/PeopleLocationsPage.js";
import { TimelinePage } from "../features/timeline/TimelinePage.js";
import { debugLog } from "../shared/debug.js";
import type { InvestigationData, ViewName } from "../types.js";

type NavigationItem = {
  view: ViewName;
  label: string;
};

const navigationItems: readonly NavigationItem[] = [
  { view: "dashboard", label: "Dashboard" },
  { view: "evidence", label: "Evidence" },
  { view: "people", label: "People & Locations" },
  { view: "timeline", label: "Timeline" },
  { view: "workspace", label: "Workspace" },
];

type PageDefinition = {
  title: string;
  description: string;
};

const pageDefinitions: Record<ViewName, PageDefinition> = {
  dashboard: {
    title: "Case Dashboard",
    description: "The Dashboard is rendered from the investigation data.",
  },
  evidence: {
    title: "Evidence Catalogue",
    description: "The Evidence view will be migrated in Exercise 5.",
  },
  people: {
    title: "People & Locations",
    description: "The People & Locations view will be migrated in Exercise 4.",
  },
  timeline: {
    title: "Investigation Timeline",
    description: "The Timeline view will be migrated in Exercise 4.",
  },
  workspace: {
    title: "Investigator Workspace",
    description: "The Workspace view will be migrated in Exercise 5.",
  },
};

function isViewName(value: string): value is ViewName {
  return navigationItems.some((item) => item.view === value);
}

function getViewFromHash(): ViewName {
  const hashValue = window.location.hash.slice(1);
  const isKnownView = isViewName(hashValue);

  const resolvedView: ViewName = isKnownView ? hashValue : "dashboard";

  debugLog("3.9", "ROUTER → hash resolved", {
    originalHash: window.location.hash,
    hashValue,
    isKnownView,
    resolvedView,
    usedFallback: !isKnownView,
  });

  return resolvedView;
}

type NavigationProps = {
  currentView: ViewName;
};

function Navigation({ currentView }: NavigationProps) {
  debugLog("3.9", "NAVIGATION → rendering active item", {
    currentView,
  });

  return (
    <nav className="main-nav" aria-label="Main navigation">
      {navigationItems.map((item) => {
        const isActive = item.view === currentView;

        return (
          <a
            key={item.view}
            href={`#${item.view}`}
            className={isActive ? "nav-btn active" : "nav-btn"}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              debugLog("3.9", "NAVIGATION → link selected", {
                fromView: currentView,
                toView: item.view,
              });
            }}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

type HeaderProps = {
  currentView: ViewName;
};

function Header({ currentView }: HeaderProps) {
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
        <Navigation currentView={currentView} />
      </div>
    </header>
  );
}

type ViewPageProps = {
  currentView: ViewName;
};

function ViewPage({ currentView }: ViewPageProps) {
  const page = pageDefinitions[currentView];

  debugLog("3.9", "VIEW → page content selected", {
    currentView,
    title: page.title,
  });

  return (
    <section>
      <h2>{page.title}</h2>

      <div className="intro-card">
        <p>{page.description}</p>
      </div>
    </section>
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

type AppProps = {
  data: InvestigationData;
};

export function App({ data }: AppProps) {
  const [currentView, setCurrentView] = useState<ViewName>(() => {
    const initialView = getViewFromHash();

    debugLog("3.9", "STATE → initial currentView created", {
      initialView,
    });

    return initialView;
  });

  useEffect(() => {
    function handleHashChange(event: HashChangeEvent): void {
      debugLog("3.9", "HASHCHANGE → browser event received", {
        previousHash: new URL(event.oldURL).hash,
        nextHash: new URL(event.newURL).hash,
      });

      const nextView = getViewFromHash();

      debugLog("3.9", "STATE → currentView update requested", {
        nextView,
      });

      setCurrentView(nextView);
    }

    window.addEventListener("hashchange", handleHashChange);

    debugLog("3.9", "EFFECT → subscribed to hashchange");

    return () => {
      window.removeEventListener("hashchange", handleHashChange);

      debugLog("3.9", "EFFECT → removed hashchange listener");
    };
  }, []);

  debugLog("3.9", "APP → component function executed", {
    currentHash: window.location.hash,
    currentView,
  });

  debugLog("3.10", "PROPS → App rendering with investigation data", {
    caseId: data.caseData.caseId,
    evidenceCount: data.evidence.length,
    timelineCount: data.timeline.length,
    currentView,
  });

  return (
    <>
      <Header currentView={currentView} />

      <main className="app-main">

        {currentView === "dashboard" ? (
          <DashboardPage data={data} />
        ) : currentView === "people" ? (
          <PeopleLocationsPage
            people={data.people}
            locations={data.locations}
          />
        ) : currentView === "timeline" ? (
          <TimelinePage events={data.timeline} />
        ) : (
          <ViewPage currentView={currentView} />
        )}

      </main>

      <Footer />
    </>
  );
}
