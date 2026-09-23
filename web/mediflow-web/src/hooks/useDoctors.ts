import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiGetDoctors,
  apiGetDoctor,
  apiGetSpecialties,
  apiGetDoctorAvailability,
  apiGetDoctorReviews,
  apiGetMyDoctorProfile,
  apiUpdateMyDoctorProfile,
} from '../services/api';
import type { DoctorProfileUpdatePayload } from '../types/doctor';

export function useDoctors(specialtyId?: number | string, search?: string) {
  return useQuery({
    queryKey: ['doctors', { specialtyId, search }],
    queryFn: () => apiGetDoctors(specialtyId, search),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDoctor(id: number | string | undefined) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => (id ? apiGetDoctor(id) : Promise.reject('No doctor ID')),
    enabled: Boolean(id),
  });
}

export function useSpecialties() {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: apiGetSpecialties,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useDoctorAvailability(id: number | string | undefined) {
  return useQuery({
    queryKey: ['doctor', id, 'availability'],
    queryFn: () => (id ? apiGetDoctorAvailability(id) : Promise.reject('No doctor ID')),
    enabled: Boolean(id),
  });
}

export function useDoctorReviews(id: number | string | undefined) {
  return useQuery({
    queryKey: ['doctor', id, 'reviews'],
    queryFn: () => (id ? apiGetDoctorReviews(id) : Promise.reject('No doctor ID')),
    enabled: Boolean(id),
  });
}

export function useMyDoctorProfile() {
  return useQuery({
    queryKey: ['myDoctorProfile'],
    queryFn: apiGetMyDoctorProfile,
  });
}

export function useUpdateMyDoctorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DoctorProfileUpdatePayload) => apiUpdateMyDoctorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDoctorProfile'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}
