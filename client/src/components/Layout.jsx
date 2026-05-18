import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
