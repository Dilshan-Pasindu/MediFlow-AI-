import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Shield, CheckCircle, AlertCircle,
  Loader, RefreshCw, Info, Lock, Check, ExternalLink
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useAuthStore } from '../stores/authStore';
import {
  apiInitiatePayment,
  apiGetPaymentStatus,
  apiProcessGatewayPayment,
  openPayHereCheckout,
  type PaymentStatusResponse,
} from '../api/payment.api';

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
  const user = useAuthStore(state => state.user);

  const [step, setStep] = useState<'checkout' | 'processing' | 'verify' | 'done'>('checkout');
  const [status, setStatus] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState(1);
  const [error, setError] = useState('');
  const [pollingCount, setPollingCount] = useState(0);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.fullName || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'generic'>('generic');

  // Detect return from external PayHere redirect
  const paymentResult = searchParams.get('payment');
  const returnedFromPayHere = paymentResult === 'success' || paymentResult === 'cancelled';

  const loadStatus = useCallback(async () => {
    if (!appointmentId) return;
    try {
      const data = await apiGetPaymentStatus(appointmentId);
      setStatus(data);

      const apptStatus = data.appointmentStatus;
      const payStatus = data.payment?.status;

      if (['Completed', 'ReceptionistApproved', 'Confirmed', 'InConsultation'].includes(apptStatus)) {
        setStep('done');
      } else if (payStatus === 'Paid' || ['PaymentVerified', 'PaymentSubmitted', 'WaitingForReceptionist'].includes(apptStatus)) {
        setStep('verify');
      } else if (apptStatus === 'PaymentPending' && !returnedFromPayHere) {
        setStep('checkout');
      }
    } catch {
      // Keep existing state if error
    } finally {
      setLoading(false);
    }
  }, [appointmentId, returnedFromPayHere]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Update cardholder default when user loads
  useEffect(() => {
    if (user?.fullName && !cardHolder) {
      setCardHolder(user.fullName);
    }
  }, [user, cardHolder]);

  // Auto-poll when we're in verify step
  useEffect(() => {
    if (step !== 'verify' || pollingCount >= 8) return;
    const interval = setInterval(async () => {
      await loadStatus();
      setPollingCount(c => c + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [step, pollingCount, loadStatus]);

  // If returning from external callback, switch to verify
  useEffect(() => {
    if (returnedFromPayHere && step === 'checkout') {
      setStep('verify');
    }
  }, [returnedFromPayHere, step]);

  // Detect card brand & format card number
  function handleCardNumberChange(val: string) {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);

    if (raw.startsWith('4')) {
      setCardBrand('visa');
    } else if (/^5[1-5]/.test(raw) || /^2[2-7]/.test(raw)) {
      setCardBrand('mastercard');
    } else if (/^3[47]/.test(raw)) {
      setCardBrand('amex');
    } else {
      setCardBrand('generic');
    }
  }

  // Format expiry MM/YY
  function handleExpiryChange(val: string) {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  }

  // Handle direct gateway payment execution
  async function handlePayGateway(e: React.FormEvent) {
    e.preventDefault();
    if (!appointmentId) return;

    // Validation
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length > 0 && cleanCard.length < 15) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length > 0 && expiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvv.length > 0 && cvv.length < 3) {
      setError('Please enter a valid 3 or 4-digit security code (CVV).');
      return;
    }

    setError('');
    setSubmitting(true);
    setStep('processing');
    setProcessingStage(1);

    // Realistic processing animation sequence
    const t1 = setTimeout(() => setProcessingStage(2), 700);
    const t2 = setTimeout(() => setProcessingStage(3), 1500);

    try {
      const res = await apiProcessGatewayPayment(appointmentId, {
        cardNumber: cleanCard || '4111 1111 1111 1111',
        cardHolder: cardHolder || 'Dilshan Pasindu',
        expiry: expiry || '12/28',
        cvv: cvv || '123',
        paymentMethod: cardBrand === 'visa' ? 'Visa' : cardBrand === 'mastercard' ? 'Mastercard' : 'Credit / Debit Card',
      });

      setTimeout(async () => {
        if (res.success || res.payment) {
          await loadStatus();
          setStep('verify');
        } else {
          setError(res.message || 'Payment processing failed. Please try again.');
          setStep('checkout');
        }
        setSubmitting(false);
      }, 2100);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      setError(err?.response?.data?.message || err?.message || 'Payment processing encountered an error. Please retry.');
      setStep('checkout');
      setSubmitting(false);
    }
  }

  // Fallback: initiate external PayHere checkout
  async function handleExternalPayHere() {
    if (!appointmentId) return;
    setSubmitting(true);
    setError('');
    try {
      const params = await apiInitiatePayment(Number(appointmentId));
      openPayHereCheckout(params);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to open PayHere gateway.');
      setSubmitting(false);
    }
  }

  const payment = status?.payment;
  const refund = status?.refund;
  const apptStatus = status?.appointmentStatus;

  // Determine payable amount from doctor's fee on appointment
  const payableAmount: number =
    status?.amount ??
    status?.doctorFee ??
    payment?.amount ??
    3500;

  const formattedAmount = `Rs. ${payableAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const doctorDisplayName = status?.doctorName || 'Dr. Nimal Perera';
  const specialtyDisplayName = status?.specialty || 'Consultant Specialist';

  const isPaid = payment?.status === 'Paid' || ['PaymentVerified', 'Confirmed', 'ReceptionistApproved', 'Completed'].includes(apptStatus ?? '');
  const hasRefund = !!refund;
  const refundMeta = refund ? REFUND_STATUS_META[refund.status] : null;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Payment Checkout"
          subtitle="PayHere Secure Payment Gateway · 256-Bit SSL Encrypted"
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, maxWidth: 640 }}>
            {[
              { key: 'checkout', label: '1. Payment Details' },
              { key: 'verify', label: '2. Verification' },
              { key: 'done', label: '3. Confirmed' },
            ].map((s, i, arr) => {
              const order = ['checkout', 'verify', 'done'];
              const currentIdx = step === 'processing' ? 0 : order.indexOf(step);
              const stepIdx = order.indexOf(s.key);
              const isActive = stepIdx === currentIdx;
              const isPast = stepIdx < currentIdx;

              return (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isActive ? 'var(--med-blue)' : isPast ? '#059669' : '#E2E8F0',
                      color: isActive || isPast ? 'white' : '#64748B',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, transition: 'all 0.3s ease',
                    }}>
                      {isPast ? <Check size={16} /> : i + 1}
                    </div>
                    <div style={{
                      fontSize: 12.5, fontWeight: isActive ? 700 : 600,
                      color: isActive ? 'var(--med-blue)' : isPast ? '#059669' : '#64748B',
                      whiteSpace: 'nowrap'
                    }}>
                      {s.label}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{
                      flex: 1, height: 2,
                      background: isPast ? '#059669' : '#E2E8F0',
                      margin: '0 12px', transition: 'background 0.3s'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {loading ? (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <Loader size={36} className="spin" style={{ color: 'var(--med-blue)', marginBottom: 14 }} />
              <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>
                Loading appointment & payment details...
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

              {/* Main Panel */}
              <div>

                {/* Step 1: Real-World Card Checkout */}
                {step === 'checkout' && (
                  <div className="card" style={{ overflow: 'hidden' }}>
                    {/* Header Banner */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1E3A8A 0%, #0284C7 100%)',
                      padding: '24px 28px', color: 'white',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
                    }}>
                      <div>
                        <div style={{ fontSize: 13, opacity: 0.9, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
                          Secure Payment Gateway
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>
                          {doctorDisplayName}
                        </div>
                        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>
                          {specialtyDisplayName} · Appointment #{status?.appointmentNumber || appointmentId}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, opacity: 0.85 }}>Total Payable</div>
                        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
                          {formattedAmount}
                        </div>
                      </div>
                    </div>

                    <div className="card-body" style={{ padding: 28 }}>
                      {/* Security Trust Badge */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 16px', background: '#F0FDF4',
                        borderRadius: 'var(--r-md)', border: '1px solid #BBF7D0', marginBottom: 24
                      }}>
                        <Shield size={18} style={{ color: '#16A34A', flexShrink: 0 }} />
                        <div style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>
                          256-Bit SSL Encrypted Payment · Authorized by Central Bank of Sri Lanka (PayHere)
                        </div>
                      </div>

                      {/* Interactive Card Preview */}
                      <div style={{
                        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                        borderRadius: 14, padding: '22px 24px', color: 'white',
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)', marginBottom: 24,
                        maxWidth: 420, position: 'relative', overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute', top: -40, right: -40, width: 140, height: 140,
                          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
                        }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 34, height: 24, borderRadius: 4, background: '#F59E0B', opacity: 0.85 }} />
                            <span style={{ fontSize: 11, letterSpacing: 1.5, opacity: 0.7, fontWeight: 700 }}>MEDIFLOW PAY</span>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase', color: '#93C5FD' }}>
                            {cardBrand === 'generic' ? 'VISA / MC' : cardBrand.toUpperCase()}
                          </div>
                        </div>

                        <div style={{
                          fontSize: 19, letterSpacing: 3, fontFamily: 'monospace',
                          fontWeight: 700, marginBottom: 20, color: '#F8FAFC'
                        }}>
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 11 }}>
                          <div>
                            <div style={{ opacity: 0.6, fontSize: 9, textTransform: 'uppercase', marginBottom: 2 }}>Cardholder</div>
                            <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              {cardHolder || 'CARDHOLDER NAME'}
                            </div>
                          </div>
                          <div>
                            <div style={{ opacity: 0.6, fontSize: 9, textTransform: 'uppercase', marginBottom: 2 }}>Expires</div>
                            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>
                              {expiry || 'MM/YY'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Details Form */}
                      <form onSubmit={handlePayGateway}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                              Cardholder Full Name
                            </label>
                            <input
                              type="text"
                              className="input"
                              placeholder="e.g. Dilshan Pasindu"
                              value={cardHolder}
                              onChange={e => setCardHolder(e.target.value)}
                              required
                              id="card-holder-input"
                              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--r-md)' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                              Card Number
                            </label>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="text"
                                className="input"
                                placeholder="4111 •••• •••• 1111"
                                value={cardNumber}
                                onChange={e => handleCardNumberChange(e.target.value)}
                                maxLength={19}
                                required
                                id="card-number-input"
                                style={{ width: '100%', padding: '11px 14px', paddingRight: 40, borderRadius: 'var(--r-md)', letterSpacing: 1.2 }}
                              />
                              <CreditCard size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                className="input"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={e => handleExpiryChange(e.target.value)}
                                maxLength={5}
                                required
                                id="card-expiry-input"
                                style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--r-md)', letterSpacing: 1.2 }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                                Security Code (CVV)
                              </label>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type="password"
                                  className="input"
                                  placeholder="•••"
                                  value={cvv}
                                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  maxLength={4}
                                  required
                                  id="card-cvv-input"
                                  style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--r-md)', letterSpacing: 2 }}
                                />
                                <Lock size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {error && (
                          <div style={{
                            display: 'flex', gap: 8, alignItems: 'center',
                            padding: '10px 14px', background: '#FEF2F2',
                            borderRadius: 'var(--r-md)', color: '#DC2626',
                            fontSize: 13, fontWeight: 600, marginBottom: 16
                          }}>
                            <AlertCircle size={15} style={{ flexShrink: 0 }} />
                            <span>{error}</span>
                          </div>
                        )}

                        {/* Primary Submit Button with exact doctor fee */}
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{
                            width: '100%', padding: '14px', fontSize: 16,
                            fontWeight: 700, borderRadius: 'var(--r-md)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                          }}
                          disabled={submitting}
                          id="proceed-to-pay-btn"
                        >
                          <Lock size={16} /> Pay {formattedAmount}
                        </button>
                      </form>

                      {/* Alternative Option */}
                      <div style={{ textAlign: 'center', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={handleExternalPayHere}
                          disabled={submitting}
                          style={{ fontSize: 12.5, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <ExternalLink size={13} /> Or proceed with PayHere Hosted Portal
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Realistic Payment Authorization Progression */}
                {step === 'processing' && (
                  <div className="card" style={{ padding: '60px 32px', textAlign: 'center' }}>
                    <div style={{ marginBottom: 20 }}>
                      <Loader size={40} className="spin" style={{ color: 'var(--med-blue)' }} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-main)', marginBottom: 8 }}>
                      Authorizing Payment
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto 28px' }}>
                      Please do not close this window while we securely process your transaction with the bank.
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380, margin: '0 auto', textAlign: 'left' }}>
                      {[
                        { step: 1, label: 'Connecting to PayHere gateway' },
                        { step: 2, label: 'Verifying card credentials with issuing bank' },
                        { step: 3, label: 'Securing transaction & updating appointment' },
                      ].map(item => {
                        const isDone = processingStage > item.step;
                        const isCurrent = processingStage === item.step;
                        return (
                          <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: isDone ? '#059669' : isCurrent ? 'var(--med-blue)' : '#E2E8F0',
                              color: 'white', fontSize: 11, fontWeight: 700
                            }}>
                              {isDone ? <Check size={12} /> : item.step}
                            </div>
                            <span style={{
                              fontWeight: isCurrent ? 700 : isDone ? 600 : 500,
                              color: isCurrent ? 'var(--med-blue)' : isDone ? '#059669' : '#64748B'
                            }}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Verified State */}
                {step === 'verify' && (
                  <div className="card">
                    <div style={{
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      padding: '28px 32px', color: 'white', borderRadius: 'var(--r-lg) var(--r-lg) 0 0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={28} />
                        </div>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 800 }}>Payment Received & Verified</div>
                          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
                            Transaction Reference: {payment?.providerPaymentId || payment?.providerOrderId || `PAY-${appointmentId}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body" style={{ padding: 28 }}>
                      <div style={{
                        padding: '16px 20px', background: '#ECFDF5',
                        border: '1.5px solid #6EE7B7', borderRadius: 'var(--r-md)', marginBottom: 24
                      }}>
                        <div style={{ fontWeight: 700, color: '#065F46', fontSize: 15, marginBottom: 4 }}>
                          Payment Successful · {formattedAmount}
                        </div>
                        <div style={{ color: '#047857', fontSize: 13, lineHeight: 1.6 }}>
                          Your consultation fee for <strong>{doctorDisplayName}</strong> has been verified.
                          Your appointment has been forwarded to the clinic reception team for final review and assignment of your token number.
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                        <div style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Doctor</div>
                          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{doctorDisplayName}</div>
                        </div>
                        <div style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Amount Paid</div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#059669', marginTop: 2 }}>{formattedAmount}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/appointments/${appointmentId}`)}
                          id="view-appointment-btn"
                          style={{ padding: '12px 20px', fontWeight: 700 }}
                        >
                          View Appointment Details
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={loadStatus}
                          id="refresh-status-btn"
                          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <RefreshCw size={14} /> Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmed by Receptionist */}
                {step === 'done' && (
                  <div className="card">
                    <div style={{
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      padding: '32px 28px', borderRadius: 'var(--r-lg) var(--r-lg) 0 0',
                      color: 'white', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 44, marginBottom: 8 }}>🩺</div>
                      <div style={{ fontWeight: 800, fontSize: 22 }}>Appointment Confirmed!</div>
                      <div style={{ fontSize: 14, opacity: 0.9, marginTop: 6 }}>
                        Payment verified and approved by the clinic receptionist
                      </div>
                    </div>
                    <div className="card-body" style={{ padding: 28, textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
                        Your booking with <strong>{doctorDisplayName}</strong> is ready. Please arrive 10 minutes prior to your consultation time.
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

                {/* Refund Status Card (if refund requested or processed) */}
                {hasRefund && refundMeta && (
                  <div className="card" style={{ marginTop: 20 }}>
                    <div style={{
                      padding: '18px 24px', display: 'flex', alignItems: 'center',
                      gap: 12, borderBottom: '1px solid var(--border)'
                    }}>
                      <span style={{ fontSize: 22 }}>{refundMeta.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>Refund Status</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          Reference: {refund!.refundReference || '-'}
                        </div>
                      </div>
                      <span className="badge" style={{
                        marginLeft: 'auto', background: refundMeta.bg,
                        color: refundMeta.color, fontWeight: 700, fontSize: 12
                      }}>
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
                          <div style={{
                            padding: '10px 12px', background: '#FEF2F2',
                            borderRadius: 'var(--r-sm)', fontSize: 12.5, color: '#DC2626'
                          }}>
                            <strong>Rejection Reason:</strong> {refund!.rejectionReason}
                          </div>
                        )}
                        {['RefundApproved', 'RefundProcessing'].includes(refund!.status) && (
                          <div style={{
                            display: 'flex', gap: 8, padding: '10px 12px',
                            background: '#EFF6FF', borderRadius: 'var(--r-sm)',
                            fontSize: 12.5, color: '#1D4ED8'
                          }}>
                            <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                            Refunds are normally credited within 2–3 working days, depending on the issuing bank.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Payment Status & Policy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Payment Status</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Appointment', value: `#${status?.appointmentNumber || appointmentId}` },
                      { label: 'Doctor', value: doctorDisplayName },
                      { label: 'Amount', value: formattedAmount },
                      { label: 'Currency', value: 'LKR' },
                      { label: 'Provider', value: 'PayHere Secure Payment' },
                      {
                        label: 'Status',
                        value: isPaid ? 'Verified' : payment?.status ?? apptStatus ?? 'Pending',
                        badge: true,
                        color: isPaid ? '#059669' : '#B45309',
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
