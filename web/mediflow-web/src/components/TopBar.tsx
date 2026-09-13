import * as React from 'react';
import { Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import NotificationBell from './NotificationBell';

export interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const ROLE_COLORS: Record<string, string> = {
  Patient:       '#2A7DE1',
  Doctor:        '#059669',
  Receptionist:  '#7C3AED',
  Pharmacist:    '#D97706',
  PharmacyOwner: '#DC2626',
  Supplier:      '#0891B2',
  Administrator: '#1E293B',
};

const ROLE_AVATAR_GRADIENT: Record<string, string> = {
  Patient:       'linear-gradient(135deg,#2A7DE1,#4FD1C5)',
  Doctor:        'linear-gradient(135deg,#065F46,#059669)',
  Receptionist:  'linear-gradient(135deg,#4C1D95,#7C3AED)',
  Pharmacist:    'linear-gradient(135deg,#78350F,#D97706)',
  PharmacyOwner: 'linear-gradient(135deg,#991B1B,#DC2626)',
  Supplier:      'linear-gradient(135deg,#155E75,#0891B2)',
  Administrator: 'linear-gradient(135deg,#0F172A,#1E293B)',
};

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { user } = useAuthStore();

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'User';
  const roleColor = ROLE_COLORS[user?.role || 'Patient'] || '#2A7DE1';
  const avatarGradient = ROLE_AVATAR_GRADIENT[user?.role || 'Patient'] || 'linear-gradient(135deg,#2A7DE1,#4FD1C5)';

  return (
    <header className="topbar">
      {/* Title section */}
      <div className="topbar-titles">
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>

      {/* Actions section */}
      <div className="topbar-actions">
        {actions}

        <NotificationBell />

        <button
          className="topbar-btn touch-target"
          title="Settings"
          id="topbar-settings-btn"
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>

        {/* User chip — macOS menu-bar style */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 10px',
            background: 'rgba(0,0,0,0.04)',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              background: avatarGradient,
              borderRadius: 'var(--r-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 10.5,
              fontWeight: 700,
              flexShrink: 0,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              letterSpacing: '-0.3px',
            }}
          >
            {initials}
          </div>
          <div>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
            >
              {firstName}
            </div>
            <div
              style={{
                fontSize: 9.5,
                color: roleColor,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2px',
              }}
            >
              {user?.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
