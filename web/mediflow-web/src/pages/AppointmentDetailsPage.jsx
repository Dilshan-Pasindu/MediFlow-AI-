import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { appointments, statusConfig } from '../data/mockData';

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appt = appointments.find(a => a.id === parseInt(id));

  if (!appt) return <div>Appointment not found</div>;

  const statusCfg = statusConfig[appt.status] || statusConfig.Pending;
  const d = new Date(appt.date);

  // Simple step logic based on status
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
            {appt.status !== 'Cancelled' && appt.status !== 'NoShow' && (
              <div className="step-bar">
                <div className="step-item">
                  <div className={`step-circle ${step >= 1 ? 'done' : ''}`}>{step >= 1 ? '✓' : '1'}</div>
                  <div className={`step-label ${step >= 1 ? 'done' : ''}`}>Booked</div>
                  <div className={`step-line ${step >= 2 ? 'done' : ''}`}></div>
                </div>
                <div className="step-item">
                  <div className={`step-circle ${step >= 2 ? 'done' : ''}`}>{step >= 2 ? '✓' : '2'}</div>
                  <div className={`step-label ${step >= 2 ? 'done' : ''}`}>Payment Sent</div>
                  <div className={`step-line ${step >= 3 ? 'done' : ''}`}></div>
                </div>
                <div className="step-item">
                  <div className={`step-circle ${step >= 3 ? 'done' : ''}`}>{step >= 3 ? '✓' : '3'}</div>
                  <div className={`step-label ${step >= 3 ? 'done' : ''}`}>Confirmed</div>
                  <div className={`step-line ${step >= 4 ? 'done' : ''}`}></div>
                </div>
                <div className="step-item" style={{ flex: 'none' }}>
                  <div className={`step-circle ${step >= 4 ? 'done' : ''}`}>{step >= 4 ? '✓' : '4'}</div>
                  <div className={`step-label ${step >= 4 ? 'done' : ''}`}>Completed</div>
                </div>
              </div>
            )}

            {/* Details Card */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div className="section-title">Consultation with {appt.doctorName}</div>
                    <div className="section-sub">{appt.specialty}</div>
                  </div>
                  <span className="badge" style={{ color: statusCfg.color, background: statusCfg.bg, borderColor: statusCfg.border, fontSize: 13, padding: '4px 12px' }}>
                    {statusCfg.label}
                  </span>
                </div>

                <div className="detail-grid" style={{ marginBottom: 24 }}>
                  <div className="detail-item">
                    <div className="detail-label">Date</div>
                    <div className="detail-value">{d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Time</div>
                    <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16}/> {appt.time}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Location</div>
                    <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16}/> {appt.hospital}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Appointment Number</div>
                    <div className="detail-value" style={{ fontFamily: 'monospace' }}>{appt.appointmentNumber || 'Pending Confirmation'}</div>
                  </div>
                </div>

                {appt.notes && (
                  <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E8EDF2', fontSize: 13, color: '#475569' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: 4 }}>Notes:</strong>
                    {appt.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Prescription (if completed & available) */}
            {appt.prescription && (
              <div className="rx-card fade-in">
                <div className="rx-header">
                  <div className="rx-title">
                    💊 E-Prescription
                  </div>
                  <div className="rx-id">{appt.prescription.id}</div>
                </div>
                
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0D9488', textTransform: 'uppercase', marginBottom: 4 }}>Diagnosis</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{appt.prescription.diagnosis}</div>
                </div>

                <table className="rx-med-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appt.prescription.medicines.map((med, i) => (
                      <tr key={i}>
                        <td className="med-name">{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.duration}</td>
                        <td>{med.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {appt.prescription.notes && (
                  <div className="rx-notes">
                    <div className="rx-notes-label">Doctor's Instructions</div>
                    <div className="rx-notes-text">{appt.prescription.notes}</div>
                  </div>
                )}

                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                  <button className="btn btn-teal">
                    Order Medicines <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                  <button className="btn btn-ghost">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
            )}
            
            {appt.status === 'Completed' && !appt.prescription && (
              <div className="info-banner blue">
                <div>No e-prescription was issued during this consultation.</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
