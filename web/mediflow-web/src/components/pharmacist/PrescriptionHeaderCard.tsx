import React from 'react';

interface PrescriptionHeaderCardProps {
  patientName: string;
  doctorName?: string;
  appointmentNumber?: string;
  createdAt: string;
}

export const PrescriptionHeaderCard: React.FC<PrescriptionHeaderCardProps> = ({
  patientName,
  doctorName,
  appointmentNumber,
  createdAt,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
      <div>
        <h4 className="text-base font-semibold text-gray-900">{patientName}</h4>
        {doctorName && <p className="text-xs text-gray-500">Issued by: {doctorName}</p>}
      </div>
      <div className="text-right">
        {appointmentNumber && (
          <span className="text-xs font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Appt #{appointmentNumber}
          </span>
        )}
        <p className="text-xs text-gray-400 mt-1">{new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
