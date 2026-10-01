import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, CheckCircle2, Clock, AlertCircle, RefreshCw,
  Loader, Info, XCircle, CreditCard, ClipboardList, Coins, Zap, Ban, ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useAuthStore } from '../stores/authStore';
import {
  apiGetRefundStatus,
  apiGetPaymentStatus,
  apiRequestRefund,
  apiCancelAppointmentForRefund,
  type RefundStatusResponse
} from '../api/payment.api';

const REFUND_STEPS = [
  { key: 'RefundRequested', label: 'Requested', icon: ClipboardList, desc: 'Waiting for receptionist review' },
  { key: 'RefundApproved', label: 'Approved', icon: CheckCircle, desc: 'Receptionist approved the refund' },
  { key: 'RefundProcessing', label: 'Processing', icon: Clock, desc: 'Refund initiated with payment provider' },
  { key: 'RefundCompleted', label: 'Completed', icon: Coins, desc: 'Refund credited to your account' },
];

function RefundTimeline({ status }: { status: string }) {
  const isCompleted = status === 'RefundCompleted';
  const currentIdx = isCompleted ? 3 : REFUND_STEPS.findIndex(s => s.key === status);
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
        const isDone = isCompleted ? true : i < currentIdx;
        const isActive = isCompleted ? false : i === currentIdx;
        const isFuture = !isCompleted && i > currentIdx;
        const isCompletedStep = isCompleted && i === 3;

        return (
          <div key={step.key} style={{ display: 'flex', gap: 16 }}>
            {/* Left: dot + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: isDone ? '#059669' : isActive ? 'var(--med-blue)' : 'var(--border)',
                color: isDone || isActive ? 'white' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 15,
                boxShadow: isCompletedStep
                  ? '0 0 0 4px rgba(16,185,129,0.2)'
                  : isActive
                  ? '0 0 0 4px rgba(2,132,199,0.15)'
                  : 'none',
                transition: 'all 0.3s',
              }}>
                {isDone ? <CheckCircle size={18} /> : <step.icon size={18} />}
              </div>
              {i < REFUND_STEPS.length - 1 && (
                <div style={{
                  width: 2, flex: 1, minHeight: 28,
                  background: (isCompleted || i < currentIdx) ? '#059669' : 'var(--border)',
                  margin: '4px 0',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>

            {/* Right: content */}
            <div style={{ padding: '6px 0 24px 0', flex: 1 }}>
              <div style={{
                fontWeight: 700,
                fontSize: 14,
                color: isDone ? '#065F46' : isFuture ? 'var(--text-muted)' : 'var(--text-primary)'
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: 12.5, color: isDone ? '#047857' : 'var(--text-muted)', marginTop: 2 }}>
                {step.desc}
              </div>

              {isActive && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '4px 10px', background: '#EFF6FF', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#0369A1' }}>
                  <Clock size={11} /> In Progress
                </div>
              )}

              {isCompletedStep && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '4px 10px', background: '#ECFDF5', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#065F46' }}>
                  <CheckCircle size={12} /> Successfully Completed · Funds Credited
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
      if (!d.refund) {
        // Fallback: check payment status to see if already refunded
        try {
          const p = await apiGetPaymentStatus(appointmentId);
          if (p.refund) {
            d.refund = {
              id: p.refund.id,
              refundReference: p.refund.refundReference,
              amount: p.refund.amount,
              currency: 'LKR',
              status: p.refund.status,
              reason: 'PatientCancellation',
              requestedAt: p.refund.requestedAt,
              approvedAt: p.refund.approvedAt,
              processingAt: p.refund.processingAt,
              completedAt: p.refund.completedAt,
              failedAt: p.refund.failedAt,
              rejectionReason: p.refund.rejectionReason,
            };
          } else if (p.payment?.status === 'Refunded') {
            d.refund = {
              id: p.payment.id,
              refundReference: `RF-${appointmentId}-${p.payment.id}`,
              amount: p.payment.amount,
              currency: p.payment.currency || 'LKR',
              status: 'RefundCompleted',
              reason: 'PatientCancellation',
              requestedAt: p.payment.paidAt || new Date().toISOString(),
              approvedAt: new Date().toISOString(),
              processingAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
              failedAt: null,
              rejectionReason: null,
            };
          }
        } catch {
          // ignore fallback error
        }
      }
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

  const currentUser = useAuthStore(s => s.user);
  const isStaff = currentUser?.role === 'Receptionist' || currentUser?.role === 'Administrator';

  const refund = data?.refund;
  const canRequestRefund = data?.canRequestRefund;
  const apptStatus = data?.appointmentStatus;
  const isApprovedLocked = ['InConsultation', 'Completed'].includes(apptStatus ?? '');
  const isCancellable = ['Pending', 'PaymentSubmitted', 'PaymentVerified', 'PaymentPending', 'WaitingForReceptionist', 'Confirmed', 'ReceptionistApproved'].includes(apptStatus ?? '');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title={isStaff ? 'Refund Tracking & Audit' : 'Refund Tracking'}
          subtitle={isStaff ? 'Administrative & Receptionist live refund monitoring' : 'Track your refund request status'}
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={load} id="refresh-refund-btn">
                <RefreshCw size={14} /> Refresh
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  if (isStaff) {
                    navigate('/receptionist/refunds');
                  } else {
                    navigate(`/appointments/${appointmentId}`);
                  }
                }}
                id="back-appt-btn"
              >
                <ArrowLeft size={14} /> {isStaff ? 'Back to Refunds Queue' : 'Appointment Details'}
              </button>
            </div>
          }
        />

        <div className="page-body fade-in">
          {isStaff && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)',
              border: '1.5px solid #BFDBFE',
              borderRadius: 'var(--r-md)',
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ShieldCheck size={22} style={{ color: 'var(--med-blue)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1E40AF' }}>
                    Receptionist &amp; Administrative View · Live Refund Audit Timeline
                  </div>
                  <div style={{ fontSize: 12.5, color: '#2563EB', marginTop: 2 }}>
                    Monitoring PayHere payment and refund lifecycle for Appointment #{data?.appointmentNumber || appointmentId}.
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/receptionist/refunds')}
                style={{ fontSize: 12, padding: '6px 14px', fontWeight: 600 }}
                id="open-queue-btn"
              >
                Refund Review Queue
              </button>
            </div>
          )}

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

                {/* Locked post-consultation message */}
                {isApprovedLocked && (
                  <div style={{ display: 'flex', gap: 12, padding: '16px 20px', background: '#FFFBEB', border: '1.5px solid #F59E0B', borderRadius: 'var(--r-md)' }}>
                    <Info size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#92400E', fontSize: 14 }}>Refund Not Available</div>
                      <div style={{ color: '#B45309', fontSize: 13, marginTop: 4 }}>
                        This appointment is currently in consultation or has already been completed. Refunds can only be requested prior to consultation.
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
                      {refund.status === 'RefundCompleted' && (
                        <div style={{
                          display: 'flex',
                          gap: 14,
                          alignItems: 'center',
                          padding: '16px 20px',
                          background: '#ECFDF5',
                          border: '1.5px solid #6EE7B7',
                          borderRadius: 'var(--r-md)',
                          marginBottom: 20,
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
                        }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#059669',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <CheckCircle size={22} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#065F46', fontSize: 15 }}>
                              Refund Completed Successfully
                            </div>
                            <div style={{ color: '#047857', fontSize: 13, marginTop: 2 }}>
                              Your refund of <strong>Rs. {refund.amount?.toLocaleString()} {refund.currency}</strong> has been approved by the receptionist and credited back to your original payment method.
                            </div>
                          </div>
                        </div>
                      )}

                      <RefundTimeline status={refund.status} />

                      {refund.expectedProcessingInfo && refund.status !== 'RefundCompleted' && (
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
                    <CreditCard size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No Refund Request Yet</div>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                      {canRequestRefund
                        ? 'Your appointment has been cancelled. You can apply for a consultation refund below.'
                        : isApprovedLocked
                        ? 'Refunds are not available once consultation has started or is completed.'
                        : (apptStatus === 'Cancelled' || apptStatus === 'PatientCancelled')
                        ? 'This appointment has been cancelled. If you made a payment that requires a refund, please contact reception.'
                        : 'You can cancel this appointment and apply for a refund below.'}
                    </div>

                    {isStaff ? (
                      <div style={{ textAlign: 'center', padding: '12px 0' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 14 }}>
                          No active refund application recorded. Receptionists can manage appointment cancellations and approvals directly in the portal.
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate('/receptionist/refunds')}
                          >
                            View Refunds Queue
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate('/receptionist/dashboard')}
                          >
                            Dashboard
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                      <span>Full refund eligibility if cancelled before consultation begins.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <ClipboardList size={15} style={{ color: '#0284C7', flexShrink: 0, marginTop: 2 }} />
                      <span>Refund applications are reviewed and approved by reception.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <Zap size={15} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                      <span>Upon approval, funds are credited back to your account.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <Ban size={15} style={{ color: '#DC2626', flexShrink: 0, marginTop: 2 }} />
                      <span>Consultations in progress or completed are not refundable.</span>
                    </div>
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
