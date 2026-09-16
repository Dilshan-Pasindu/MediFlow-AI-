import { useQuery } from '@tanstack/react-query';
import { apiGetMyPharmacy } from '../services/api';

/** The pharmacy linked to the currently logged-in pharmacist user. */
export function useMyPharmacy() {
  return useQuery({
    queryKey: ['pharmacy', 'my'],
    queryFn: apiGetMyPharmacy,
    staleTime: 1000 * 60 * 10,
  });
}
