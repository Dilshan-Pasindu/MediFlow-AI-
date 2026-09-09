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
}
