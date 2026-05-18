import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="nav-brand">
          <span aria-hidden="true">📊</span>
          AI Expense Tracker
        </NavLink>
        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link${isActive ? ' active' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `nav-link${isActive ? ' active' : ''}`
            }
          >
            Upload Receipt
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
