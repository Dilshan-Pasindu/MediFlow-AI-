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

// ─── Base Fetch Wrapper (backed by Axios client) ──────────────────────────────

async function apiFetch<T = any>(
  endpoint: string,
  options: { method?: string; body?: string; headers?: Record<string, string> } = {}
): Promise<T> {
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

// ─── Patient ──────────────────────────────────────────────────────────────────

export async function apiGetProfile() {
  return apiFetch('/patient/profile');
}

export async function apiUpdateProfile(data: any) {
  return apiFetch('/patient/profile', { method: 'PUT', body: JSON.stringify(data) });
}

export async function apiGetMyAppointments() {
  return apiFetch('/patient/appointments');
}

export async function apiSubmitSymptoms(symptoms: any) {
  return apiFetch('/patients/symptoms', { method: 'POST', body: JSON.stringify(symptoms) });
}

export async function apiGetMyPrescriptions() {
  return apiFetch('/prescriptions/my');
}

export async function apiGetMyOrders() {
  return apiFetch('/orders/my');
}

export async function apiRateDoctor(id: number | string, rating: number, comment?: string) {
  return apiFetch(`/doctors/${id}/ratings`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
}

export async function apiRatePharmacy(id: number | string, rating: number, comment?: string) {
  return apiFetch(`/pharmacies/${id}/ratings`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export async function apiGetDoctors(specialtyId?: number | string, search?: string) {
  const params = new URLSearchParams();
  if (specialtyId) params.append('specialtyId', specialtyId.toString());
  if (search) params.append('search', search);
  const qs = params.toString();
  return apiFetch(`/doctors${qs ? `?${qs}` : ''}`);
}

export async function apiGetDoctor(id: number | string) {
  return apiFetch(`/doctors/${id}`);
}

export async function apiGetDoctorById(id: number | string) {
  return apiGetDoctor(id);
}

export async function apiGetSpecialties() {
  return apiFetch('/doctors/specialties');
}

export async function apiGetDoctorAvailability(id: number | string) {
  return apiFetch(`/doctors/${id}/availability`);
}

export async function apiGetRankedDoctors(specialtyId?: number | string) {
  return apiFetch(`/doctors/ranked?specialty=${specialtyId || ''}`);
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function apiBookAppointment(doctorId: number | string, dateTime: string, notes?: string) {
  return apiFetch('/appointments', { method: 'POST', body: JSON.stringify({ doctorId, dateTime, notes }) });
}

export async function apiGetAppointment(id: number | string) {
  return apiFetch(`/appointments/${id}`);
}

export async function apiGetAppointmentById(id: number | string) {
  return apiGetAppointment(id);
}

export async function apiPayAppointment(id: number | string) {
  return apiFetch(`/appointments/${id}/pay`, { method: 'POST' });
}

export async function apiSubmitPayment(appointmentId: number | string, amount: number, paymentMethod = 'Card') {
  return apiFetch(`/appointments/${appointmentId}/payment`, {
    method: 'POST',
    body: JSON.stringify({ amount, paymentMethod }),
  });
}

// ─── Receptionist ─────────────────────────────────────────────────────────────

export async function apiGetPendingAppointments() {
  return apiFetch('/receptionist/appointments');
}

export async function apiVerifyPayment(id: number | string) {
  return apiFetch(`/receptionist/appointments/${id}/verify`, { method: 'POST' });
}

export async function apiGenerateAppointmentNumber(id: number | string) {
  return apiFetch(`/receptionist/appointments/${id}/generate-number`, { method: 'POST' });
}

export async function apiConfirmAppointment(appointmentId: number | string, appointmentNumber: string) {
  return apiFetch(`/receptionist/appointments/${appointmentId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ appointmentNumber }),
  });
}

export async function apiRescheduleAppointment(id: number | string, data: any) {
  return apiFetch(`/receptionist/appointments/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function apiCancelAppointment(id: number | string, reason: string) {
  return apiFetch(`/receptionist/appointments/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) });
}

// ─── Doctor Clinical ──────────────────────────────────────────────────────────

export async function apiGetDoctorAppointments() {
  return apiFetch('/doctors/appointments');
}

export async function apiStartConsultation(apptId: number | string) {
  return apiFetch('/consultations', { method: 'POST', body: JSON.stringify({ appointmentId: apptId }) });
}

export async function apiUpdateConsultation(id: number | string, data: any) {
  return apiFetch(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function apiGetConsultation(id: number | string) {
  return apiFetch(`/consultations/${id}`);
}

export async function apiCompleteConsultation(appointmentId: number | string, diagnosis: string, prescriptionNotes: string, medicines: any[]) {
  return apiFetch(`/doctor/consultations/${appointmentId}`, {
    method: 'POST',
    body: JSON.stringify({ diagnosis, prescriptionNotes, medicines }),
  });
}

export async function apiRequestClinicalAnalysis(data: any) {
  return apiFetch('/clinical-analysis', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiSubmitDoctorDecision(diagnosisId: number | string, decision: string, modifiedDiagnosis?: any) {
  return apiFetch(`/diagnosis/${diagnosisId}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision, modifiedDiagnosis }),
  });
}

export async function apiGetPatientHistory(appointmentId: number | string) {
  return apiFetch(`/appointments/${appointmentId}/patient-history`);
}

// ─── Medicines & Prescriptions ────────────────────────────────────────────────

export async function apiGetMedicines(search?: string) {
  return apiFetch(`/medicines${search ? `?search=${search}` : ''}`);
}

export async function apiCheckMedicineAvailability(pharmacyId: number | string, medicineIds: (number | string)[]) {
  return apiFetch(`/pharmacies/${pharmacyId}/medicine-availability?medicineIds=${medicineIds.join(',')}`);
}

export async function apiGeneratePrescription(data: any) {
  return apiFetch('/prescriptions', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiGetPrescription(id: number | string) {
  return apiFetch(`/prescriptions/${id}`);
}

export async function apiGetPrescriptions() {
  return apiFetch('/pharmacist/prescriptions');
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function apiCreateOrder(data: any) {
  return apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiGetOrder(id: number | string) {
  return apiFetch(`/orders/${id}`);
}

export async function apiPayOrder(id: number | string) {
  return apiFetch(`/orders/${id}/payment`, { method: 'POST' });
}

export async function apiUpdateOrderStatus(id: number | string, status: string) {
  return apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

export async function apiCalculateOrderPrice(id: number | string, pharmacyId: number | string) {
  return apiFetch(`/orders/${id}/calculate-price`, { method: 'POST', body: JSON.stringify({ pharmacyId }) });
}

// ─── Pharmacist ───────────────────────────────────────────────────────────────

export async function apiGetPharmacistPrescriptions() {
  return apiFetch('/pharmacist/prescriptions');
}

export async function apiGetPharmacistOrders() {
  return apiFetch('/pharmacist/orders');
}

// ─── Pharmacy Inventory ───────────────────────────────────────────────────────

export async function apiGetPharmacyInventory(pharmacyId: number | string) {
  return apiFetch(`/pharmacies/${pharmacyId}/inventory`);
}

export async function apiGetInventory() {
  return apiFetch('/pharmacist/inventory');
}

export async function apiGetLowStockItems() {
  return apiFetch('/inventory/low-stock');
}

export async function apiGenerateRestockRecommendations(pharmacyId: number | string) {
  return apiFetch(`/pharmacies/${pharmacyId}/generate-restock-recommendations`, { method: 'POST' });
}

export async function apiCreateRestockRequest(data: any) {
  return apiFetch('/restock-requests', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiCreateRestockOrder(medicineId: number | string, quantity: number, supplierId: number | string) {
  return apiFetch('/pharmacist/restock-orders', {
    method: 'POST',
    body: JSON.stringify({ medicineId, quantity, supplierId }),
  });
}

export async function apiGetRestockRequests() {
  return apiFetch('/restock-requests');
}

export async function apiUpdateRestockRequest(id: number | string, status: string) {
  return apiFetch(`/restock-requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
}

// ─── Pharmacy Owner ───────────────────────────────────────────────────────────

export async function apiGetOwnerStats() {
  return apiFetch('/pharmacyowner/stats');
}

// ─── Supplier ─────────────────────────────────────────────────────────────────

export async function apiApproveRestockRequest(supplierId: number | string, requestId: number | string) {
  return apiFetch(`/suppliers/${supplierId}/approve`, { method: 'POST', body: JSON.stringify({ requestId }) });
}

export async function apiGetSupplyHistory(supplierId: number | string) {
  return apiFetch(`/suppliers/${supplierId}/supply-history`);
}

export async function apiGetSupplierOrders() {
  return apiFetch('/supplier/orders');
}

export async function apiUpdateDeliveryStatus(orderId: number | string, status: string) {
  return apiFetch(`/supplier/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function apiGetAdminStats() {
  return apiFetch('/admin/stats');
}

export async function apiGetAdminUsers() {
  return apiFetch('/admin/users');
}

// ─── Nearby ───────────────────────────────────────────────────────────────────

export async function apiGetNearbyPharmacies(lat: number | string, lng: number | string) {
  return apiFetch(`/pharmacies/nearby?lat=${lat}&lng=${lng}`);
}

export async function apiGetPharmacyDetails(id: number | string) {
  return apiFetch(`/pharmacies/${id}`);
}
