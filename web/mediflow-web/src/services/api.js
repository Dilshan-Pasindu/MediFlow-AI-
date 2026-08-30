const API_BASE = 'http://localhost:5224/api';

// ─── Token Management ─────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('mediflow_token');
}

export function setToken(token) {
  localStorage.setItem('mediflow_token', token);
}

export function removeToken() {
  localStorage.removeItem('mediflow_token');
  localStorage.removeItem('mediflow_user');
}

export function getUser() {
  const raw = localStorage.getItem('mediflow_user');
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
  localStorage.setItem('mediflow_user', JSON.stringify(user));
}

// ─── Base Fetch Wrapper ───────────────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `API Error: ${res.status}`);
  }

  return data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

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

// ─── Patient API ──────────────────────────────────────────────────────────────

export async function apiGetProfile() {
  return apiFetch('/patient/profile');
}

export async function apiUpdateProfile(data) {
  return apiFetch('/patient/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiGetMyAppointments() {
  return apiFetch('/patient/appointments');
}

// ─── Doctor API (public) ──────────────────────────────────────────────────────

export async function apiGetDoctors(specialtyId, search) {
  const params = new URLSearchParams();
  if (specialtyId) params.append('specialtyId', specialtyId);
  if (search) params.append('search', search);
  const qs = params.toString();
  return apiFetch(`/doctors${qs ? `?${qs}` : ''}`);
}

export async function apiGetDoctor(id) {
  return apiFetch(`/doctors/${id}`);
}

export async function apiGetSpecialties() {
  return apiFetch('/doctors/specialties');
}

// ─── Appointments API ─────────────────────────────────────────────────────────

export async function apiBookAppointment(doctorId, dateTime, notes) {
  return apiFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify({ doctorId, dateTime, notes }),
  });
}

export async function apiGetAppointment(id) {
  return apiFetch(`/appointments/${id}`);
}
