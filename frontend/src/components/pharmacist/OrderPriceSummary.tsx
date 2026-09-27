import React from 'react';
import { formatCurrency } from '../../utils/orderCalculations';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderPriceSummaryProps {
  totalAmount: number;
  isPaid?: boolean;
}

export const OrderPriceSummary: React.FC<OrderPriceSummaryProps> = ({ totalAmount, isPaid }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-50 to-teal-50/30 border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-2xs overflow-hidden max-w-full">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex-shrink-0">Total:</span>
      <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-normal flex-shrink-0">{formatCurrency(totalAmount)}</span>
      {isPaid ? (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/90 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1 flex-shrink-0">
          <CheckCircle2 size={10} className="text-emerald-700" />
          Paid
        </span>
      ) : (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1 flex-shrink-0">
          <AlertCircle size={10} className="text-amber-600" />
          Unpaid
        </span>
      )}
    </div>
  );
};

