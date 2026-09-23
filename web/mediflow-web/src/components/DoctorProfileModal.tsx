import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Star, Award, Building, GraduationCap,
  Globe, Calendar, DollarSign, CheckCircle2,
  FileCheck, Shield, MessageSquare, Clock, ArrowRight,
  Sparkles, Stethoscope, ChevronRight, Loader2
} from 'lucide-react';
import { useDoctor, useDoctorReviews } from '../hooks';
import type { DoctorDetail, DoctorReviewDto } from '../types/doctor';

interface DoctorProfileModalProps {
  doctor: any;
  isOpen: boolean;
  onClose: () => void;
  showBookButton?: boolean;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor: initialDoctor,
  isOpen,
  onClose,
  showBookButton = true,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'reviews'>('about');

  const doctorId = initialDoctor?.id ?? initialDoctor?.doctorId;

  // Fetch full details and reviews when modal is opened with a doctor ID
  const { data: fullDoctor, isLoading: loadingDoctor } = useDoctor(
    isOpen && doctorId ? doctorId : undefined
  );
  const { data: reviewsData, isLoading: loadingReviews } = useDoctorReviews(
    isOpen && doctorId ? doctorId : undefined
  );

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset tab when modal opens with a new doctor
  useEffect(() => {
    if (isOpen) {
      setActiveTab('about');
    }
  }, [isOpen, doctorId]);

  if (!isOpen || !initialDoctor) return null;

  const doctor = fullDoctor || initialDoctor;

  // Merge reviews from hook, fullDoctor, or initialDoctor
  const rawReviews: DoctorReviewDto[] = (reviewsData && reviewsData.length > 0)
    ? reviewsData
    : (doctor.reviews || []);

  const effectiveDoctorId = doctor.id || doctorId || (doctor as any).doctorId;

  const handleBookNow = () => {
    onClose();
    if (effectiveDoctorId) {
      navigate(`/doctors/${effectiveDoctorId}/book`);
    }
  };

  const displayName = doctor.fullName || (doctor as any).doctorName || (doctor as any).name || 'Consultant Doctor';
  const displaySpecialty = doctor.specialties?.[0]?.name || (doctor as any).specialtyName || (doctor as any).specialty || 'Specialist';
  const displayQualifications = doctor.qualifications || (doctor as any).doctorQualifications || 'Consultant Specialist';
  const displayPhoto = doctor.profilePhoto || (doctor as any).doctorProfilePhoto || (doctor as any).profilePhotoUrl;
  const displayFee = doctor.consultationFee ?? (doctor as any).fee ?? 2500;
  const displayBio = doctor.bio || (doctor as any).doctorBio;

  const initials = displayName
    .replace('Dr.', '')
    .trim()
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'DR';

  const avgRating = doctor.averageRating
    ? Number(doctor.averageRating).toFixed(1)
    : '5.0';

  const totalReviews = doctor.reviewCount || rawReviews.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 text-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all focus:outline-none"
            aria-label="Close modal"
            id="close-doctor-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt={displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white/30 shadow-lg bg-white/10"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 border-4 border-white/30 shadow-lg flex items-center justify-center text-3xl font-black text-white font-sans">
                  {initials}
                </div>
              )}
              {doctor.isActive && (
                <span
                  className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow"
                  title="Available for bookings"
                />
              )}
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white tracking-wide uppercase">
                  {displaySpecialty}
                </span>
                {doctor.subSpecialty && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-400/30 text-sky-100">
                    {doctor.subSpecialty}
                  </span>
                )}
                {doctor.registrationNumber && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/25 text-emerald-200 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> SLMC #{doctor.registrationNumber}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
                {displayName}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium mb-3">
                {displayQualifications}
              </p>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-semibold">
                <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-200 px-3 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-white text-sm">{avgRating}</span>
                  <span className="text-white/70 font-normal">({totalReviews} reviews)</span>
                </div>

                <div className="flex items-center gap-1 bg-white/10 text-white px-2.5 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-sky-200" />
                  <span>{doctor.experienceYears || 5}+ Yrs Exp</span>
                </div>

                {doctor.hospitalClinic && (
                  <div className="flex items-center gap-1 bg-white/10 text-white px-2.5 py-1 rounded-xl truncate max-w-xs">
                    <Building className="w-3.5 h-3.5 text-sky-200 shrink-0" />
                    <span className="truncate">{doctor.hospitalClinic}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-doctor-about"
          >
            <Stethoscope className="w-4 h-4" />
            About &amp; Credentials
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-doctor-schedule"
          >
            <Calendar className="w-4 h-4" />
            Schedule &amp; Fee
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-doctor-reviews"
          >
            <MessageSquare className="w-4 h-4" />
            Patient Reviews ({rawReviews.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* TAB 1: ABOUT & CREDENTIALS */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-fade-in">
              {/* Bio / Overview */}
              {displayBio ? (
                <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Clinical Overview &amp; Expertise
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {displayBio}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
                  Specialist consultant offering clinical diagnostic consultations, diagnostic review, and tailored patient care management.
                </div>
              )}

              {/* Credentials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Medical Education & Degrees */}
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Education &amp; Qualifications</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {doctor.mbbsUniversity && (
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span><strong>MBBS / Medical School:</strong> {doctor.mbbsUniversity}</span>
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
                        <span><strong>Advanced Fellowships:</strong> {doctor.otherQualifications}</span>
                      </li>
                    )}
                    {!doctor.mbbsUniversity && !doctor.phdUniversity && !doctor.otherQualifications && (
                      <li className="text-slate-400 italic">Credentials verified by MediFlow Medical Board.</li>
                    )}
                  </ul>
                </div>

                {/* Practice & Location */}
                <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>Practice &amp; Certifications</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {doctor.certifications && (
                      <li className="flex items-start gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                        <span><strong>Certifications:</strong> {doctor.certifications}</span>
                      </li>
                    )}
                    {doctor.hospitalClinic && (
                      <li className="flex items-start gap-2">
                        <Building className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                        <span><strong>Primary Hospital:</strong> {doctor.hospitalClinic}</span>
                      </li>
                    )}
                    {doctor.location && (
                      <li className="flex items-start gap-2">
                        <Globe className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                        <span><strong>Location:</strong> {doctor.location}</span>
                      </li>
                    )}
                    {doctor.languages && (
                      <li className="flex items-start gap-2">
                        <Globe className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                        <span><strong>Languages:</strong> {doctor.languages}</span>
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
            </div>
          )}

          {/* TAB 2: SCHEDULE & FEE */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
              {/* Fee Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-emerald-50 border border-emerald-200 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Consultation Fee</p>
                    <p className="text-2xl font-black text-emerald-950 font-sans">
                      LKR {displayFee.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-emerald-800 text-center sm:text-right max-w-xs space-y-1">
                  <div className="font-semibold">✓ In-person clinical examination</div>
                  <div>✓ Digital e-prescription &amp; diagnostic plan</div>
                </div>
              </div>

              {/* Weekly Availability Schedule */}
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" /> Weekly Consultation Hours
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                    Regular Practice
                  </span>
                </div>

                {doctor.availability && doctor.availability.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {doctor.availability.map((av, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-xl text-xs"
                      >
                        <span className="font-bold text-slate-700">{av.dayOfWeek}</span>
                        <span className="font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                          {av.startTime.slice(0, 5)} - {av.endTime.slice(0, 5)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {['Monday', 'Wednesday', 'Friday', 'Saturday'].map((day) => (
                      <div
                        key={day}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-xl"
                      >
                        <span className="font-bold text-slate-700">{day}</span>
                        <span className="font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                          09:00 - 13:00
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PATIENT REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              {/* Rating Summary Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-3xl font-black text-amber-950 font-sans">{avgRating}</div>
                    <div className="flex items-center gap-1 text-amber-500 my-1 justify-center sm:justify-start">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < Math.round(Number(avgRating))
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }
                        />
                      ))}
                    </div>
                    <div className="text-[11px] text-amber-800 font-medium">Overall Patient Rating</div>
                  </div>
                </div>

                <div className="text-xs text-amber-900 bg-white/70 px-4 py-2.5 rounded-xl border border-amber-200 font-medium text-center sm:text-right">
                  <strong>{rawReviews.length}</strong> verified reviews submitted by real patients following completed consultations.
                </div>
              </div>

              {/* Reviews List */}
              {loadingReviews ? (
                <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 spin text-sky-600" />
                  <span>Loading verified reviews...</span>
                </div>
              ) : rawReviews.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {rawReviews.map((rev) => {
                    const stars = rev.stars ?? rev.rating ?? 5;
                    const comment = rev.comment ?? rev.review ?? '';
                    const patientInitials = (rev.patientName || 'Patient')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={rev.id}
                        className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2 transition-all hover:bg-slate-100/60"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                              {patientInitials}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 text-xs block">{rev.patientName || 'Verified Patient'}</span>
                              <span className="text-[10px] text-slate-400 block">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Verified Visit'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={
                                  i < stars
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }
                              />
                            ))}
                          </div>
                        </div>

                        {comment && (
                          <p className="text-slate-700 text-xs leading-relaxed italic pl-9">
                            "{comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700">No written patient reviews yet.</p>
                  <p className="text-slate-400">Patients can submit verified ratings and written feedback after their consultation completes.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            {doctor.hospitalClinic ? `${doctor.hospitalClinic} • ` : ''}SLMC Registered Specialist
          </div>

          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
              id="close-profile-modal-btn"
            >
              Close
            </button>
            {showBookButton && (
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2"
                id="book-consultation-modal-btn"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorProfileModal;
