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

export interface AIClinicalResult {
  diagnoses: AIDiagnosis[];
  labTests: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
}

export type DiagnosisDecision = 'accept' | 'modify' | 'reject' | null;

export interface AIRecommendation {
  specialty: string;
  confidence: number;
  alt: string;
  altConf: number;
  reason: string;
}

export interface ConsultationAppointment {
  id: number;
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
  vitals?: Partial<ExamForm>;
  patientAge?: number;
  patientGender?: string;
  history?: string;
}

