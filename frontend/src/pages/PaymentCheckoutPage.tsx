import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Shield, CheckCircle, AlertCircle,
  Loader, RefreshCw, Clock, AlertTriangle, Info
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import {
  apiInitiatePayment,
  apiGetPaymentStatus,
  openPayHereCheckout,
  type PaymentStatusResponse,
} from '../api/payment.api';

const STEPS = [
  { key: 'review', label: 'Review' },
  { key: 'pay', label: 'Checkout' },
  { key: 'verify', label: 'Verify' },
  { key: 'done', label: 'Confirmed' },
];

const REFUND_STATUS_META: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  RefundRequested:  { color: '#B45309', bg: '#FFFBEB', icon: '📋', label: 'Refund Requested' },
  RefundApproved:   { color: '#0369A1', bg: '#EFF6FF', icon: '✅', label: 'Refund Approved' },
  RefundProcessing: { color: '#7C3AED', bg: '#F5F3FF', icon: '⏳', label: 'Refund Processing' },
  RefundCompleted:  { color: '#059669', bg: '#ECFDF5', icon: '💰', label: 'Refund Completed' },
  RefundRejected:   { color: '#DC2626', bg: '#FEF2F2', icon: '❌', label: 'Refund Rejected' },
  RefundFailed:     { color: '#DC2626', bg: '#FEF2F2', icon: '⚠️', label: 'Refund Failed' },
};

export default function PaymentCheckoutPage() {
  const { id: appointmentId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<'review' | 'pay' | 'verify' | 'done'>('review');
  const [status, setStatus] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [error, setError] = useState('');
  const [pollingCount, setPollingCount] = useState(0);

  // Detect return from PayHere
  const paymentResult = searchParams.get('payment');
  const returnedFromPayHere = paymentResult === 'success' || paymentResult === 'cancelled';

  const loadStatus = useCallback(async () => {
    if (!appointmentId) return;
    try {
      const data = await apiGetPaymentStatus(appointmentId);
      setStatus(data);

      // Determine step from backend status
      const apptStatus = data.appointmentStatus;
      const payStatus = data.payment?.status;

      if (['Completed', 'ReceptionistApproved', 'Confirmed', 'InConsultation'].includes(apptStatus)) {
        setStep('done');
      } else if (['PaymentVerified', 'PaymentSubmitted', 'WaitingForReceptionist'].includes(apptStatus) || payStatus === 'Paid') {
        setStep('verify');
      } else if (apptStatus === 'PaymentPending') {
        setStep('pay');
      }
    } catch {
      // Appointment may not have payment yet
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Auto-poll when we're in verify step (waiting for webhook)
  useEffect(() => {
    if (step !== 'verify' || pollingCount >= 10) return;
    const interval = setInterval(async () => {
      await loadStatus();
      setPollingCount(c => c + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [step, pollingCount, loadStatus]);

  // If returning from PayHere, switch to verify
  useEffect(() => {
    if (returnedFromPayHere && step === 'pay') {
      setStep('verify');
    }
  }, [returnedFromPayHere, step]);

  async function handleInitiatePayment() {
    if (!appointmentId) return;
    setInitiating(true);
    setError('');
    try {
      const params = await apiInitiatePayment(Number(appointmentId));
      setStep('pay');
      // Small delay then redirect to PayHere
      setTimeout(() => {
        openPayHereCheckout(params);
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setInitiating(false);
    }
  }

  const payment = status?.payment;
  const refund = status?.refund;
  const apptStatus = status?.appointmentStatus;

  // Derive display info
  const isPaid = payment?.status === 'Paid';
  const isCancelled = ['PatientCancelled', 'Cancelled', 'ReceptionistRejected'].includes(apptStatus ?? '');
  const hasRefund = !!refund;
  const refundMeta = refund ? REFUND_STATUS_META[refund.status] : null;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Payment Checkout"
          subtitle="Secure PayHere Sandbox Payment"
          actions={
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(`/appointments/${appointmentId}`)}
              id="back-to-appt-btn"
            >
              <ArrowLeft size={14} /> Back to Appointment
            </button>
          }
        />

        <div className="page-body fade-in">
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
            {STEPS.map((s, i) => {
              const stepOrder = ['review', 'pay', 'verify', 'done'];
              const currentIdx = stepOrder.indexOf(step);
              const isActive = s.key === step;
              const isPast = stepOrder.indexOf(s.key) < currentIdx;
              return (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: isActive ? 'var(--med-blue)' : isPast ? '#059669' : 'var(--border)',
                      color: isActive || isPast ? 'white' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 14, transition: 'all 0.3s ease',
                    }}>
                      {isPast ? <CheckCircle size={18} /> : i + 1}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? 'var(--med-blue)' : isPast ? '#059669' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: isPast ? '#059669' : 'var(--border)', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
                  )}
                </div>
              );
            })}
          </div>

          {loading ? (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <Loader size={32} className="spin" style={{ color: 'var(--med-blue)', marginBottom: 12 }} />
              <div style={{ color: 'var(--text-muted)' }}>Loading payment details...</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

              {/* Main Panel */}
              <div>

                {/* Step: Review */}
                {step === 'review' && (
                  <div className="card">
                    <div style={{ background: 'var(--gradient-hero)', padding: '28px 32px', borderRadius: 'var(--r-lg) var(--r-lg) 0 0', color: 'white' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                        <CreditCard size={28} />
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 800 }}>Appointment Payment</div>
                          <div style={{ fontSize: 13, opacity: 0.85 }}>Secured by PayHere Sandbox</div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body" style={{ padding: 28 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#EFF6FF', borderRadius: 'var(--r-md)', border: '1.5px solid #BFDBFE', marginBottom: 24 }}>
                        <Shield size={18} style={{ color: '#0369A1', flexShrink: 0 }} />
                        <div style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600 }}>
                          This is a sandbox environment. No real money will be charged. Use PayHere test cards for payment.
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Payment Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Consultation Fee</span>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>Rs. {payment?.amount?.toLocaleString() ?? '2,500.00'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Currency</span>
                            <span style={{ fontWeight: 600 }}>Sri Lankan Rupees (LKR)</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Payment Gateway</span>
                            <span style={{ fontWeight: 600, color: '#0369A1' }}>PayHere Sandbox</span>
                          </div>
                        </div>
                      </div>

                      {/* Test card info */}
                      <div style={{ background: '#FFFBEB', border: '1.5px solid #F59E0B', borderRadius: 'var(--r-md)', padding: '14px 16px', marginBottom: 24 }}>
                        <div style={{ fontWeight: 700, color: '#92400E', fontSize: 13, marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <AlertTriangle size={14} /> Sandbox Test Card Details
                        </div>
                        <div style={{ fontSize: 12.5, color: '#78350F', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div>Card Number: <strong>4111 1111 1111 1111</strong></div>
                          <div>Expiry: <strong>12/25</strong> · CVV: <strong>123</strong></div>
                          <div style={{ marginTop: 4, opacity: 0.8 }}>Use any future expiry date in MM/YY format</div>
                        </div>
                      </div>

                      {error && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: '#FEF2F2', borderRadius: 'var(--r-md)', color: '#DC2626', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                          <AlertCircle size={14} />{error}
                        </div>
                      )}

                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: 16, fontWeight: 700, borderRadius: 'var(--r-md)' }}
                        onClick={handleInitiatePayment}
                        disabled={initiating}
                        id="proceed-to-pay-btn"
                      >
                        {initiating ? (
                          <><Loader size={18} className="spin" /> Preparing checkout...</>
                        ) : (
                          <><CreditCard size={18} /> Proceed to PayHere Checkout</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step: Redirecting to PayHere */}
                {step === 'pay' && (
                  <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
                    <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Redirecting to PayHere...</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                      You are being redirected to the PayHere sandbox payment page. Please complete your payment there.
                    </div>
                    <Loader size={28} className="spin" style={{ color: 'var(--med-blue)' }} />
                  </div>
                )}

                {/* Step: Verify (waiting for webhook / post-payment confirmation) */}
                {step === 'verify' && (
                  <div className="card">
                    <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
                        {paymentResult === 'cancelled' ? '⚠️ Payment Cancelled' : '🔄 Verifying Payment...'}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {paymentResult === 'cancelled'
                          ? 'You cancelled the payment at the PayHere checkout page.'
                          : 'Your payment is being verified by our server. This may take a few moments.'}
                      </div>
                    </div>

                    <div className="card-body" style={{ padding: 28 }}>
                      {isPaid ? (
                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
                          <CheckCircle size={22} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#065F46', fontSize: 15 }}>Payment Verified!</div>
                            <div style={{ color: '#047857', fontSize: 13, marginTop: 4 }}>
                              Your payment of <strong>Rs. {payment?.amount?.toLocaleString()}</strong> has been received and verified.
                              The receptionist will review and confirm your appointment shortly.
                            </div>
                          </div>
                        </div>
                      ) : paymentResult === 'cancelled' ? (
                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
                          <AlertCircle size={22} style={{ color: '#DC2626', flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#991B1B', fontSize: 15 }}>Payment Not Completed</div>
                            <div style={{ color: '#B91C1C', fontSize: 13, marginTop: 4 }}>
                              You cancelled at the PayHere checkout. Your appointment is still pending payment.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
                          <Clock size={22} style={{ color: '#0369A1', flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#1E40AF', fontSize: 15 }}>Awaiting Payment Confirmation</div>
                            <div style={{ color: '#1D4ED8', fontSize: 13, marginTop: 4 }}>
                              Our server is confirming your payment with PayHere. This usually takes a few seconds.
                            </div>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={loadStatus}
                          id="refresh-status-btn"
                          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <RefreshCw size={14} /> Refresh Status
                        </button>
                        {paymentResult === 'cancelled' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={handleInitiatePayment}
                            disabled={initiating}
                            id="retry-payment-btn"
                          >
                            {initiating ? <Loader size={14} className="spin" /> : <CreditCard size={14} />}
                            Retry Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step: Done */}
                {step === 'done' && (
                  <div className="card">
                    <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', padding: '32px 28px', borderRadius: 'var(--r-lg) var(--r-lg) 0 0', color: 'white', textAlign: 'center' }}>
                      <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
                      <div style={{ fontWeight: 800, fontSize: 22 }}>Appointment Confirmed!</div>
                      <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>
                        Payment verified and appointment approved by receptionist
                      </div>
                    </div>
                    <div className="card-body" style={{ padding: 28, textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                        Please arrive on time for your consultation.
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/appointments/${appointmentId}`)}
                        id="view-appointment-btn"
                      >
                        View Appointment Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Refund status card (always visible if refund exists) */}
                {hasRefund && refundMeta && (
                  <div className="card" style={{ marginTop: 20 }}>
                    <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 22 }}>{refundMeta.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>Refund Status</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Reference: {refund!.refundReference || '-'}</div>
                      </div>
                      <span className="badge" style={{ marginLeft: 'auto', background: refundMeta.bg, color: refundMeta.color, fontWeight: 700, fontSize: 12 }}>
                        {refundMeta.label}
                      </span>
                    </div>
                    <div className="card-body" style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Refund Amount</span>
                          <span style={{ fontWeight: 700 }}>Rs. {refund!.amount?.toLocaleString()}</span>
                        </div>
                        {refund!.requestedAt && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Requested</span>
                            <span>{new Date(refund!.requestedAt).toLocaleString()}</span>
                          </div>
                        )}
                        {refund!.approvedAt && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Approved</span>
                            <span>{new Date(refund!.approvedAt).toLocaleString()}</span>
                          </div>
                        )}
                        {refund!.completedAt && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Completed</span>
                            <span>{new Date(refund!.completedAt).toLocaleString()}</span>
                          </div>
                        )}
                        {refund!.rejectionReason && (
                          <div style={{ padding: '10px 12px', background: '#FEF2F2', borderRadius: 'var(--r-sm)', fontSize: 12.5, color: '#DC2626' }}>
                            <strong>Rejection Reason:</strong> {refund!.rejectionReason}
                          </div>
                        )}
                        {['RefundApproved', 'RefundProcessing'].includes(refund!.status) && (
                          <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: '#EFF6FF', borderRadius: 'var(--r-sm)', fontSize: 12.5, color: '#1D4ED8' }}>
                            <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                            Refunds are normally credited within 2–3 working days, depending on the payment provider.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Info panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Payment Status</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Appointment', value: `#${appointmentId}` },
                      { label: 'Amount', value: payment ? `Rs. ${payment.amount?.toLocaleString()}` : 'Loading...' },
                      { label: 'Currency', value: 'LKR' },
                      { label: 'Provider', value: 'PayHere Sandbox' },
                      {
                        label: 'Status',
                        value: payment?.status ?? apptStatus ?? 'Pending',
                        badge: true,
                        color: payment?.status === 'Paid' ? '#059669' : '#B45309',
                      },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                        {item.badge ? (
                          <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                        ) : (
                          <span style={{ fontWeight: 600 }}>{item.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Payment Policy</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <div>✅ Refunds are available for cancellations made <strong>before receptionist approval</strong>.</div>
                    <div>⛔ Once your appointment is approved by the receptionist, refunds are no longer available.</div>
                    <div>⚡ Rejections by the receptionist trigger an <strong>automatic refund</strong>.</div>
                    <div>🕐 Refunds are typically credited within <strong>2–3 working days</strong>.</div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Need Help?</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    If you experience issues with payment, please contact the MediFlow reception team or
                    email <strong>support@mediflow.lk</strong>.
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
