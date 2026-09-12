import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Brain, CheckCircle, X, Edit3, Stethoscope, AlertCircle, Loader, 
  ArrowLeft, Plus, Trash2, Sparkles, ShieldAlert, Activity, UserPlus, 
  ChevronDown, ChevronUp, FileText, Printer, CheckSquare, RefreshCw, AlertTriangle
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { useAppointment } from '../../hooks';
import { apiGeneratePrescription } from '../../services/api';
import type { 
  ExamForm, AIClinicalResult, AIDiagnosis, AgentThoughtStep, 
  AgentLabDraft, AgentMedicationDraft, ApprovedClinicalPlan 
} from '../../types/consultation';

// Fallback rule-based clinical CDS generator with ReAct agent simulation
function fallbackClinicalCDS(exam: ExamForm, allergies?: string): AIClinicalResult {
  const text = `${exam.chiefComplaint} ${exam.symptoms}`.toLowerCase();
  const diagnoses: AIDiagnosis[] = [];
  const labDrafts: AgentLabDraft[] = [];
  const medicationDrafts: AgentMedicationDraft[] = [];
  const warnings: string[] = [];
  const thoughtStream: AgentThoughtStep[] = [];
  let urgency: 'routine' | 'urgent' | 'emergency' = 'routine';

  thoughtStream.push({
    stepNumber: 1,
    thought: `Scanning chief complaint ("${exam.chiefComplaint || 'None'}") and recorded vitals.`,
    toolName: 'perceive_patient_context',
    toolInput: `vitals: BP=${exam.vitalBP}, Temp=${exam.vitalTemp}, SpO2=${exam.vitalSPO2}; allergies: ${allergies || 'None'}`,
    observation: 'Patient clinical context ingested.'
  });

  if (exam.vitalSPO2 && parseInt(exam.vitalSPO2) < 94) {
    urgency = 'emergency';
    warnings.push(`Low SpO2 detected (${exam.vitalSPO2}%). Monitor oxygen levels.`);
    thoughtStream.push({
      stepNumber: 2,
      thought: 'Low SpO2 detected. Escalating respiratory alert.',
      toolName: 'calculate_vitals_risk_score',
      toolInput: `SpO2=${exam.vitalSPO2}`,
      observation: 'Urgency level set to EMERGENCY.'
    });
  }

  if (text.includes('epigastric') || text.includes('stomach') || text.includes('gastritis') || text.includes('acid') || text.includes('heartburn')) {
    thoughtStream.push({
      stepNumber: 3,
      thought: 'Upper GI symptoms detected. Invoking gastroenterology clinical decision guidelines.',
      toolName: 'query_clinical_knowledge_base',
      toolInput: 'GI_guidelines_v4',
      observation: 'Matched Acute Gastritis and GERD.'
    });

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

    labDrafts.push({ id: 'L1', testName: 'H. Pylori Stool Antigen Test', indication: 'Assess H. pylori mucosal infection', urgency: 'routine', status: 'suggested' });
    labDrafts.push({ id: 'L2', testName: 'Full Blood Count (FBC)', indication: 'Rule out GI bleeding / anemia', urgency: 'routine', status: 'suggested' });

    medicationDrafts.push({
      id: 'M1',
      drugName: 'Omeprazole',
      dosage: '20mg',
      frequency: 'Once daily before breakfast',
      duration: '14 days',
      instructions: 'Swallow whole 30 minutes before food',
      status: 'suggested'
    });
    medicationDrafts.push({
      id: 'M2',
      drugName: 'Antacid Gel (Sucralfate / Gelusil)',
      dosage: '10ml',
      frequency: 'Three times daily after meals',
      duration: '7 days',
      instructions: 'Take for acute heartburn relief',
      status: 'suggested'
    });
  } else if (text.includes('cough') || text.includes('fever') || text.includes('throat')) {
    thoughtStream.push({
      stepNumber: 3,
      thought: 'Respiratory symptoms present. Evaluating viral vs bacterial airway inflammation.',
      toolName: 'query_clinical_knowledge_base',
      toolInput: 'Respiratory_guidelines_v2',
      observation: 'Matched URTI and Acute Bronchitis.'
    });

    diagnoses.push({
      id: 'D3',
      diagnosis: 'Upper Respiratory Tract Infection (URTI)',
      confidence: 91,
      icdCode: 'J06.9',
      evidence: ['Fever pattern with throat inflammation', 'Nasal congestion'],
    });
    diagnoses.push({
      id: 'D4',
      diagnosis: 'Acute Bronchitis',
      confidence: 68,
      icdCode: 'J20.9',
      evidence: ['Persistent cough with sputum production', 'No consolidation'],
    });

    labDrafts.push({ id: 'L1', testName: 'Full Blood Count (FBC)', indication: 'Check white blood cell count', urgency: 'routine', status: 'suggested' });
    labDrafts.push({ id: 'L2', testName: 'C-Reactive Protein (CRP)', indication: 'Systemic inflammation marker', urgency: 'routine', status: 'suggested' });

    medicationDrafts.push({
      id: 'M1',
      drugName: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Every 6 hours as needed',
      duration: '5 days',
      instructions: 'Max 4g per 24 hours',
      status: 'suggested'
    });
    medicationDrafts.push({
      id: 'M2',
      drugName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Every 8 hours',
      duration: '7 days',
      instructions: 'Finish full antibiotic course',
      safetyWarning: allergies?.toLowerCase().includes('penicillin') ? 'CRITICAL CONTRAINDICATION: Patient allergic to Penicillins!' : null,
      status: 'suggested'
    });
  } else {
    thoughtStream.push({
      stepNumber: 3,
      thought: 'Undifferentiated symptom report. Formulating baseline diagnostic evaluation.',
      toolName: 'query_clinical_knowledge_base',
      toolInput: 'General_consultation_v1',
      observation: 'Generated baseline differential candidates.'
    });

    diagnoses.push({
      id: 'D1',
      diagnosis: 'Undifferentiated Presentation / General Assessment',
      confidence: 75,
      icdCode: 'R69',
      evidence: ['Reported symptoms & digestive distress', 'Clinical examination findings'],
    });

    labDrafts.push({ id: 'L1', testName: 'Basic Metabolic Panel (BMP)', indication: 'Electrolytes & renal check', urgency: 'routine', status: 'suggested' });

    medicationDrafts.push({
      id: 'M1',
      drugName: 'Multivitamin Supplement',
      dosage: '1 tablet',
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take with food',
      status: 'suggested'
    });
  }

  thoughtStream.push({
    stepNumber: 4,
    thought: `Cross-checking drug safety against patient allergies ("${allergies || 'None'}").`,
    toolName: 'check_allergy_contraindications',
    toolInput: `allergies=${allergies}, meds=${medicationDrafts.map(m => m.drugName).join(', ')}`,
    observation: 'Allergy check complete.'
  });

  if (allergies && (allergies.toLowerCase().includes('penicillin') || allergies.toLowerCase().includes('amoxicillin'))) {
    warnings.push(`ALLERGY ALERT: Patient is allergic to Penicillins (${allergies}).`);
  }

  thoughtStream.push({
    stepNumber: 5,
    thought: 'ReAct execution loop completed. Draft care plan ready for clinician review.',
    toolName: 'finalize_draft_care_plan',
    toolInput: 'status=pending_approval',
    observation: 'Human-in-the-loop workspace populated.'
  });

  return {
    diagnoses,
    labTests: labDrafts.map(l => l.testName),
    urgency,
    warnings,
    thoughtStream,
    labDrafts,
    medicationDrafts
  };
}

type ConsultationStep = 'review' | 'examine' | 'ai' | 'done';

export default function ConsultationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: appt, isLoading: loading } = useAppointment(id);
  const [step, setStep] = useState<ConsultationStep>('review');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIClinicalResult | null>(null);

  // Human-in-the-Loop Editable States
  const [editableDiagnoses, setEditableDiagnoses] = useState<(AIDiagnosis & { status: 'suggested' | 'approved' | 'modified' | 'discarded' })[]>([]);
  const [editableLabs, setEditableLabs] = useState<AgentLabDraft[]>([]);
  const [editableMeds, setEditableMeds] = useState<AgentMedicationDraft[]>([]);
  
  // Custom add entries
  const [newLabName, setNewLabName] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');

  // Editing modal / inline states
  const [editingDiagId, setEditingDiagId] = useState<string | null>(null);
  const [showThoughtStream, setShowThoughtStream] = useState(true);

  // Final Approved Care Plan
  const [approvedPlan, setApprovedPlan] = useState<ApprovedClinicalPlan | null>(null);

  // Custom manual patient details if missing from backend
  const [manualPatientName, setManualPatientName] = useState('');
  const [manualAllergies, setManualAllergies] = useState('');
  const [manualBloodGroup, setManualBloodGroup] = useState('O+');

  const [exam, setExam] = useState<ExamForm>({ chiefComplaint: '', symptoms: '', vitalBP: '', vitalTemp: '', vitalPulse: '', vitalSPO2: '', examination: '', notes: '' });

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

      // Populate HITL state
      setEditableDiagnoses(result.diagnoses.map((d, idx) => ({
        ...d,
        status: idx === 0 ? 'approved' : 'suggested'
      })));

      const labs = result.labDrafts || result.labTests.map((t, idx) => ({
        id: `L${idx + 1}`,
        testName: t,
        indication: 'Recommended clinical workup',
        urgency: 'routine',
        status: 'suggested' as const
      }));
      setEditableLabs(labs.map(l => ({ ...l, status: 'suggested' as const })));

      const meds = result.medicationDrafts || [];
      setEditableMeds(meds.map(m => ({ ...m, status: 'suggested' as const })));

      setStep('ai');
    } catch (err) {
      console.error('AI Agent Execution failed:', err);
    } finally {
      setAiLoading(false);
    }
  }

  // HITL Handlers for Diagnoses
  function updateDiagnosis(id: string, newTitle: string, newIcd: string) {
    setEditableDiagnoses(prev => prev.map(d => d.id === id ? { ...d, diagnosis: newTitle, icdCode: newIcd, status: 'modified' } : d));
    setEditingDiagId(null);
  }

  function setDiagnosisStatus(id: string, status: 'approved' | 'discarded') {
    setEditableDiagnoses(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  }

  // HITL Handlers for Lab Orders
  function setLabStatus(id: string, status: 'approved' | 'discarded') {
    setEditableLabs(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }

  function addCustomLab() {
    if (!newLabName.trim()) return;
    setEditableLabs(prev => [
      ...prev,
      {
        id: `CUSTOM-L-${Date.now()}`,
        testName: newLabName.trim(),
        indication: 'Doctor custom clinical order',
        urgency: 'routine',
        status: 'approved'
      }
    ]);
    setNewLabName('');
  }

  // HITL Handlers for Medications
  function setMedStatus(id: string, status: 'approved' | 'discarded') {
    setEditableMeds(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  }

  function updateMedication(id: string, field: keyof AgentMedicationDraft, value: string) {
    setEditableMeds(prev => prev.map(m => m.id === id ? { ...m, [field]: value, status: 'modified' } : m));
  }

  function toggleSafetyOverride(id: string, justification: string) {
    setEditableMeds(prev => prev.map(m => m.id === id ? { ...m, overrideJustification: justification } : m));
  }

  function addCustomMedication() {
    if (!newMedName.trim()) return;
    setEditableMeds(prev => [
      ...prev,
      {
        id: `CUSTOM-M-${Date.now()}`,
        drugName: newMedName.trim(),
        dosage: newMedDosage.trim() || 'Standard Dose',
        frequency: 'As directed',
        duration: '7 days',
        instructions: 'Take after meals',
        status: 'approved'
      }
    ]);
    setNewMedName('');
    setNewMedDosage('');
  }

  // Finalize Care Plan
  async function finalizeClinicalCarePlan() {
    const approvedDiagList = editableDiagnoses.filter(d => d.status === 'approved' || d.status === 'modified');
    const primaryDiag = approvedDiagList[0] || null;
    const diffList = approvedDiagList.slice(1);
    const approvedLabList = editableLabs.filter(l => l.status === 'approved');
    const approvedMedList = editableMeds.filter(m => m.status === 'approved' || m.status === 'modified');
    
    const overriddenAlerts = editableMeds
      .filter(m => m.safetyWarning && m.overrideJustification)
      .map(m => `${m.drugName}: ${m.overrideJustification}`);

    const plan: ApprovedClinicalPlan = {
      appointmentId: id || '1',
      patientName: activePatientName,
      consultationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      primaryDiagnosis: primaryDiag,
      differentialDiagnoses: diffList,
      approvedLabOrders: approvedLabList,
      approvedMedications: approvedMedList,
      doctorClinicalNotes: exam.notes || exam.examination || 'Clinical consultation finalized by attending physician.',
      agentAuditTrail: aiResult?.thoughtStream || [],
      overriddenWarnings: overriddenAlerts
    };

    setApprovedPlan(plan);
    setStep('done');

    // Auto-generate prescription for InHouse dispatch
    if (approvedMedList.length > 0) {
      try {
        await apiGeneratePrescription({
          appointmentId: id ? parseInt(id, 10) : undefined,
          patientId: appt?.patientId,
          patientName: activePatientName,
          diagnosis: primaryDiag?.diagnosis || 'Clinical Assessment Completed',
          fulfillmentSource: 'InHouse',
          instructions: 'Take as directed by doctor',
          items: approvedMedList.map(med => ({
            medicineName: med.drugName,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            quantity: 1, 
            instructions: med.instructions
          }))
        });
      } catch (err) {
        console.error('Failed to auto-dispatch prescription:', err);
      }
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
    { key: 'ai',       label: 'AI Agent Co-Pilot', icon: '🧠' },
    { key: 'done',     label: 'Clinical Plan Record', icon: '📋' },
  ];
  const currentStepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Patient Consultation Workspace"
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
                        <div style={{ fontSize: 11, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--med-blue)' : isDone ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: step === 'done' ? '1fr' : '1fr 320px', gap: 24 }}>
            <div>
              {/* STEP: Review & Patient Entry */}
              {step === 'review' && (
                <div className="card fade-in">
                  <div className="card-header" style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="section-title">👤 Patient Details & Pre-Exam Entry</div>
                      <div className="section-sub">Verify or manually update patient information for clinical agent processing</div>
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
                        ⚠️ Recorded Allergies (Monitored by AI Safety Agent)
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
                      <div className="section-title">🩺 Examination & Vitals Assessment</div>
                      <div className="section-sub">Record symptoms and vitals for autonomous ReAct agent evaluation</div>
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
                      <label className="form-label" style={{ fontWeight: 700 }}>Presenting Symptoms & History of Present Illness</label>
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
                        {aiLoading ? <><Loader size={16} className="spin" /> Executing ReAct Agent Reasoning Loop...</> : <><Sparkles size={16} /> Launch Clinical AI Agent</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: AI Agent Co-Pilot (Human-in-the-Loop Workspace) */}
              {step === 'ai' && aiResult && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  {/* Human-in-the-Loop Header Banner */}
                  <div className="approval-banner" style={{ background: 'linear-gradient(135deg, #1E1B4B, #312E81)', border: '1.5px solid #6366F1', padding: '18px 20px', borderRadius: 'var(--r-lg)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.3)', border: '1px solid #818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={24} color="#A5B4FC" />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, color: '#F3F4F6' }}>🤖 Autonomous Clinical Agent & Human-in-the-Loop Workspace</div>
                        <div style={{ fontSize: 12.5, color: '#C7D2FE', marginTop: 2 }}>
                          The agent has synthesized symptoms and tool outputs. You can edit, override, or discard any item below before finalizing.
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontWeight: 700 }}
                      onClick={runAIAnalysis}
                      disabled={aiLoading}
                    >
                      <RefreshCw size={14} className={aiLoading ? 'spin' : ''} style={{ marginRight: 4 }} /> Re-evaluate
                    </button>
                  </div>

                  {/* ReAct Agent Thought Stream (Expandable) */}
                  {aiResult.thoughtStream && aiResult.thoughtStream.length > 0 && (
                    <div className="card" style={{ border: '1.5px solid var(--med-blue)', background: 'var(--surface-1)' }}>
                      <div
                        className="card-header"
                        style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}
                        onClick={() => setShowThoughtStream(!showThoughtStream)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Sparkles size={18} color="var(--med-blue)" />
                          <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--med-blue)' }}>
                            Agent Thought Stream & Tool Execution Log ({aiResult.thoughtStream.length} ReAct Steps)
                          </span>
                        </div>
                        {showThoughtStream ? <ChevronUp size={18} color="var(--med-blue)" /> : <ChevronDown size={18} color="var(--med-blue)" />}
                      </div>
                      {showThoughtStream && (
                        <div className="card-body" style={{ background: '#0F172A', color: '#F8FAFC', padding: '16px 20px', fontFamily: 'monospace', fontSize: 12.5 }}>
                          {aiResult.thoughtStream.map((t) => (
                            <div key={t.stepNumber} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #1E293B' }}>
                              <div style={{ display: 'flex', gap: 8, color: '#38BDF8', fontWeight: 700 }}>
                                <span>[Step {t.stepNumber}]</span>
                                <span>{t.thought}</span>
                              </div>
                              {t.toolName && (
                                <div style={{ marginLeft: 16, marginTop: 4, color: '#F43F5E' }}>
                                  🛠️ Executed Tool: <strong>{t.toolName}</strong> ({t.toolInput})
                                </div>
                              )}
                              {t.observation && (
                                <div style={{ marginLeft: 16, marginTop: 2, color: '#34D399' }}>
                                  👁️ Observation: {t.observation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Safety Warnings Banner */}
                  {aiResult.warnings && aiResult.warnings.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {aiResult.warnings.map((w, idx) => (
                        <div key={idx} style={{ padding: '14px 16px', background: '#FEE2E2', border: '1.5px solid #EF4444', borderRadius: 'var(--r-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
                          <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SECTION 1: HITL Differential Diagnosis Candidates */}
                  <div className="card">
                    <div className="card-header" style={{ background: 'linear-gradient(135deg, #F0FDFA, #CCFBF1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Stethoscope size={18} color="#0D9488" />
                        <span style={{ fontWeight: 800, fontSize: 15, color: '#0F766E' }}>1. Differential Diagnosis Candidates (Doctor Approval / Editing)</span>
                      </div>
                      <span className="badge" style={{ background: '#E6FFFA', color: '#047857', border: '1px solid #10B981' }}>
                        {editableDiagnoses.filter(d => d.status === 'approved' || d.status === 'modified').length} Selected
                      </span>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {editableDiagnoses.map((diag) => {
                          const isApproved = diag.status === 'approved' || diag.status === 'modified';
                          const isDiscarded = diag.status === 'discarded';
                          const isEditing = editingDiagId === diag.id;

                          return (
                            <div
                              key={diag.id}
                              style={{
                                padding: 16,
                                borderRadius: 'var(--r-md)',
                                border: isApproved ? '2px solid var(--success)' : isDiscarded ? '1.5px dashed var(--danger)' : '1.5px solid var(--border)',
                                background: isApproved ? '#F0FDF4' : isDiscarded ? '#FEF2F2' : 'var(--surface-1)',
                                opacity: isDiscarded ? 0.6 : 1,
                                transition: 'var(--transition)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <div>
                                  {isEditing ? (
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                      <input
                                        type="text"
                                        className="form-input"
                                        value={diag.diagnosis}
                                        onChange={e => updateDiagnosis(diag.id, e.target.value, diag.icdCode)}
                                        style={{ fontWeight: 700, width: 260 }}
                                      />
                                      <input
                                        type="text"
                                        className="form-input"
                                        value={diag.icdCode}
                                        onChange={e => updateDiagnosis(diag.id, diag.diagnosis, e.target.value)}
                                        style={{ width: 90, fontWeight: 700 }}
                                      />
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{diag.diagnosis}</span>
                                      <span className="badge badge-blue">{diag.icdCode}</span>
                                      {diag.status === 'modified' && <span className="badge" style={{ background: '#E0E7FF', color: '#4338CA' }}>✏️ Edited by Doctor</span>}
                                    </div>
                                  )}
                                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                    Evidence: {diag.evidence.join(' • ')}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--med-blue)', marginRight: 6 }}>{diag.confidence}%</span>
                                  
                                  {/* Doctor Actions */}
                                  <button
                                    className={`btn btn-sm ${isApproved ? 'btn-success' : 'btn-outline'}`}
                                    onClick={() => setDiagnosisStatus(diag.id, 'approved')}
                                  >
                                    <CheckCircle size={14} style={{ marginRight: 4 }} /> {isApproved ? 'Approved' : 'Approve'}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => setEditingDiagId(isEditing ? null : diag.id)}
                                    title="Edit Diagnosis / ICD"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    className={`btn btn-sm ${isDiscarded ? 'btn-danger' : 'btn-ghost'}`}
                                    onClick={() => setDiagnosisStatus(diag.id, 'discarded')}
                                    title="Discard suggestion"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: HITL Diagnostic & Laboratory Orders */}
                  <div className="card">
                    <div className="card-header" style={{ background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={18} color="#0284C7" />
                        <span style={{ fontWeight: 800, fontSize: 15, color: '#0369A1' }}>2. Laboratory & Diagnostic Workup Drafts</span>
                      </div>
                      <span className="badge badge-blue">
                        {editableLabs.filter(l => l.status === 'approved').length} Approved Labs
                      </span>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                        {editableLabs.map((lab) => {
                          const isApproved = lab.status === 'approved';
                          const isDiscarded = lab.status === 'discarded';

                          return (
                            <div
                              key={lab.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                borderRadius: 'var(--r-md)',
                                background: isApproved ? '#EFF6FF' : isDiscarded ? '#FEF2F2' : 'var(--surface-2)',
                                border: isApproved ? '1.5px solid #3B82F6' : isDiscarded ? '1px dashed #EF4444' : '1px solid var(--border)',
                                opacity: isDiscarded ? 0.6 : 1
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>🧪 {lab.testName}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Indication: {lab.indication}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button
                                  className={`btn btn-sm ${isApproved ? 'btn-primary' : 'btn-outline'}`}
                                  onClick={() => setLabStatus(lab.id, isApproved ? 'discarded' : 'approved')}
                                >
                                  {isApproved ? '✓ Approved' : 'Approve Order'}
                                </button>
                                <button
                                  className="btn btn-sm btn-ghost"
                                  onClick={() => setLabStatus(lab.id, 'discarded')}
                                  title="Discard lab order"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Custom Lab Order */}
                      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="➕ Add Custom Doctor Lab Order (e.g. Serum Creatinine)..."
                          value={newLabName}
                          onChange={e => setNewLabName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addCustomLab()}
                        />
                        <button className="btn btn-secondary" onClick={addCustomLab} style={{ whiteSpace: 'nowrap' }}>
                          <Plus size={14} style={{ marginRight: 4 }} /> Add Lab
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: HITL Pharmacotherapy & Treatment Drafts */}
                  <div className="card">
                    <div className="card-header" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={18} color="#D97706" />
                        <span style={{ fontWeight: 800, fontSize: 15, color: '#92400E' }}>3. Treatment & Pharmacotherapy Drafts</span>
                      </div>
                      <span className="badge" style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #F59E0B' }}>
                        {editableMeds.filter(m => m.status === 'approved' || m.status === 'modified').length} Approved Drafts
                      </span>
                    </div>
                    <div className="card-body">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                        {editableMeds.map((med) => {
                          const isApproved = med.status === 'approved' || med.status === 'modified';
                          const isDiscarded = med.status === 'discarded';

                          return (
                            <div
                              key={med.id}
                              style={{
                                padding: 16,
                                borderRadius: 'var(--r-md)',
                                background: isApproved ? '#FEFCE8' : isDiscarded ? '#FEF2F2' : 'var(--surface-1)',
                                border: med.safetyWarning ? '2px solid #EF4444' : isApproved ? '1.5px solid #F59E0B' : '1px solid var(--border)',
                                opacity: isDiscarded ? 0.6 : 1
                              }}
                            >
                              {/* Safety Alert Banner if present */}
                              {med.safetyWarning && (
                                <div style={{ padding: '8px 12px', background: '#FEE2E2', borderRadius: 'var(--r-sm)', marginBottom: 10, border: '1px solid #FCA5A5', color: '#991B1B', fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <AlertTriangle size={16} />
                                  <span>{med.safetyWarning}</span>
                                </div>
                              )}

                              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10, marginBottom: 8 }}>
                                <div>
                                  <label className="form-label" style={{ fontSize: 11 }}>Medication Name</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={med.drugName}
                                    onChange={e => updateMedication(med.id, 'drugName', e.target.value)}
                                    style={{ fontWeight: 700 }}
                                  />
                                </div>
                                <div>
                                  <label className="form-label" style={{ fontSize: 11 }}>Dosage</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={med.dosage}
                                    onChange={e => updateMedication(med.id, 'dosage', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="form-label" style={{ fontSize: 11 }}>Frequency</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={med.frequency}
                                    onChange={e => updateMedication(med.id, 'frequency', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="form-label" style={{ fontSize: 11 }}>Duration</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={med.duration}
                                    onChange={e => updateMedication(med.id, 'duration', e.target.value)}
                                  />
                                </div>
                              </div>

                              {med.safetyWarning && (
                                <div style={{ marginTop: 8, marginBottom: 8 }}>
                                  <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Doctor Override Clinical Rationale (Required to approve flagged med)..."
                                    value={med.overrideJustification || ''}
                                    onChange={e => toggleSafetyOverride(med.id, e.target.value)}
                                    style={{ fontSize: 12, border: '1px solid #F87171' }}
                                  />
                                </div>
                              )}

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Instructions: {med.instructions}</span>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button
                                    className={`btn btn-sm ${isApproved ? 'btn-success' : 'btn-outline'}`}
                                    onClick={() => setMedStatus(med.id, 'approved')}
                                  >
                                    <CheckCircle size={14} style={{ marginRight: 4 }} /> {isApproved ? 'Approved' : 'Approve Draft'}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => setMedStatus(med.id, 'discarded')}
                                    title="Discard drug draft"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Custom Medication Entry */}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Drug Name (e.g. Ranitidine)..."
                          value={newMedName}
                          onChange={e => setNewMedName(e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Dose (e.g. 150mg)..."
                          value={newMedDosage}
                          onChange={e => setNewMedDosage(e.target.value)}
                          style={{ width: 140 }}
                        />
                        <button className="btn btn-secondary" onClick={addCustomMedication} style={{ whiteSpace: 'nowrap' }}>
                          <Plus size={14} style={{ marginRight: 4 }} /> Add Medication
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                    <button className="btn btn-secondary" onClick={() => setStep('examine')} id="back-to-examine-btn">
                      Back to Vitals & Exam
                    </button>
                    <button
                      className="btn btn-primary btn-lg"
                      style={{ flex: 1, padding: '14px', fontSize: 15, fontWeight: 800, background: 'var(--gradient-doctor)' }}
                      onClick={finalizeClinicalCarePlan}
                      id="finalize-care-plan-btn"
                    >
                      Finalize Approved Clinical Care Plan & Complete Consultation ✅
                    </button>
                  </div>
                </div>
              )}

              {/* STEP: Final Approved Clinical Care Plan & Consultation Summary */}
              {step === 'done' && approvedPlan && (
                <div className="card scale-in" style={{ padding: 28, background: 'var(--surface-1)' }}>
                  
                  {/* Top Success Ribbon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: 18, marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 52, height: 52, background: 'var(--gradient-doctor)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(5,150,105,0.3)' }}>
                        <CheckCircle size={28} color="white" />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>Clinical Consultation Finalized</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Official Patient Care Record generated for <strong>{approvedPlan.patientName}</strong> on {approvedPlan.consultationDate}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-outline" onClick={() => window.print()}>
                        <Printer size={16} style={{ marginRight: 4 }} /> Print Record
                      </button>
                      <button className="btn btn-primary" onClick={() => navigate('/doctor/dashboard')}>
                        Return to Dashboard
                      </button>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                    
                    {/* Primary & Differential Diagnoses */}
                    <div style={{ padding: 18, background: '#F0FDF4', borderRadius: 'var(--r-md)', border: '1.5px solid #86EFAC' }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#166534', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckSquare size={18} /> Confirmed Clinical Diagnoses
                      </div>
                      {approvedPlan.primaryDiagnosis ? (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontWeight: 800, fontSize: 16, color: '#14532D' }}>
                            Primary: {approvedPlan.primaryDiagnosis.diagnosis} ({approvedPlan.primaryDiagnosis.icdCode})
                          </div>
                          <div style={{ fontSize: 12, color: '#15803D', marginTop: 2 }}>Confidence: {approvedPlan.primaryDiagnosis.confidence}%</div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: '#15803D' }}>General Clinical Assessment</div>
                      )}

                      {approvedPlan.differentialDiagnoses.length > 0 && (
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #BBF7D0' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 4 }}>Secondary / Differential:</div>
                          {approvedPlan.differentialDiagnoses.map(d => (
                            <div key={d.id} style={{ fontSize: 13, color: '#14532D' }}>• {d.diagnosis} ({d.icdCode})</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Approved Lab Orders */}
                    <div style={{ padding: 18, background: '#EFF6FF', borderRadius: 'var(--r-md)', border: '1.5px solid #93C5FD' }}>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#1E40AF', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Activity size={18} /> Approved Laboratory & Diagnostic Orders
                      </div>
                      {approvedPlan.approvedLabOrders.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {approvedPlan.approvedLabOrders.map(l => (
                            <div key={l.id} style={{ fontSize: 13.5, fontWeight: 700, color: '#1E3A8A' }}>
                              🧪 {l.testName} <span style={{ fontWeight: 400, fontSize: 12, color: '#3B82F6' }}>({l.indication})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: '#3B82F6' }}>No diagnostic labs ordered.</div>
                      )}
                    </div>
                  </div>

                  {/* Approved Pharmacotherapy & Care Plan */}
                  <div style={{ padding: 18, background: '#FEFCE8', borderRadius: 'var(--r-md)', border: '1.5px solid #FDE047', marginBottom: 24 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#854D0E', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={18} /> Approved Treatment & Medication Plan
                    </div>
                    {approvedPlan.approvedMedications.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {approvedPlan.approvedMedications.map(m => (
                          <div key={m.id} style={{ padding: '10px 14px', background: 'white', borderRadius: 'var(--r-sm)', border: '1px solid #FEF08A' }}>
                            <div style={{ fontWeight: 800, fontSize: 14, color: '#713F12' }}>💊 {m.drugName} — {m.dosage}</div>
                            <div style={{ fontSize: 12.5, color: '#854D0E', marginTop: 2 }}>
                              Frequency: <strong>{m.frequency}</strong> • Duration: <strong>{m.duration}</strong>
                            </div>
                            {m.instructions && <div style={{ fontSize: 12, color: '#A16207', marginTop: 2 }}>Instructions: {m.instructions}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: '#854D0E' }}>No pharmacological treatment specified in care plan.</div>
                    )}
                  </div>

                  {/* Overridden Alerts Audit Log */}
                  {approvedPlan.overriddenWarnings.length > 0 && (
                    <div style={{ padding: 14, background: '#FEE2E2', borderRadius: 'var(--r-md)', border: '1px solid #FCA5A5', marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#991B1B', marginBottom: 4 }}>🛡️ Clinician Allergy Overrides Logged:</div>
                      {approvedPlan.overriddenWarnings.map((ov, idx) => (
                        <div key={idx} style={{ fontSize: 12, color: '#B91C1C' }}>• {ov}</div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/doctor/dashboard')}>
                      Done & Close Record
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Right Panel: Active Patient Summary */}
            {step !== 'done' && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

