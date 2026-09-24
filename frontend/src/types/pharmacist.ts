import { PrescriptionStatus } from './prescription';
import { OrderStatus } from './order';

export interface PharmacistMetrics {
  pendingPrescriptionsCount: number;
  activeOrdersCount: number;
  completedTodayCount: number;
}

export interface PharmacistFilterOptions {
  status?: PrescriptionStatus | OrderStatus;
  searchTerm?: string;
}
