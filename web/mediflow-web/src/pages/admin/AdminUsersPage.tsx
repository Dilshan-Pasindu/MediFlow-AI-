import { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldCheck, UserCheck, UserX, RefreshCw, Mail, Phone, Clock } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiGetAdminUsers, apiUpdateUserStatus } from '../../services/api';

const ROLE_COLORS: Record<string, string> = {
  Doctor: '#059669',
  Receptionist: '#7C3AED',
  Pharmacist: '#B45309',
  PharmacyOwner: '#DC2626',
  Supplier: '#0891B2',
  Patient: '#0369A1',
  Administrator: '#1E293B',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, [selectedRole]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await apiGetAdminUsers(
        selectedRole === 'ALL' ? undefined : selectedRole,
        searchTerm || undefined
      );
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(userId: number, currentStatus: boolean) {
    setUpdatingId(userId);
    try {
      await apiUpdateUserStatus(userId, !currentStatus);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles = ['ALL', 'Doctor', 'Patient', 'Receptionist', 'Pharmacist', 'PharmacyOwner', 'Supplier', 'Administrator'];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="User Account Administration"
          subtitle="Directory and access management for all staff and patient accounts"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadUsers} id="refresh-users-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="admin"
            title="User Account Management"
            subtitle="Control role access, security states, and activation credentials across MediFlow"
            loading={loading}
            stats={[
              { label: 'Total Registered', value: users.length, icon: '👥' },
              { label: 'Active Accounts', value: users.filter(u => u.isActive).length, icon: '✅' },
              { label: 'Role Types', value: '7 Roles', icon: '🛡️' },
            ]}
          />

          {/* Search & Role Filters */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by full name or email address..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--border-color)', fontSize: 13.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`btn btn-sm ${selectedRole === r ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 12, height: 34, borderRadius: 'var(--r-md)' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-title">Registered Accounts ({filteredUsers.length})</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Real-time directory from database</span>
            </div>

            {loading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton" style={{ height: 50, borderRadius: 'var(--r-md)' }} />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <Users size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <div className="empty-title">No user accounts found</div>
                <div className="empty-sub">Try changing your search terms or role filters.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email & Phone</th>
                      <th>Role</th>
                      <th>Account Status</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const isUpdating = updatingId === u.id;
                      const roleColor = ROLE_COLORS[u.role] || '#1E293B';
                      const formattedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active';

                      return (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: '50%',
                                  background: roleColor,
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 12,
                                  fontWeight: 800,
                                }}
                              >
                                {u.fullName?.substring(0, 2).toUpperCase() || 'MF'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700 }}>{u.fullName}</div>
                                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>ID #{u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                              <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                              <span>{u.email}</span>
                            </div>
                            {u.phoneNumber && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                                <Phone size={11} />
                                <span>{u.phoneNumber}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                color: roleColor,
                                background: `${roleColor}15`,
                                borderColor: `${roleColor}40`,
                                fontWeight: 700,
                                fontSize: 12,
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
                          <td>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formattedDate}</span>
                          </td>
                          <td>
                            <button
                              className={`btn btn-xs ${u.isActive ? 'btn-ghost' : 'btn-primary'}`}
                              onClick={() => handleToggleStatus(u.id, u.isActive)}
                              disabled={isUpdating}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11.5,
                                color: u.isActive ? '#DC2626' : undefined,
                              }}
                            >
                              {u.isActive ? <UserX size={12} /> : <UserCheck size={12} />}
                              {isUpdating ? 'Saving...' : u.isActive ? 'Deactivate' : 'Reactivate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
