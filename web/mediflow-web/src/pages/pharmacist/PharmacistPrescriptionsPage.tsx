import { useState } from 'react';
import {
  FileText, Pill, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck,
  RefreshCw, ArrowRight, Loader2, ShoppingCart, Package, Clock, X
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { usePharmacistPrescriptions, usePharmacistOrders, useMyPharmacy } from '../../hooks';
import { apiRunMedicationCheck, apiCreateOrder, type MedicationCheckResult } from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';
import type { Prescription } from '../../types/prescription';

export default function PharmacistPrescriptionsPage() {
  const queryClient = useQueryClient();
  const { data: prescriptions = [], isLoading: loading, refetch } = usePharmacistPrescriptions();
  const { data: orders = [] } = usePharmacistOrders();
  const { data: myPharmacy } = useMyPharmacy();

  const [aiChecks, setAiChecks] = useState<Record<number, MedicationCheckResult>>({});
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'QUEUE' | 'CONVERTED'>('QUEUE');
  const [converting, setConverting] = useState<Record<number, boolean>>({});
  const [convertMsg, setConvertMsg] = useState<Record<number, { ok: boolean; text: string } | null>>({});

  // ─── AI Medication Check ─────────────────────────────────────────────────

  async function handleRunAICheck(rx: Prescription) {
    const rxId = Number(rx.id);
    setCheckingId(rxId);
    try {
      const drugNames = (rx.items || []).map(i => i.medicineName);
      const res = await apiRunMedicationCheck({
        medications: drugNames.length > 0 ? drugNames : ['Amoxicillin 500mg'],
        patient_allergies: 'Penicillin',
      });
      setAiChecks(prev => ({ ...prev, [rxId]: res }));
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingId(null);
    }
  }

  // ─── Convert Prescription → Order ──────────────────────────────────────

  async function handleConvertToOrder(rx: Prescription) {
    const rxId = Number(rx.id);

    if (!myPharmacy?.id) {
      setConvertMsg(m => ({ ...m, [rxId]: { ok: false, text: 'Pharmacy profile not loaded. Please refresh.' } }));
      return;
    }

    setConverting(c => ({ ...c, [rxId]: true }));
    setConvertMsg(m => ({ ...m, [rxId]: null }));

    try {
      await apiCreateOrder({
        prescriptionId: rxId,
        pharmacyId: myPharmacy.id,
        items: [], // backend copies items from prescription automatically
      });
      setConvertMsg(m => ({
        ...m,
        [rxId]: { ok: true, text: `Order created! Prescription #${rxId} is now in the Orders queue.` }
      }));
      // Refresh both queues
      queryClient.invalidateQueries({ queryKey: ['pharmacist', 'prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacist', 'orders'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order. Please try again.';
      setConvertMsg(m => ({ ...m, [rxId]: { ok: false, text: msg } }));
    } finally {
      setConverting(c => ({ ...c, [rxId]: false }));
    }
  }

  // Prescriptions already converted (have a matching order)
  const convertedRxIds = new Set(orders.map(o => o.prescriptionId).filter(Boolean));
  const queuePrescriptions = prescriptions.filter(p => !convertedRxIds.has(Number(p.id)));
  const convertedPrescriptions = prescriptions.filter(p => convertedRxIds.has(Number(p.id)));
  const displayList = filterStatus === 'QUEUE' ? queuePrescriptions : convertedPrescriptions;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Prescription Dispensing & Clinical Queue"
          subtitle="Review e-prescriptions, run AI screening, and convert to dispense orders"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => refetch()} id="refresh-rx-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="pharma"
            title="E-Prescription Verification Hub"
            subtitle="Human-in-the-loop (HITL) safety checkpoint before medication dispensing"
            loading={loading}
            stats={[
              { label: 'Awaiting Conversion', value: queuePrescriptions.length, icon: '📋', highlight: true },
              { label: 'Converted to Orders', value: convertedPrescriptions.length, icon: '📦' },
              { label: 'AI Screening', value: 'Active', icon: '🤖' },
            ]}
          />

          {/* Pharmacy info banner */}
          {myPharmacy ? (
            <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid #059669', background: 'rgba(5,150,105,0.04)' }}>
              <div className="card-body" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Package size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>
                  Dispensing Pharmacy: <span style={{ color: '#059669' }}>{myPharmacy.name}</span>
                  <span style={{ fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 8 }}>— Orders will be created under this pharmacy</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid #F59E0B', background: 'rgba(245,158,11,0.05)' }}>
              <div className="card-body" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
                <span style={{ fontSize: 13, color: '#92400E' }}>
                  Pharmacy profile loading… If this persists, your account may not be linked to a pharmacy.
                </span>
              </div>
            </div>
          )}

          {/* HITL Safety Banner */}
          <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid #0EA5E9', background: 'rgba(14,165,233,0.04)' }}>
            <div className="card-body" style={{ padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <ShieldCheck size={24} style={{ color: '#0EA5E9', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0369A1' }}>Human-in-the-Loop Checkpoint — Pharmacist Clinical Validation</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Run the AI safety check, then click <strong>Convert to Order</strong> to create a dispense order from the prescription.
                  This moves it from the incoming queue to the active Orders workflow.
                </div>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button
              className={`tab-btn ${filterStatus === 'QUEUE' ? 'active' : ''}`}
              onClick={() => setFilterStatus('QUEUE')}
              id="tab-rx-queue"
            >
              <Clock size={13} style={{ marginRight: 5 }} />
              Incoming Queue ({queuePrescriptions.length})
            </button>
            <button
              className={`tab-btn ${filterStatus === 'CONVERTED' ? 'active' : ''}`}
              onClick={() => setFilterStatus('CONVERTED')}
              id="tab-rx-converted"
            >
              <CheckCircle2 size={13} style={{ marginRight: 5 }} />
              Converted to Orders ({convertedPrescriptions.length})
            </button>
          </div>

          {/* Prescriptions List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--r-lg)' }} />
              ))}
            </div>
          ) : displayList.length === 0 ? (
            <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <FileText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <div className="empty-title">
                {filterStatus === 'QUEUE' ? 'No prescriptions awaiting conversion' : 'No converted prescriptions yet'}
              </div>
              <div className="empty-sub">
                {filterStatus === 'QUEUE'
                  ? 'All incoming prescriptions have been processed into orders.'
                  : 'Converted prescriptions will appear here once you process the incoming queue.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {displayList.map(rx => {
                const rxId = Number(rx.id);
                const isConverted = convertedRxIds.has(rxId);
                const aiResult = aiChecks[rxId];
                const isChecking = checkingId === rxId;
                const isConverting = converting[rxId];
                const msg = convertMsg[rxId];

                return (
                  <div
                    key={rx.id}
                    className="card"
                    style={{
                      border: isConverted
                        ? '1px solid #A7F3D0'
                        : '1px solid rgba(14,165,233,0.3)',
                      background: isConverted ? 'rgba(5,150,105,0.02)' : undefined
                    }}
                  >
                    {/* Card Header */}
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 8, background: isConverted ? 'rgba(5,150,105,0.1)' : 'rgba(14,165,233,0.1)', color: isConverted ? '#059669' : 'var(--med-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15 }}>
                            Prescription #{rx.id}
                            {rx.appointmentNumber && <span style={{ color: 'var(--med-teal)', marginLeft: 6 }}>— {rx.appointmentNumber}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Patient: <strong>{rx.patientName}</strong> · Doctor: <strong>{rx.doctorName}</strong>
                            {rx.diagnosis && <> · <em>{rx.diagnosis}</em></>}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className={`badge ${isConverted ? 'badge-green' : 'badge-amber'}`}>
                          {isConverted ? '✓ Converted' : 'Active'}
                        </span>

                        {/* Convert to Order Button */}
                        {!isConverted && (
                          <button
                            id={`convert-order-btn-${rxId}`}
                            className="btn btn-primary btn-sm"
                            onClick={() => handleConvertToOrder(rx)}
                            disabled={isConverting || !myPharmacy?.id}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            title={!myPharmacy?.id ? 'Pharmacy profile not loaded' : 'Convert this prescription into a dispense order'}
                          >
                            {isConverting
                              ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Converting…</>
                              : <><ShoppingCart size={13} /> Convert to Order</>
                            }
                          </button>
                        )}

                        {isConverted && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#059669' }}>
                            <CheckCircle2 size={14} /> Order Created
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Conversion feedback message */}
                    {msg && (
                      <div style={{
                        margin: '0 20px',
                        padding: '10px 14px',
                        borderRadius: 'var(--r-md)',
                        background: msg.ok ? '#ECFDF5' : '#FEF2F2',
                        border: `1px solid ${msg.ok ? '#6EE7B7' : '#FECACA'}`,
                        fontSize: 13,
                        fontWeight: 600,
                        color: msg.ok ? '#065F46' : '#991B1B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8
                      }}>
                        <span>{msg.ok ? <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 5 }} /> : <AlertTriangle size={14} style={{ display: 'inline', marginRight: 5 }} />}{msg.text}</span>
                        <button onClick={() => setConvertMsg(m => ({ ...m, [rxId]: null }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {/* Medicines */}
                    <div className="card-body" style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
                        Prescribed Medication Items ({rx.items?.length || 0}):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                        {(rx.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '6px 12px', background: 'var(--bg-secondary)',
                              borderRadius: 'var(--r-md)', fontSize: 12.5, fontWeight: 600,
                            }}
                          >
                            <Pill size={12} style={{ color: 'var(--med-teal)' }} />
                            <span>{item.medicineName}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                              ({item.dosage || 'Standard'} · {item.frequency || 'Daily'} · ×{item.quantity})
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* AI Safety Check */}
                      {!isConverted && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                          {!aiResult ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleRunAICheck(rx)}
                                disabled={isChecking}
                                id={`ai-check-btn-${rxId}`}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284C7', borderColor: '#0284C7' }}
                              >
                                <Sparkles size={13} />
                                {isChecking ? 'Running AI Safety Screen…' : 'Run AI Safety & DDI Check (Recommended)'}
                              </button>
                              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                                — or convert directly if you've already verified
                              </span>
                              <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                            </div>
                          ) : (
                            <div style={{
                              padding: 12, borderRadius: 'var(--r-md)',
                              background: aiResult.safe_to_dispense ? '#ECFDF5' : '#FEF2F2',
                              border: `1px solid ${aiResult.safe_to_dispense ? '#10B981' : '#EF4444'}`
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {aiResult.safe_to_dispense
                                    ? <CheckCircle2 size={16} color="#059669" />
                                    : <AlertTriangle size={16} color="#DC2626" />}
                                  <strong style={{ fontSize: 13, color: aiResult.safe_to_dispense ? '#065F46' : '#991B1B' }}>
                                    AI Safety: {aiResult.safe_to_dispense ? 'Verified Safe ✓' : 'Warnings Detected'}
                                  </strong>
                                </div>
                                <span className="badge badge-teal" style={{ fontSize: 11 }}>Score: {aiResult.safety_score}/100</span>
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{aiResult.summary}</div>
                              {aiResult.allergy_warnings.map((w, i) => (
                                <div key={i} style={{ fontSize: 11.5, color: '#DC2626', fontWeight: 600, marginTop: 4 }}>• {w}</div>
                              ))}
                              {aiResult.alternatives.map((alt, i) => (
                                <div key={i} style={{ fontSize: 11.5, color: '#0369A1', fontWeight: 600, marginTop: 4 }}>
                                  💡 Alternative: {alt.original_drug} → {alt.alternative_drug} ({alt.dosage_guidance})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
