// src/layouts/DashboardLayout.tsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FaChartLine, FaRunning, FaMoon, FaUtensils, FaSignOutAlt,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

const navItems: { icon: IconType; label: string; path: string }[] = [
  { icon: FaChartLine, label: 'Dashboard', path: '/dashboard' },
  { icon: FaRunning, label: 'Workout', path: '/workout' },
  { icon: FaMoon, label: 'Activities', path: '/activities' },
  { icon: FaUtensils, label: 'Nutrition', path: '/nutrition' },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ← To detect current path

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const Icon = ({ icon: IconComponent, ...props }: { icon: IconType; size?: number; className?: string }) => (
    <IconComponent {...props} />
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="brand">FITNESS</h1>
        <nav className="sidebar-nav">
          {navItems.map(({ icon, label, path }) => (
            <a
              key={path}
              onClick={() => navigate(path)}
              className={location.pathname === path ? 'active' : ''}
            >
              <span className="nav-icon"><Icon icon={icon} size={18} /></span>
              {label}
            </a>
          ))}
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon"><Icon icon={FaSignOutAlt} size={18} /></span>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main dynamic content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
