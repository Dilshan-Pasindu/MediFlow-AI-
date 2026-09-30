import { apiClient } from '../api/client';

export interface PayHereCheckoutParams {
  merchantId: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  orderId: string;
  amount: string;
  currency: string;
  hash: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: string;
  appointmentId: number;
  sandboxCheckoutUrl: string;
}

export interface PaymentStatusResponse {
  appointmentId: number;
  appointmentStatus: string;
  payment?: {
    id: number;
    status: string;
    amount: number;
    currency: string;
    paidAt: string | null;
    providerOrderId: string;
    providerPaymentId: string | null;
  };
  refund?: {
    id: number;
    status: string;
    amount: number;
    refundReference: string;
    requestedAt: string;
    approvedAt: string | null;
    processingAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    rejectionReason: string | null;
  };
}

export interface RefundStatusResponse {
  appointmentId: number;
  appointmentNumber: string | null;
  doctorName: string;
  appointmentStatus: string;
  canRequestRefund: boolean;
  refund?: {
    id: number;
    refundReference: string;
    amount: number;
    currency: string;
    status: string;
    reason: string;
    additionalNotes?: string;
    requestedAt: string;
    approvedAt: string | null;
    processingAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    rejectionReason: string | null;
    expectedProcessingInfo?: string;
  };
}

// ── Payment API Functions ──────────────────────────────────────────────────────

export async function apiInitiatePayment(appointmentId: number | string): Promise<PayHereCheckoutParams> {
  const res = await apiClient.post<PayHereCheckoutParams>(`/payment/appointments/${appointmentId}/initiate`);
  return res.data;
}

export async function apiGetPaymentStatus(appointmentId: number | string): Promise<PaymentStatusResponse> {
  const res = await apiClient.get<PaymentStatusResponse>(`/payment/appointments/${appointmentId}/status`);
  return res.data;
}

export async function apiCancelAppointmentForRefund(appointmentId: number | string, reason: string) {
  const res = await apiClient.post(`/payment/appointments/${appointmentId}/cancel`, { reason });
  return res.data;
}

export async function apiRequestRefund(appointmentId: number | string, additionalNotes?: string) {
  const res = await apiClient.post(`/payment/appointments/${appointmentId}/refund/request`, {
    additionalNotes: additionalNotes ?? null,
  });
  return res.data;
}

export async function apiGetRefundStatus(appointmentId: number | string): Promise<RefundStatusResponse> {
  const res = await apiClient.get<RefundStatusResponse>(`/payment/appointments/${appointmentId}/refund`);
  return res.data;
}

// ── Receptionist API ──────────────────────────────────────────────────────────

export async function apiGetRefundRequests(status?: string) {
  const qs = status ? `?status=${status}` : '';
  const res = await apiClient.get(`/payment/refunds${qs}`);
  return res.data;
}

export async function apiApproveRefund(refundId: number | string, notes?: string) {
  const res = await apiClient.post(`/payment/refunds/${refundId}/approve`, { notes });
  return res.data;
}

export async function apiRejectRefund(refundId: number | string, reason: string, notes?: string) {
  const res = await apiClient.post(`/payment/refunds/${refundId}/reject`, { reason, notes });
  return res.data;
}

export async function apiReceptionistApproveAppointment(appointmentId: number | string) {
  const res = await apiClient.post(`/payment/appointments/${appointmentId}/receptionist-approve`);
  return res.data;
}

export async function apiReceptionistRejectAppointment(appointmentId: number | string, reason: string) {
  const res = await apiClient.post(`/payment/appointments/${appointmentId}/receptionist-reject`, { reason });
  return res.data;
}

// ── PayHere checkout form submission ──────────────────────────────────────────

/**
 * Opens the PayHere sandbox payment page by submitting a form.
 * This creates a hidden form, fills the PayHere fields, and submits it.
 * PayHere will redirect back to returnUrl on success or cancelUrl on cancel.
 */
export function openPayHereCheckout(params: PayHereCheckoutParams): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = params.sandboxCheckoutUrl;
  form.target = '_self'; // Same tab

  const fields: Record<string, string> = {
    merchant_id: params.merchantId,
    return_url: params.returnUrl,
    cancel_url: params.cancelUrl,
    notify_url: params.notifyUrl,
    order_id: params.orderId,
    items: params.items,
    currency: params.currency,
    amount: params.amount,
    first_name: params.firstName,
    last_name: params.lastName,
    email: params.email,
    phone: params.phone,
    address: params.address,
    city: params.city,
    country: params.country,
    hash: params.hash,
    platform: 'WEB',
  };

  for (const [key, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
