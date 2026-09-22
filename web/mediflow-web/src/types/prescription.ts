export type PrescriptionStatus = 'Active' | 'Fulfilled' | 'Expired' | 'Cancelled';
export type FulfillmentSource = 'InHouse' | 'External';
export type RecipientTarget = 'Both' | 'PatientOnly';

export interface PrescriptionItem {
  medicineId?: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface WalkInPatientInfo {
  fullName: string;
  age?: number | string;
  gender?: string;
  phone?: string;
  address?: string;
}

export interface Prescription {
  id: number | string;
  appointmentId?: number | string;
  appointmentNumber?: string;
  patientId?: number;
  patientName: string;
  patientAge?: number | string;
  patientGender?: string;
  patientPhone?: string;
  isWalkIn?: boolean;
  doctorId: number | string;
  doctorName: string;
  doctorSpecialty?: string;
  doctorLicenseNo?: string;
  diagnosis?: string;
  status: PrescriptionStatus;
  fulfillmentSource: FulfillmentSource;
  recipients: RecipientTarget;
  items: PrescriptionItem[];
  itemCount?: number;
  instructions?: string;
  dateIssued: string;
  createdAt: string;
}

export interface CreatePrescriptionDto {
  appointmentId?: number;
  doctorId?: number | string;
  doctorName?: string;
  patientId?: number;
  isWalkIn?: boolean;
  walkInPatientDetails?: WalkInPatientInfo;
  patientName?: string;
  diagnosis?: string;
  fulfillmentSource: FulfillmentSource;
  recipients: RecipientTarget;
  instructions?: string;
  items: Array<{
    medicineId?: number;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
  }>;
  labOrders?: Array<{
    testName: string;
    indication: string;
    urgency: string;
  }>;
}

// ─── AI Medication Intelligence & Drug Interaction Types ──────────────────────

export interface DrugInteraction {
  drug_pair?: string[];
  drugPair?: string[];
  severity: 'High' | 'Moderate' | 'Low' | string;
  description: string;
  recommendation?: string;
  clinicalGuidance?: string;
}

export interface AlternativeDrug {
  original_drug?: string;
  originalDrug?: string;
  alternative_drug?: string;
  alternativeDrug?: string;
  reason: string;
  dosage_guidance?: string;
  dosageGuidance?: string;
  inStock?: boolean;
}

export interface MedicationCheckResult {
  safe_to_dispense: boolean;
  safeToDispense?: boolean;
  safety_score: number;
  safetyScore?: number;
  interactions: DrugInteraction[];
  allergy_warnings?: string[];
  allergyWarnings?: string[];
  dosage_warnings?: string[];
  dosageWarnings?: string[];
  out_of_stock_medications?: string[];
  outOfStockMedications?: string[];
  alternatives: AlternativeDrug[];
  summary: string;
}

export interface ScreenInteractionsResponse {
  result: MedicationCheckResult;
  warningLogIds: number[];
}

export interface DrugInteractionLog {
  id: number;
  prescriptionId: number;
  drugA: string;
  drugB?: string | null;
  warningType: string;
  severityLevel: 'High' | 'Moderate' | 'Low' | string;
  description: string;
  clinicalGuidance?: string | null;
  isAcknowledged?: boolean;
  acknowledgedAt?: string | null;
  pharmacistId?: number | null;
  pharmacistOverrideNote?: string | null;
  createdAt: string;
}

