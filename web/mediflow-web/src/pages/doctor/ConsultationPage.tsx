import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, X, Edit3, Stethoscope, AlertCircle, Loader, ArrowLeft, Plus, Trash2, Sparkles } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiGetAppointment, apiGetPatientHistory, apiRequestClinicalAnalysis, apiSubmitDoctorDecision, apiGetMedicines, apiGeneratePrescription } from '../../services/api';

// Mock clinical AI analysis
async function mockClinicalAI(symptoms: any, vitalSigns: any) {
  await new Promise(r => setTimeout(r, 2000));
  return {
    diagnoses: [
      { id: 'D1', diagnosis: 'Acute Gastritis', confidence: 87, icdCode: 'K29.7', evidence: ['Reported epigastric pain', 'Nausea after eating', 'Symptom duration >3 days'] },
      { id: 'D2', diagnosis: 'Peptic Ulcer Disease', confidence: 64, icdCode: 'K27.9', evidence: ['Night pain pattern', 'Partial relief with antacids'] },
    ],
    labTests: ['H. Pylori Breath Test', 'Complete Blood Count', 'Liver Function Tests'],
    urgency: 'routine',
  };
}

export default function ConsultationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState<any>(null);
  const [step, setStep] = useState('review'); // review | examine | ai | prescribe | done
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [decisions, setDecisions] = useState<Record<string, any>>({});
  const [exam, setExam] = useState({ chiefComplaint: '', symptoms: '', vitalBP: '', vitalTemp: '', vitalPulse: '', vitalSPO2: '', examination: '', notes: '' });
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', quantity: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      apiGetAppointment(id || ''),
    ]).then(([apptRes]) => {
      setAppt((apptRes as any).value || null);
    }).finally(() => setLoading(false));
  }, [id]);

  async function runAIAnalysis() {
    setAiLoading(true);
    try {
      const result = await mockClinicalAI(exam.symptoms, { bp: exam.vitalBP, temp: exam.vitalTemp, pulse: exam.vitalPulse });
      setAiResult(result);
      const initialDecisions: Record<string, any> = {};
      result.diagnoses.forEach(d => { initialDecisions[d.id] = null; });
      setDecisions(initialDecisions);
      setStep('ai');
    } catch (err) { console.error(err); }
    finally { setAiLoading(false); }
  }

  function addMedicine() {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', quantity: '' }]);
  }

  function removeMedicine(i: number) {
    setMedicines(medicines.filter((_, idx) => idx !== i));
  }

  function setMed(i: number, key: string, val: any) {
    setMedicines(prev => prev.map((m, idx) => idx === i ? { ...m, [key]: val } : m));
  }

  async function handleCompletePrescription() {
    setSubmitting(true);
    try {
      await apiGeneratePrescription({ appointmentId: id, items: medicines.filter(m => m.name), clinicianNotes: exam.notes });
      setDone(true); setStep('done');
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
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
    { key: 'prescribe',label: 'Prescription',   icon: '💊' },
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

          {/* Progress Steps */}
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
              {/* STEP: Review */}
              {step === 'review' && (
                <div className="card fade-in">
                  <div className="card-header" style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' }}>
                    <div>
                      <div className="section-title">👤 Patient Information</div>
                      <div className="section-sub">Review patient history before consultation</div>
                    </div>
                  </div>
                  <div className="card-body">
                    {appt ? (
                      <div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                          <div style={{ width: 64, height: 64, background: 'var(--gradient-primary)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Outfit, sans-serif' }}>
                            {appt.patientName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PT'}
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800 }}>{appt.patientName}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Appointment: <strong style={{ color: 'var(--med-teal)' }}>{appt.appointmentNumber}</strong></div>
                            {appt.patientBloodGroup && <div style={{ fontSize: 12.5, marginTop: 4 }}>Blood Group: <strong style={{ color: 'var(--danger)' }}>{appt.patientBloodGroup}</strong></div>}
                          </div>
                        </div>
                        {appt.patientAllergies && (
                          <div style={{ display: 'flex', gap: 8, padding: '12px 14px', background: 'var(--danger-bg)', border: '1.5px solid var(--danger-border)', borderRadius: 'var(--r-md)', marginBottom: 16 }}>
                            <AlertCircle size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
                            <div><strong style={{ color: 'var(--danger)' }}>⚠️ Known Allergies:</strong> <span style={{ fontSize: 13 }}>{appt.patientAllergies}</span></div>
                          </div>
                        )}
                        {appt.notes && <div className="info-row"><span className="info-row-label">Patient Notes:</span>{appt.notes}</div>}
                        <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }} onClick={() => setStep('examine')} id="start-examination-btn">
                          Start Examination <Stethoscope size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">Patient info unavailable</div></div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP: Examine */}
              {step === 'examine' && (
                <div className="card fade-in">
                  <div className="card-header">
                    <div className="section-title">🩺 Clinical Examination</div>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label className="form-label">Chief Complaint</label>
                      <input type="text" className="form-input" id="chief-complaint" placeholder="Primary reason for visit" value={exam.chiefComplaint} onChange={e => setExam(p => ({ ...p, chiefComplaint: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Symptoms & History</label>
                      <textarea className="form-textarea" id="symptoms-notes" rows={4} placeholder="Detailed symptoms, onset, duration, severity..." value={exam.symptoms} onChange={e => setExam(p => ({ ...p, symptoms: e.target.value }))} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--text-secondary)' }}>Vital Signs</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                      {[
                        { key: 'vitalBP',    label: 'Blood Pressure',  placeholder: '120/80 mmHg' },
                        { key: 'vitalTemp',  label: 'Temperature',     placeholder: '37.0 °C' },
                        { key: 'vitalPulse', label: 'Pulse Rate',      placeholder: '72 bpm' },
                        { key: 'vitalSPO2',  label: 'SpO2',            placeholder: '98%' },
                      ].map(({ key, label, placeholder }) => (
                        <div className="form-group" key={key}>
                          <label className="form-label">{label}</label>
                          <input type="text" className="form-input" id={`vital-${key}`} placeholder={placeholder} value={exam[key]} onChange={e => setExam(p => ({ ...p, [key]: e.target.value }))} />
                        </div>
                      ))}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Physical Examination Findings</label>
                      <textarea className="form-textarea" id="examination-findings" rows={3} placeholder="Findings from physical examination..." value={exam.examination} onChange={e => setExam(p => ({ ...p, examination: e.target.value }))} />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-secondary" onClick={() => setStep('review')} id="back-to-review-btn">Back</button>
                      <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={runAIAnalysis} disabled={aiLoading} id="run-ai-analysis-btn">
                        {aiLoading ? <><Loader size={16} className="spin" /> Analyzing with AI...</> : <><Sparkles size={16} /> Get AI Clinical Analysis</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: AI Suggestions */}
              {step === 'ai' && aiResult && (
                <div className="fade-in">
                  <div className="approval-banner">
                    <span className="approval-banner-icon">⚠️</span>
                    <div>
                      <div className="approval-banner-title">Human Approval Required — Clinical Decision Point</div>
                      <div className="approval-banner-sub">Review each AI diagnosis suggestion and Accept, Modify, or Reject. You must decide before proceeding.</div>
                    </div>
                  </div>

                  {aiResult.diagnoses.map(diag => (
                    <div key={diag.id} className="card" style={{ marginBottom: 16 }}>
                      <div className="card-header" style={{ background: 'linear-gradient(135deg,#EFF6FF,#EEF2FF)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="ai-badge" style={{ background: 'rgba(3,105,161,0.1)', color: 'var(--med-blue)', fontSize: 10 }}>🧠 AI Suggestion</div>
                            <span className="badge badge-blue">{diag.icdCode}</span>
                          </div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 800, marginTop: 6 }}>{diag.diagnosis}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>AI Confidence</div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: 'var(--med-blue)' }}>{diag.confidence}%</div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="confidence-bar-wrap" style={{ marginBottom: 14 }}>
                          <div className="confidence-bar-track">
                            <div className="confidence-bar-fill" style={{ width: `${diag.confidence}%` }} />
                          </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Supporting Evidence</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {diag.evidence.map((ev, i) => (
                              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                                <CheckCircle size={13} color="var(--success)" style={{ marginTop: 1, flexShrink: 0 }} /> {ev}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="decision-btn-group">
                          <button className={`decision-btn accept ${decisions[diag.id] === 'accept' ? 'selected' : ''}`} onClick={() => setDecisions(d => ({ ...d, [diag.id]: 'accept' }))} id={`accept-${diag.id}`}>
                            <CheckCircle size={14} /> Accept Diagnosis
                          </button>
                          <button className={`decision-btn modify ${decisions[diag.id] === 'modify' ? 'selected' : ''}`} onClick={() => setDecisions(d => ({ ...d, [diag.id]: 'modify' }))} id={`modify-${diag.id}`}>
                            <Edit3 size={14} /> Modify
                          </button>
                          <button className={`decision-btn reject ${decisions[diag.id] === 'reject' ? 'selected' : ''}`} onClick={() => setDecisions(d => ({ ...d, [diag.id]: 'reject' }))} id={`reject-${diag.id}`}>
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {aiResult.labTests.length > 0 && (
                    <div className="card" style={{ marginBottom: 16, background: 'var(--med-blue-50)', border: '1.5px solid var(--med-blue-200)' }}>
                      <div className="card-body">
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--med-blue)', marginBottom: 10 }}>🔬 Recommended Lab Tests</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {aiResult.labTests.map(t => <span key={t} className="badge badge-blue">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={() => setStep('examine')} id="back-to-examine-btn">Back</button>
                    <button
                      className="btn btn-primary btn-lg"
                      style={{ flex: 1 }}
                      disabled={Object.values(decisions).some(d => d === null)}
                      onClick={() => setStep('prescribe')}
                      id="proceed-to-prescription-btn"
                    >
                      Proceed to Prescription <span>💊</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: Prescribe */}
              {step === 'prescribe' && (
                <div className="card fade-in">
                  <div className="card-header">
                    <div className="section-title">💊 Write E-Prescription</div>
                    <button className="btn btn-ghost btn-sm" onClick={addMedicine} id="add-medicine-btn"><Plus size={13} /> Add Medicine</button>
                  </div>
                  <div className="card-body">
                    {medicines.map((med, i) => (
                      <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: '16px', marginBottom: 12, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)' }}>Medicine {i + 1}</div>
                          {medicines.length > 1 && <button onClick={() => removeMedicine(i)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }} id={`remove-med-${i}`}><Trash2 size={14} /></button>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 10 }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Medicine Name</label>
                            <input type="text" className="form-input" id={`med-name-${i}`} placeholder="e.g. Omeprazole" value={med.name} onChange={e => setMed(i, 'name', e.target.value)} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Dosage</label>
                            <input type="text" className="form-input" id={`med-dosage-${i}`} placeholder="20mg" value={med.dosage} onChange={e => setMed(i, 'dosage', e.target.value)} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Frequency</label>
                            <input type="text" className="form-input" id={`med-freq-${i}`} placeholder="Twice daily" value={med.frequency} onChange={e => setMed(i, 'frequency', e.target.value)} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Duration</label>
                            <input type="text" className="form-input" id={`med-dur-${i}`} placeholder="7 days" value={med.duration} onChange={e => setMed(i, 'duration', e.target.value)} />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Qty</label>
                            <input type="number" className="form-input" id={`med-qty-${i}`} placeholder="14" value={med.quantity} onChange={e => setMed(i, 'quantity', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="form-group">
                      <label className="form-label">Special Instructions</label>
                      <textarea className="form-textarea" id="prescription-notes" rows={2} placeholder="Take medicines after food, avoid alcohol..." value={exam.notes} onChange={e => setExam(p => ({ ...p, notes: e.target.value }))} />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-secondary" onClick={() => setStep('ai')} id="back-to-ai-btn">Back</button>
                      <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleCompletePrescription} disabled={submitting} id="generate-prescription-btn">
                        {submitting ? <><Loader size={16} className="spin" /> Generating...</> : <>Generate E-Prescription ✅</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: Done */}
              {step === 'done' && (
                <div className="card scale-in" style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ width: 72, height: 72, background: 'var(--gradient-doctor)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}>
                    <CheckCircle size={32} color="white" />
                  </div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Consultation Complete! 🎉</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>E-Prescription has been generated and sent to the patient.</div>
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('/doctor/dashboard')} id="back-to-doctor-dash-done">Return to Dashboard</button>
                </div>
              )}
            </div>

            {/* Right: Patient Summary */}
            <div>
              <div className="card" style={{ position: 'sticky', top: 80 }}>
                <div className="card-header" style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' }}>
                  <div className="section-title" style={{ fontSize: 14 }}>Patient Summary</div>
                </div>
                <div className="card-body">
                  {appt ? (
                    <>
                      <div className="info-row" style={{ fontSize: 13 }}><span className="info-row-label" style={{ minWidth: 80 }}>Patient:</span><strong>{appt.patientName}</strong></div>
                      <div className="info-row" style={{ fontSize: 13 }}><span className="info-row-label" style={{ minWidth: 80 }}>Appt No:</span><span style={{ color: 'var(--med-teal)', fontWeight: 700 }}>{appt.appointmentNumber}</span></div>
                      <div className="info-row" style={{ fontSize: 13 }}><span className="info-row-label" style={{ minWidth: 80 }}>Date:</span>{new Date(appt.appointmentDateTime).toLocaleString()}</div>
                      {appt.notes && <div className="info-row" style={{ fontSize: 13, alignItems: 'flex-start' }}><span className="info-row-label" style={{ minWidth: 80 }}>Notes:</span>{appt.notes}</div>}
                    </>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No appointment data</div>
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
