import { useState } from 'react';
import { Users, Activity, ShieldCheck, BarChart3, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { getUser } from '../../services/api';

const MOCK_USERS = [
  { id: 1, name: 'Dr. Priya Sharma', email: 'doctor@mediflow.lk', role: 'Doctor', status: 'Active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Sarah Johnson', email: 'receptionist@mediflow.lk', role: 'Receptionist', status: 'Active', lastLogin: '30 min ago' },
  { id: 3, name: 'Nimasha Perera', email: 'pharmacist@mediflow.lk', role: 'Pharmacist', status: 'Active', lastLogin: '1 hour ago' },
  { id: 4, name: 'Michael Fernando', email: 'owner@mediflow.lk', role: 'PharmacyOwner', status: 'Active', lastLogin: '5 hours ago' },
  { id: 5, name: 'Ravi Kumara', email: 'supplier@mediflow.lk', role: 'Supplier', status: 'Active', lastLogin: '3 hours ago' },
  { id: 6, name: 'John Smith', email: 'patient@mediflow.lk', role: 'Patient', status: 'Active', lastLogin: '10 min ago' },
];

const MOCK_AI_EVENTS = [
  { time: '14:32', agent: '🩺 Specialist Agent', event: 'Recommended Gastroenterology for patient AP-2026-0012', status: 'success', confidence: '91%' },
  { time: '13:45', agent: '🧠 Clinical Agent', event: 'Diagnosis suggestion accepted by Dr. Sharma: Acute Gastritis', status: 'accepted' },
  { time: '13:20', agent: '💊 Medication Agent', event: 'Checked availability: Omeprazole, Antacid — 2/2 in stock', status: 'success' },
  { time: '12:15', agent: '📦 Inventory Agent', event: 'Restock recommendation sent: Amoxicillin 250mg (150 units)', status: 'pending' },
  { time: '11:50', agent: '🧠 Clinical Agent', event: 'Diagnosis suggestion modified by Dr. Patel before acceptance', status: 'modified' },
  { time: '10:30', agent: '🩺 Specialist Agent', event: 'Recommended Cardiology for patient AP-2026-0008', status: 'success', confidence: '88%' },
];

const ROLE_COLORS = { Doctor: '#059669', Receptionist: '#7C3AED', Pharmacist: '#B45309', PharmacyOwner: '#DC2626', Supplier: '#0891B2', Patient: '#0369A1', Administrator: '#1E293B' };

export default function AdminDashboard() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState('users');

  const agentStats = [
    { agent: '🩺 Specialist & Doctor', calls: 47, accepted: null, icon: '🩺', color: '#0369A1' },
    { agent: '🧠 Clinical Analysis', calls: 23, accepted: '91%', icon: '🧠', color: '#059669' },
    { agent: '💊 Medication Availability', calls: 23, accepted: null, icon: '💊', color: '#B45309' },
    { agent: '📦 Inventory Management', calls: 8, accepted: '75%', icon: '📦', color: '#DC2626' },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Admin Dashboard" subtitle="System health, user management, and AI monitoring" />
        <div className="page-body fade-in">

          {/* Dark banner */}
          <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)', borderRadius: 'var(--r-xl)', padding: '22px 28px', color: 'white', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(15,23,42,0.4)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 21, fontWeight: 800, marginBottom: 4 }}>System Administration</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Monitor all portal activities, user accounts, and AI agent operations</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Total Users', value: MOCK_USERS.length, icon: '👥' },
                { label: 'AI Events Today', value: MOCK_AI_EVENTS.length, icon: '🤖' },
                { label: 'System Status', value: '✅', icon: '🟢' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-lg)', padding: '10px 16px', textAlign: 'center', minWidth: 90 }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agent Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {agentStats.map(a => (
              <div key={a.agent} className="card" style={{ borderTop: `3px solid ${a.color}` }}>
                <div className="card-body" style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: a.color }}>{a.calls}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 2 }}>API Calls Today</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.agent.replace(/^.\s/, '')}</div>
                  {a.accepted && <span className="badge badge-green" style={{ marginTop: 8 }}>{a.accepted} Human Acceptance</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')} id="tab-users-admin">👥 Users ({MOCK_USERS.length})</button>
            <button className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')} id="tab-ai-monitor">🤖 AI Monitor ({MOCK_AI_EVENTS.length})</button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="card">
              <div className="card-header">
                <div className="section-title">User Management</div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u.id} id={`user-row-${u.id}`}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, background: (ROLE_COLORS as any)[u.role] || 'var(--gradient-primary)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>
                            {u.name ? u.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'U'}
                          </div>
                          <span style={{ fontWeight: 600 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>
                        <span className="badge" style={{ background: ((ROLE_COLORS as any)[u.role] || '#0369A1') + '20', color: (ROLE_COLORS as any)[u.role] || '#0369A1' }}>
                          {u.role}
                        </span>
                      </td>
                      <td><span className="badge badge-green">✓ {u.status}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{u.lastLogin}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" id={`edit-user-${u.id}`}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} id={`disable-user-${u.id}`}>Disable</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* AI Monitor Tab */}
          {activeTab === 'ai' && (
            <div className="card">
              <div className="card-header">
                <div className="section-title">🤖 AI Agent Activity Log</div>
                <span className="badge badge-green" style={{ fontSize: 11 }}>All Systems Operational</span>
              </div>
              <div style={{ padding: '0 8px' }}>
                {MOCK_AI_EVENTS.map((ev, idx) => (
                  <div key={idx} className="notif-item" id={`ai-event-${idx}`} style={{ borderBottom: '1px solid var(--border)', cursor: 'default' }}>
                    <div className="notif-icon" style={{ fontSize: 20, background: 'var(--surface-2)' }}>{ev.icon || '🤖'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{ev.agent}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{ev.event}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{ev.time}</div>
                      <span className={`badge ${ev.status === 'success' ? 'badge-green' : ev.status === 'accepted' ? 'badge-blue' : ev.status === 'modified' ? 'badge-yellow' : 'badge-gray'}`}>
                        {ev.status}
                      </span>
                      {ev.confidence && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{ev.confidence} conf.</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
