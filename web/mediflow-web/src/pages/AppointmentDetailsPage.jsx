import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetAppointment } from '../services/api';

const statusStyles = {
  Pending: { color: '#B45309', bg: '#FFFBEB', border: '#FDE68A', label: 'Pending' },
  PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', border: '#BFDBFE', label: 'Payment Sent' },
  Confirmed: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Confirmed' },
  Completed: { color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', label: 'Completed' },
  Cancelled: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Cancelled' },
};

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  async function loadAppointment() {
    try {
      const data = await apiGetAppointment(id);
      setAppt(data);
    } catch (err) {
      console.error('Failed to load appointment:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="app-shell"><Sidebar /><div className="main-content"><TopBar title="Loading..." /><div className="page-body" style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>Loading appointment...</div></div></div>;
  if (!appt) return <div className="app-shell"><Sidebar /><div className="main-content"><TopBar title="Not Found" /><div className="page-body"><div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">Appointment not found</div></div></div></div></div>;

  const d = new Date(appt.appointmentDateTime);
  const st = statusStyles[appt.status] || statusStyles.Pending;

  let step = 1;
  if (appt.status === 'PaymentSubmitted') step = 2;
  if (appt.status === 'Confirmed') step = 3;
  if (appt.status === 'Completed') step = 4;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Appointment Details"
          actions={
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>
          }
        />
        
        <div className="page-body fade-in">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            
            {/* Status Steps */}
            {appt.status !== 'Cancelled' && (
              <div className="step-bar">
                {['Booked', 'Payment Sent', 'Confirmed', 'Completed'].map((label, i) => (
                  <div key={i} className="step-item" style={i === 3 ? { flex: 'none' } : {}}>
                    <div className={`step-circle ${step > i ? 'done' : step === i + 1 ? 'active' : ''}`}>
                      {step > i ? '✓' : i + 1}
                    </div>
                    <div className={`step-label ${step > i ? 'done' : step === i + 1 ? 'active' : ''}`}>{label}</div>
                    {i < 3 && <div className={`step-line ${step > i + 1 ? 'done' : ''}`}></div>}
                  </div>
                ))}
              </div>
            )}

            {/* Details Card */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div className="section-title">Consultation with {appt.doctorName}</div>
                  </div>
                  <span className="badge" style={{ color: st.color, background: st.bg, borderColor: st.border, fontSize: 13, padding: '4px 12px' }}>
                    {st.label}
                  </span>
                </div>

                <div className="detail-grid" style={{ marginBottom: 24 }}>
                  <div className="detail-item">
                    <div className="detail-label">Date</div>
                    <div className="detail-value">{d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Time</div>
                    <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={16}/> {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Appointment Number</div>
                    <div className="detail-value" style={{ fontFamily: 'monospace' }}>{appt.appointmentNumber || 'Pending'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Fee</div>
                    <div className="detail-value" style={{ color: '#0369A1' }}>Rs. {appt.fee?.toLocaleString()}</div>
                  </div>
                </div>

                {appt.payment && (
                  <div style={{ padding: 16, background: '#ECFDF5', borderRadius: 12, border: '1px solid #A7F3D0' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#059669', marginBottom: 4 }}>Payment Info</div>
                    <div style={{ fontSize: 13, color: '#475569' }}>
                      Amount: Rs. {appt.payment.amount?.toLocaleString()} · Status: {appt.payment.status} · Method: {appt.payment.paymentMethod || 'N/A'}
                    </div>
                  </div>
                )}

                {appt.notes && (
                  <div style={{ marginTop: 16, padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E8EDF2', fontSize: 13, color: '#475569' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: 4 }}>Notes:</strong>
                    {appt.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
