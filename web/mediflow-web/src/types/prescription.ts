export type PrescriptionStatus = 'Active' | 'Fulfilled' | 'Expired' | 'Cancelled';

export interface PrescriptionItem {
  medicineId: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}

export interface Prescription {
  id: number;
  appointmentId: number;
  appointmentNumber: string;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  itemCount?: number;
  instructions?: string;
  dateIssued: string;
  createdAt: string;
}

export interface CreatePrescriptionDto {
  appointmentId: number;
  doctorId: number;
  patientId: number;
  instructions?: string;
  items: Array<{
    medicineId: number;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }>;
}

