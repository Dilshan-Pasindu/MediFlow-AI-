import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Star, Award, Building, GraduationCap,
  Globe, Calendar, DollarSign, CheckCircle2,
  FileCheck, Shield, MessageSquare, Clock
} from 'lucide-react';
import type { DoctorDetail } from '../types/doctor';

interface DoctorProfileModalProps {
  doctor: DoctorDetail | null;
  isOpen: boolean;
  onClose: () => void;
  showBookButton?: boolean;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  isOpen,
  onClose,
  showBookButton = true,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !doctor) return null;

  const handleBookNow = () => {
    onClose();
    navigate(`/doctors/${doctor.id}/book`);
  };

  const reviews = doctor.reviews || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Doctor Photo / Avatar */}
            <div className="relative">
              {doctor.profilePhoto ? (
                <img
                  src={doctor.profilePhoto}
                  alt={doctor.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white/30 shadow-md bg-white/10"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 border-4 border-white/30 shadow-md flex items-center justify-center text-3xl font-bold">
                  {doctor.fullName?.charAt(0) || 'D'}
                </div>
              )}
              {doctor.isActive && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow" title="Available for consultations" />
              )}
            </div>

            {/* Doctor Title and Quick Stats */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white tracking-wide uppercase">
                  {doctor.specialties?.[0]?.name || 'Specialist'}
                </span>
                {doctor.subSpecialty && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-400/30 text-sky-100">
                    {doctor.subSpecialty}
                  </span>
                )}
                {doctor.registrationNumber && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-200 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SLMC #{doctor.registrationNumber}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                {doctor.fullName}
              </h2>
              <p className="text-white/80 text-sm mb-3">
                {doctor.qualifications}
              </p>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium">
                <div className="flex items-center gap-1 bg-amber-400/20 text-amber-200 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white text-sm">
                    {doctor.averageRating ? doctor.averageRating.toFixed(1) : '5.0'}
                  </span>
                  <span className="text-white/70">({doctor.reviewCount || reviews.length} reviews)</span>
                </div>

                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Clock className="w-4 h-4 text-sky-200" />
                  <span>{doctor.experienceYears || 5}+ Yrs Exp</span>
                </div>

                {doctor.hospitalClinic && (
                  <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Building className="w-4 h-4 text-sky-200" />
                    <span>{doctor.hospitalClinic}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Bio / Overview */}
          {doctor.bio && (
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2">
                About the Specialist
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {doctor.bio}
              </p>
            </div>
          )}

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medical Education & Degrees */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Education & Medical Degrees</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {doctor.mbbsUniversity && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>MBBS:</strong> {doctor.mbbsUniversity}</span>
                  </li>
                )}
                {doctor.phdUniversity && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Postgraduate / Fellowship:</strong> {doctor.phdUniversity}</span>
                  </li>
                )}
                {doctor.otherQualifications && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Advanced Diplomas:</strong> {doctor.otherQualifications}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Practice Details & Languages */}
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Practice & Accreditation</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {doctor.certifications && (
                  <li className="flex items-start gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Certifications:</strong> {doctor.certifications}</span>
                  </li>
                )}
                {doctor.languages && (
                  <li className="flex items-start gap-2">
                    <Globe className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Languages:</strong> {doctor.languages}</span>
                  </li>
                )}
                {doctor.location && (
                  <li className="flex items-start gap-2">
                    <Building className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Practice Location:</strong> {doctor.location}</span>
                  </li>
                )}
                {doctor.age && (
                  <li className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Age:</strong> {doctor.age} years</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Consultation Fee Callout */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-800 font-medium">Standard Consultation Fee</p>
                <p className="text-xl font-bold text-emerald-950">
                  LKR {doctor.consultationFee?.toLocaleString() ?? '2,500.00'}
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-700 text-center sm:text-right">
              Includes comprehensive clinical assessment & digital prescription.
            </p>
          </div>

          {/* Patient Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                Verified Patient Reviews
                <span className="text-xs text-slate-400 font-normal">
                  ({reviews.length} written reviews)
                </span>
              </h3>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{rev.patientName}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.review && (
                      <p className="text-slate-600 italic">"{rev.review}"</p>
                    )}
                    <span className="text-[10px] text-slate-400 block">
                      Consultation verified • {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
                No written patient reviews yet. Patients can submit feedback after their completed consultation.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition"
          >
            Close
          </button>
          {showBookButton && (
            <button
              type="button"
              onClick={handleBookNow}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-sm font-semibold shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Consultation Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;
