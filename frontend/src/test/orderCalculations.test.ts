import { describe, it, expect } from 'vitest';
import { calculateOrderSubtotal, formatCurrency } from '../utils/orderCalculations';
import type { OrderItem } from '../types/order';

describe('Order Calculations Utility', () => {
  it('calculates order subtotal accurately for multiple items', () => {
    const items: OrderItem[] = [
      {
        medicineId: 101,
        medicineName: 'Amoxicillin 500mg',
        dosage: '500mg',
        quantity: 2,
        unitPrice: 50.0,
        subtotal: 100.0,
      },
      {
        medicineId: 102,
        medicineName: 'Paracetamol 500mg',
        dosage: '500mg',
        quantity: 4,
        unitPrice: 15.5,
        subtotal: 62.0,
      },
    ];

    const subtotal = calculateOrderSubtotal(items);
    expect(subtotal).toBe(162.0);
  });

  it('returns 0 when item list is empty or null', () => {
    expect(calculateOrderSubtotal([])).toBe(0);
    // @ts-expect-error Testing edge case handling
    expect(calculateOrderSubtotal(null)).toBe(0);
  });

  it('formats currency with two decimal places and LKR prefix', () => {
    expect(formatCurrency(100)).toBe('LKR 100.00');
    expect(formatCurrency(1250.75)).toBe('LKR 1,250.75');
    expect(formatCurrency(0)).toBe('LKR 0.00');
  });
});
