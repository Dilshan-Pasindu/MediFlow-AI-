import React from 'react';

interface PharmacistSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const PharmacistSearchFilter: React.FC<PharmacistSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search by patient name...',
}) => {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
    </div>
  );
};
