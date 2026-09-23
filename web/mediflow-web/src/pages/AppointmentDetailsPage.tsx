import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle, Phone, Loader, Hash, XCircle, AlertTriangle, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetAppointment, apiPayAppointment, apiPatientCancelAppointment } from '../services/api';
import { consultationHubService } from '../services/consultationHubService';

const STATUS_STEPS = [
  { key: 'Pending',          label: 'Booking Placed',       icon: '📋', desc: 'Appointment request submitted' },
  { key: 'PaymentSubmitted', label: 'Payment Submitted',    icon: '💳', desc: 'Awaiting receptionist verification' },
  { key: 'Confirmed',        label: 'Receptionist Verified', icon: '✅', desc: 'Payment verified & number generated' },
  { key: 'InConsultation',   label: 'In Consultation',      icon: '🩺', desc: 'Doctor actively consulting appointment' },
  { key: 'Completed',        label: 'Consultation Done',    icon: '🎉', desc: 'Appointment completed' },
];

const STATUS_META = {
  Pending:          { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', label: 'Payment Sent' },
  Confirmed:        { color: '#059669', bg: '#ECFDF5', label: 'Confirmed' },
  InConsultation:   { color: '#DC2626', bg: '#FEF2F2', label: '🔴 In Consultation' },
  Completed:        { color: '#6366F1', bg: '#EEF2FF', label: 'Completed' },
  Cancelled:        { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelled' },
};

const CANCEL_REASONS = [
  'Schedule conflict / Change of plans',
  'Feeling better / Consultation no longer needed',
  'Booked an earlier appointment with another doctor',
  'Personal or transportation difficulties',
  'Other reason',
];

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [payError, setPayError] = useState('');

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const [cancelNotes, setCancelNotes] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    loadAppointment();

    consultationHubService.startConnection().catch(console.warn);

    const unsubStarted = consultationHubService.onConsultationStarted((payload) => {
      if (String(payload.appointmentId) === String(id)) {
        setAppt((prev: any) => prev ? { ...prev, status: 'InConsultation' } : prev);
      }
    });

    const unsubEnded = consultationHubService.onConsultationEnded((payload) => {
      if (String(payload.appointmentId) === String(id)) {
        setAppt((prev: any) => prev ? { ...prev, status: 'Completed' } : prev);
      }
    });

    const unsubReconnected = consultationHubService.onReconnected(() => {
      loadAppointment();
    });

    return () => {
      unsubStarted();
      unsubEnded();
      unsubReconnected();
    };
  }, [id]);

  async function loadAppointment() {
    try {
      const data = await apiGetAppointment(id || '');
      setAppt(data);
      if (data.status === 'Cancelled') {
        setCancelled(true);
      }
    } catch {
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!appt || appt.status !== 'Pending') return;
    setPaying(true);
    setPayError('');
    try {
      await apiPayAppointment(id || '');
      setPaid(true);
      setAppt((prev: any) => ({ ...prev, status: 'PaymentSubmitted' }));
    } catch (err: any) {
      setPayError(err?.message || 'Payment processing failed. Please try again.');
    } finally {
      setPaying(false);
    }
  }

  async function handleConfirmCancel() {
    if (!appt) return;

    if (new Date(appt.appointmentDateTime).getTime() <= Date.now()) {
      setCancelError('Cannot cancel an appointment that has already passed.');
      return;
    }

    if (['Completed', 'InConsultation', 'Cancelled'].includes(appt.status)) {
      setCancelError(`Cannot cancel an appointment that is already ${appt.status}.`);
      return;
    }

    const trimmedNotes = cancelNotes.trim();
    if (trimmedNotes.length > 200) {
      setCancelError('Reason details cannot exceed 200 characters.');
      return;
    }

    const fullReason = selectedReason === 'Other reason'
      ? (trimmedNotes || 'Other reason')
      : trimmedNotes ? `${selectedReason} - ${trimmedNotes}` : selectedReason;

    setCancelling(true);
    setCancelError('');

    try {
      await apiPatientCancelAppointment(id || '', fullReason);
      setCancelled(true);
      setShowCancelModal(false);
      setAppt((prev: any) => ({ ...prev, status: 'Cancelled' }));
    } catch (err: any) {
      setCancelError(err?.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <TopBar title="Appointment Details" />
          <div className="page-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader size={32} className="spin" style={{ marginBottom: 12 }} />
              <div>Loading appointment...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appt) return null;

  const d = new Date(appt.appointmentDateTime);
  const isPast = d.getTime() <= Date.now();
  const st = (STATUS_META as any)[appt.status] || STATUS_META.Pending;
  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === appt.status);
  const canCancel = !cancelled && ['Pending', 'PaymentSubmitted', 'Confirmed'].includes(appt?.status) && !isPast;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Appointment Details"
          subtitle={appt.appointmentNumber || `Appointment #${appt.id}`}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/appointments')} id="back-to-appointments-btn">
              <ArrowLeft size={14} /> Back
            </button>
          }
        />
        <div className="page-body fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

            {/* Main Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Doctor + Status Card */}
              <div className="card">
                <div style={{ background: 'var(--gradient-hero)', padding: '24px 28px', color: 'white', borderRadius: 'var(--r-lg) var(--r-lg) 0 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                        {appt.doctorName?.replace('Dr.', '').trim().split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'DR'}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{appt.doctorName}</div>
                        <div style={{ fontSize: 13, opacity: 0.85 }}>{appt.specialtyName || 'Medical Specialist'}</div>
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{appt.doctorQualifications}</div>
                      </div>
                    </div>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.35)' }}>
                      {st.label}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  {appt.appointmentNumber && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'var(--med-teal-50)', borderRadius: 'var(--r-md)', marginBottom: 20, border: '1px solid var(--med-teal-100)' }}>
                      <Hash size={16} color="var(--med-teal)" />
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--med-teal)' }}>Appointment Number: <strong>{appt.appointmentNumber}</strong></div>
                    </div>
                  )}

                  <div className="info-row"><span className="info-row-label">📅 Date & Time:</span>{d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="info-row"><span className="info-row-label">💰 Consultation Fee:</span>Rs. {appt.fee?.toLocaleString()}</div>
                  {appt.notes && <div className="info-row"><span className="info-row-label">📝 Notes:</span>{appt.notes}</div>}

                  {/* Payment Action */}
                  {appt.status === 'Pending' && !paid && (
                    <div style={{ marginTop: 24, padding: '20px', background: 'var(--warning-bg)', border: '1.5px solid var(--warning-border)', borderRadius: 'var(--r-lg)' }}>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                        <AlertCircle size={20} color="#B45309" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Payment Required</div>
                          <div style={{ fontSize: 13, color: '#B45309' }}>Please complete your payment of <strong>Rs. {appt.fee?.toLocaleString()}</strong> to confirm your appointment. The receptionist will then verify and generate your appointment number.</div>
                        </div>
                      </div>
                      {payError && <div className="form-error" style={{ marginBottom: 14 }}><AlertCircle size={14} />{payError}</div>}
                      <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handlePay} disabled={paying} id="pay-appointment-btn">
                        {paying ? <><Loader size={16} className="spin" /> Processing...</> : <><CreditCard size={16} /> Pay Rs. {appt.fee?.toLocaleString()} Now</>}
                      </button>
                    </div>
                  )}

                  {(appt.status === 'PaymentSubmitted' || paid) && (
                    <div style={{ marginTop: 24, padding: '16px 18px', background: 'var(--med-blue-50)', border: '1.5px solid var(--med-blue-200)', borderRadius: 'var(--r-md)', display: 'flex', gap: 12 }}>
                      <CheckCircle size={18} color="var(--med-blue)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--med-blue)', marginBottom: 3 }}>Payment Submitted</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your payment is pending verification by the receptionist. You'll receive your appointment number once confirmed.</div>
                      </div>
                    </div>
                  )}

                  {appt.status === 'Confirmed' && (
                    <div style={{ marginTop: 24, padding: '16px 18px', background: 'var(--success-bg)', border: '1.5px solid var(--success-border)', borderRadius: 'var(--r-md)', display: 'flex', gap: 12 }}>
                      <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#065F46', marginBottom: 3 }}>Appointment Confirmed! ✅</div>
                        <div style={{ fontSize: 13, color: '#047857' }}>Your appointment has been verified and confirmed. Please arrive 10 minutes early. Appointment Number: <strong>{appt.appointmentNumber}</strong></div>
                      </div>
                    </div>
                  )}

                  {appt.status === 'InConsultation' && (
                    <div style={{ marginTop: 24, padding: '16px 18px', background: '#FEF2F2', border: '1.5px solid #F87171', borderRadius: 'var(--r-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626', boxShadow: '0 0 10px #DC2626', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 800, color: '#B91C1C', marginBottom: 2 }}>🔴 Consultation in Progress!</div>
                        <div style={{ fontSize: 13, color: '#7F1D1D' }}>The doctor is currently consulting this appointment right now.</div>
                      </div>
                    </div>
                  )}

                  {appt.status === 'Cancelled' && (
                    <div style={{ marginTop: 24, padding: '16px 18px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 'var(--r-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
                      <XCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: 2 }}>Appointment Cancelled</div>
                        <div style={{ fontSize: 13, color: '#B91C1C' }}>This appointment has been cancelled and is no longer active.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column — Timeline & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card">
                <div className="card-header">
                  <div className="section-title" style={{ fontSize: 14 }}>Appointment Progress</div>
                </div>
                <div className="card-body" style={{ padding: '20px' }}>
                  <div className="status-timeline">
                    {STATUS_STEPS.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step.key} className={`timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                          <div className="timeline-dot">
                            {isDone ? <CheckCircle size={14} /> : <span style={{ fontSize: 10, fontWeight: 700 }}>{idx + 1}</span>}
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-label">{step.icon} {step.label}</div>
                            <div className="timeline-time">{step.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="section-title" style={{ fontSize: 14, marginBottom: 16 }}>Need Help?</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }} id="contact-support-btn">
                      <Phone size={14} /> Contact Support
                    </button>

                    {cancelError && <div className="form-error"><AlertCircle size={13} />{cancelError}</div>}

                    {canCancel && (
                      <button
                        className="btn btn-ghost"
                        style={{ justifyContent: 'flex-start', width: '100%', color: 'var(--danger)' }}
                        id="cancel-appointment-btn"
                        onClick={() => setShowCancelModal(true)}
                        disabled={cancelling}
                      >
                        <XCircle size={14} /> Cancel Appointment
                      </button>
                    )}

                    {!canCancel && !cancelled && isPast && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 8px' }}>
                        Past appointments cannot be cancelled.
                      </div>
                    )}

                    {cancelled && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--danger)', fontWeight: 600, padding: '8px 12px', background: '#FEF2F2', borderRadius: 'var(--r-md)' }}>
                        <XCircle size={14} /> Appointment Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal Dialog */}
      {showCancelModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }}>
          <div className="card scale-in" style={{ maxWidth: 460, width: '100%', padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} color="var(--danger)" />
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800 }}>Cancel Appointment</div>
              </div>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                onClick={() => { setShowCancelModal(false); setCancelError(''); }}
                disabled={cancelling}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
              Are you sure you want to cancel your consultation with <strong>{appt.doctorName}</strong> on <strong>{d.toLocaleDateString()}</strong>? This action cannot be undone.
            </p>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ fontSize: 12.5 }}>Please select a reason:</label>
              <select
                className="form-select"
                id="cancellation-reason-select"
                value={selectedReason}
                onChange={e => setSelectedReason(e.target.value)}
                disabled={cancelling}
              >
                {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label className="form-label" style={{ fontSize: 12.5, marginBottom: 0 }}>Additional Details (Optional):</label>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cancelNotes.length} / 200</span>
              </div>
              <textarea
                className="form-textarea"
                id="cancellation-notes"
                placeholder="Briefly explain the reason for cancellation..."
                value={cancelNotes}
                onChange={e => e.target.value.length <= 200 && setCancelNotes(e.target.value)}
                maxLength={200}
                rows={2}
                disabled={cancelling}
              />
            </div>

            {cancelError && (
              <div className="form-error" style={{ marginBottom: 14 }}>
                <AlertCircle size={14} /> {cancelError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setShowCancelModal(false); setCancelError(''); }}
                disabled={cancelling}
                id="cancel-modal-close-btn"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                id="confirm-cancel-appointment-btn"
                style={{ background: 'var(--danger)', color: 'white' }}
              >
                {cancelling ? <><Loader size={14} className="spin" /> Cancelling...</> : 'Yes, Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
