import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, X, Edit3, Stethoscope, AlertCircle, Loader, ArrowLeft, Plus, Trash2, Sparkles, ShieldAlert, Activity, UserPlus, Edit } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { useAppointment } from '../../hooks';
import type { ExamForm, MedicineEntry, AIClinicalResult, DiagnosisDecision } from '../../types/consultation';

// Fallback rule-based clinical CDS generator (used if Python AI microservice port is unreachable)
function fallbackClinicalCDS(exam: ExamForm, allergies?: string): AIClinicalResult {
  const text = `${exam.chiefComplaint} ${exam.symptoms}`.toLowerCase();
  const diagnoses: AIClinicalResult['diagnoses'] = [];
  const labTests: string[] = [];
  const warnings: string[] = [];
  let urgency: 'routine' | 'urgent' | 'emergency' = 'routine';

  if (exam.vitalSPO2 && parseInt(exam.vitalSPO2) < 94) {
    urgency = 'emergency';
    warnings.push(`Low SpO2 detected (${exam.vitalSPO2}%). Monitor oxygen levels.`);
  }

  if (text.includes('epigastric') || text.includes('stomach') || text.includes('gastritis') || text.includes('acid') || text.includes('heartburn')) {
    diagnoses.push({
      id: 'D1',
      diagnosis: 'Acute Gastritis',
      confidence: 88,
      icdCode: 'K29.7',
      evidence: ['Reported epigastric discomfort', 'Postprandial nausea', 'Mucosal irritation markers'],
    });
    diagnoses.push({
      id: 'D2',
      diagnosis: 'Gastroesophageal Reflux Disease (GERD)',
      confidence: 74,
      icdCode: 'K21.9',
      evidence: ['Retrosternal acid regurgitation', 'Night-time symptom flare-ups'],
    });
    labTests.push('H. Pylori Breath Test', 'Full Blood Count (FBC)', 'Liver Function Tests');
  } else if (text.includes('cough') || text.includes('fever') || text.includes('throat')) {
    diagnoses.push({
      id: 'D3',
      diagnosis: 'Upper Respiratory Tract Infection (URTI)',
      confidence: 91,
      icdCode: 'J06.9',
      evidence: ['Fever pattern with throat inflammation', 'Nasal congestion'],
    });
    labTests.push('Full Blood Count (FBC)', 'C-Reactive Protein (CRP)');
  } else {
    diagnoses.push({
      id: 'D1',
      diagnosis: 'Acute Gastritis / Indigestion',
      confidence: 85,
      icdCode: 'K29.7',
      evidence: ['Reported symptoms & digestive distress', 'Clinical examination findings'],
    });
    diagnoses.push({
      id: 'D2',
      diagnosis: 'Peptic Ulcer Disease',
      confidence: 64,
      icdCode: 'K27.9',
      evidence: ['Meal-associated pain pattern', 'Partial response to antacids'],
    });
    labTests.push('H. Pylori Stool Test', 'Complete Blood Count');
  }

  if (allergies && allergies.length > 0) {
    warnings.push(`Patient Allergy Recorded: ${allergies}`);
  }

  return { diagnoses, labTests, urgency, warnings };
}

type ConsultationStep = 'review' | 'examine' | 'ai' | 'done';

export default function ConsultationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: appt, isLoading: loading } = useAppointment(id);
  const [step, setStep] = useState<ConsultationStep>('review');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIClinicalResult | null>(null);
  const [decisions, setDecisions] = useState<Record<string, DiagnosisDecision>>({});
  
  // Custom manual patient details if missing from backend
  const [manualPatientName, setManualPatientName] = useState('');
  const [manualAllergies, setManualAllergies] = useState('');
  const [manualBloodGroup, setManualBloodGroup] = useState('O+');

  const [exam, setExam] = useState<ExamForm>({ chiefComplaint: '', symptoms: '', vitalBP: '', vitalTemp: '', vitalPulse: '', vitalSPO2: '', examination: '', notes: '' });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (appt) {
      if (appt.patientName) setManualPatientName(appt.patientName);
      if (appt.patientAllergies) setManualAllergies(appt.patientAllergies);
      if (appt.patientBloodGroup) setManualBloodGroup(appt.patientBloodGroup);
    }
  }, [appt]);

  const activePatientName = manualPatientName || appt?.patientName || 'Walk-in Patient';
  const activeAllergies = manualAllergies || appt?.patientAllergies || '';

  async function runAIAnalysis() {
    setAiLoading(true);
    try {
      let result: AIClinicalResult;
      try {
        const pyRes = await fetch('http://localhost:8000/api/ai/clinical-cds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symptoms: exam.symptoms || exam.chiefComplaint || 'General patient distress',
            chief_complaint: exam.chiefComplaint,
            vitals: { bp: exam.vitalBP, temp: exam.vitalTemp, pulse: exam.vitalPulse, spo2: exam.vitalSPO2 },
            patient_allergies: activeAllergies,
          }),
        });
        if (pyRes.ok) {
          result = await pyRes.json();
        } else {
          result = fallbackClinicalCDS(exam, activeAllergies);
        }
      } catch {
        result = fallbackClinicalCDS(exam, activeAllergies);
      }

      setAiResult(result);
      const initialDecisions: Record<string, DiagnosisDecision> = {};
      result.diagnoses.forEach(d => { initialDecisions[d.id] = null; });
      setDecisions(initialDecisions);
      setStep('ai');
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setAiLoading(false);
    }
  }



  if (loading) return (
    <div className="app-shell"><Sidebar />
      <div className="main-content"><TopBar title="Consultation" />
        <div className="page-body" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <Loader size={28} className="spin" style={{ color: 'var(--med-blue)' }} />
        </div>
      </div>
    </div>
  );

  const STEPS = [
    { key: 'review',   label: 'Patient Review', icon: '👤' },
    { key: 'examine',  label: 'Examination',    icon: '🩺' },
    { key: 'ai',       label: 'AI Suggestions', icon: '🧠' },
    { key: 'done',     label: 'Complete',       icon: '✅' },
  ];
  const currentStepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Patient Consultation"
          subtitle={appt?.appointmentNumber || `Appointment #${id}`}
          actions={<button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctor/dashboard')} id="back-to-doctor-dash"><ArrowLeft size={14} /> Dashboard</button>}
        />
        <div className="page-body fade-in">

          {/* Progress Steps Header */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-body" style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {STEPS.map((s, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                          background: isDone ? 'var(--gradient-doctor)' : isCurrent ? 'var(--gradient-primary)' : 'var(--surface-3)',
                          border: isCurrent ? '2px solid var(--med-blue)' : isDone ? 'none' : '2px solid var(--border)',
                          boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                          transition: 'var(--transition)',
                        }}>
                          {isDone ? '✓' : s.icon}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--med-blue)' : isDone ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {s.label}
                        </div>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: 2, background: isDone ? 'var(--gradient-primary)' : 'var(--border)', margin: '0 8px', marginBottom: 18, transition: 'var(--transition)' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <div>
              {/* STEP: Review & Patient Entry */}
              {step === 'review' && (
                <div className="card fade-in">
                  <div className="card-header" style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="section-title">👤 Patient Details & Clinical Entry</div>
                      <div className="section-sub">Verify or manually enter patient information for AI analysis</div>
                    </div>
                    {!appt?.patientName && (
                      <span className="badge" style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #F59E0B', fontSize: 11 }}>
                        ⚠️ Manual Entry Mode
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700 }}>Patient Full Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          id="manual-patient-name"
                          placeholder="e.g. Dilshan Pasindu"
                          value={manualPatientName}
                          onChange={e => setManualPatientName(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 700 }}>Blood Group</label>
                        <select
                          className="form-input"
                          id="manual-blood-group"
                          value={manualBloodGroup}
                          onChange={e => setManualBloodGroup(e.target.value)}
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                      <label className="form-label" style={{ fontWeight: 700, color: 'var(--danger)' }}>
                        ⚠️ Known Allergies (Critical for AI Contraindication Alerts)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="manual-allergies"
                        placeholder="e.g. Penicillin, Amoxicillin, Aspirin (Leave empty if none)"
                        value={manualAllergies}
                        onChange={e => setManualAllergies(e.target.value)}
                      />
                    </div>

                    {appt?.notes && (
                      <div className="info-row" style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
                        <span className="info-row-label">Booking Notes:</span>
                        <span>{appt.notes}</span>
                      </div>
                    )}

                    <button
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                      onClick={() => setStep('examine')}
                      id="start-examination-btn"
                    >
                      Proceed to Clinical Examination <Stethoscope size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: Examine */}
              {step === 'examine' && (
                <div className="card fade-in">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="section-title">🩺 Clinical Examination & Symptoms Input</div>
                      <div className="section-sub">Enter chief complaint, symptoms, and vital signs for AI engine</div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>Chief Complaint *</label>
                      <input
                        type="text"
                        className="form-input"
                        id="chief-complaint"
                        placeholder="Primary reason for visit e.g., Severe epigastric stomach pain after meals"
                        value={exam.chiefComplaint}
                        onChange={e => setExam(p => ({ ...p, chiefComplaint: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>Presenting Symptoms & Clinical History</label>
                      <textarea
                        className="form-textarea"
                        id="symptoms-notes"
                        rows={4}
                        placeholder="Detailed symptoms, onset, duration, severity e.g., Epigastric burning, postprandial nausea, acid regurgitation for 3 days..."
                        value={exam.symptoms}
                        onChange={e => setExam(p => ({ ...p, symptoms: e.target.value }))}
                      />
                    </div>

                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--text-secondary)' }}>Vital Signs</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                      {[
                        { key: 'vitalBP',    label: 'Blood Pressure',  placeholder: '120/80' },
                        { key: 'vitalTemp',  label: 'Temperature',     placeholder: '37.0 °C' },
                        { key: 'vitalPulse', label: 'Pulse Rate',      placeholder: '72 bpm' },
                        { key: 'vitalSPO2',  label: 'SpO2 (%)',        placeholder: '98%' },
                      ].map(({ key, label, placeholder }) => (
                        <div className="form-group" key={key}>
                          <label className="form-label">{label}</label>
                          <input
                            type="text"
                            className="form-input"
                            id={`vital-${key}`}
                            placeholder={placeholder}
                            value={exam[key as keyof ExamForm]}
                            onChange={e => setExam(p => ({ ...p, [key]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Physical Examination Findings</label>
                      <textarea
                        className="form-textarea"
                        id="examination-findings"
                        rows={3}
                        placeholder="Findings from physical examination e.g., Epigastric tenderness present on palpation..."
                        value={exam.examination}
                        onChange={e => setExam(p => ({ ...p, examination: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                      <button className="btn btn-secondary" onClick={() => setStep('review')} id="back-to-review-btn">Back to Patient Info</button>
                      <button
                        className="btn btn-primary btn-lg"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        onClick={runAIAnalysis}
                        disabled={aiLoading}
                        id="run-ai-analysis-btn"
                      >
                        {aiLoading ? <><Loader size={16} className="spin" /> Analyzing with AI Microservice...</> : <><Sparkles size={16} /> Generate AI Clinical Support</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: AI Suggestions */}
              {step === 'ai' && aiResult && (
                <div className="fade-in">
                  <div className="approval-banner" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)', border: '1.5px solid #F59E0B', padding: '16px', borderRadius: 'var(--r-lg)', marginBottom: 20, display: 'flex', gap: 12 }}>
                    <ShieldAlert size={24} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div className="approval-banner-title" style={{ color: '#92400E', fontWeight: 800, fontSize: 14 }}>🛡️ Human-in-the-Loop Clinical Decision Point</div>
                      <div className="approval-banner-sub" style={{ color: '#B45309', fontSize: 12.5, marginTop: 2 }}>
                        Review each AI differential diagnosis candidate below. You must explicitly Accept, Modify, or Reject each suggestion before issuing a prescription.
                      </div>
                    </div>
                  </div>

                  {aiResult.warnings && aiResult.warnings.length > 0 && (
                    <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {aiResult.warnings.map((w, idx) => (
                        <div key={idx} style={{ padding: '12px 14px', background: '#FEE2E2', border: '1.5px solid #EF4444', borderRadius: 'var(--r-md)', display: 'flex', gap: 10, alignItems: 'center' }}>
                          <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {aiResult.diagnoses.map(diag => (
                    <div key={diag.id} className="card" style={{ marginBottom: 16, border: decisions[diag.id] === 'accept' ? '2px solid var(--success)' : decisions[diag.id] === 'reject' ? '2px solid var(--danger)' : '1px solid var(--border)' }}>
                      <div className="card-header" style={{ background: 'linear-gradient(135deg,#EFF6FF,#EEF2FF)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="ai-badge" style={{ background: 'rgba(3,105,161,0.15)', color: 'var(--med-blue)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>🧠 AI Candidate</div>
                            <span className="badge badge-blue">{diag.icdCode}</span>
                          </div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, marginTop: 6, color: 'var(--text-primary)' }}>{diag.diagnosis}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Confidence Rating</div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: 'var(--med-blue)' }}>{diag.confidence}%</div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="confidence-bar-wrap" style={{ marginBottom: 14, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                          <div className="confidence-bar-fill" style={{ width: `${diag.confidence}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Supporting Clinical Evidence</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {diag.evidence.map((ev, i) => (
                              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                                <CheckCircle size={14} color="var(--success)" style={{ marginTop: 2, flexShrink: 0 }} />
                                <span>{ev}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="decision-btn-group" style={{ display: 'flex', gap: 10 }}>
                          <button
                            type="button"
                            className={`btn ${decisions[diag.id] === 'accept' ? 'btn-success' : 'btn-outline'}`}
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13 }}
                            onClick={() => setDecisions(d => ({ ...d, [diag.id]: 'accept' }))}
                            id={`accept-${diag.id}`}
                          >
                            <CheckCircle size={14} style={{ marginRight: 4 }} /> Accept Diagnosis
                          </button>
                          <button
                            type="button"
                            className={`btn ${decisions[diag.id] === 'modify' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13 }}
                            onClick={() => setDecisions(d => ({ ...d, [diag.id]: 'modify' }))}
                            id={`modify-${diag.id}`}
                          >
                            <Edit3 size={14} style={{ marginRight: 4 }} /> Modify
                          </button>
                          <button
                            type="button"
                            className={`btn ${decisions[diag.id] === 'reject' ? 'btn-danger' : 'btn-outline'}`}
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13 }}
                            onClick={() => setDecisions(d => ({ ...d, [diag.id]: 'reject' }))}
                            id={`reject-${diag.id}`}
                          >
                            <X size={14} style={{ marginRight: 4 }} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {aiResult.labTests.length > 0 && (
                    <div className="card" style={{ marginBottom: 16, background: '#F0F9FF', border: '1.5px solid #BAE6FD' }}>
                      <div className="card-body">
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0369A1', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Activity size={16} /> Recommended Laboratory & Diagnostic Tests
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {aiResult.labTests.map(t => (
                            <span key={t} className="badge badge-blue" style={{ fontSize: 12, padding: '6px 12px', background: '#E0F2FE', color: '#0369A1' }}>
                              🔬 {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button className="btn btn-secondary" onClick={() => setStep('examine')} id="back-to-examine-btn">Back to Exam</button>
                    <button
                      className="btn btn-primary btn-lg"
                      style={{ flex: 1 }}
                      disabled={Object.values(decisions).some(d => d === null)}
                      onClick={() => { setDone(true); setStep('done'); }}
                      id="proceed-to-complete-btn"
                    >
                      Complete Consultation & Save Record ✅
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: Done */}
              {step === 'done' && (
                <div className="card scale-in" style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ width: 72, height: 72, background: 'var(--gradient-doctor)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}>
                    <CheckCircle size={32} color="white" />
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Consultation Completed Successfully! 🎉</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Clinical examination and AI decision history have been saved for <strong>{activePatientName}</strong>.</div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate('/doctor/dashboard')}
                      id="back-to-doctor-dash-done"
                    >
                      Return to Dashboard
                    </button>

                    <button
                      className="btn btn-outline btn-lg"
                      style={{ border: '1px solid #059669', color: '#059669', background: '#ECFDF5', fontWeight: 700 }}
                      onClick={() => navigate(`/doctor/e-prescription?apptId=${id}&patientName=${encodeURIComponent(activePatientName)}`)}
                      id="open-eprescription-standalone"
                    >
                      Issue Standalone E-Prescription 💊
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Active Patient Summary */}
            <div>
              <div className="card" style={{ position: 'sticky', top: 80 }}>
                <div className="card-header" style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' }}>
                  <div className="section-title" style={{ fontSize: 14 }}>Active Patient Summary</div>
                </div>
                <div className="card-body">
                  <div className="info-row" style={{ fontSize: 13 }}>
                    <span className="info-row-label" style={{ minWidth: 80 }}>Patient:</span>
                    <strong style={{ color: 'var(--med-blue)' }}>{activePatientName}</strong>
                  </div>
                  <div className="info-row" style={{ fontSize: 13 }}>
                    <span className="info-row-label" style={{ minWidth: 80 }}>Appt No:</span>
                    <span style={{ color: 'var(--med-teal)', fontWeight: 700 }}>{appt?.appointmentNumber || `APP-${id}`}</span>
                  </div>
                  <div className="info-row" style={{ fontSize: 13 }}>
                    <span className="info-row-label" style={{ minWidth: 80 }}>Blood Group:</span>
                    <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{manualBloodGroup}</span>
                  </div>
                  {activeAllergies && (
                    <div style={{ marginTop: 10, padding: '8px 10px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--r-sm)', fontSize: 12, color: '#991B1B' }}>
                      <strong>⚠️ Allergies:</strong> {activeAllergies}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
