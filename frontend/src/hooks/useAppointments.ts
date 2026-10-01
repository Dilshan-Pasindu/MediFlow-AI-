import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiGetMyAppointments,
  apiGetDoctorAppointments,
  apiGetPendingAppointments,
  apiGetAppointment,
  apiBookAppointment,
  apiRateAppointment,
} from '../services/api';

export function useMyAppointments(options?: { refetchInterval?: number; staleTime?: number }) {
  return useQuery({
    queryKey: ['appointments', 'my'],
    queryFn: apiGetMyAppointments,
    staleTime: options?.staleTime ?? 1000 * 3, // 3 seconds
    refetchInterval: options?.refetchInterval ?? 3000, // auto-update every 3s
    refetchOnWindowFocus: true,
  });
}

export function useDoctorAppointments(options?: { refetchInterval?: number; staleTime?: number }) {
  return useQuery({
    queryKey: ['appointments', 'doctor'],
    queryFn: apiGetDoctorAppointments,
    staleTime: options?.staleTime ?? 1000 * 3,
    refetchInterval: options?.refetchInterval ?? 3000,
    refetchOnWindowFocus: true,
  });
}

export function usePendingAppointments(options?: { refetchInterval?: number; staleTime?: number }) {
  return useQuery({
    queryKey: ['appointments', 'pending'],
    queryFn: apiGetPendingAppointments,
    staleTime: options?.staleTime ?? 1000 * 3,
    refetchInterval: options?.refetchInterval ?? 3000,
    refetchOnWindowFocus: true,
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

export function useRateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, rating, review }: { appointmentId: number | string; rating: number; review?: string }) =>
      apiRateAppointment(appointmentId, { rating, review }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctor'] });
    },
  });
}
