import * as React from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { apiGetNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead } from '../services/api';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { user } = useAuthStore();
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const data = await apiGetNotifications();
      setNotifications(data);
    } catch { /* not logged in or no notifications */ }
  }, []);

  React.useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  // Poll every 30s
  React.useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: number) => {
    await apiMarkNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAll = async () => {
    await apiMarkAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const typeColor = (type: string) => ({
    warning: { bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706' },
    info:    { bg: '#EFF6FF', border: '#BFDBFE', dot: '#2563EB' },
    success: { bg: '#ECFDF5', border: '#A7F3D0', dot: '#059669' },
  }[type] ?? { bg: '#F9FAFB', border: '#E5E7EB', dot: '#6B7280' });

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        id="topbar-notifications-btn"
        className="topbar-btn"
        title="Notifications"
        aria-label="Notifications"
        onClick={() => { setOpen(o => !o); if (!open) fetchNotifications(); }}
        style={{ position: 'relative' }}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            background: '#EF4444', color: 'white',
            borderRadius: '50%', fontSize: 9, fontWeight: 700,
            width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 360, maxHeight: 480,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
              Notifications {unread > 0 && <span style={{ color: '#EF4444', fontWeight: 600 }}>({unread})</span>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {unread > 0 && (
                <button onClick={handleMarkAll} title="Mark all read" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 500, padding: '4px 8px', borderRadius: 6,
                }}>
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', padding: 4, borderRadius: 6,
              }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                <Bell size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
                <div>No notifications yet</div>
              </div>
            ) : (
              notifications.map(n => {
                const colors = typeColor(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      background: n.isRead ? 'transparent' : colors.bg,
                      cursor: n.isRead ? 'default' : 'pointer',
                      transition: 'background 0.15s',
                      display: 'flex', gap: 10,
                    }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: n.isRead ? 'var(--border)' : colors.dot,
                      flexShrink: 0, marginTop: 5,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        {timeAgo(n.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
