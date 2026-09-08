import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Hash, User, Loader, ChevronRight, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiVerifyPayment, apiGenerateAppointmentNumber, apiCancelAppointment, getUser } from '../../services/api';
import { usePendingAppointments } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import type { ConsultationAppointment } from '../../types/consultation';

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string; step: number }> = {
  Pending:          { color: '#B45309', bg: '#FFFBEB', label: 'Pending Payment', step: 1 },
  PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', label: 'Payment Sent',    step: 2 },
  Confirmed:        { color: '#059669', bg: '#ECFDF5', label: 'Confirmed',        step: 3 },
};

export default function ReceptionistDashboard() {
  const user = getUser();
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading: loading, refetch: load } = usePendingAppointments();
  const [actionLoading, setActionLoading] = useState<Record<string | number, string | null>>({});
  const [activeTab, setActiveTab] = useState('PaymentSubmitted');
  const [messages, setMessages] = useState<Record<string | number, { type: string; text: string } | null>>({});

  async function handleVerify(id: number | string) {
    setActionLoading(a => ({ ...a, [id]: 'verify' }));
    try {
      await apiVerifyPayment(id);
      await apiGenerateAppointmentNumber(id);
      setMessages(m => ({ ...m, [id]: { type: 'success', text: 'Payment verified & appointment number generated!' } }));
      load();
    } catch (err: any) {
      setMessages(m => ({ ...m, [id]: { type: 'error', text: err?.message || 'Verification failed' } }));
    } finally { setActionLoading(a => ({ ...a, [id]: null })); }
  }

  async function handleCancel(id: number | string) {
    setActionLoading(a => ({ ...a, [id]: 'cancel' }));
    try {
      await apiCancelAppointment(id, 'Cancelled by receptionist');
      load();
    } catch (err: any) {
      setMessages(m => ({ ...m, [id]: { type: 'error', text: err?.message || 'Cancellation failed' } }));
    } finally { setActionLoading(a => ({ ...a, [id]: null })); }
  }

  const pending = appointments.filter(a => a.status === 'Pending');
  const paymentSent = appointments.filter(a => a.status === 'PaymentSubmitted');
  const confirmed = appointments.filter(a => a.status === 'Confirmed');
  const display = appointments.filter(a => a.status === activeTab);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Receptionist Dashboard"
          subtitle="Manage appointment verification and confirmation"
          actions={<button className="btn btn-ghost btn-sm" onClick={() => { load(); }} id="refresh-appts-btn"><RefreshCw size={14} /> Refresh</button>}
        />
        <div className="page-body fade-in">

          {/* Purple banner */}
          <div style={{ background: 'linear-gradient(135deg,#5B21B6,#7C3AED)', borderRadius: 'var(--r-xl)', padding: '22px 28px', color: 'white', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 21, fontWeight: 800, marginBottom: 4 }}>Reception Portal</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Verify payments and confirm appointments with unique numbers</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Pending Payment', value: pending.length, icon: '🕐' },
                { label: 'Awaiting Verify', value: paymentSent.length, icon: '💳', highlight: true },
                { label: 'Confirmed', value: confirmed.length, icon: '✅' },
              ].map(s => (
                <div key={s.label} style={{ background: s.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: `1.5px solid ${s.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 'var(--r-lg)', padding: '10px 16px', textAlign: 'center', minWidth: 90 }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{loading ? '—' : s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Human Approval Banner */}
          <div className="approval-banner">
            <span className="approval-banner-icon">🔐</span>
            <div>
              <div className="approval-banner-title">Human Approval Point #1 — Payment Verification</div>
              <div className="approval-banner-sub">Review payment submissions and verify manually. Only verified appointments get appointment numbers generated by the system.</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'PaymentSubmitted' ? 'active' : ''}`} onClick={() => setActiveTab('PaymentSubmitted')} id="tab-payment-sent">
              💳 Payment Submitted ({paymentSent.length})
            </button>
            <button className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`} onClick={() => setActiveTab('Pending')} id="tab-pending">
              🕐 Pending ({pending.length})
            </button>
            <button className={`tab-btn ${activeTab === 'Confirmed' ? 'active' : ''}`} onClick={() => setActiveTab('Confirmed')} id="tab-confirmed">
              ✅ Confirmed ({confirmed.length})
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--r-lg)' }} />)}
            </div>
          ) : display.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">{activeTab === 'PaymentSubmitted' ? '🎉' : '📋'}</div>
              <div className="empty-title">{activeTab === 'PaymentSubmitted' ? 'No pending verifications!' : 'No appointments found'}</div>
              <div className="empty-sub">All caught up.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {display.map(appt => {
                const d = new Date(appt.appointmentDateTime);
                const st = STATUS_STYLES[appt.status] || STATUS_STYLES.Pending;
                const isLoading = actionLoading[appt.id];
                const msg = messages[appt.id];
                return (
                  <div key={appt.id} className="card" id={`recept-appt-${appt.id}`}>
                    <div className="card-body">
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div style={{ width: 46, height: 52, background: 'var(--med-blue-50)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900, color: 'var(--med-blue)', lineHeight: 1 }}>{d.getDate()}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d.toLocaleString('default', { month: 'short' })}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{appt.patientName}</div>
                            <span className="badge" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                          </div>
                          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 2 }}>
                            🩺 {appt.doctorName} · {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                            💰 Fee: <strong>Rs. {appt.fee?.toLocaleString()}</strong>
                            {appt.appointmentNumber && <span style={{ marginLeft: 10, color: 'var(--med-teal)', fontWeight: 700 }}><Hash size={11} /> {appt.appointmentNumber}</span>}
                          </div>
                          {msg && (
                            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 'var(--r-md)', background: msg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: 12.5, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                              {msg.type === 'success' ? <CheckCircle size={13} /> : <AlertCircle size={13} />} {msg.text}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                          {appt.status === 'PaymentSubmitted' && (
                            <>
                              <button className="btn btn-success" onClick={() => handleVerify(appt.id)} disabled={!!isLoading} id={`verify-btn-${appt.id}`}>
                                {isLoading === 'verify' ? <Loader size={13} className="spin" /> : <CheckCircle size={13} />}
                                {isLoading === 'verify' ? 'Verifying...' : 'Verify & Confirm'}
                              </button>
                              <button className="btn btn-danger" onClick={() => handleCancel(appt.id)} disabled={!!isLoading} id={`reject-btn-${appt.id}`}>
                                {isLoading === 'cancel' ? <Loader size={13} className="spin" /> : 'Reject'}
                              </button>
                            </>
                          )}
                          {appt.status === 'Confirmed' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>
                              <CheckCircle size={15} /> Confirmed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
