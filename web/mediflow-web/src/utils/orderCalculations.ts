import { OrderItem } from '../types/order';

/**
 * Calculates the subtotal for a list of order items based on unit price and quantity.
 */
export function calculateOrderSubtotal(items: OrderItem[]): number {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

/**
 * Formats currency values consistently in LKR format.
 */
export function formatCurrency(amount: number): string {
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
