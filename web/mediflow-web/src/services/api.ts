import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import type { User, UserRole, AuthResponse } from '../types/auth';
import type { ProfileForm } from '../types/profile';
import type { Order, CreateOrderDto, RestockRequestDto } from '../types/order';
import type { Prescription, CreatePrescriptionDto } from '../types/prescription';
import type { DoctorDetail, SpecialtyInfo, RankedDoctor } from '../types/doctor';
import type { ConsultationAppointment, ExamForm, MedicineEntry, AIDiagnosis, DiagnosisDecision, ClinicalAnalysisRequestDto } from '../types/consultation';

// ─── Token & Session ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem('mediflow_token');
}

export function setToken(t: string): void {
  localStorage.setItem('mediflow_token', t);
}

export function removeToken(): void {
  localStorage.removeItem('mediflow_token');
}

export function getUser(): User | null {
  return useAuthStore.getState().user;
}

export function setUser(u: User | null): void {
  useAuthStore.getState().setUser(u);
}

// ─── Base Fetch Wrapper (backed by Axios client) ──────────────────────────────

async function apiFetch<T = unknown>(
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
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  useAuthStore.getState().setAuth(data);
  return data;
}

export async function apiRegister(fullName: string, email: string, password: string, phoneNumber: string, role: UserRole = 'Patient') {
  const data = await apiFetch<AuthResponse>('/auth/register', {
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

export async function apiGetProfile(): Promise<ProfileForm> {
  return apiFetch<ProfileForm>('/patient/profile');
}

export async function apiUpdateProfile(data: ProfileForm): Promise<ProfileForm> {
  return apiFetch<ProfileForm>('/patient/profile', { method: 'PUT', body: JSON.stringify(data) });
}

export async function apiGetMyAppointments(): Promise<ConsultationAppointment[]> {
  return apiFetch<ConsultationAppointment[]>('/patient/appointments');
}

export async function apiSubmitSymptoms(symptoms: { symptoms: string; duration?: string; severity?: string } | Record<string, unknown>) {
  return apiFetch('/patients/symptoms', { method: 'POST', body: JSON.stringify(symptoms) });
}

export async function apiGetMyPrescriptions(): Promise<Prescription[]> {
  return apiFetch<Prescription[]>('/prescriptions/my');
}

export async function apiGetMyOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/orders/my');
}

export async function apiRateDoctor(id: number | string, rating: number, comment?: string) {
  return apiFetch(`/doctors/${id}/ratings`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
}

export async function apiRatePharmacy(id: number | string, rating: number, comment?: string) {
  return apiFetch(`/pharmacies/${id}/ratings`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export async function apiGetDoctors(specialtyId?: number | string, search?: string): Promise<DoctorDetail[]> {
  const params = new URLSearchParams();
  if (specialtyId) params.append('specialtyId', specialtyId.toString());
  if (search) params.append('search', search);
  const qs = params.toString();
  return apiFetch<DoctorDetail[]>(`/doctors${qs ? `?${qs}` : ''}`);
}

export async function apiGetDoctor(id: number | string): Promise<DoctorDetail> {
  return apiFetch<DoctorDetail>(`/doctors/${id}`);
}

export async function apiGetDoctorById(id: number | string): Promise<DoctorDetail> {
  return apiGetDoctor(id);
}

export async function apiGetSpecialties(): Promise<SpecialtyInfo[]> {
  return apiFetch<SpecialtyInfo[]>('/doctors/specialties');
}

export async function apiGetDoctorAvailability(id: number | string) {
  return apiFetch(`/doctors/${id}/availability`);
}

export async function apiGetRankedDoctors(specialtyId?: number | string): Promise<RankedDoctor[]> {
  return apiFetch<RankedDoctor[]>(`/doctors/ranked?specialty=${specialtyId || ''}`);
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function apiBookAppointment(doctorId: number | string, dateTime: string, notes?: string): Promise<ConsultationAppointment> {
  return apiFetch<ConsultationAppointment>('/appointments', { method: 'POST', body: JSON.stringify({ doctorId, dateTime, notes }) });
}

export async function apiGetAppointment(id: number | string): Promise<ConsultationAppointment> {
  return apiFetch<ConsultationAppointment>(`/appointments/${id}`);
}

export async function apiGetAppointmentById(id: number | string): Promise<ConsultationAppointment> {
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

export async function apiGetPendingAppointments(): Promise<ConsultationAppointment[]> {
  return apiFetch<ConsultationAppointment[]>('/receptionist/appointments');
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

export async function apiRescheduleAppointment(id: number | string, data: { newDateTime: string; reason?: string } | Record<string, unknown>) {
  return apiFetch(`/receptionist/appointments/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function apiCancelAppointment(id: number | string, reason: string) {
  return apiFetch(`/receptionist/appointments/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) });
}

// ─── Doctor Clinical ──────────────────────────────────────────────────────────

export async function apiGetDoctorAppointments(): Promise<ConsultationAppointment[]> {
  return apiFetch<ConsultationAppointment[]>('/doctors/appointments');
}

export async function apiStartConsultation(apptId: number | string) {
  return apiFetch('/consultations', { method: 'POST', body: JSON.stringify({ appointmentId: apptId }) });
}

export async function apiUpdateConsultation(id: number | string, data: Partial<ExamForm> | Record<string, unknown>) {
  return apiFetch(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function apiGetConsultation(id: number | string) {
  return apiFetch(`/consultations/${id}`);
}

export async function apiCompleteConsultation(appointmentId: number | string, diagnosis: string, prescriptionNotes: string, medicines: MedicineEntry[]) {
  return apiFetch(`/doctor/consultations/${appointmentId}`, {
    method: 'POST',
    body: JSON.stringify({ diagnosis, prescriptionNotes, medicines }),
  });
}

export async function apiRequestClinicalAnalysis(data: ClinicalAnalysisRequestDto | Record<string, unknown>) {
  return apiFetch('/clinical-analysis', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiSubmitDoctorDecision(diagnosisId: number | string, decision: DiagnosisDecision | string, modifiedDiagnosis?: string | Partial<AIDiagnosis>) {
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

export async function apiGeneratePrescription(data: CreatePrescriptionDto | Record<string, unknown>) {
  return apiFetch('/prescriptions', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiGetPrescription(id: number | string): Promise<Prescription> {
  return apiFetch<Prescription>(`/prescriptions/${id}`);
}

export async function apiGetPrescriptions(): Promise<Prescription[]> {
  return apiFetch<Prescription[]>('/pharmacist/prescriptions');
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function apiCreateOrder(data: CreateOrderDto | Record<string, unknown>) {
  return apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiGetOrder(id: number | string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
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

export async function apiGetPharmacistPrescriptions(): Promise<Prescription[]> {
  return apiFetch<Prescription[]>('/pharmacist/prescriptions');
}

export async function apiGetPharmacistOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/pharmacist/orders');
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

export async function apiCreateRestockRequest(data: RestockRequestDto | Record<string, unknown>) {
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
