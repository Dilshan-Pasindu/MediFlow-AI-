import React from 'react';
import { formatCurrency } from '../../utils/orderCalculations';

interface OrderPriceSummaryProps {
  totalAmount: number;
  isPaid?: boolean;
}

export const OrderPriceSummary: React.FC<OrderPriceSummaryProps> = ({ totalAmount, isPaid }) => {
  return (
    <div className="flex items-center space-x-2 text-sm font-semibold">
      <span className="text-gray-500">Total:</span>
      <span className="text-gray-900">{formatCurrency(totalAmount)}</span>
      {isPaid && (
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-normal">
          Paid
        </span>
      )}
    </div>
  );
};
