import { NavLink, Outlet } from "react-router-dom";

export function PeopleLocationsLayout() {
  return (
    <section>
      <h2>People &amp; Locations</h2>

      <nav className="tab-bar" aria-label="People and locations">
        <NavLink
          to="/team/people"
          className={({ isActive }) =>
            isActive ? "tab-btn active" : "tab-btn"
          }
        >
          People
        </NavLink>

        <NavLink
          to="/team/locations"
          className={({ isActive }) =>
            isActive ? "tab-btn active" : "tab-btn"
          }
        >
          Locations
        </NavLink>
      </nav>

      <Outlet />
    </section>
  );
}
