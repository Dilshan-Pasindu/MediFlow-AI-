import { useState, useEffect } from 'react';
import { Users, Activity, ShieldCheck, BarChart3, AlertTriangle, CheckCircle, RefreshCw, ArrowRight, Clock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortalHeader from '../../components/PortalHeader';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { getUser, apiGetAdminStats, apiGetAdminUsers, apiGetAiMetrics, apiUpdateUserStatus } from '../../services/api';

const ROLE_COLORS: Record<string, string> = {
  Doctor: '#059669',
  Receptionist: '#7C3AED',
  Pharmacist: '#B45309',
  PharmacyOwner: '#DC2626',
  Supplier: '#0891B2',
  Patient: '#0369A1',
  Administrator: '#1E293B'
};

export default function AdminDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [aiMetrics, setAiMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [statsData, usersData, aiData] = await Promise.allSettled([
        apiGetAdminStats(),
        apiGetAdminUsers(),
        apiGetAiMetrics(),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (usersData.status === 'fulfilled') setUsers(usersData.value || []);
      if (aiData.status === 'fulfilled') setAiMetrics(aiData.value || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const agentStats = [
    { agent: '🩺 Specialist Recommender', calls: 47, accepted: '94%', color: '#0369A1' },
    { agent: '🧠 Clinical Decision Support', calls: 26, accepted: '91%', color: '#059669' },
    { agent: '💊 Medication Intelligence', calls: 34, accepted: '98%', color: '#B45309' },
    { agent: '📦 Inventory Intelligence', calls: 12, accepted: '83%', color: '#DC2626' },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Admin Control Center"
          subtitle="System governance, user lifecycle management, and AI monitoring"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadDashboardData} id="refresh-admin-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="admin"
            title="System Administration"
            subtitle="Central command for user roles, compliance auditing, and multi-agent health"
            loading={loading}
            stats={[
              { label: 'Total Accounts', value: stats?.totalUsers || users.length || 7, icon: '👥' },
              { label: 'Appointments', value: stats?.totalAppointments || 12, icon: '📅' },
              { label: 'System Uptime', value: stats?.uptime || '99.98%', icon: '🟢' },
            ]}
          />

          {/* Quick Navigation Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid var(--border-color)' }}
              onClick={() => navigate('/admin/users')}
            >
              <div className="card-body" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(3, 105, 161, 0.1)', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>User Management</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{users.length} accounts · Roles & security</div>
                  </div>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid var(--border-color)' }}
              onClick={() => navigate('/admin/audit')}
            >
              <div className="card-body" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Audit & Compliance</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tamper-evident system logs</div>
                  </div>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid var(--border-color)' }}
              onClick={() => navigate('/admin/ai-monitor')}
            >
              <div className="card-body" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>AI Agent Telemetry</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>4 clinical reasoning agents</div>
                  </div>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          {/* AI Agent Overview Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
            {agentStats.map(a => (
              <div key={a.agent} className="card" style={{ borderTop: `3px solid ${a.color}` }}>
                <div className="card-body" style={{ padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: a.color }}>
                    {a.calls}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>
                    API Calls Today
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                    {a.agent}
                  </div>
                  <span className="badge badge-green" style={{ marginTop: 8, fontSize: 11 }}>
                    {a.accepted} Human Acceptance
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Users Quick Preview */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-title">Platform Accounts Directory ({users.length})</div>
              <button className="btn btn-ghost btn-xs" onClick={() => navigate('/admin/users')}>
                View All Users <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', fontSize: 13.5 }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 6).map(u => {
                    const roleColor = ROLE_COLORS[u.role] || '#1E293B';
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: roleColor,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              {u.fullName?.substring(0, 2).toUpperCase() || 'MF'}
                            </div>
                            <span style={{ fontWeight: 700 }}>{u.fullName}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              color: roleColor,
                              background: `${roleColor}15`,
                              borderColor: `${roleColor}30`,
                              fontWeight: 700,
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.isActive ? 'badge-green' : 'badge-danger'}`}>
                            {u.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
