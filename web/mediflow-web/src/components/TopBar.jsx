import { Bell } from 'lucide-react';
import { getUser } from '../services/api';

export default function TopBar({ title, subtitle, actions }) {
  const user = getUser();
  
  return (
    <div className="topbar">
      <div style={{ flex: 1 }}>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>
      <div className="topbar-actions">
        {actions}
        <button className="close-btn" style={{ width: 36, height: 36 }}>
          <Bell size={17} />
        </button>
        <div className="user-avatar" style={{ width: 34, height: 34, borderRadius: 10, fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #0369A1, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
        </div>
      </div>
    </div>
  );
}
