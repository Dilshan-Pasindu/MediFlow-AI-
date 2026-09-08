import { useQuery } from '@tanstack/react-query';
import { apiGetMyOrders, apiGetOrder } from '../services/api';

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: apiGetMyOrders,
    staleTime: 1000 * 60 * 2,
  });
}

export function useOrder(id: number | string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => (id ? apiGetOrder(id) : Promise.reject('No order ID')),
    enabled: Boolean(id),
  });
}
