import React from 'react';
import { Clock, Hash, User } from 'lucide-react';

interface OrderHeaderCardProps {
  orderId: number;
  patientName: string;
  createdAt: string;
}

export const OrderHeaderCard: React.FC<OrderHeaderCardProps> = ({ orderId, patientName, createdAt }) => {
  const formattedTime = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap max-w-full overflow-hidden">
      <span className="inline-flex items-center gap-1 bg-teal-50/90 text-teal-800 border border-teal-200/90 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold shadow-2xs shrink-0">
        <Hash size={12} className="text-teal-600" />
        Order #{orderId}
      </span>
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs overflow-hidden shrink-0">
        <User size={12} className="text-teal-600 shrink-0" />
        <h4 className="text-[11px] font-semibold text-slate-800 tracking-normal truncate">{patientName}</h4>
      </div>
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100/80 border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
        <Clock size={10} className="text-slate-400" />
        {formattedTime}
      </span>
    </div>
  );
};


