import React from 'react';

interface PharmacistStatCardProps {
  label: string;
  value: number | string;
  icon?: string;
  accentColor?: string;
}

export const PharmacistStatCard: React.FC<PharmacistStatCardProps> = ({ label, value, icon = '💊', accentColor = 'border-l-indigo-500' }) => {
  return (
    <div className={`bg-white p-4 rounded-xl border border-gray-100 border-l-4 ${accentColor} shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-base">{icon}</span>
      </div>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};
