import { useState } from 'react';
import {
  FileText, Pill, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck,
  RefreshCw, ArrowRight, Loader2, ShoppingCart, Package, Clock, X,
  AlertCircle, Check, Info
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { usePharmacistPrescriptions, usePharmacistOrders, useMyPharmacy } from '../../hooks';
import {
  apiScreenInteractions,
  apiAcknowledgeWarning,
  apiGetPrescriptionInteractionLogs,
  apiCreateOrder,
  type ScreenInteractionsResponse,
  type DrugInteractionLog
} from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';
import type { Prescription } from '../../types/prescription';

export default function PharmacistPrescriptionsPage() {
  const queryClient = useQueryClient();
  const { data: prescriptions = [], isLoading: loading, refetch } = usePharmacistPrescriptions();
  const { data: orders = [] } = usePharmacistOrders();
  const { data: myPharmacy } = useMyPharmacy();

  const [aiChecks, setAiChecks] = useState<Record<number, ScreenInteractionsResponse>>({});
  const [aiCheckErrors, setAiCheckErrors] = useState<Record<number, string>>({});
  const [warningLogs, setWarningLogs] = useState<Record<number, DrugInteractionLog[]>>({});
  const [overrideNotes, setOverrideNotes] = useState<Record<number, Record<number, string>>>({});
  const [acknowledgedLogs, setAcknowledgedLogs] = useState<Record<number, Set<number>>>({});
  const [acknowledging, setAcknowledging] = useState<Record<number, boolean>>({});
  const [checkingId, setCheckingId] = useState<number | null>(null);

  const [filterStatus, setFilterStatus] = useState<'QUEUE' | 'CONVERTED'>('QUEUE');
  const [converting, setConverting] = useState<Record<number, boolean>>({});
  const [convertMsg, setConvertMsg] = useState<Record<number, { ok: boolean; text: string } | null>>({});

  // ─── AI Medication Check (Backend Screen Interactions Endpoint) ──────────────

  async function handleRunAICheck(rx: Prescription) {
    const rxId = Number(rx.id);
    setCheckingId(rxId);
    setAiCheckErrors(prev => ({ ...prev, [rxId]: '' }));

    try {
      const res = await apiScreenInteractions(rxId, myPharmacy?.id);
      setAiChecks(prev => ({ ...prev, [rxId]: res }));

      // Fetch active interaction logs for this prescription
      const logs = await apiGetPrescriptionInteractionLogs(rxId);
      setWarningLogs(prev => ({ ...prev, [rxId]: logs }));

      const ackedSet = new Set(logs.filter(l => l.isAcknowledged).map(l => l.id));
      setAcknowledgedLogs(prev => ({ ...prev, [rxId]: ackedSet }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI service unavailable. Manual pharmacist review required.';
      setAiCheckErrors(prev => ({ ...prev, [rxId]: msg }));
    } finally {
      setCheckingId(null);
    }
  }

  // ─── Pharmacist Warning Acknowledgment & HITL Override ─────────────────────

  async function handleAcknowledge(rxId: number, logId: number, severity: string) {
    const note = overrideNotes[rxId]?.[logId] || '';
    if (severity === 'High' && !note.trim()) {
      alert('A justification note is required to acknowledge High-severity warnings.');
      return;
    }

    setAcknowledging(prev => ({ ...prev, [logId]: true }));
    try {
      await apiAcknowledgeWarning(rxId, logId, note);

      // Update local state
      setAcknowledgedLogs(prev => {
        const current = new Set(prev[rxId] || []);
        current.add(logId);
        return { ...prev, [rxId]: current };
      });

      // Refetch logs to confirm status from backend
      const logs = await apiGetPrescriptionInteractionLogs(rxId);
      setWarningLogs(prev => ({ ...prev, [rxId]: logs }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to acknowledge warning.';
      alert(msg);
    } finally {
      setAcknowledging(prev => ({ ...prev, [logId]: false }));
    }
  }

  function setOverrideNoteValue(rxId: number, logId: number, value: string) {
    setOverrideNotes(prev => ({
      ...prev,
      [rxId]: {
        ...(prev[rxId] || {}),
        [logId]: value
      }
    }));
  }

  function hasUnacknowledgedHighWarning(rxId: number): boolean {
    const logs = warningLogs[rxId] || [];
    const ackedSet = acknowledgedLogs[rxId] || new Set();
    return logs.some(l => l.severityLevel === 'High' && !l.isAcknowledged && !ackedSet.has(l.id));
  }

  // ─── Convert Prescription → Order ──────────────────────────────────────────

  async function handleConvertToOrder(rx: Prescription) {
    const rxId = Number(rx.id);

    if (hasUnacknowledgedHighWarning(rxId)) {
      setConvertMsg(m => ({
        ...m,
        [rxId]: {
          ok: false,
          text: 'Blocked: High-severity drug interaction detected. You must acknowledge all High-severity warnings with a justification note before converting to an order.'
        }
      }));
      return;
    }

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
                  Run the AI safety check to screen for drug-drug interactions, allergy contraindications, dosage warnings, and out-of-stock alternatives.
                  High-severity warnings strictly require a written justification note to convert to order.
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
                const screenRes = aiChecks[rxId];
                const aiError = aiCheckErrors[rxId];
                const logs = warningLogs[rxId] || [];
                const ackedSet = acknowledgedLogs[rxId] || new Set();
                const isChecking = checkingId === rxId;
                const isConverting = converting[rxId];
                const msg = convertMsg[rxId];
                const blockedByHigh = hasUnacknowledgedHighWarning(rxId);

                const resultData = screenRes?.result;
                const isSafe = resultData?.safeToDispense ?? resultData?.safe_to_dispense;
                const score = resultData?.safetyScore ?? resultData?.safety_score ?? 100;
                const interactions = resultData?.interactions || [];
                const allergyWarnings = resultData?.allergyWarnings || resultData?.allergy_warnings || [];
                const dosageWarnings = resultData?.dosageWarnings || resultData?.dosage_warnings || [];
                const alternatives = resultData?.alternatives || [];
                const summaryText = resultData?.summary;

                return (
                  <div
                    key={rx.id}
                    className="card"
                    style={{
                      border: isConverted
                        ? '1px solid #A7F3D0'
                        : blockedByHigh
                        ? '2px solid #EF4444'
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
                        <span className={`badge ${isConverted ? 'badge-green' : blockedByHigh ? 'badge-red' : 'badge-amber'}`}>
                          {isConverted ? '✓ Converted' : blockedByHigh ? '⚠️ Blocked (High Risk)' : 'Active'}
                        </span>

                        {/* Convert to Order Button */}
                        {!isConverted && (
                          <button
                            id={`convert-order-btn-${rxId}`}
                            className="btn btn-primary btn-sm"
                            onClick={() => handleConvertToOrder(rx)}
                            disabled={isConverting || !myPharmacy?.id || blockedByHigh}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              opacity: blockedByHigh ? 0.65 : 1,
                              cursor: blockedByHigh ? 'not-allowed' : 'pointer'
                            }}
                            title={
                              blockedByHigh
                                ? 'Blocked: Provide justification note for High-severity warning'
                                : !myPharmacy?.id
                                ? 'Pharmacy profile not loaded'
                                : 'Convert this prescription into a dispense order'
                            }
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
                        margin: '0 20px 10px',
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

                      {/* AI Safety Check Trigger / Error Banner */}
                      {!isConverted && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleRunAICheck(rx)}
                              disabled={isChecking}
                              id={`ai-check-btn-${rxId}`}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284C7', borderColor: '#0284C7' }}
                            >
                              <Sparkles size={13} />
                              {isChecking ? 'Running AI Medication Check…' : screenRes ? 'Re-run AI Safety Check' : 'Run AI Safety Check'}
                            </button>

                            {screenRes && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className={`badge ${isSafe ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 12, fontWeight: 700 }}>
                                  {isSafe ? '✓ Safe to Dispense' : '⚠️ Warnings Detected'}
                                </span>
                                <span className="badge badge-teal" style={{ fontSize: 12, fontWeight: 700 }}>
                                  Safety Score: {score}/100
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Error state if AI service unavailable */}
                          {aiError && (
                            <div style={{
                              marginTop: 12, padding: '12px 16px', borderRadius: 'var(--r-md)',
                              background: '#FFFBEB', border: '1px solid #FCD34D', color: '#92400E', fontSize: 12.5
                            }}>
                              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <AlertTriangle size={15} color="#D97706" />
                                <span>AI Service Offline — Manual Review Required</span>
                              </div>
                              <div>{aiError}</div>
                            </div>
                          )}

                          {/* Screen Results Display */}
                          {screenRes && (
                            <div style={{
                              marginTop: 14, padding: 16, borderRadius: 'var(--r-md)',
                              background: isSafe ? 'rgba(16,185,129,0.03)' : 'rgba(239,68,68,0.03)',
                              border: `1px solid ${isSafe ? '#A7F3D0' : '#FECACA'}`
                            }}>
                              {/* Gemini Summary */}
                              {summaryText && (
                                <div style={{
                                  padding: '10px 14px', borderRadius: 8, background: 'rgba(14,165,233,0.06)',
                                  borderLeft: '4px solid #0EA5E9', fontSize: 12.5, fontWeight: 600, color: '#0369A1', marginBottom: 12
                                }}>
                                  🤖 <strong>AI Clinical Summary:</strong> {summaryText}
                                </div>
                              )}

                              {/* Drug Interactions */}
                              {interactions.length > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', marginBottom: 6 }}>
                                    Drug-Drug Interactions ({interactions.length}):
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {interactions.map((item, idx) => {
                                      const pair = item.drug_pair || item.drugPair || [];
                                      const pairStr = pair.join(' ↔ ');
                                      const isHigh = item.severity === 'High';
                                      return (
                                        <div key={idx} style={{
                                          padding: '10px 12px', borderRadius: 6, background: '#FFF',
                                          border: `1px solid ${isHigh ? '#FCA5A5' : '#FED7AA'}`, fontSize: 12
                                        }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                                              💊 {pairStr || 'Drug Pair'}
                                            </span>
                                            <span className={`badge ${isHigh ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: 10.5 }}>
                                              {item.severity} Severity
                                            </span>
                                          </div>
                                          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{item.description}</div>
                                          {(item.recommendation || item.clinicalGuidance) && (
                                            <div style={{ fontSize: 11.5, color: '#0369A1', fontWeight: 600 }}>
                                              💡 Recommendation: {item.recommendation || item.clinicalGuidance}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Allergy Warnings */}
                              {allergyWarnings.length > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: 6 }}>
                                    Allergy Contraindications ({allergyWarnings.length}):
                                  </div>
                                  {allergyWarnings.map((w, i) => (
                                    <div key={i} style={{ padding: '8px 12px', borderRadius: 6, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                                      🚫 {w}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Dosage Warnings */}
                              {dosageWarnings.length > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', marginBottom: 6 }}>
                                    Dosage & Age Warnings ({dosageWarnings.length}):
                                  </div>
                                  {dosageWarnings.map((w, i) => (
                                    <div key={i} style={{ padding: '8px 12px', borderRadius: 6, background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                                      ⚖️ {w}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Alternatives */}
                              {alternatives.length > 0 && (
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: 6 }}>
                                    Bioequivalent & In-Stock Alternatives ({alternatives.length}):
                                  </div>
                                  {alternatives.map((alt, i) => {
                                    const orig = alt.original_drug || alt.originalDrug;
                                    const repl = alt.alternative_drug || alt.alternativeDrug;
                                    const guidance = alt.dosage_guidance || alt.dosageGuidance;
                                    return (
                                      <div key={i} style={{ padding: '8px 12px', borderRadius: 6, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 12, marginTop: 4 }}>
                                        <strong>🔄 {orig}</strong> → <span style={{ textDecoration: 'underline' }}>{repl}</span>
                                        {alt.reason && <div style={{ fontSize: 11.5, color: '#047857', marginTop: 2 }}>Reason: {alt.reason}</div>}
                                        {guidance && <div style={{ fontSize: 11, color: '#065F46', fontWeight: 600, marginTop: 2 }}>Guidance: {guidance}</div>}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Pharmacist HITL Warning Override Section */}
                          {logs.length > 0 && (
                            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed #CBD5E1' }}>
                              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ShieldCheck size={16} color="#0EA5E9" />
                                <span>Pharmacist Clinical Warning Acknowledgments (HITL Gate)</span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {logs.map(log => {
                                  const isAcked = log.isAcknowledged || ackedSet.has(log.id);
                                  const isHigh = log.severityLevel === 'High';
                                  const isAcking = acknowledging[log.id];
                                  const noteValue = overrideNotes[rxId]?.[log.id] || '';

                                  return (
                                    <div
                                      key={log.id}
                                      style={{
                                        padding: 12, borderRadius: 8,
                                        background: isAcked ? '#F8FAFC' : isHigh ? '#FEF2F2' : '#FFFBEB',
                                        border: `1px solid ${isAcked ? '#E2E8F0' : isHigh ? '#FCA5A5' : '#FDE68A'}`
                                      }}
                                    >
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                          <span className={`badge ${isHigh ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: 10.5 }}>
                                            {log.severityLevel} Severity
                                          </span>
                                          <span style={{ fontSize: 12, fontWeight: 700 }}>
                                            Log #{log.id} · {log.warningType}
                                          </span>
                                        </div>

                                        {isAcked ? (
                                          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircle2 size={13} /> Acknowledged
                                          </span>
                                        ) : (
                                          <span style={{ fontSize: 11, fontWeight: 700, color: isHigh ? '#DC2626' : '#D97706' }}>
                                            {isHigh ? '⚠️ Requires Written Justification' : 'Optional Acknowledgment'}
                                          </span>
                                        )}
                                      </div>

                                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                        {log.description}
                                      </div>

                                      {/* Acknowledged details */}
                                      {isAcked && log.pharmacistOverrideNote && (
                                        <div style={{ fontSize: 11.5, color: '#047857', background: '#ECFDF5', padding: '6px 10px', borderRadius: 4, marginTop: 4 }}>
                                          <strong>Override Justification:</strong> {log.pharmacistOverrideNote}
                                        </div>
                                      )}

                                      {/* Interactive Override Input for Unacknowledged Logs */}
                                      {!isAcked && (
                                        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                          {isHigh && (
                                            <textarea
                                              placeholder="Enter mandatory clinical rationale for overriding this High-severity warning..."
                                              value={noteValue}
                                              onChange={e => setOverrideNoteValue(rxId, log.id, e.target.value)}
                                              rows={2}
                                              style={{
                                                width: '100%', fontSize: 12, padding: '6px 10px',
                                                borderRadius: 6, border: '1px solid #FCA5A5', outline: 'none'
                                              }}
                                            />
                                          )}
                                          {!isHigh && (
                                            <input
                                              type="text"
                                              placeholder="Optional override note..."
                                              value={noteValue}
                                              onChange={e => setOverrideNoteValue(rxId, log.id, e.target.value)}
                                              style={{
                                                width: '100%', fontSize: 12, padding: '6px 10px',
                                                borderRadius: 6, border: '1px solid #CBD5E1', outline: 'none'
                                              }}
                                            />
                                          )}

                                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                              className="btn btn-sm"
                                              onClick={() => handleAcknowledge(rxId, log.id, log.severityLevel)}
                                              disabled={isAcking || (isHigh && !noteValue.trim())}
                                              style={{
                                                background: isHigh ? '#DC2626' : '#D97706',
                                                color: '#FFF', border: 'none', borderRadius: 6,
                                                padding: '4px 12px', fontSize: 11.5, fontWeight: 700,
                                                opacity: isHigh && !noteValue.trim() ? 0.5 : 1,
                                                cursor: isHigh && !noteValue.trim() ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 4
                                              }}
                                            >
                                              {isAcking
                                                ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Acknowledging…</>
                                                : <><Check size={12} /> {isHigh ? 'Acknowledge & Override' : 'Acknowledge Warning'}</>
                                              }
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
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
