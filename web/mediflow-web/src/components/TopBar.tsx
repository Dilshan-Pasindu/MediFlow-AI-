import * as React from 'react';
import { Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import NotificationBell from './NotificationBell';

export interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { user } = useAuthStore();

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : '?';

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'User';

  return (
    <header className="topbar">
      <div className="topbar-titles">
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>

      <div className="topbar-actions">
        {actions}

        <NotificationBell />

        <button className="topbar-btn" title="Settings" id="topbar-settings-btn" aria-label="Settings">
          <Settings size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--r-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0,
            fontFamily: 'Outfit, sans-serif'
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {firstName}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
