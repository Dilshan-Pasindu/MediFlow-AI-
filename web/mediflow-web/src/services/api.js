const API_BASE = 'http://localhost:5224/api';

// ─── Token & Session ──────────────────────────────────────────────────────────

export function getToken()         { return localStorage.getItem('mediflow_token'); }
export function setToken(t)        { localStorage.setItem('mediflow_token', t); }
export function removeToken()      { localStorage.removeItem('mediflow_token'); localStorage.removeItem('mediflow_user'); }
export function getUser()          { const r = localStorage.getItem('mediflow_user'); return r ? JSON.parse(r) : null; }
export function setUser(u)         { localStorage.setItem('mediflow_user', JSON.stringify(u)); }

// ─── Base Fetch Wrapper ───────────────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.title || `API Error: ${res.status}`);
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  setUser({ userId: data.userId, fullName: data.fullName, email: data.email, role: data.role });
  return data;
}

export async function apiRegister(fullName, email, password, phoneNumber, role = 'Patient') {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, phoneNumber, role }),
  });
  setToken(data.token);
  setUser({ userId: data.userId, fullName: data.fullName, email: data.email, role: data.role });
  return data;
}

export function apiLogout() {
  removeToken();
  window.location.href = '/login';
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export async function apiGetProfile()              { return apiFetch('/patient/profile'); }
export async function apiUpdateProfile(data)       { return apiFetch('/patient/profile', { method: 'PUT', body: JSON.stringify(data) }); }
export async function apiGetMyAppointments()       { return apiFetch('/patient/appointments'); }
export async function apiSubmitSymptoms(symptoms)  { return apiFetch('/patients/symptoms', { method: 'POST', body: JSON.stringify(symptoms) }); }
export async function apiGetMyPrescriptions()      { return apiFetch('/prescriptions/my'); }
export async function apiGetMyOrders()             { return apiFetch('/orders/my'); }
export async function apiRateDoctor(id, rating, comment) {
  return apiFetch(`/doctors/${id}/ratings`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
}
export async function apiRatePharmacy(id, rating, comment) {
  return apiFetch(`/pharmacies/${id}/ratings`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export async function apiGetDoctors(specialtyId, search) {
  const params = new URLSearchParams();
  if (specialtyId) params.append('specialtyId', specialtyId);
  if (search) params.append('search', search);
  const qs = params.toString();
  return apiFetch(`/doctors${qs ? `?${qs}` : ''}`);
}
export async function apiGetDoctor(id)             { return apiFetch(`/doctors/${id}`); }
export async function apiGetSpecialties()          { return apiFetch('/doctors/specialties'); }
export async function apiGetDoctorAvailability(id) { return apiFetch(`/doctors/${id}/availability`); }
export async function apiGetRankedDoctors(specialtyId) { return apiFetch(`/doctors/ranked?specialty=${specialtyId}`); }

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function apiBookAppointment(doctorId, dateTime, notes) {
  return apiFetch('/appointments', { method: 'POST', body: JSON.stringify({ doctorId, dateTime, notes }) });
}
export async function apiGetAppointment(id)        { return apiFetch(`/appointments/${id}`); }
export async function apiPayAppointment(id)        { return apiFetch(`/appointments/${id}/pay`, { method: 'POST' }); }

// ─── Receptionist ─────────────────────────────────────────────────────────────

export async function apiGetPendingAppointments()  { return apiFetch('/receptionist/appointments'); }
export async function apiVerifyPayment(id)         { return apiFetch(`/receptionist/appointments/${id}/verify`, { method: 'POST' }); }
export async function apiGenerateAppointmentNumber(id) {
  return apiFetch(`/receptionist/appointments/${id}/generate-number`, { method: 'POST' });
}
export async function apiRescheduleAppointment(id, data) {
  return apiFetch(`/receptionist/appointments/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function apiCancelAppointment(id, reason) {
  return apiFetch(`/receptionist/appointments/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) });
}

// ─── Doctor Clinical ──────────────────────────────────────────────────────────

export async function apiGetDoctorAppointments()   { return apiFetch('/doctors/appointments'); }
export async function apiStartConsultation(apptId) { return apiFetch('/consultations', { method: 'POST', body: JSON.stringify({ appointmentId: apptId }) }); }
export async function apiUpdateConsultation(id, data) {
  return apiFetch(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export async function apiGetConsultation(id)       { return apiFetch(`/consultations/${id}`); }
export async function apiRequestClinicalAnalysis(data) {
  return apiFetch('/clinical-analysis', { method: 'POST', body: JSON.stringify(data) });
}
export async function apiSubmitDoctorDecision(diagnosisId, decision, modifiedDiagnosis) {
  return apiFetch(`/diagnosis/${diagnosisId}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision, modifiedDiagnosis }),
  });
}
export async function apiGetPatientHistory(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}/patient-history`);
}

// ─── Medicines & Prescriptions ────────────────────────────────────────────────

export async function apiGetMedicines(search)      { return apiFetch(`/medicines${search ? `?search=${search}` : ''}`); }
export async function apiCheckMedicineAvailability(pharmacyId, medicineIds) {
  return apiFetch(`/pharmacies/${pharmacyId}/medicine-availability?medicineIds=${medicineIds.join(',')}`);
}
export async function apiGeneratePrescription(data) {
  return apiFetch('/prescriptions', { method: 'POST', body: JSON.stringify(data) });
}
export async function apiGetPrescription(id)       { return apiFetch(`/prescriptions/${id}`); }

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function apiCreateOrder(data)         { return apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }); }
export async function apiGetOrder(id)              { return apiFetch(`/orders/${id}`); }
export async function apiPayOrder(id)              { return apiFetch(`/orders/${id}/payment`, { method: 'POST' }); }
export async function apiUpdateOrderStatus(id, status) {
  return apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}
export async function apiCalculateOrderPrice(id, pharmacyId) {
  return apiFetch(`/orders/${id}/calculate-price`, { method: 'POST', body: JSON.stringify({ pharmacyId }) });
}

// ─── Pharmacist ───────────────────────────────────────────────────────────────

export async function apiGetPharmacistPrescriptions() { return apiFetch('/pharmacist/prescriptions'); }
export async function apiGetPharmacistOrders()     { return apiFetch('/pharmacist/orders'); }

// ─── Pharmacy Inventory ───────────────────────────────────────────────────────

export async function apiGetPharmacyInventory(pharmacyId) { return apiFetch(`/pharmacies/${pharmacyId}/inventory`); }
export async function apiGetLowStockItems()        { return apiFetch('/inventory/low-stock'); }
export async function apiGenerateRestockRecommendations(pharmacyId) {
  return apiFetch(`/pharmacies/${pharmacyId}/generate-restock-recommendations`, { method: 'POST' });
}
export async function apiCreateRestockRequest(data) {
  return apiFetch('/restock-requests', { method: 'POST', body: JSON.stringify(data) });
}
export async function apiGetRestockRequests()      { return apiFetch('/restock-requests'); }
export async function apiUpdateRestockRequest(id, status) {
  return apiFetch(`/restock-requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
}

// ─── Supplier ─────────────────────────────────────────────────────────────────

export async function apiApproveRestockRequest(supplierId, requestId) {
  return apiFetch(`/suppliers/${supplierId}/approve`, { method: 'POST', body: JSON.stringify({ requestId }) });
}
export async function apiGetSupplyHistory(supplierId) { return apiFetch(`/suppliers/${supplierId}/supply-history`); }

// ─── Nearby ───────────────────────────────────────────────────────────────────

export async function apiGetNearbyPharmacies(lat, lng) {
  return apiFetch(`/pharmacies/nearby?lat=${lat}&lng=${lng}`);
}
export async function apiGetPharmacyDetails(id)    { return apiFetch(`/pharmacies/${id}`); }
