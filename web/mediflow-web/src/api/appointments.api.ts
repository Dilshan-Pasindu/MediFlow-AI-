import { apiClient } from './client';
import type { Appointment, BookAppointmentRequest } from '../types/appointment';

export async function bookAppointment(request: BookAppointmentRequest): Promise<Appointment> {
  const response = await apiClient.post<Appointment>('/appointments', {
    doctorId: request.doctorId,
    dateTime: request.appointmentDateTime,
    notes: request.notes,
  });
  return response.data;
}

export async function getAppointmentById(id: number): Promise<Appointment> {
  const response = await apiClient.get<Appointment>(`/appointments/${id}`);
  return response.data;
}
