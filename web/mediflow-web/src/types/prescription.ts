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
  instructions?: string;
  dateIssued: string;
  createdAt: string;
}
