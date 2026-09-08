import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import type { User, UserRole } from '../types/auth';

// ─── Token & Session ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem('mediflow_token');
}

export function setToken(t: string): void {
  localStorage.setItem('mediflow_token', t);
}

export function removeToken(): void {
  useAuthStore.getState().logout();
}

export function getUser(): User | null {
  const r = localStorage.getItem('mediflow_user');
  return r ? JSON.parse(r) : null;
}

export function setUser(u: User): void {
  useAuthStore.getState().setUser(u);
}

// ─── Base Fetch Wrapper (using Axios underneath) ──────────────────────────────

async function apiFetch<T = any>(endpoint: string, options: { method?: string; body?: string; headers?: Record<string, string> } = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const data = options.body ? JSON.parse(options.body) : undefined;
  
  const res = await apiClient.request<T>({
    url: endpoint,
    method,
    data,
    headers: options.headers,
  });

  return res.data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string) {
  const data = await apiFetch<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  useAuthStore.getState().setAuth(data);
  return data;
}

export async function apiRegister(fullName: string, email: string, password: string, phoneNumber: string, role: UserRole = 'Patient') {
  const data = await apiFetch<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, phoneNumber, role }),
  });
  useAuthStore.getState().setAuth(data);
  return data;
}

export function apiLogout() {
  useAuthStore.getState().logout();
}

// ─── Doctors & Specialties ───────────────────────────────────────────────────

export async function apiGetDoctors(specialtyId?: number, search?: string) {
  const params = new URLSearchParams();
  if (specialtyId) params.append('specialtyId', specialtyId.toString());
  if (search)      params.append('search', search);
  const q = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<any[]>(`/doctors${q}`);
}

export async function apiGetSpecialties() {
  return apiFetch<any[]>('/doctors/specialties');
}

export async function apiGetDoctorById(id: number) {
  return apiFetch<any>(`/doctors/${id}`);
}

// ─── Appointments (Patient) ───────────────────────────────────────────────────

export async function apiBookAppointment(doctorId: number, dateTime: string, notes?: string) {
  return apiFetch<any>('/appointments', {
    method: 'POST',
    body: JSON.stringify({ doctorId, dateTime, notes }),
  });
}

export async function apiGetMyAppointments() {
  return apiFetch<any[]>('/patient/appointments');
}

export async function apiGetAppointmentById(id: number) {
  return apiFetch<any>(`/appointments/${id}`);
}

export async function apiSubmitPayment(appointmentId: number, amount: number, paymentMethod = 'Card') {
  return apiFetch<any>(`/appointments/${appointmentId}/payment`, {
    method: 'POST',
    body: JSON.stringify({ amount, paymentMethod }),
  });
}

// ─── Receptionist ─────────────────────────────────────────────────────────────

export async function apiGetPendingAppointments() {
  return apiFetch<any[]>('/receptionist/appointments/pending');
}

export async function apiConfirmAppointment(appointmentId: number, appointmentNumber: string) {
  return apiFetch<any>(`/receptionist/appointments/${appointmentId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ appointmentNumber }),
  });
}

// ─── Doctor Consultation ──────────────────────────────────────────────────────

export async function apiGetDoctorAppointments() {
  return apiFetch<any[]>('/doctor/appointments');
}

export async function apiCompleteConsultation(appointmentId: number, diagnosis: string, prescriptionNotes: string, medicines: any[]) {
  return apiFetch<any>(`/doctor/consultations/${appointmentId}`, {
    method: 'POST',
    body: JSON.stringify({ diagnosis, prescriptionNotes, medicines }),
  });
}

// ─── Pharmacist ───────────────────────────────────────────────────────────────

export async function apiGetPrescriptions() {
  return apiFetch<any[]>('/pharmacist/prescriptions');
}

export async function apiGetInventory() {
  return apiFetch<any[]>('/pharmacist/inventory');
}

export async function apiCreateRestockOrder(medicineId: number, quantity: number, supplierId: number) {
  return apiFetch<any>('/pharmacist/restock-orders', {
    method: 'POST',
    body: JSON.stringify({ medicineId, quantity, supplierId }),
  });
}

// ─── Pharmacy Owner ───────────────────────────────────────────────────────────

export async function apiGetOwnerStats() {
  return apiFetch<any>('/pharmacyowner/stats');
}

// ─── Supplier ─────────────────────────────────────────────────────────────────

export async function apiGetSupplierOrders() {
  return apiFetch<any[]>('/supplier/orders');
}

export async function apiUpdateDeliveryStatus(orderId: number, status: string) {
  return apiFetch<any>(`/supplier/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function apiGetAdminStats() {
  return apiFetch<any>('/admin/stats');
}

export async function apiGetAdminUsers() {
  return apiFetch<any[]>('/admin/users');
}
