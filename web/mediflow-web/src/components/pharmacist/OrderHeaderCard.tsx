import React from 'react';

interface OrderHeaderCardProps {
  orderId: number;
  patientName: string;
  createdAt: string;
}

export const OrderHeaderCard: React.FC<OrderHeaderCardProps> = ({ orderId, patientName, createdAt }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
      <div>
        <span className="text-xs font-mono font-bold text-gray-500">Order #{orderId}</span>
        <h4 className="text-sm font-semibold text-gray-900">{patientName}</h4>
      </div>
      <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  );
};
