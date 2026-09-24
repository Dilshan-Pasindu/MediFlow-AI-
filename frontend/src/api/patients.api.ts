import { apiClient } from './client';

export interface PatientProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  bloodGroup?: string;
  createdAt: string;
}

export interface UpdatePatientProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  bloodGroup?: string;
}

export interface PatientAppointmentSummary {
  id: number;
  appointmentNumber: string;
  doctorName: string;
  appointmentDateTime: string;
  status: string;
  fee?: number;
  paymentStatus?: string;
  notes?: string;
  createdAt: string;
}

export async function getPatientProfile(): Promise<PatientProfile> {
  const response = await apiClient.get<PatientProfile>('/patient/profile');
  return response.data;
}

export async function updatePatientProfile(request: UpdatePatientProfileRequest): Promise<{ message: string }> {
  const response = await apiClient.put<{ message: string }>('/patient/profile', request);
  return response.data;
}

export async function getPatientAppointments(): Promise<PatientAppointmentSummary[]> {
  const response = await apiClient.get<PatientAppointmentSummary[]>('/patient/appointments');
  return response.data;
}
