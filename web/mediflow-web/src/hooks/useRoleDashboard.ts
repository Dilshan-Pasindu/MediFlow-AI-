import { useQuery } from '@tanstack/react-query';
import {
  apiGetPharmacistPrescriptions,
  apiGetPharmacistOrders,
} from '../services/api';
import type { Prescription } from '../types/prescription';
import type { Order } from '../types/order';

export function usePharmacistPrescriptions() {
  return useQuery<Prescription[]>({
    queryKey: ['pharmacist', 'prescriptions'],
    queryFn: apiGetPharmacistPrescriptions,
    staleTime: 1000 * 60 * 2,
  });
}

export function usePharmacistOrders() {
  return useQuery<Order[]>({
    queryKey: ['pharmacist', 'orders'],
    queryFn: apiGetPharmacistOrders,
    staleTime: 1000 * 30,
  });
}
