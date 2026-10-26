import { NavLink } from "react-router-dom";
import { debugLog } from "../../shared/debug.js";
import type { InvestigationData } from "../../types.js";
import { AppRoutes } from "./routes.js";

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

function Navigation() {
  debugLog("4.8", "NAVIGATION → React Router links rendered");

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
  debugLog("4.8", "APP → router-controlled shell rendered", {
    caseId: data.caseData.caseId,
  });

  return (
    <>
      <Header />

      <main className="app-main">
        <AppRoutes data={data} />
      </main>

      <Footer />
    </>
  );
}
