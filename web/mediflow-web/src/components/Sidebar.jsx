import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Calendar, FileText,
  User, LogOut, HeartPulse
} from 'lucide-react';
import { getUser, apiLogout } from '../services/api';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/find-doctor',  icon: Search,          label: 'Find a Doctor' },
  { to: '/appointments', icon: Calendar,         label: 'My Appointments' },
  { to: '/prescriptions',icon: FileText,         label: 'Prescriptions' },
  { to: '/profile',      icon: User,             label: 'My Profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <HeartPulse size={18} />
          </div>
          <div>
            <div className="logo-text">MediFlow AI</div>
            <div className="logo-sub">Patient Portal</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">Main Menu</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" size={17} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">
            {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName || 'Guest'}
            </div>
            <div className="user-role">{user?.role || 'Patient'}</div>
          </div>
          <button
            className="close-btn"
            onClick={apiLogout}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
