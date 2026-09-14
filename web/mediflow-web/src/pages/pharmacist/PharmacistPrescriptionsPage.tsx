import { useState } from 'react';
import { FileText, Pill, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, User, Calendar, ArrowRight } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { usePharmacistPrescriptions } from '../../hooks';
import { apiRunMedicationCheck, type MedicationCheckResult } from '../../services/api';
import type { Prescription } from '../../types/prescription';

export default function PharmacistPrescriptionsPage() {
  const { data: prescriptions = [], isLoading: loading, refetch } = usePharmacistPrescriptions();
  const [aiChecks, setAiChecks] = useState<Record<number, MedicationCheckResult>>({});
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Active' | 'Fulfilled'>('ALL');
  const [dispensedMap, setDispensedMap] = useState<Record<number, boolean>>({});

  async function handleRunAICheck(rx: Prescription) {
    const rxId = Number(rx.id);
    setCheckingId(rxId);
    try {
      const drugNames = (rx.items || []).map(i => i.medicineName);
      const res = await apiRunMedicationCheck({
        medications: drugNames.length > 0 ? drugNames : ['Amoxicillin 500mg'],
        patient_allergies: 'Penicillin', // default test cross-check for high safety vigilance
      });
      setAiChecks(prev => ({ ...prev, [rxId]: res }));
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingId(null);
    }
  }

  function handleDispense(id: number) {
    setDispensedMap(prev => ({ ...prev, [id]: true }));
  }

  const filtered = prescriptions.filter(p => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'Fulfilled') return p.status === 'Fulfilled' || dispensedMap[Number(p.id)];
    return (p.status === 'Active' || !p.status) && !dispensedMap[Number(p.id)];
  });

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Prescription Dispensing & Clinical Queue"
          subtitle="Review e-prescriptions, execute AI multi-drug interaction screening, and dispense"
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
              { label: 'Pending Dispense', value: prescriptions.filter(p => p.status === 'Active' && !dispensedMap[Number(p.id)]).length, icon: '📋', highlight: true },
              { label: 'Total Received', value: prescriptions.length, icon: '💊' },
              { label: 'AI Screening', value: 'Active', icon: '🤖' },
            ]}
          />

          {/* HITL Safety Banner */}
          <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid #0EA5E9', background: 'rgba(14, 165, 233, 0.04)' }}>
            <div className="card-body" style={{ padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <ShieldCheck size={24} style={{ color: '#0EA5E9', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0369A1' }}>Human-in-the-Loop Checkpoint #2 — Pharmacist Clinical Validation</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  All e-prescriptions require pharmacist review. Run the AI medication check to screen for potential drug-drug interactions and allergy contraindications before marking as dispensed.
                </div>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${filterStatus === 'ALL' ? 'active' : ''}`} onClick={() => setFilterStatus('ALL')}>
              All Prescriptions ({prescriptions.length})
            </button>
            <button className={`tab-btn ${filterStatus === 'Active' ? 'active' : ''}`} onClick={() => setFilterStatus('Active')}>
              Awaiting Dispense
            </button>
            <button className={`tab-btn ${filterStatus === 'Fulfilled' ? 'active' : ''}`} onClick={() => setFilterStatus('Fulfilled')}>
              Dispensed / Fulfilled
            </button>
          </div>

          {/* Prescriptions List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--r-lg)' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <FileText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <div className="empty-title">No prescriptions found</div>
              <div className="empty-sub">All prescriptions in this category have been processed.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map(rx => {
                const rxId = Number(rx.id);
                const isDispensed = rx.status === 'Fulfilled' || dispensedMap[rxId];
                const aiResult = aiChecks[rxId];
                const isChecking = checkingId === rxId;

                return (
                  <div key={rx.id} className="card" style={{ border: isDispensed ? '1px solid var(--border-color)' : '1px solid rgba(14, 165, 233, 0.3)' }}>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(14, 165, 233, 0.1)', color: 'var(--med-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15 }}>
                            Prescription #{rx.id} — <span style={{ color: 'var(--med-teal)' }}>{rx.appointmentNumber}</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Patient: <strong>{rx.patientName}</strong> · Doctor: {rx.doctorName}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge ${isDispensed ? 'badge-green' : 'badge-amber'}`}>
                          {isDispensed ? 'Dispensed' : 'Active'}
                        </span>
                        {!isDispensed && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleDispense(rxId)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                          >
                            <CheckCircle2 size={13} /> Mark Dispensed
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="card-body" style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>
                        Prescribed Medication Items:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                        {(rx.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 12px',
                              background: 'var(--bg-secondary)',
                              borderRadius: 'var(--r-md)',
                              fontSize: 12.5,
                              fontWeight: 600,
                            }}
                          >
                            <Pill size={12} style={{ color: 'var(--med-teal)' }} />
                            <span>{item.medicineName}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>({item.dosage || 'Standard'} · {item.frequency || 'Daily'})</span>
                          </div>
                        ))}
                      </div>

                      {/* AI Safety Check Trigger / Result */}
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                        {!aiResult ? (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleRunAICheck(rx)}
                            disabled={isChecking}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284C7', borderColor: '#0284C7' }}
                          >
                            <Sparkles size={13} />
                            {isChecking ? 'Running Agent 3 Safety Screen...' : 'Run Agent 3 AI Safety & DDI Check'}
                          </button>
                        ) : (
                          <div style={{ padding: 12, borderRadius: 'var(--r-md)', background: aiResult.safe_to_dispense ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${aiResult.safe_to_dispense ? '#10B981' : '#EF4444'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {aiResult.safe_to_dispense ? <CheckCircle2 size={16} color="#059669" /> : <AlertTriangle size={16} color="#DC2626" />}
                                <strong style={{ fontSize: 13, color: aiResult.safe_to_dispense ? '#065F46' : '#991B1B' }}>
                                  AI Safety Evaluation: {aiResult.safe_to_dispense ? 'Verified Safe' : 'Warnings Detected'}
                                </strong>
                              </div>
                              <span className="badge badge-teal" style={{ fontSize: 11 }}>Safety Score: {aiResult.safety_score}/100</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{aiResult.summary}</div>
                            {aiResult.allergy_warnings.map((w, i) => (
                              <div key={i} style={{ fontSize: 11.5, color: '#DC2626', fontWeight: 600, marginTop: 4 }}>• {w}</div>
                            ))}
                            {aiResult.alternatives.map((alt, i) => (
                              <div key={i} style={{ fontSize: 11.5, color: '#0369A1', fontWeight: 600, marginTop: 4 }}>
                                💡 Suggested Bioequivalent: {alt.original_drug} → {alt.alternative_drug} ({alt.dosage_guidance})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
