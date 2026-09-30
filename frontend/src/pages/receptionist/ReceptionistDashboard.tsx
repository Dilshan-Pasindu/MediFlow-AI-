import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Hash, Loader, RefreshCw, XCircle, CreditCard, ExternalLink } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiVerifyPayment, apiGenerateAppointmentNumber, apiCancelAppointment, getUser } from '../../services/api';
import { apiGetRefundRequests, apiApproveRefund, apiRejectRefund } from '../../api/payment.api';
import { usePendingAppointments } from '../../hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string; step: number }> = {
  Pending:          { color: '#B45309', bg: '#FFFBEB', label: 'Pending Payment', step: 1 },
  PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', label: 'Payment Sent',    step: 2 },
  Confirmed:        { color: '#059669', bg: '#ECFDF5', label: 'Confirmed',        step: 3 },
  Cancelled:        { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelled',        step: 4 },
};

const REFUND_STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  RefundRequested:  { color: '#B45309', bg: '#FFFBEB', label: '📋 Review Pending' },
  RefundApproved:   { color: '#0369A1', bg: '#EFF6FF', label: '✅ Approved' },
  RefundProcessing: { color: '#7C3AED', bg: '#F5F3FF', label: '⏳ Processing' },
  RefundCompleted:  { color: '#059669', bg: '#ECFDF5', label: '💰 Completed' },
  RefundRejected:   { color: '#DC2626', bg: '#FEF2F2', label: '❌ Rejected' },
  RefundFailed:     { color: '#DC2626', bg: '#FEF2F2', label: '⚠️ Failed' },
};

export default function ReceptionistDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading: loading, refetch: load } = usePendingAppointments();
  const [actionLoading, setActionLoading] = useState<Record<string | number, string | null>>({});
  const [activeTab, setActiveTab] = useState('PaymentSubmitted');
  const [messages, setMessages] = useState<Record<string | number, { type: string; text: string } | null>>({});
  const [rejectReasons, setRejectReasons] = useState<Record<number, string>>({});
  const [openRejectId, setOpenRejectId] = useState<number | null>(null);

  // Refund Requests query
  const { data: allRefunds = [], isLoading: refundsLoading, refetch: refetchRefunds } = useQuery({
    queryKey: ['recept-refunds'],
    queryFn: () => apiGetRefundRequests(),
    refetchInterval: 15000,
  });

  const pendingRefunds = (allRefunds as any[]).filter(r => r.refundStatus === 'RefundRequested');

  async function handleVerify(id: number | string) {
    setActionLoading(a => ({ ...a, [id]: 'verify' }));
    try {
      await apiVerifyPayment(id);
      await apiGenerateAppointmentNumber(id);
      setMessages(m => ({ ...m, [id]: { type: 'success', text: 'Payment verified & appointment confirmed!' } }));
      load();
    } catch (err: any) {
      setMessages(m => ({ ...m, [id]: { type: 'error', text: err?.message || 'Verification failed' } }));
    } finally {
      setActionLoading(a => ({ ...a, [id]: null }));
    }
  }

  async function handleCancel(id: number | string) {
    setActionLoading(a => ({ ...a, [id]: 'cancel' }));
    try {
      await apiCancelAppointment(id, 'Rejected by receptionist');
      setMessages(m => ({ ...m, [id]: { type: 'error', text: 'Appointment request rejected.' } }));
      load();
    } catch (err: any) {
      setMessages(m => ({ ...m, [id]: { type: 'error', text: err?.message || 'Cancellation failed' } }));
    } finally {
      setActionLoading(a => ({ ...a, [id]: null }));
    }
  }

  async function handleApproveRefund(refundId: number) {
    setActionLoading(a => ({ ...a, [refundId]: 'approve-refund' }));
    try {
      await apiApproveRefund(refundId);
      setMessages(m => ({ ...m, [refundId]: { type: 'success', text: 'Refund approved and completed successfully!' } }));
      refetchRefunds();
      queryClient.invalidateQueries({ queryKey: ['recept-refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      load();
    } catch (err: any) {
      setMessages(m => ({ ...m, [refundId]: { type: 'error', text: err?.message || 'Failed to approve refund' } }));
    } finally {
      setActionLoading(a => ({ ...a, [refundId]: null }));
    }
  }

  async function handleRejectRefund(refundId: number) {
    const reason = rejectReasons[refundId] || 'Cancellation requested after cutoff';
    setActionLoading(a => ({ ...a, [refundId]: 'reject-refund' }));
    try {
      await apiRejectRefund(refundId, reason);
      setMessages(m => ({ ...m, [refundId]: { type: 'error', text: 'Refund request declined.' } }));
      setOpenRejectId(null);
      refetchRefunds();
      queryClient.invalidateQueries({ queryKey: ['recept-refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      load();
    } catch (err: any) {
      setMessages(m => ({ ...m, [refundId]: { type: 'error', text: err?.message || 'Failed to reject refund' } }));
    } finally {
      setActionLoading(a => ({ ...a, [refundId]: null }));
    }
  }

  const pending = appointments.filter(a => a.status === 'Pending');
  const paymentSent = appointments.filter(a => a.status === 'PaymentSubmitted');
  const confirmed = appointments.filter(a => a.status === 'Confirmed');
  const cancelled = appointments.filter(a => a.status === 'Cancelled');
  const display = appointments.filter(a => a.status === activeTab);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Receptionist Dashboard"
          subtitle="Manage appointment verification, confirmation, and refunds"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => { load(); refetchRefunds(); }} id="refresh-appts-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">

          <PortalHeader
            role="recept"
            title="Reception Portal"
            subtitle="Verify payments, confirm appointments, and review patient refund requests"
            loading={loading || refundsLoading}
            stats={[
              { label: 'Pending Payment', value: pending.length, icon: '🕐' },
              { label: 'Awaiting Verify', value: paymentSent.length, icon: '💳', highlight: paymentSent.length > 0 },
              { label: 'Confirmed', value: confirmed.length, icon: '✅' },
              { label: 'Refund Requests', value: pendingRefunds.length, icon: '💰', highlight: pendingRefunds.length > 0 },
            ]}
          />

          {/* Human Approval Banner */}
          <div className="approval-banner" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)', border: '1.5px solid #F59E0B', padding: '16px', borderRadius: 'var(--r-lg)', marginBottom: 20, display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🔐</span>
            <div>
              <div className="approval-banner-title" style={{ color: '#92400E', fontWeight: 800, fontSize: 14 }}>Human Approval Point #1 — Payment &amp; Refund Verification</div>
              <div className="approval-banner-sub" style={{ color: '#B45309', fontSize: 12.5, marginTop: 2 }}>
                Review appointment requests below. Accept to verify payment &amp; assign numbers, or review patient refund requests to approve or decline refunds.
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'PaymentSubmitted' ? 'active' : ''}`} onClick={() => setActiveTab('PaymentSubmitted')} id="tab-payment-sent">
              💳 Payment Submitted ({paymentSent.length})
            </button>
            <button className={`tab-btn ${activeTab === 'Pending' ? 'active' : ''}`} onClick={() => setActiveTab('Pending')} id="tab-pending">
              🕐 Pending Payment ({pending.length})
            </button>
            <button className={`tab-btn ${activeTab === 'Confirmed' ? 'active' : ''}`} onClick={() => setActiveTab('Confirmed')} id="tab-confirmed">
              ✅ Confirmed ({confirmed.length})
            </button>
            <button className={`tab-btn ${activeTab === 'Cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('Cancelled')} id="tab-cancelled">
              ❌ Cancelled / Rejected ({cancelled.length})
            </button>
            <button className={`tab-btn ${activeTab === 'RefundRequests' ? 'active' : ''}`} onClick={() => setActiveTab('RefundRequests')} id="tab-refunds">
              💰 Refund Requests ({pendingRefunds.length})
            </button>
          </div>

          {/* Refund Requests Tab Content */}
          {activeTab === 'RefundRequests' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Showing {allRefunds.length} Refund Request{allRefunds.length === 1 ? '' : 's'}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/receptionist/refunds')}
                  id="open-full-refund-page-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--med-blue)', fontWeight: 600 }}
                >
                  <ExternalLink size={14} /> Open Full Refund Management
                </button>
              </div>

              {refundsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--r-lg)' }} />)}
                </div>
              ) : allRefunds.length === 0 ? (
                <div className="empty-state card" style={{ padding: 40, textAlign: 'center' }}>
                  <div className="empty-icon" style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
                  <div className="empty-title" style={{ fontWeight: 800, fontSize: 16 }}>No refund requests!</div>
                  <div className="empty-sub" style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                    No patient cancellations with refund applications have been submitted.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(allRefunds as any[]).map((refund: any) => {
                    const st = REFUND_STATUS_STYLES[refund.refundStatus] || REFUND_STATUS_STYLES.RefundRequested;
                    const isPending = refund.refundStatus === 'RefundRequested';
                    const isLoading = actionLoading[refund.id];
                    const msg = messages[refund.id];
                    const isRejectOpen = openRejectId === refund.id;

                    return (
                      <div key={refund.id} className="card" id={`recept-refund-${refund.id}`}>
                        <div className="card-body" style={{ padding: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            <div style={{ width: 50, height: 56, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <CreditCard size={22} color="var(--med-blue)" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{refund.patientName}</div>
                                <span className="badge" style={{ color: st.color, background: st.bg, fontSize: 11, padding: '3px 8px' }}>{st.label}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ref: {refund.refundReference}</span>
                              </div>

                              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                                🩺 <strong>{refund.doctorName}</strong> ({refund.specialtyName}) · Appointment #{refund.appointmentNumber || refund.appointmentId}
                              </div>

                              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                💰 Refund Amount: <strong style={{ color: '#059669', fontSize: 14 }}>Rs. {refund.amount?.toLocaleString()}</strong>
                                <span style={{ marginLeft: 14, color: 'var(--text-muted)', fontSize: 12 }}>
                                  Requested: {new Date(refund.requestedAt).toLocaleString()}
                                </span>
                              </div>

                              {refund.additionalNotes && (
                                <div style={{ fontSize: 12.5, color: '#B45309', background: '#FFFBEB', padding: '6px 10px', borderRadius: 6, marginTop: 6 }}>
                                  <strong>Patient Reason:</strong> {refund.additionalNotes}
                                </div>
                              )}

                              {refund.rejectionReason && (
                                <div style={{ fontSize: 12.5, color: '#DC2626', background: '#FEF2F2', padding: '6px 10px', borderRadius: 6, marginTop: 6 }}>
                                  <strong>Declined Reason:</strong> {refund.rejectionReason}
                                </div>
                              )}

                              {msg && (
                                <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 'var(--r-md)', background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: msg.type === 'success' ? '#059669' : '#DC2626', fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                                  {msg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {msg.text}
                                </div>
                              )}

                              {isRejectOpen && (
                                <div style={{ marginTop: 12, padding: 12, background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
                                  <label style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', display: 'block', marginBottom: 4 }}>
                                    Reason for Declining Refund:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    style={{ width: '100%', fontSize: 13, marginBottom: 8 }}
                                    placeholder="e.g. Cancelled past cutoff, service already delivered"
                                    value={rejectReasons[refund.id] || ''}
                                    onChange={e => setRejectReasons(prev => ({ ...prev, [refund.id]: e.target.value }))}
                                  />
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleRejectRefund(refund.id)}
                                      disabled={isLoading === 'reject-refund'}
                                    >
                                      {isLoading === 'reject-refund' ? <Loader size={12} className="spin" /> : 'Confirm Decline'}
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-ghost btn-sm"
                                      onClick={() => setOpenRejectId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                              {isPending && !isRejectOpen && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, background: '#059669', color: 'white', border: 'none', cursor: 'pointer' }}
                                    onClick={() => handleApproveRefund(refund.id)}
                                    disabled={!!isLoading}
                                    id={`approve-refund-btn-${refund.id}`}
                                  >
                                    {isLoading === 'approve-refund' ? <Loader size={14} className="spin" /> : <CheckCircle size={14} />}
                                    {isLoading === 'approve-refund' ? 'Processing...' : 'Approve Refund'}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer' }}
                                    onClick={() => setOpenRejectId(refund.id)}
                                    disabled={!!isLoading}
                                    id={`reject-refund-btn-${refund.id}`}
                                  >
                                    <XCircle size={14} /> Decline
                                  </button>
                                </>
                              )}

                              {refund.refundStatus === 'RefundCompleted' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '6px 12px', borderRadius: 'var(--r-md)' }}>
                                  <CheckCircle size={16} /> Refunded
                                </div>
                              )}

                              {refund.refundStatus === 'RefundRejected' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#DC2626', background: '#FEF2F2', padding: '6px 12px', borderRadius: 'var(--r-md)' }}>
                                  <XCircle size={16} /> Declined
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
          ) : (
            /* Regular Appointment Tabs */
            <div>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--r-lg)' }} />)}
                </div>
              ) : display.length === 0 ? (
                <div className="empty-state card" style={{ padding: 40, textAlign: 'center' }}>
                  <div className="empty-icon" style={{ fontSize: 36, marginBottom: 12 }}>{activeTab === 'PaymentSubmitted' ? '🎉' : '📋'}</div>
                  <div className="empty-title" style={{ fontWeight: 800, fontSize: 16 }}>{activeTab === 'PaymentSubmitted' ? 'No pending verifications!' : 'No appointments found'}</div>
                  <div className="empty-sub" style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>All caught up for this status tab.</div>
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
                        <div className="card-body" style={{ padding: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            <div style={{ width: 50, height: 56, background: 'var(--med-blue-50)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900, color: 'var(--med-blue)', lineHeight: 1 }}>{d.getDate()}</div>
                              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>{d.toLocaleString('default', { month: 'short' })}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{appt.patientName}</div>
                                <span className="badge" style={{ color: st.color, background: st.bg, fontSize: 11, padding: '3px 8px' }}>{st.label}</span>
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                                🩺 <strong>{appt.doctorName}</strong> ({appt.specialtyName}) · 🕒 {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                💰 Consultation Fee: <strong>Rs. {appt.fee?.toLocaleString()}</strong>
                                {appt.appointmentNumber && <span style={{ marginLeft: 12, color: 'var(--med-teal)', fontWeight: 700 }}><Hash size={12} /> {appt.appointmentNumber}</span>}
                              </div>
                              {appt.notes && (
                                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                                  Notes: {appt.notes}
                                </div>
                              )}
                              {msg && (
                                <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 'var(--r-md)', background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: msg.type === 'success' ? '#059669' : '#DC2626', fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                                  {msg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {msg.text}
                                </div>
                              )}
                            </div>

                            {/* Accept / Reject Action Buttons for Receptionist */}
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                              {(appt.status === 'PaymentSubmitted' || appt.status === 'Pending') && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, background: '#059669', color: 'white', border: 'none', cursor: 'pointer' }}
                                    onClick={() => handleVerify(appt.id)}
                                    disabled={!!isLoading}
                                    id={`verify-btn-${appt.id}`}
                                  >
                                    {isLoading === 'verify' ? <Loader size={14} className="spin" /> : <CheckCircle size={14} />}
                                    {isLoading === 'verify' ? 'Processing...' : 'Accept & Confirm'}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer' }}
                                    onClick={() => handleCancel(appt.id)}
                                    disabled={!!isLoading}
                                    id={`reject-btn-${appt.id}`}
                                  >
                                    {isLoading === 'cancel' ? <Loader size={14} className="spin" /> : <XCircle size={14} />}
                                    {isLoading === 'cancel' ? 'Processing...' : 'Reject Request'}
                                  </button>
                                </>
                              )}
                              {appt.status === 'Confirmed' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--success)', background: '#ECFDF5', padding: '6px 12px', borderRadius: 'var(--r-md)' }}>
                                  <CheckCircle size={16} /> Confirmed
                                </div>
                              )}
                              {appt.status === 'Cancelled' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--danger)', background: '#FEF2F2', padding: '6px 12px', borderRadius: 'var(--r-md)' }}>
                                  <XCircle size={16} /> Rejected / Cancelled
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
          )}
        </div>
      </div>
    </div>
  );
}
