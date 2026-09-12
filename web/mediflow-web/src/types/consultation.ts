export interface ExamForm {
  chiefComplaint: string;
  symptoms: string;
  vitalBP: string;
  vitalTemp: string;
  vitalPulse: string;
  vitalSPO2: string;
  examination: string;
  notes: string;
}

export interface MedicineEntry {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
}

export interface AIDiagnosis {
  id: string;
  diagnosis: string;
  confidence: number;
  icdCode: string;
  evidence: string[];
}

export interface AgentThoughtStep {
  stepNumber: number;
  thought: string;
  toolName?: string;
  toolInput?: string;
  observation?: string;
}

export interface AgentLabDraft {
  id: string;
  testName: string;
  indication: string;
  urgency: string;
  status?: 'suggested' | 'approved' | 'modified' | 'discarded';
}

export interface AgentMedicationDraft {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  safetyWarning?: string | null;
  status?: 'suggested' | 'approved' | 'modified' | 'discarded';
  overrideJustification?: string;
}

export interface AIClinicalResult {
  diagnoses: AIDiagnosis[];
  labTests: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  warnings?: string[];
  thoughtStream?: AgentThoughtStep[];
  labDrafts?: AgentLabDraft[];
  medicationDrafts?: AgentMedicationDraft[];
}

export type DiagnosisDecision = 'accept' | 'modify' | 'reject' | null;

export interface ApprovedClinicalPlan {
  appointmentId: string | number;
  patientName: string;
  consultationDate: string;
  primaryDiagnosis: AIDiagnosis | null;
  differentialDiagnoses: AIDiagnosis[];
  approvedLabOrders: AgentLabDraft[];
  approvedMedications: AgentMedicationDraft[];
  doctorClinicalNotes: string;
  agentAuditTrail: AgentThoughtStep[];
  overriddenWarnings: string[];
}


export interface AIRecommendation {
  specialty: string;
  confidence: number;
  alt: string;
  altConf: number;
  reason: string;
}

export interface ConsultationAppointment {
  id: number;
  patientId?: number;
  patientName: string;
  patientBloodGroup?: string;
  patientAllergies?: string;
  appointmentNumber: string;
  appointmentDateTime: string;
  notes?: string;
  status: string;
  doctorName?: string;
  specialtyName?: string;
  fee?: number;
}

export interface ClinicalAnalysisRequestDto {
  symptoms: string;
  chiefComplaint?: string;
  vitals?: {
    bp?: string;
    temp?: string;
    pulse?: string;
    spo2?: string;
  };
  patientAllergies?: string;
  patientAge?: number;
  patientGender?: string;
}
