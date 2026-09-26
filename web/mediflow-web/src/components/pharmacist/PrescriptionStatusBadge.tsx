import React from 'react';

interface PrescriptionStatusBadgeProps {
  status: string;
}

export const PrescriptionStatusBadge: React.FC<PrescriptionStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case 'fulfilled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}>
      {status}
    </span>
  );
};
