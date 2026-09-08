import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiGetMyAppointments,
  apiGetDoctorAppointments,
  apiGetPendingAppointments,
  apiGetAppointment,
  apiBookAppointment,
} from '../services/api';

export function useMyAppointments() {
  return useQuery({
    queryKey: ['appointments', 'my'],
    queryFn: apiGetMyAppointments,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useDoctorAppointments() {
  return useQuery({
    queryKey: ['appointments', 'doctor'],
    queryFn: apiGetDoctorAppointments,
    staleTime: 1000 * 60 * 2,
  });
}

export function usePendingAppointments() {
  return useQuery({
    queryKey: ['appointments', 'pending'],
    queryFn: apiGetPendingAppointments,
    staleTime: 1000 * 30, // 30 seconds for receptionists
  });
}

export function useAppointment(id: number | string | undefined) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: () => (id ? apiGetAppointment(id) : Promise.reject('No ID provided')),
    enabled: Boolean(id),
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, dateTime, notes }: { doctorId: number | string; dateTime: string; notes?: string }) =>
      apiBookAppointment(doctorId, dateTime, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
