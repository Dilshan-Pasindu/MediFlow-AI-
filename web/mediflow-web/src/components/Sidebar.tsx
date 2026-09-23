import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, Calendar, FileText,
  User, LogOut, HeartPulse, Pill, PackageSearch,
  ClipboardList, BarChart3, Truck,
  ShieldCheck, Activity, Users, type LucideIcon
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types/auth';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

// ─── Role-specific navigation ──────────────────────────────────
const NAV_BY_ROLE: Record<UserRole, NavSection[]> = {
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
      { to: '/doctor/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/doctor/appointments',   icon: Calendar,        label: 'Appointments' },
      { to: '/doctor/e-prescription', icon: Pill,            label: 'E-Prescription' },
      { to: '/doctor/history',        icon: ClipboardList,   label: 'Patient History' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'User Profile' },
    ]},
  ],
  Receptionist: [
    { section: 'Operations', items: [
      { to: '/receptionist/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/receptionist/queue',     icon: ClipboardList,   label: 'Appointment Queue' },
      { to: '/receptionist/history',   icon: Calendar,        label: 'History' },
    ]},
    { section: 'Account', items: [
      { to: '/profile', icon: User, label: 'My Profile' },
    ]},
  ],
  Pharmacist: [
    { section: 'Dispensing', items: [
      { to: '/pharmacist/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/pharmacist/prescriptions', icon: FileText,        label: 'Prescriptions' },
      { to: '/pharmacist/orders',        icon: PackageSearch,   label: 'Orders' },
      { to: '/pharmacist/medicines',     icon: Pill,            label: 'Medicines' },
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

// ─── Role meta (avatar gradient only — nav item active color from CSS) ──────
const ROLE_META: Record<UserRole, { label: string; avatarGradient: string }> = {
  Patient:       { label: 'Patient Portal',    avatarGradient: 'linear-gradient(135deg,#2A7DE1,#4FD1C5)' },
  Doctor:        { label: 'Doctor Portal',     avatarGradient: 'linear-gradient(135deg,#065F46,#059669)' },
  Receptionist:  { label: 'Reception Portal',  avatarGradient: 'linear-gradient(135deg,#4C1D95,#7C3AED)' },
  Pharmacist:    { label: 'Pharmacist Portal', avatarGradient: 'linear-gradient(135deg,#78350F,#D97706)' },
  PharmacyOwner: { label: 'Owner Portal',      avatarGradient: 'linear-gradient(135deg,#991B1B,#DC2626)' },
  Supplier:      { label: 'Supplier Portal',   avatarGradient: 'linear-gradient(135deg,#155E75,#0891B2)' },
  Administrator: { label: 'Admin Portal',      avatarGradient: 'linear-gradient(135deg,#0F172A,#1E293B)' },
};

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const role: UserRole = user?.role || 'Patient';
  const sections = NAV_BY_ROLE[role] || NAV_BY_ROLE.Patient;
  const meta = ROLE_META[role] || ROLE_META.Patient;

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <HeartPulse size={17} />
          </div>
          <div>
            <div className="logo-text">MediFlow AI</div>
            <div className="logo-sub">{meta.label}</div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        {sections.map(({ section, items }) => (
          <div key={section} className="nav-section">
            <div className="nav-section-label">{section}</div>
            {items.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon className="nav-icon" size={16} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && <span className="nav-badge">{badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer user card ── */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div
            className="user-avatar"
            style={{ background: meta.avatarGradient }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{user?.fullName || 'Guest'}</div>
            <div className="user-role">{role}</div>
          </div>
          <button
            className="close-btn touch-target"
            onClick={handleLogout}
            title="Sign out"
            id="sidebar-logout-btn"
            aria-label="Sign out"
            style={{ width: 30, height: 30, minWidth: 30, minHeight: 30 }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
