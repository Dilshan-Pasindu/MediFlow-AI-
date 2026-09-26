import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, ChevronRight, Pill } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useMyPrescriptions } from '../hooks';
import type { Prescription } from '../types/prescription';

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { data: prescriptions = [], isLoading: loading } = useMyPrescriptions();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="My Prescriptions" subtitle="View and download your e-prescriptions from doctors" />
        <div className="page-body fade-in">

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--r-xl)' }} />)}
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">💊</div>
              <div className="empty-title">No prescriptions yet</div>
              <div className="empty-sub">Your e-prescriptions from doctors will appear here after a consultation.</div>
              <button className="btn btn-primary" onClick={() => navigate('/find-doctor')} id="book-for-rx-btn">
                Book a Consultation
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selectedPrescription ? '1fr 400px' : '1fr', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {prescriptions.map(rx => (
                  <div key={rx.id} className="rx-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedPrescription(rx)} id={`rx-card-${rx.id}`}>
                    <div className="rx-header">
                      <div>
                        <div className="rx-id">Rx #{rx.id}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{rx.appointmentNumber}</div>
                      </div>
                      <span className={`badge ${rx.status === 'Active' ? 'badge-green' : rx.status === 'Fulfilled' ? 'badge-blue' : 'badge-gray'}`}>
                        {rx.status}
                      </span>
                    </div>
                    <div className="rx-body">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Dr. {rx.doctorName}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Issued: {new Date(rx.dateIssued).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span className="badge badge-teal"><Pill size={10} /> {rx.items?.length || 1} medicines</span>
                          <ChevronRight size={16} color="var(--text-muted)" />
                        </div>
                      </div>
                      {rx.items && rx.items.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {rx.items.slice(0, 3).map((item, i) => (
                            <span key={i} className="pill">{item.medicineName}</span>
                          ))}
                          {rx.items.length > 3 && <span className="pill" style={{ color: 'var(--med-blue)' }}>+{rx.items.length - 3} more</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detail Panel */}
              {selectedPrescription && (
                <div className="card scale-in" style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
                  <div className="card-header">
                    <div>
                      <div className="rx-id">Rx #{selectedPrescription.id}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPrescription.appointmentNumber}</div>
                    </div>
                    <button className="close-btn" onClick={() => setSelectedPrescription(null)} id="close-rx-panel-btn">✕</button>
                  </div>
                  <div className="card-body">
                    <div style={{ marginBottom: 16 }}>
                      <div className="info-row"><span className="info-row-label">Doctor:</span>{selectedPrescription.doctorName}</div>
                      <div className="info-row"><span className="info-row-label">Date Issued:</span>{new Date(selectedPrescription.dateIssued).toLocaleDateString()}</div>
                      <div className="info-row"><span className="info-row-label">Status:</span><span className={`badge ${selectedPrescription.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>{selectedPrescription.status}</span></div>
                    </div>

                    <div className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>Prescribed Medicines</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {(selectedPrescription.items || []).map((item, i) => (
                        <div key={i} className="rx-medicine-item">
                          <div>
                            <div className="rx-med-name">{item.medicineName}</div>
                            <div className="rx-med-dosage">{item.dosage} — {item.frequency} — {item.duration}</div>
                          </div>
                          <div className="rx-med-qty">×{item.quantity}</div>
                        </div>
                      ))}
                    </div>

                    {selectedPrescription.instructions && (
                      <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--warning-bg)', borderRadius: 'var(--r-md)', border: '1px solid var(--warning-border)' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>Special Instructions</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedPrescription.instructions}</div>
                      </div>
                    )}

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 18 }} id="download-rx-btn">
                      <Download size={15} /> Download Prescription
                    </button>
                    <button className="btn btn-teal" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/orders')} id="order-medicines-btn">
                      <Pill size={15} /> Order Medicines
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
