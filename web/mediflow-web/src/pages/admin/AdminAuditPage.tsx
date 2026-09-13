import { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, AlertTriangle, Info, CheckCircle2, Clock, RefreshCw, FileText } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiGetAuditLogs } from '../../services/api';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  async function loadAuditLogs() {
    setLoading(true);
    try {
      const data = await apiGetAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchSearch =
      log.actor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id?.toLowerCase().includes(searchTerm.toLowerCase());

    if (severityFilter === 'ALL') return matchSearch;
    return matchSearch && log.severity?.toLowerCase() === severityFilter.toLowerCase();
  });

  const warningCount = logs.filter(l => l.severity?.toLowerCase() === 'warning').length;
  const infoCount = logs.filter(l => l.severity?.toLowerCase() === 'info').length;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="System Audit & Security Logs"
          subtitle="Immutable compliance log of platform operations, access changes, and clinical events"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadAuditLogs} id="refresh-audit-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="admin"
            title="Compliance & Audit Trail"
            subtitle="Centralized tamper-evident audit logging for HIPAA/clinical governance standards"
            loading={loading}
            stats={[
              { label: 'Logged Events', value: logs.length, icon: '📜' },
              { label: 'Informational', value: infoCount, icon: 'ℹ️' },
              { label: 'Security Flags', value: warningCount, icon: '⚠️', highlight: warningCount > 0 },
            ]}
          />

          {/* Search & Filter */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by actor, action, audit ID or details..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--border-color)', fontSize: 13.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {(['ALL', 'Info', 'Warning'] as const).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`btn btn-sm ${severityFilter === sev ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 12, height: 34, borderRadius: 'var(--r-md)' }}
                  >
                    {sev === 'ALL' ? 'All Severities' : sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-title">Audit Trail Records ({filteredLogs.length})</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auto-recorded chronological timeline</span>
            </div>

            {loading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton" style={{ height: 50, borderRadius: 'var(--r-md)' }} />
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <ShieldCheck size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <div className="empty-title">No audit events match criteria</div>
                <div className="empty-sub">Audit trail is currently clear for the selected parameters.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      <th>Audit Event ID</th>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Actor & Role</th>
                      <th>Event Details</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => {
                      const isWarning = log.severity?.toLowerCase() === 'warning';
                      const formattedTime = log.timestamp
                        ? new Date(log.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : 'Recent';

                      return (
                        <tr key={log.id}>
                          <td>
                            <strong style={{ color: 'var(--med-teal)', fontFamily: 'Outfit, sans-serif' }}>
                              {log.id}
                            </strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                              <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                              <span>{formattedTime}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{log.action}</span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{log.actor}</div>
                            <span className="badge badge-teal" style={{ fontSize: 10.5, marginTop: 2 }}>{log.role}</span>
                          </td>
                          <td>
                            <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                          </td>
                          <td>
                            <span className={`badge ${isWarning ? 'badge-danger' : 'badge-green'}`}>
                              {isWarning ? <AlertTriangle size={11} style={{ marginRight: 4 }} /> : <Info size={11} style={{ marginRight: 4 }} />}
                              {log.severity}
                            </span>
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
