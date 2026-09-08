import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Calendar, FileText,
  User, LogOut, HeartPulse, Pill, PackageSearch,
  Stethoscope, ClipboardList, BarChart3, Truck,
  ShieldCheck, FlaskConical, Users, Activity
} from 'lucide-react';
import { getUser, apiLogout } from '../services/api';

// Role-specific navigation definitions
const NAV_BY_ROLE = {
  Patient: [
    { section: 'Main', items: [
      { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/find-doctor',   icon: Search,          label: 'Find a Doctor' },
      { to: '/symptom-check', icon: Activity,        label: 'AI Symptom Check' },
    ]},
    { section: 'My Health', items: [
      { to: '/appointments',  icon: Calendar,        label: 'My Appointments' },
      { to: '/prescriptions', icon: FileText,        label: 'Prescriptions' },
      { to: '/orders',        icon: PackageSearch,   label: 'Medicine Orders' },
    ]},
    { section: 'Account', items: [
      { to: '/profile',       icon: User,            label: 'My Profile' },
    ]},
  ],
  Doctor: [
    { section: 'Clinical', items: [
      { to: '/doctor/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/doctor/appointments',icon: Calendar,        label: 'Appointments' },
      { to: '/doctor/history',     icon: ClipboardList,   label: 'Patient History' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'My Profile' },
    ]},
  ],
  Receptionist: [
    { section: 'Operations', items: [
      { to: '/receptionist/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/receptionist/queue',        icon: ClipboardList,   label: 'Appointment Queue' },
      { to: '/receptionist/history',      icon: Calendar,        label: 'History' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'My Profile' },
    ]},
  ],
  Pharmacist: [
    { section: 'Dispensing', items: [
      { to: '/pharmacist/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/pharmacist/prescriptions',  icon: FileText,        label: 'Prescriptions' },
      { to: '/pharmacist/orders',         icon: PackageSearch,   label: 'Orders' },
      { to: '/pharmacist/medicines',      icon: Pill,            label: 'Medicines' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'My Profile' },
    ]},
  ],
  PharmacyOwner: [
    { section: 'Management', items: [
      { to: '/owner/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/owner/inventory',   icon: PackageSearch,   label: 'Inventory' },
      { to: '/owner/restock',     icon: Truck,           label: 'Restock Requests' },
      { to: '/owner/analytics',   icon: BarChart3,       label: 'Analytics' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'My Profile' },
    ]},
  ],
  Supplier: [
    { section: 'Supply Chain', items: [
      { to: '/supplier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/supplier/requests',  icon: ClipboardList,   label: 'Restock Requests' },
      { to: '/supplier/history',   icon: BarChart3,       label: 'Supply History' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'My Profile' },
    ]},
  ],
  Administrator: [
    { section: 'Administration', items: [
      { to: '/admin/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/users',       icon: Users,           label: 'User Management' },
      { to: '/admin/audit',       icon: ShieldCheck,     label: 'Audit Logs' },
      { to: '/admin/ai-monitor',  icon: Activity,        label: 'AI Monitor' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'My Profile' },
    ]},
  ],
};

// Role display config
const ROLE_META = {
  Patient:       { label: 'Patient Portal',       gradient: 'var(--gradient-primary)' },
  Doctor:        { label: 'Doctor Portal',         gradient: 'var(--gradient-doctor)' },
  Receptionist:  { label: 'Reception Portal',      gradient: 'linear-gradient(135deg,#5B21B6,#7C3AED)' },
  Pharmacist:    { label: 'Pharmacist Portal',     gradient: 'var(--gradient-pharma)' },
  PharmacyOwner: { label: 'Owner Portal',          gradient: 'linear-gradient(135deg,#991B1B,#DC2626)' },
  Supplier:      { label: 'Supplier Portal',       gradient: 'var(--gradient-supplier)' },
  Administrator: { label: 'Admin Portal',          gradient: 'var(--gradient-admin)' },
};

export default function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();
  const role = user?.role || 'Patient';
  const sections = NAV_BY_ROLE[role] || NAV_BY_ROLE.Patient;
  const meta = ROLE_META[role] || ROLE_META.Patient;

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <HeartPulse size={18} />
          </div>
          <div>
            <div className="logo-text">MediFlow AI</div>
            <div className="logo-sub">{meta.label}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map(({ section, items }) => (
          <div key={section} className="nav-section">
            <div className="nav-section-label">{section}</div>
            {items.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" size={17} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && <span className="nav-badge">{badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer user card */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar" style={{ background: meta.gradient }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{user?.fullName || 'Guest'}</div>
            <span className="user-role" style={{ color: 'var(--med-blue)' }}>{role}</span>
          </div>
          <button
            className="close-btn"
            onClick={apiLogout}
            title="Sign out"
            id="sidebar-logout-btn"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
