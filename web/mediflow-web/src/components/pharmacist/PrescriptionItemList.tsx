import React from 'react';
import { PrescriptionItem } from '../../types/prescription';

interface PrescriptionItemListProps {
  items: PrescriptionItem[];
}

export const PrescriptionItemList: React.FC<PrescriptionItemListProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-1.5 my-2">
      {items.map((item, idx) => (
        <div key={item.medicineId || idx} className="flex justify-between items-center text-xs text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded">
          <span className="font-medium text-gray-900">{item.medicineName}</span>
          <span className="text-gray-500">{item.dosage} &times; {item.quantity}</span>
        </div>
      ))}
    </div>
  );
};
