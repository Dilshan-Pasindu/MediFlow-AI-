import React from 'react';

interface PharmacistEmptyStateProps {
  title: string;
  description: string;
}

export const PharmacistEmptyState: React.FC<PharmacistEmptyStateProps> = ({ title, description }) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 p-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3">
        ⚡
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};
