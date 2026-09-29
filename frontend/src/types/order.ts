export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Dispensed'
  | 'Cancelled';

export interface OrderItem {
  id?: number;
  medicineId: number;
  medicineName: string;
  genericName?: string;
  dosage?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  prescriptionId?: number;
  patientId: number;
  patientName: string;
  pharmacyId: number;
  pharmacyName: string;
  appointmentNumber: string;
  doctorName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  isPaid?: boolean;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
  dispensedAt?: string;
}

export interface InvoiceLineItem {
  id: number;
  medicineId?: number;
  medicineName: string;
  dosage?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Invoice {
  id: number;
  medicineOrderId: number;
  invoiceNumber: string;
  issuedAt: string;
  totalAmount: number;
  isPaid: boolean;
  paymentStatus?: string;
  paidAt?: string;
  paymentMethod?: string;
  generatedByPharmacistId?: number;
  items: InvoiceLineItem[];
}

export interface CreateOrderDto {
  prescriptionId?: number;
  pharmacyId: number;
  items: Array<{
    medicineId: number;
    quantity: number;
    unitPrice?: number;
  }>;
  deliveryAddress?: string;
  notes?: string;
}

export interface RestockRequestDto {
  pharmacyId: number;
  medicineId: number;
  requestedQuantity: number;
  reason?: string;
  urgency?: 'Low' | 'Medium' | 'High';
}


