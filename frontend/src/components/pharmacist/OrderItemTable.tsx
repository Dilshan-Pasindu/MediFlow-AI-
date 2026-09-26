import React from 'react';
import { OrderItem } from '../../types/order';
import { formatCurrency } from '../../utils/orderCalculations';

interface OrderItemTableProps {
  items: OrderItem[];
}

export const OrderItemTable: React.FC<OrderItemTableProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <table className="w-full text-left text-xs border-collapse my-2">
      <thead>
        <tr className="border-b border-gray-200 text-gray-400">
          <th className="py-1">Medicine</th>
          <th className="py-1 text-center">Qty</th>
          <th className="py-1 text-right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className="border-b border-gray-50 text-gray-700">
            <td className="py-1 font-medium">{item.medicineName}</td>
            <td className="py-1 text-center">{item.quantity}</td>
            <td className="py-1 text-right">{formatCurrency(item.subtotal || item.unitPrice * item.quantity)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
