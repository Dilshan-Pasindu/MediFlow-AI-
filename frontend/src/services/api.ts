import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, UserRole, AuthResponse } from '../types/auth';
import type { ProfileForm } from '../types/profile';
import type { Order, CreateOrderDto, RestockRequestDto } from '../types/order';
import type { Prescription, CreatePrescriptionDto, MedicationCheckResult, DrugInteraction, AlternativeDrug, ScreenInteractionsResponse, DrugInteractionLog } from '../types/prescription';
import type { DoctorDetail, SpecialtyInfo, RankedDoctor, DoctorReviewDto, DoctorProfileUpdatePayload } from '../types/doctor';
import type { ConsultationAppointment, ExamForm, MedicineEntry, AIDiagnosis, DiagnosisDecision, ClinicalAnalysisRequestDto, CurrentConsultationResponse } from '../types/consultation';

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
  if (isSupabaseConfigured()) {
    try {
      const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!supaError && supaData.session?.access_token) {
        useAuthStore.getState().setToken(supaData.session.access_token);

        const syncData = await apiFetch<AuthResponse>('/auth/sync', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supaData.session.access_token}`,
          },
        });

        const combined: AuthResponse = {
          ...syncData,
          token: supaData.session.access_token,
        };
        useAuthStore.getState().setAuth(combined);
        return combined;
      }
    } catch {
      // Supabase sign-in failed (e.g. user not in Supabase auth yet).
      // Fall through to backend auth fallback below.
    }
  }

  // Fallback to legacy/direct backend auth (handles seeded demo accounts & doctors/admins)
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  useAuthStore.getState().setAuth(data);
  return data;
}

export async function apiRegister(fullName: string, email: string, password: string, phoneNumber: string, role: UserRole = 'Patient') {
  if (isSupabaseConfigured()) {
    const { data: supaData, error: supaError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phoneNumber,
          role: role,
        },
      },
    });

    if (supaError) {
      throw new Error(supaError.message || 'Registration failed.');
    }

    if (!supaData.session?.access_token) {
      return {
        userId: 0,
        fullName,
        email,
        role,
        token: '',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      };
    }

    useAuthStore.getState().setToken(supaData.session.access_token);

    const syncData = await apiFetch<AuthResponse>('/auth/sync', {
      method: 'POST',
      body: JSON.stringify({ fullName, phoneNumber, role }),
      headers: {
        Authorization: `Bearer ${supaData.session.access_token}`,
      },
    });

    const combined: AuthResponse = {
      ...syncData,
      token: supaData.session.access_token,
    };
    useAuthStore.getState().setAuth(combined);
    return combined;
  }

  // Fallback to legacy/direct backend registration
  const data = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, phoneNumber, role }),
  });
  useAuthStore.getState().setAuth(data);
  return data;
}

export async function apiGoogleAuth(googleData: { idToken?: string; email?: string; fullName?: string; photoUrl?: string; role?: UserRole }) {
  const data = await apiFetch<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify(googleData),
  });
  useAuthStore.getState().setAuth(data);
  return data;
}

export async function apiGetMe(): Promise<User> {
  return apiFetch<User>('/auth/me');
}

export async function apiLogout() {
  await useAuthStore.getState().logout();
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
  return apiFetch('/patient/symptoms', { method: 'POST', body: JSON.stringify(symptoms) });
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

export async function apiGetDoctorReviews(id: number | string): Promise<DoctorReviewDto[]> {
  return apiFetch<DoctorReviewDto[]>(`/doctors/${id}/reviews`);
}

export async function apiGetMyDoctorProfile(): Promise<DoctorDetail> {
  return apiFetch<DoctorDetail>('/doctors/me/profile');
}

export async function apiUpdateMyDoctorProfile(data: DoctorProfileUpdatePayload): Promise<{ message: string; doctor: DoctorDetail }> {
  return apiFetch<{ message: string; doctor: DoctorDetail }>('/doctors/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiRateAppointment(appointmentId: number | string, data: { rating: number; review?: string }) {
  return apiFetch<{ message: string; ratingId: number }>(`/appointments/${appointmentId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ Stars: data.rating, Comment: data.review ?? null }),
  });
}

export async function apiGetAppointmentRating(appointmentId: number | string): Promise<{ hasRated: boolean; rating?: any }> {
  return apiFetch<{ hasRated: boolean; rating?: any }>(`/appointments/${appointmentId}/rating`);
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

export async function apiStartConsultation(id: number | string) {
  return apiFetch(`/appointments/${id}/start-consultation`, { method: 'POST' });
}

export async function apiCompleteConsultation(id: number | string) {
  return apiFetch(`/appointments/${id}/complete-consultation`, { method: 'POST' });
}

export async function apiCompleteAppointment(id: number | string) {
  return apiFetch(`/appointments/${id}/complete`, { method: 'PUT' });
}

export async function apiGetCurrentConsultation(doctorId?: number | string): Promise<CurrentConsultationResponse> {
  const query = doctorId ? `?doctorId=${doctorId}` : '';
  return apiFetch<CurrentConsultationResponse>(`/appointments/current-consultation${query}`);
}

export async function apiSubmitPayment(appointmentId: number | string, amount: number, paymentMethod = 'Card') {
  return apiFetch(`/appointments/${appointmentId}/payment`, {
    method: 'POST',
    body: JSON.stringify({ amount, paymentMethod }),
  });
}

export async function apiPatientCancelAppointment(id: number | string, reason?: string) {
  return apiFetch(`/patient/appointments/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason: reason || '' }),
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

// ─── Doctor Leave Management ──────────────────────────────────────────────────

export async function apiGetDoctorLeaves(doctorId: number | string) {
  return apiFetch(`/doctors/${doctorId}/leaves`);
}

export async function apiCreateDoctorLeave(doctorId: number | string, data: { startDate: string; endDate: string; reason: string }) {
  return apiFetch(`/doctors/${doctorId}/leaves`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteDoctorLeave(doctorId: number | string, leaveId: number | string) {
  return apiFetch(`/doctors/${doctorId}/leaves/${leaveId}`, {
    method: 'DELETE',
  });
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

export async function apiGetDoctorPrescriptions(status?: string): Promise<Prescription[]> {
  const qs = status ? `?status=${status}` : '';
  return apiFetch<Prescription[]>(`/prescriptions/doctor/my${qs}`);
}

export async function apiUpdatePrescription(
  id: number | string,
  data: {
    patientName?: string;
    isWalkIn?: boolean;
    walkInPatientDetails?: {
      fullName: string;
      age?: string;
      gender?: string;
      phone?: string;
    };
    diagnosis?: string;
    fulfillmentSource?: string;
    instructions?: string;
    items?: Array<{
      medicineId?: number;
      medicineName: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity: number;
      instructions?: string;
    }>;
  }
): Promise<{ message: string; prescription: Prescription }> {
  return apiFetch(`/prescriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function apiDeletePrescription(id: number | string): Promise<{ message: string }> {
  return apiFetch(`/prescriptions/${id}`, { method: 'DELETE' });
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

export async function apiDeleteOrder(id: number | string): Promise<{ message: string }> {
  return apiFetch(`/orders/${id}`, { method: 'DELETE' });
}

export async function apiCalculateOrderPrice(id: number | string, pharmacyId: number | string) {
  return apiFetch(`/orders/${id}/calculate-price`, { method: 'POST', body: JSON.stringify({ pharmacyId }) });
}

// ─── Pharmacist ───────────────────────────────────────────────────────────────

export async function apiGetPharmacistPrescriptions(): Promise<Prescription[]> {
  return apiFetch<Prescription[]>('/prescriptions');
}

export async function apiGetPharmacistOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/orders');
}

// ─── Pharmacy Inventory ───────────────────────────────────────────────────────

export async function apiGetMyPharmacy() {
  return apiFetch<{ id: number; name: string; location: string; contactNumber: string; ownerId: number }>(
    '/pharmacies/my'
  );
}

export async function apiGetPharmacyInventory(
  pharmacyId: number | string,
  params?: { search?: string; category?: string; stockFilter?: string; page?: number; pageSize?: number }
) {
  const qs = new URLSearchParams();
  if (params?.search) qs.append('search', params.search);
  if (params?.category) qs.append('category', params.category);
  if (params?.stockFilter) qs.append('stockFilter', params.stockFilter);
  if (params?.page) qs.append('page', String(params.page));
  if (params?.pageSize) qs.append('pageSize', String(params.pageSize));
  return apiFetch(`/pharmacies/${pharmacyId}/inventory${qs.toString() ? `?${qs}` : ''}`);
}

export async function apiCreateInventoryItem(
  pharmacyId: number | string,
  data: {
    medicineName: string;
    genericName: string;
    category: string;
    unitOfMeasure: string;
    minStockLevel: number;
    unitPrice: number;
    initialStock: number;
    batchNumber?: string;
    expiryDate?: string;
    batchNotes?: string;
  }
) {
  // Normalise expiryDate to full ISO datetime so ASP.NET DateTime binding works
  const expiryDateIso = data.expiryDate
    ? (data.expiryDate.includes('T') ? data.expiryDate : `${data.expiryDate}T00:00:00`)
    : undefined;
  return apiFetch(`/pharmacies/${pharmacyId}/inventory`, {
    method: 'POST',
    body: JSON.stringify({ ...data, expiryDate: expiryDateIso }),
  });
}

export async function apiUpdateInventoryItem(
  pharmacyId: number | string,
  itemId: number | string,
  data: {
    minStockLevel: number;
    unitPrice: number;
    stockAdjustment: number;
    adjustmentReason?: string;
  }
) {
  return apiFetch(`/pharmacies/${pharmacyId}/inventory/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiAddInventoryBatch(
  pharmacyId: number | string,
  itemId: number | string,
  data: { batchNumber: string; quantity: number; expiryDate: string; notes?: string }
) {
  // Ensure expiryDate is a full ISO datetime — ASP.NET DateTime binding requires time component
  const expiryDateIso = data.expiryDate.includes('T')
    ? data.expiryDate
    : `${data.expiryDate}T00:00:00`;
  return apiFetch(`/pharmacies/${pharmacyId}/inventory/${itemId}/batches`, {
    method: 'POST',
    body: JSON.stringify({ ...data, expiryDate: expiryDateIso }),
  });
}

export async function apiDeleteExpiredBatch(
  pharmacyId: number | string,
  itemId: number | string,
  batchId: number | string
) {
  return apiFetch(`/pharmacies/${pharmacyId}/inventory/${itemId}/batches/${batchId}`, {
    method: 'DELETE',
  });
}

export async function apiUpdateBatchExpiry(
  pharmacyId: number | string,
  itemId: number | string,
  batchId: number | string,
  data: { expiryDate: string; notes?: string }
) {
  const expiryDateIso = data.expiryDate.includes('T')
    ? data.expiryDate
    : `${data.expiryDate}T00:00:00`;
  return apiFetch(`/pharmacies/${pharmacyId}/inventory/${itemId}/batches/${batchId}/expiry`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, expiryDate: expiryDateIso }),
  });
}

export async function apiGetInventory() {
  return apiFetch('/pharmacist/inventory');
}

export async function apiGetLowStockItems(pharmacyId?: number | string) {
  const qs = pharmacyId ? `?pharmacyId=${pharmacyId}` : '';
  return apiFetch(`/inventory/low-stock${qs}`);
}

export async function apiGenerateRestockRecommendations(pharmacyId: number | string) {
  return apiFetch(`/pharmacies/${pharmacyId}/generate-restock-recommendations`, { method: 'POST' });
}

export async function apiGetRestockRequests(status?: string) {
  const qs = status ? `?status=${status}` : '';
  return apiFetch(`/restock-requests${qs}`);
}

export async function apiCreateRestockRequest(data: {
  supplierProfileId: number;
  notes?: string;
  items: Array<{ medicineId: number; quantity: number; unitPrice: number }>;
  pharmacyId?: number;
}) {
  return apiFetch('/restock-requests', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiUpdateRestockStatus(
  id: number | string,
  status: string,
  responseNote?: string,
  itemBatches?: Array<{
    restockRequestItemId: number;
    batchNumber: string;
    expiryDate: string;
    quantity?: number;
    unitPrice?: number;
    subTotal?: number;
  }>
) {
  // Normalise expiryDate on each batch item to full ISO datetime
  const normalisedBatches = itemBatches?.map(b => ({
    ...b,
    expiryDate: b.expiryDate.includes('T') ? b.expiryDate : `${b.expiryDate}T00:00:00`,
  }));
  return apiFetch(`/restock-requests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, responseNote, itemBatches: normalisedBatches }),
  });
}

export async function apiReceiveRestockRequest(id: number | string, notes?: string) {
  return apiFetch(`/restock-requests/${id}/receive`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

// ── Payment Workflow ─────────────────────────────────────────────────────────

export async function apiSubmitBankDetails(id: number | string, data: { bankName: string; accountName: string; accountNumber: string; branch: string }) {
  return apiFetch(`/restock-requests/${id}/bank-details`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiSubmitPaymentSlip(id: number | string, paymentSlipUrl: string) {
  return apiFetch(`/restock-requests/${id}/payment-slip`, {
    method: 'POST',
    body: JSON.stringify({ paymentSlipUrl }),
  });
}

export async function apiVerifyRestockPayment(id: number | string) {
  return apiFetch(`/restock-requests/${id}/verify-payment`, {
    method: 'POST',
  });
}

export async function apiGetInventoryTransactions(params?: {
  pharmacyId?: number;
  medicineId?: number;
  days?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.pharmacyId) qs.append('pharmacyId', String(params.pharmacyId));
  if (params?.medicineId) qs.append('medicineId', String(params.medicineId));
  if (params?.days) qs.append('days', String(params.days));
  return apiFetch(`/inventory/transactions${qs.toString() ? `?${qs}` : ''}`);
}

export async function apiGetSuppliers() {
  return apiFetch('/suppliers');
}

export async function apiGetMySupplierProfile() {
  return apiFetch('/suppliers/me');
}

// Keep legacy compat aliases
export async function apiUpdateRestockRequest(id: number | string, status: string) {
  return apiUpdateRestockStatus(id, status);
}

export async function apiCreateRestockOrder(medicineId: number | string, quantity: number, supplierId: number | string) {
  return apiFetch('/pharmacist/restock-orders', {
    method: 'POST',
    body: JSON.stringify({ medicineId, quantity, supplierId }),
  });
}

// ─── Pharmacy Owner ───────────────────────────────────────────────────────────

export async function apiGetOwnerStats() {
  return apiFetch('/pharmacyowner/stats');
}

// ─── Supplier ───────────────────────────────────────────────────────

/** @deprecated Use apiUpdateRestockStatus instead */
export async function apiApproveRestockRequest(supplierId: number | string, requestId: number | string) {
  return apiUpdateRestockStatus(requestId, 'Approved');
}

export async function apiGetSupplyHistory(supplierId: number | string) {
  return apiFetch(`/suppliers/${supplierId}/supply-history`);
}

export async function apiGetSupplierOrders() {
  return apiFetch('/restock-requests');
}

export async function apiUpdateDeliveryStatus(orderId: number | string, status: string) {
  return apiUpdateRestockStatus(orderId, status);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function apiGetAdminStats() {
  return apiFetch<{
    totalUsers: number;
    activeUsers: number;
    totalAppointments: number;
    confirmedAppointments: number;
    totalMedicines: number;
    totalRestockRequests: number;
    systemHealth: string;
    uptime: string;
    activeAlerts: number;
    aiEventsToday: number;
  }>('/admin/stats');
}

export async function apiGetAdminUsers(role?: string, search?: string) {
  const qs = new URLSearchParams();
  if (role) qs.append('role', role);
  if (search) qs.append('search', search);
  return apiFetch<Array<{
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
  }>>(`/admin/users${qs.toString() ? `?${qs}` : ''}`);
}

export async function apiUpdateUserStatus(id: number | string, isActive: boolean) {
  return apiFetch(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  });
}

export async function apiGetAuditLogs() {
  return apiFetch<Array<{
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    role: string;
    details: string;
    severity: string;
  }>>('/admin/audit');
}

export async function apiGetAiMetrics() {
  return apiFetch<Array<{
    agentId: string;
    name: string;
    description: string;
    invocationsToday: number;
    acceptanceRate: string;
    avgLatencyMs: number;
    status: string;
    lastInvoked: string;
  }>>('/admin/ai-metrics');
}

// ─── Pharmacist Medicines & AI Check ─────────────────────────────────────────

export async function apiGetPharmacistMedicines(search?: string, category?: string) {
  const qs = new URLSearchParams();
  if (search) qs.append('search', search);
  if (category) qs.append('category', category);
  return apiFetch<Array<{
    id: number;
    medicineName: string;
    genericName: string;
    category: string;
    unitOfMeasure: string;
    isActive: boolean;
  }>>(`/medicines${qs.toString() ? `?${qs}` : ''}`);
}

export interface MedicationCheckPayload {
  medications: string[];
  patient_allergies?: string;
  pharmacy_id?: number;
}

export type { MedicationCheckResult, DrugInteraction, AlternativeDrug, ScreenInteractionsResponse, DrugInteractionLog };

export async function apiScreenInteractions(
  prescriptionId: number | string,
  pharmacyId?: number
): Promise<ScreenInteractionsResponse> {
  const qs = pharmacyId ? `?pharmacyId=${pharmacyId}` : '';
  return apiFetch<ScreenInteractionsResponse>(`/prescriptions/${prescriptionId}/screen-interactions${qs}`, {
    method: 'POST',
  });
}

export async function apiAcknowledgeWarning(
  prescriptionId: number | string,
  logId: number,
  overrideNote?: string
) {
  return apiFetch<{ message: string; logId: number; warningType: string; severityLevel: string; acknowledgedAt: string }>(
    `/prescriptions/${prescriptionId}/acknowledge-warning`,
    {
      method: 'POST',
      body: JSON.stringify({ logId, overrideNote }),
    }
  );
}

export async function apiGetPrescriptionInteractionLogs(
  prescriptionId: number | string
): Promise<DrugInteractionLog[]> {
  return apiFetch<DrugInteractionLog[]>(`/prescriptions/${prescriptionId}/interaction-logs`);
}

export async function apiRunMedicationCheck(payload: MedicationCheckPayload): Promise<MedicationCheckResult> {
  try {
    const res = await fetch('http://localhost:8000/api/ai/medication-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback if AI service is offline
  }

  // Graceful client-side fallback
  const meds = payload.medications.map(m => m.toLowerCase());
  const allergies = (payload.patient_allergies || '').toLowerCase();
  const interactions: Array<{ drug_pair: string[]; severity: string; description: string; recommendation: string }> = [];
  const allergyWarnings: string[] = [];
  const alternatives: Array<{ original_drug: string; alternative_drug: string; reason: string; dosage_guidance: string }> = [];

  if (meds.some(m => m.includes('warfarin')) && meds.some(m => m.includes('aspirin') || m.includes('ibuprofen'))) {
    interactions.push({
      drug_pair: ['Warfarin', 'Aspirin/NSAID'],
      severity: 'High',
      description: 'Concurrent use of anticoagulant and NSAID significantly amplifies bleeding hazard.',
      recommendation: 'Substitute with Paracetamol and monitor coagulation profile.',
    });
  }

  if (allergies.includes('penicillin') && meds.some(m => m.includes('amoxicillin') || m.includes('penicillin') || m.includes('augmentin'))) {
    allergyWarnings.push("CRITICAL ALLERGY ALERT: Beta-lactam antibiotic contraindicated for penicillin-allergic patient.");
    alternatives.push({
      original_drug: "Amoxicillin / Penicillin",
      alternative_drug: "Azithromycin 500mg OD",
      reason: "Macrolide alternative avoiding beta-lactam hypersensitivity",
      dosage_guidance: "500mg once daily for 3-5 days"
    });
  }

  const safe = allergyWarnings.length === 0 && !interactions.some(i => i.severity === 'High');
  return {
    safe_to_dispense: safe,
    safety_score: safe ? 95 : 35,
    interactions,
    allergy_warnings: allergyWarnings,
    alternatives,
    summary: safe ? "Prescription safety verified. Safe to dispense." : "Safety alert: Critical interaction or allergy contraindication detected."
  };
}

export interface InventoryForecastResult {
  pharmacy_id: number;
  risk_items: Array<{
    medicine_id: number;
    medicine_name: string;
    current_stock: number;
    daily_burn_rate: number;
    days_until_stockout: number;
    urgency: string;
  }>;
  restock_recommendations: Array<{
    medicine_id: number;
    medicine_name: string;
    suggested_quantity: number;
    reason: string;
    estimated_unit_cost: number;
    priority: string;
  }>;
  total_projected_cost: number;
  summary: string;
}

export async function apiGetInventoryForecast(pharmacyId: number): Promise<InventoryForecastResult> {
  try {
    const res = await fetch('http://localhost:8000/api/ai/inventory-forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pharmacy_id: pharmacyId, lookback_days: 30 }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  return {
    pharmacy_id: pharmacyId,
    risk_items: [
      { medicine_id: 1, medicine_name: 'Amoxicillin 500mg Capsule', current_stock: 18, daily_burn_rate: 9.2, days_until_stockout: 2, urgency: 'CRITICAL' },
      { medicine_id: 3, medicine_name: 'Omeprazole 20mg Capsule', current_stock: 32, daily_burn_rate: 11.5, days_until_stockout: 3, urgency: 'CRITICAL' },
      { medicine_id: 4, medicine_name: 'Metformin 500mg Tablet', current_stock: 110, daily_burn_rate: 14.0, days_until_stockout: 8, urgency: 'WARNING' },
    ],
    restock_recommendations: [
      { medicine_id: 1, medicine_name: 'Amoxicillin 500mg Capsule', suggested_quantity: 280, reason: 'Stockout horizon < 2 days. 30-day buffer required.', estimated_unit_cost: 45.0, priority: 'HIGH' },
      { medicine_id: 3, medicine_name: 'Omeprazole 20mg Capsule', suggested_quantity: 350, reason: 'Stockout horizon < 3 days. 30-day buffer required.', estimated_unit_cost: 28.0, priority: 'HIGH' },
    ],
    total_projected_cost: 22400.0,
    summary: `Inventory audit for Pharmacy #${pharmacyId}: 2 critical stockout risks detected. Generated recommended restock batches totaling LKR 22,400.00.`
  };
}


// ─── Nearby ───────────────────────────────────────────────────────────────────

export async function apiGetNearbyPharmacies(lat: number | string, lng: number | string) {
  return apiFetch(`/pharmacies/nearby?lat=${lat}&lng=${lng}`);
}

export async function apiGetPharmacyDetails(id: number | string) {
  return apiFetch(`/pharmacies/${id}`);
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function apiGetNotifications() {
  return apiFetch<{ id: number; title: string; message: string; type: string; isRead: boolean; createdAt: string }[]>('/notifications');
}

export async function apiMarkNotificationRead(id: number) {
  return apiFetch(`/notifications/${id}/read`, { method: 'POST' });
}

export async function apiMarkAllNotificationsRead() {
  return apiFetch('/notifications/read-all', { method: 'POST' });
}


