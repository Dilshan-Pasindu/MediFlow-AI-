export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Dispensed'
  | 'Cancelled';

export interface OrderItem {
  medicineId: number;
  medicineName: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  patientId: number;
  patientName: string;
  pharmacyId: number;
  pharmacyName: string;
  appointmentNumber: string;
  doctorName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
