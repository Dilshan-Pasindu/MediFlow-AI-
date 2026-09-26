import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, ChevronRight, Pill, Printer, X, Truck, CheckCircle, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useMyPrescriptions, useMyOrders } from '../hooks';
import type { Prescription } from '../types/prescription';
import type { Order } from '../types/order';
import { downloadPrescriptionPdf, generatePrescriptionHtml } from '../utils/prescriptionPdfGenerator';

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { data: prescriptions = [], isLoading: loading } = useMyPrescriptions();
  const { data: orders = [] } = useMyOrders();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [previewPrescription, setPreviewPrescription] = useState<Prescription | null>(null);

  const handleDownloadPrescription = (rx: Prescription) => {
    downloadPrescriptionPdf(rx);
  };

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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge ${rx.status === 'Active' ? 'badge-green' : rx.status === 'Fulfilled' ? 'badge-blue' : 'badge-gray'}`}>
                          {rx.status}
                        </span>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => { e.stopPropagation(); setPreviewPrescription(rx); }}
                          title="Preview Official Document"
                          style={{ padding: '4px 8px', color: 'var(--med-teal)' }}
                          id={`preview-rx-${rx.id}`}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => { e.stopPropagation(); handleDownloadPrescription(rx); }}
                          title="Save as PDF / Print"
                          style={{ padding: '4px 8px' }}
                          id={`download-rx-${rx.id}`}
                        >
                          <Download size={14} />
                        </button>
                      </div>
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

                    {/* ── Live Medicine Dispense Status ── */}
                    {(() => {
                      const linkedOrder = orders.find(o =>
                        (o.prescriptionId && Number(o.prescriptionId) === Number(selectedPrescription.id)) ||
                        (o.appointmentNumber && selectedPrescription.appointmentNumber && o.appointmentNumber === selectedPrescription.appointmentNumber)
                      );
                      const isDispensed = linkedOrder?.status === 'Dispensed' || selectedPrescription.status === 'Fulfilled';

                      return (
                        <div style={{
                          marginTop: 18,
                          padding: '14px 16px',
                          background: isDispensed ? '#ECFDF5' : 'var(--bg-secondary)',
                          borderRadius: 'var(--r-lg)',
                          border: isDispensed ? '1.5px solid #10B981' : '1px solid var(--border)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{
                              fontSize: 11,
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              color: isDispensed ? '#065F46' : 'var(--text-muted)'
                            }}>
                              Medicine Dispense Status
                            </div>
                            <span className={`badge ${
                              linkedOrder?.status === 'Dispensed' ? 'badge-green' :
                              ['Confirmed', 'Preparing', 'Ready'].includes(linkedOrder?.status || '') ? 'badge-blue' :
                              linkedOrder?.status === 'Pending' ? 'badge-amber' : 'badge-amber'
                            }`}>
                              {linkedOrder?.status === 'Dispensed' ? '✓ Dispensed' :
                               ['Confirmed', 'Preparing', 'Ready'].includes(linkedOrder?.status || '') ? '✅ Confirmed' :
                               linkedOrder?.status === 'Pending' ? '🕐 In Queue' : '⏳ Awaiting Dispense'}
                            </span>
                          </div>

                          <div style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>
                            {linkedOrder?.status === 'Dispensed' ? (
                              <div>
                                <div style={{ color: '#065F46', fontWeight: 700 }}>✓ Medications Dispensed</div>
                                <div style={{ fontSize: 11.5, color: '#047857', marginTop: 2 }}>
                                  Dispensed by <strong>{linkedOrder?.pharmacyName || 'Pharmacy'}</strong>
                                  {linkedOrder?.dispensedAt && ` on ${new Date(linkedOrder.dispensedAt).toLocaleDateString()}`}
                                </div>
                              </div>
                            ) : ['Confirmed', 'Preparing', 'Ready'].includes(linkedOrder?.status || '') ? (
                              <div>
                                <div style={{ color: '#0369a1', fontWeight: 700 }}>✅ Pharmacist Confirmed</div>
                                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                                  Prescription verified by {linkedOrder?.pharmacyName || 'pharmacy'}.
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Awaiting Pharmacy Action</div>
                                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                                  E-prescription is queued for pharmacist safety review and dispensing.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        id="download-rx-btn"
                        onClick={() => handleDownloadPrescription(selectedPrescription)}
                      >
                        <Download size={15} /> Download / Save PDF
                      </button>

                      <button
                        className="btn btn-outline"
                        style={{ width: '100%', borderColor: 'var(--med-teal)', color: 'var(--med-teal)' }}
                        id="preview-rx-btn"
                        onClick={() => setPreviewPrescription(selectedPrescription)}
                      >
                        <Eye size={15} /> Preview Official Document
                      </button>

                      {/* ── Track Medicine Dispense Option (Replaces Order Medicines) ── */}
                      {(() => {
                        const linkedOrder = orders.find(o =>
                          (o.prescriptionId && Number(o.prescriptionId) === Number(selectedPrescription.id)) ||
                          (o.appointmentNumber && selectedPrescription.appointmentNumber && o.appointmentNumber === selectedPrescription.appointmentNumber)
                        );
                        return (
                          <button
                            className="btn btn-teal"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            onClick={() => {
                              if (linkedOrder) {
                                navigate(`/orders?orderId=${linkedOrder.id}`);
                              } else {
                                navigate(`/orders?prescriptionId=${selectedPrescription.id}`);
                              }
                            }}
                            id="track-dispense-btn"
                          >
                            <Truck size={15} /> Track Medicine Dispense
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── High-Fidelity Prescription PDF Preview Modal ── */}
          {previewPrescription && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
              }}
              onClick={() => setPreviewPrescription(null)}
            >
              <div
                className="scale-in"
                style={{
                  background: '#ffffff',
                  width: '100%',
                  maxWidth: '920px',
                  height: '92vh',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    padding: '14px 20px',
                    background: '#0f172a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, background: '#0d9488',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FileText size={18} color="#ffffff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>Official Prescription Document Preview</div>
                      <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                        Rx #{previewPrescription.id} • {previewPrescription.patientName} • Dr. {previewPrescription.doctorName}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ background: '#0d9488', borderColor: '#0d9488', display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={() => handleDownloadPrescription(previewPrescription)}
                      id="modal-print-btn"
                    >
                      <Printer size={14} /> Save as PDF / Print
                    </button>
                    <button
                      onClick={() => setPreviewPrescription(null)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#cbd5e1',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      id="modal-close-btn"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Modal Iframe Content */}
                <div style={{ flex: 1, background: '#f1f5f9', overflow: 'hidden' }}>
                  <iframe
                    title="Prescription PDF Preview"
                    srcDoc={generatePrescriptionHtml(previewPrescription)}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
