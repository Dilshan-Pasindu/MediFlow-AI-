import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Calendar, FileText,
  User, LogOut, HeartPulse
} from 'lucide-react';
import { currentPatient } from '../data/mockData';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/find-doctor',  icon: Search,          label: 'Find a Doctor' },
  { to: '/appointments', icon: Calendar,         label: 'My Appointments' },
  { to: '/prescriptions',icon: FileText,         label: 'Prescriptions' },
  { to: '/profile',      icon: User,             label: 'My Profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();

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
          <div className="user-avatar">{currentPatient.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentPatient.name}
            </div>
            <div className="user-role">Patient</div>
          </div>
          <button
            className="close-btn"
            onClick={() => navigate('/login')}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
