import { useQuery } from '@tanstack/react-query';
import { apiGetMyPrescriptions, apiGetPrescription } from '../services/api';

export function useMyPrescriptions() {
  return useQuery({
    queryKey: ['prescriptions', 'my'],
    queryFn: apiGetMyPrescriptions,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePrescription(id: number | string | undefined) {
  return useQuery({
    queryKey: ['prescriptions', id],
    queryFn: () => (id ? apiGetPrescription(id) : Promise.reject('No prescription ID')),
    enabled: Boolean(id),
  });
}
