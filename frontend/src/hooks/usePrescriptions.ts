import { useQuery } from '@tanstack/react-query';
import { apiGetMyPrescriptions, apiGetPrescription } from '../services/api';

export function useMyPrescriptions(options?: { refetchInterval?: number; staleTime?: number }) {
  return useQuery({
    queryKey: ['prescriptions', 'my'],
    queryFn: apiGetMyPrescriptions,
    staleTime: options?.staleTime ?? 1000 * 10, // 10 seconds
    refetchInterval: options?.refetchInterval ?? 30000, // auto-update every 30s
    refetchOnWindowFocus: true,
  });
}

export function usePrescription(id: number | string | undefined) {
  return useQuery({
    queryKey: ['prescriptions', id],
    queryFn: () => (id ? apiGetPrescription(id) : Promise.reject('No prescription ID')),
    enabled: Boolean(id),
  });
}
