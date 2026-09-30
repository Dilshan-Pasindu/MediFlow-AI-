import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, Clock, AlertCircle, RefreshCw,
  Loader, Info, XCircle, CreditCard
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetRefundStatus, apiRequestRefund, apiCancelAppointmentForRefund, type RefundStatusResponse } from '../api/payment.api';

const REFUND_STEPS = [
  { key: 'RefundRequested', label: 'Requested', icon: '📋', desc: 'Waiting for receptionist review' },
  { key: 'RefundApproved', label: 'Approved', icon: '✅', desc: 'Receptionist approved the refund' },
  { key: 'RefundProcessing', label: 'Processing', icon: '⏳', desc: 'Refund initiated with payment provider' },
  { key: 'RefundCompleted', label: 'Completed', icon: '💰', desc: 'Refund credited to your account' },
];

function RefundTimeline({ status }: { status: string }) {
  const currentIdx = REFUND_STEPS.findIndex(s => s.key === status);
  const failed = status === 'RefundRejected' || status === 'RefundFailed';

  if (failed) {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 18px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
        <XCircle size={20} style={{ color: '#DC2626', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, color: '#991B1B', fontSize: 14 }}>
            {status === 'RefundRejected' ? 'Refund Request Rejected' : 'Refund Failed'}
          </div>
          <div style={{ color: '#B91C1C', fontSize: 12.5, marginTop: 2 }}>
            Please contact reception for more information.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
      {REFUND_STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const isFuture = i > currentIdx;
        return (
          <div key={step.key} style={{ display: 'flex', gap: 16 }}>
            {/* Left: dot + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: isDone ? '#059669' : isActive ? 'var(--med-blue)' : 'var(--border)',
                color: isDone || isActive ? 'white' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 15, boxShadow: isActive ? '0 0 0 4px rgba(2,132,199,0.15)' : 'none',
                transition: 'all 0.3s',
              }}>
                {isDone ? <CheckCircle size={18} /> : <span>{step.icon}</span>}
              </div>
              {i < REFUND_STEPS.length - 1 && (
                <div style={{
                  width: 2, flex: 1, minHeight: 28,
                  background: isDone ? '#059669' : 'var(--border)',
                  margin: '4px 0',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>

            {/* Right: content */}
            <div style={{ padding: '6px 0 24px 0', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: isFuture ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                {step.label}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
                {step.desc}
              </div>
              {isActive && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '4px 10px', background: '#EFF6FF', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#0369A1' }}>
                  <Clock size={11} /> In Progress
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RefundTrackingPage() {
  const { id: appointmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<RefundStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [requestNotes, setRequestNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('I no longer need this appointment');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!appointmentId) return;
    try {
      const d = await apiGetRefundStatus(appointmentId);
      setData(d);
    } catch (err: any) {
      setError(err?.message || 'Failed to load refund status.');
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => { load(); }, [load]);

  async function handleCancelAndRequestRefund() {
    if (!appointmentId) return;
    setCancelling(true);
    setError('');
    try {
      await apiCancelAppointmentForRefund(appointmentId, cancelReason);
      await load(); // Reload
      setShowCancelForm(false);
      setShowRequestForm(true); // Show refund request next
      setSuccess('Appointment cancelled. You can now apply for a refund.');
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  }

  async function handleRequestRefund() {
    if (!appointmentId) return;
    setRequesting(true);
    setError('');
    try {
      await apiRequestRefund(appointmentId, requestNotes);
      await load();
      setShowRequestForm(false);
      setSuccess('Refund requested successfully! The receptionist will review your request.');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit refund request.');
    } finally {
      setRequesting(false);
    }
  }

  const refund = data?.refund;
  const canRequestRefund = data?.canRequestRefund;
  const apptStatus = data?.appointmentStatus;
  const isApprovedLocked = ['Confirmed', 'ReceptionistApproved', 'InConsultation', 'Completed'].includes(apptStatus ?? '');
  const isCancellable = ['Pending', 'PaymentSubmitted', 'PaymentVerified', 'PaymentPending', 'WaitingForReceptionist'].includes(apptStatus ?? '');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Refund Tracking"
          subtitle="Track your refund request status"
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={load} id="refresh-refund-btn">
                <RefreshCw size={14} /> Refresh
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/appointments/${appointmentId}`)} id="back-appt-btn">
                <ArrowLeft size={14} /> Appointment
              </button>
            </div>
          }
        />

        <div className="page-body fade-in">
          {loading ? (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <Loader size={28} className="spin" style={{ color: 'var(--med-blue)', marginBottom: 12 }} />
              <div style={{ color: 'var(--text-muted)' }}>Loading refund status...</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

              {/* Main */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Status messages */}
                {success && (
                  <div style={{ display: 'flex', gap: 10, padding: '14px 18px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 'var(--r-md)', color: '#065F46', fontWeight: 600, fontSize: 14 }}>
                    <CheckCircle size={18} style={{ flexShrink: 0 }} /> {success}
                  </div>
                )}
                {error && (
                  <div style={{ display: 'flex', gap: 10, padding: '14px 18px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 'var(--r-md)', color: '#DC2626', fontWeight: 600, fontSize: 14 }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} /> {error}
                  </div>
                )}

                {/* Locked post-approval message */}
                {isApprovedLocked && (
                  <div style={{ display: 'flex', gap: 12, padding: '16px 20px', background: '#FFFBEB', border: '1.5px solid #F59E0B', borderRadius: 'var(--r-md)' }}>
                    <Info size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#92400E', fontSize: 14 }}>Refund Not Available</div>
                      <div style={{ color: '#B45309', fontSize: 13, marginTop: 4 }}>
                        This appointment has been approved by the receptionist. Patient-initiated refund requests are no longer available after approval.
                      </div>
                    </div>
                  </div>
                )}

                {/* Refund timeline */}
                {refund ? (
                  <div className="card">
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 800, fontSize: 17 }}>Refund Progress</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                        Reference: <strong>{refund.refundReference}</strong> · Amount: <strong>Rs. {refund.amount?.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="card-body" style={{ padding: '24px 28px' }}>
                      <RefundTimeline status={refund.status} />

                      {refund.expectedProcessingInfo && (
                        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', background: '#EFF6FF', borderRadius: 'var(--r-md)', fontSize: 12.5, color: '#1D4ED8' }}>
                          <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                          {refund.expectedProcessingInfo}
                        </div>
                      )}

                      {refund.rejectionReason && (
                        <div style={{ padding: '12px 16px', background: '#FEF2F2', borderRadius: 'var(--r-md)', fontSize: 13, color: '#DC2626', marginTop: 12 }}>
                          <strong>Rejection Reason:</strong> {refund.rejectionReason}
                        </div>
                      )}

                      {/* Timestamps */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20, padding: '16px', background: 'var(--surface)', borderRadius: 'var(--r-md)' }}>
                        {[
                          { label: 'Requested', value: refund.requestedAt },
                          { label: 'Approved', value: refund.approvedAt },
                          { label: 'Processing Started', value: refund.processingAt },
                          { label: 'Completed', value: refund.completedAt },
                          { label: 'Failed/Rejected', value: refund.failedAt ?? (refund.status === 'RefundRejected' ? 'N/A' : null) },
                        ].filter(r => r.value).map(row => (
                          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                            <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                            <span style={{ fontWeight: 600 }}>
                              {row.value === 'N/A' ? 'N/A' : new Date(row.value!).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ padding: 28 }}>
                    <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>💳</div>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No Refund Request Yet</div>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                      {canRequestRefund
                        ? 'You can cancel this appointment and apply for a refund below.'
                        : isApprovedLocked
                        ? 'Refunds are not available once the appointment is approved.'
                        : 'Refunds can only be requested after cancelling a paid appointment.'}
                    </div>

                    {/* Cancel appointment flow (before approved) */}
                    {isCancellable && !isApprovedLocked && (
                      <>
                        {!showCancelForm ? (
                          <div style={{ textAlign: 'center' }}>
                            <button
                              className="btn btn-danger"
                              onClick={() => { setShowCancelForm(true); setError(''); }}
                              id="cancel-appt-btn"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                            >
                              <XCircle size={16} /> Cancel Appointment &amp; Request Refund
                            </button>
                          </div>
                        ) : (
                          <div style={{ padding: '16px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 'var(--r-md)' }}>
                            <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: 10 }}>Confirm Cancellation</div>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--text-secondary)' }}>
                              Cancellation Reason
                            </label>
                            <select
                              value={cancelReason}
                              onChange={e => setCancelReason(e.target.value)}
                              className="form-input"
                              style={{ marginBottom: 12 }}
                              id="cancel-reason-select"
                            >
                              <option>I no longer need this appointment</option>
                              <option>Schedule conflict</option>
                              <option>Feeling better</option>
                              <option>Transportation issues</option>
                              <option>Other</option>
                            </select>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-danger btn-sm" onClick={handleCancelAndRequestRefund} disabled={cancelling} id="confirm-cancel-btn">
                                {cancelling ? <Loader size={14} className="spin" /> : <XCircle size={14} />}
                                Confirm Cancel
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={() => setShowCancelForm(false)} id="cancel-cancel-btn">
                                Keep Appointment
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Request refund (after cancelled) */}
                    {(canRequestRefund || showRequestForm) && (
                      <div style={{ marginTop: 16, padding: '16px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 'var(--r-md)' }}>
                        <div style={{ fontWeight: 700, color: '#1E40AF', marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <CreditCard size={16} /> Request Refund
                        </div>
                        <div style={{ fontSize: 13, color: '#1D4ED8', marginBottom: 10 }}>
                          Your appointment has been cancelled. Click below to request a refund.
                        </div>
                        <textarea
                          value={requestNotes}
                          onChange={e => setRequestNotes(e.target.value)}
                          placeholder="Additional notes (optional)..."
                          className="form-input"
                          rows={2}
                          style={{ marginBottom: 10, fontSize: 13 }}
                          id="refund-notes-input"
                        />
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={handleRequestRefund}
                          disabled={requesting}
                          id="request-refund-btn"
                        >
                          {requesting ? <Loader size={14} className="spin" /> : <CreditCard size={14} />}
                          Submit Refund Request
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Appointment Info</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Appointment', value: data?.appointmentNumber ?? `#${appointmentId}` },
                      { label: 'Doctor', value: data?.doctorName ?? '—' },
                      { label: 'Status', value: apptStatus ?? '—' },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                        <span style={{ fontWeight: 600 }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Refund Policy</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <div>✅ Refunds available for cancellations before receptionist approval.</div>
                    <div>⛔ No refunds after receptionist approves the appointment.</div>
                    <div>⚡ Receptionist rejections trigger automatic refunds.</div>
                    <div>🕐 Processing time: <strong>2–3 working days</strong>.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
