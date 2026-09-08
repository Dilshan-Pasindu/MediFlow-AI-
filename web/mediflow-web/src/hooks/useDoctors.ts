import { useQuery } from '@tanstack/react-query';
import { apiGetDoctors, apiGetDoctor, apiGetSpecialties, apiGetDoctorAvailability } from '../services/api';

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
