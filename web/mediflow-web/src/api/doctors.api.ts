import { apiClient } from './client';
import type { Doctor } from '../types/appointment';

export interface DoctorFilterParams {
  specialtyId?: number;
  search?: string;
}

export async function getDoctors(params?: DoctorFilterParams): Promise<Doctor[]> {
  const response = await apiClient.get<Doctor[]>('/doctors', { params });
  return response.data;
}

export async function getDoctorById(id: number): Promise<Doctor> {
  const response = await apiClient.get<Doctor>(`/doctors/${id}`);
  return response.data;
}
