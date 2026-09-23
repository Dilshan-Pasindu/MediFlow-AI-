import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X, Star, Award, Building, GraduationCap,
  Globe, Calendar, DollarSign, CheckCircle2,
  FileCheck, Shield, MessageSquare, Clock, ArrowRight,
  Sparkles, Stethoscope, Loader2
} from 'lucide-react';
import { useDoctor, useDoctorReviews } from '../hooks';
import type { DoctorReviewDto } from '../types/doctor';

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

  const { data: fullDoctor } = useDoctor(isOpen && doctorId ? doctorId : undefined);
  const { data: reviewsData, isLoading: loadingReviews } = useDoctorReviews(
    isOpen && doctorId ? doctorId : undefined
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setActiveTab('about');
  }, [isOpen, doctorId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !initialDoctor) return null;

  const doctor = fullDoctor || initialDoctor;
  const rawReviews: DoctorReviewDto[] = (reviewsData && reviewsData.length > 0)
    ? reviewsData
    : (doctor.reviews || []);

  const effectiveDoctorId = doctor.id || doctorId || doctor.doctorId;

  const handleBookNow = () => {
    onClose();
    if (effectiveDoctorId) navigate(`/doctors/${effectiveDoctorId}/book`);
  };

  const displayName = doctor.fullName || doctor.doctorName || doctor.name || 'Consultant Doctor';
  const displaySpecialty = doctor.specialties?.[0]?.name || doctor.specialtyName || doctor.specialty || 'Specialist';
  const displayQualifications = doctor.qualifications || doctor.doctorQualifications || 'Consultant Specialist';
  const displayPhoto = doctor.profilePhoto || doctor.doctorProfilePhoto || doctor.profilePhotoUrl;
  const displayFee = doctor.consultationFee ?? doctor.fee ?? 2500;
  const displayBio = doctor.bio || doctor.doctorBio;

  const initials = displayName
    .replace('Dr.', '')
    .trim()
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'DR';

  const avgRating = doctor.averageRating ? Number(doctor.averageRating).toFixed(1) : '5.0';
  const totalReviews = doctor.reviewCount || rawReviews.length;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'docModalFade 0.2s ease',
      }}
    >
      <style>{`
        @keyframes docModalFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes docModalSlide { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .doc-tab-btn {
          padding: 11px 16px;
          font-size: 12.5px;
          font-weight: 700;
          border: none;
          border-bottom: 2.5px solid transparent;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
          white-space: nowrap;
          color: #64748B;
          font-family: Inter, sans-serif;
        }
        .doc-tab-btn.active { border-bottom-color: #0EA5E9; color: #0369A1; }
        .doc-tab-btn:not(.active):hover { color: #1E293B; background: rgba(0,0,0,0.03); }
        .doc-rev-card { padding: 14px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; }
        .doc-rev-card:hover { background: #F1F5F9; }
        .doc-cred-card { padding: 18px; border-radius: 14px; border: 1px solid #E2E8F0; background: #F8FAFC; }
      `}</style>

      {/* ─── Modal Container ─── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 760,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
          overflow: 'hidden',
          animation: 'docModalSlide 0.25s cubic-bezier(0.34, 1.4, 0.64, 1)',
        }}
      >
        {/* ─── Header ─── */}
        <div style={{
          background: 'linear-gradient(140deg, #075985 0%, #0369A1 45%, #1D4ED8 100%)',
          padding: '28px 28px 22px',
          color: 'white',
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: 80, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          {/* Close */}
          <button
            onClick={onClose}
            id="close-doctor-modal-btn"
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {displayPhoto ? (
                <img
                  src={displayPhoto}
                  alt={displayName}
                  style={{ width: 90, height: 90, borderRadius: 18, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.35)', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
                />
              ) : (
                <div style={{
                  width: 90, height: 90, borderRadius: 18,
                  background: 'rgba(255,255,255,0.18)',
                  border: '3px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, fontWeight: 900, fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}>
                  {initials}
                </div>
              )}
              <span style={{ position: 'absolute', bottom: 4, right: 4, width: 13, height: 13, borderRadius: '50%', background: '#34D399', border: '2.5px solid white', boxShadow: '0 0 8px rgba(52,211,153,0.7)' }} />
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.95)', padding: '2px 10px', borderRadius: 99 }}>
                  {displaySpecialty}
                </span>
                {doctor.subSpecialty && (
                  <span style={{ fontSize: 10.5, fontWeight: 600, background: 'rgba(14,165,233,0.3)', color: '#BAE6FD', padding: '2px 10px', borderRadius: 99 }}>
                    {doctor.subSpecialty}
                  </span>
                )}
                {doctor.registrationNumber && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, background: 'rgba(52,211,153,0.25)', color: '#A7F3D0', padding: '2px 10px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Shield size={10} /> SLMC #{doctor.registrationNumber}
                  </span>
                )}
              </div>

              <h2 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1.15 }}>
                {displayName}
              </h2>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>
                {displayQualifications}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(251,191,36,0.2)', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                  <Star size={13} fill="#FCD34D" color="#FCD34D" />
                  <span style={{ color: 'white', fontWeight: 900 }}>{avgRating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, fontSize: 11 }}>({totalReviews} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)', color: 'white', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                  <Clock size={12} color="#BAE6FD" />
                  {doctor.experienceYears || 5}+ Yrs Experience
                </div>
                {doctor.hospitalClinic && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)', color: 'white', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                    <Building size={12} color="#BAE6FD" />
                    <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doctor.hospitalClinic}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid #E2E8F0', background: '#F8FAFC', paddingLeft: 12, paddingRight: 12, flexShrink: 0, overflowX: 'auto' }}>
          {([
            { key: 'about' as const, icon: <Stethoscope size={13} />, label: 'About & Credentials' },
            { key: 'schedule' as const, icon: <Calendar size={13} />, label: 'Schedule & Fee' },
            { key: 'reviews' as const, icon: <MessageSquare size={13} />, label: `Patient Reviews (${rawReviews.length})` },
          ]).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`doc-tab-btn${activeTab === tab.key ? ' active' : ''}`}
              id={`tab-doc-${tab.key}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* ── About ── */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {displayBio ? (
                <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#F0F9FF)', border: '1px solid #BAE6FD', borderRadius: 16, padding: '16px 20px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 10.5, fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={12} color="#0EA5E9" /> Clinical Overview
                  </p>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#334155', lineHeight: 1.7 }}>{displayBio}</p>
                </div>
              ) : (
                <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 14, padding: '14px 18px', fontSize: 13, color: '#94A3B8', fontStyle: 'italic' }}>
                  Specialist consultant offering clinical diagnostic consultations and tailored patient care management.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="doc-cred-card">
                  <p style={{ margin: '0 0 12px', fontSize: 12.5, fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <GraduationCap size={15} color="#3B82F6" /> Education & Qualifications
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {doctor.mbbsUniversity && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#475569' }}>
                        <CheckCircle2 size={13} color="#3B82F6" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span><strong>MBBS:</strong> {doctor.mbbsUniversity}</span>
                      </div>
                    )}
                    {doctor.phdUniversity && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#475569' }}>
                        <CheckCircle2 size={13} color="#3B82F6" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span><strong>Postgrad:</strong> {doctor.phdUniversity}</span>
                      </div>
                    )}
                    {doctor.otherQualifications && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#475569' }}>
                        <CheckCircle2 size={13} color="#3B82F6" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span><strong>Fellowships:</strong> {doctor.otherQualifications}</span>
                      </div>
                    )}
                    {!doctor.mbbsUniversity && !doctor.phdUniversity && !doctor.otherQualifications && (
                      <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>Credentials verified by MediFlow Medical Board.</p>
                    )}
                  </div>
                </div>

                <div className="doc-cred-card">
                  <p style={{ margin: '0 0 12px', fontSize: 12.5, fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Award size={15} color="#6366F1" /> Practice & Affiliations
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {doctor.certifications && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#475569' }}>
                        <FileCheck size={13} color="#6366F1" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span><strong>Certifications:</strong> {doctor.certifications}</span>
                      </div>
                    )}
                    {doctor.hospitalClinic && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#475569' }}>
                        <Building size={13} color="#6366F1" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span><strong>Hospital:</strong> {doctor.hospitalClinic}</span>
                      </div>
                    )}
                    {doctor.location && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#475569' }}>
                        <Globe size={13} color="#6366F1" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span><strong>Location:</strong> {doctor.location}</span>
                      </div>
                    )}
                    {doctor.languages && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#475569' }}>
                        <Globe size={13} color="#6366F1" style={{ marginTop: 1, flexShrink: 0 }} />
                        <span><strong>Languages:</strong> {doctor.languages}</span>
                      </div>
                    )}
                    {!doctor.certifications && !doctor.hospitalClinic && !doctor.location && !doctor.languages && (
                      <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>Practice details not yet provided.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Schedule & Fee ── */}
          {activeTab === 'schedule' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', background: 'linear-gradient(135deg,#ECFDF5,#F0FDF4)', border: '1px solid #86EFAC', borderRadius: 18, flexWrap: 'wrap', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 15, background: 'linear-gradient(135deg,#059669,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}>
                    <DollarSign size={22} color="white" />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: 10.5, fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Consultation Fee</p>
                    <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#064E3B', fontFamily: 'Outfit, sans-serif' }}>
                      LKR {Number(displayFee).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#065F46', lineHeight: 1.8 }}>
                  <div style={{ fontWeight: 600 }}>✓ In-person clinical examination</div>
                  <div>✓ Digital e-prescription issued</div>
                </div>
              </div>

              <div className="doc-cred-card">
                <p style={{ margin: '0 0 12px', fontSize: 12.5, fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Calendar size={15} color="#0EA5E9" /> Weekly Consultation Hours
                  <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '2px 10px', borderRadius: 99 }}>Active Schedule</span>
                </p>
                {doctor.availability && doctor.availability.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {doctor.availability.map((av: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 13px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12 }}>
                        <span style={{ fontWeight: 700, color: '#334155' }}>{av.dayOfWeek}</span>
                        <span style={{ fontWeight: 600, color: '#0369A1', background: '#EFF6FF', padding: '3px 10px', borderRadius: 8 }}>
                          {av.startTime.slice(0, 5)} – {av.endTime.slice(0, 5)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['Monday', 'Wednesday', 'Friday', 'Saturday'].map((day) => (
                      <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 13px', background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12 }}>
                        <span style={{ fontWeight: 700, color: '#334155' }}>{day}</span>
                        <span style={{ fontWeight: 600, color: '#0369A1', background: '#EFF6FF', padding: '3px 10px', borderRadius: 8 }}>09:00 – 13:00</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Reviews ── */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'linear-gradient(135deg,#FFFBEB,#FEF9C3)', border: '1px solid #FDE68A', borderRadius: 18, flexWrap: 'wrap', gap: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 38, fontWeight: 900, color: '#92400E', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{avgRating}</div>
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 4 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.round(Number(avgRating)) ? '#F59E0B' : 'none'} color={i < Math.round(Number(avgRating)) ? '#F59E0B' : '#D1D5DB'} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: '#B45309', marginTop: 4, fontWeight: 600 }}>Overall Rating</div>
                </div>
                <div style={{ fontSize: 12, color: '#92400E', background: 'rgba(255,255,255,0.8)', padding: '10px 16px', borderRadius: 12, border: '1px solid #FDE68A', fontWeight: 500, textAlign: 'right' }}>
                  <strong style={{ fontSize: 18, fontWeight: 900, display: 'block' }}>{rawReviews.length}</strong>
                  verified patient reviews
                </div>
              </div>

              {loadingReviews ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <Loader2 size={20} color="#0EA5E9" />
                  <span>Loading reviews...</span>
                </div>
              ) : rawReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                  {rawReviews.map((rev) => {
                    const stars = rev.stars ?? (rev as any).rating ?? 5;
                    const comment = rev.comment ?? (rev as any).review ?? '';
                    const patientInitials = (rev.patientName || 'P').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <div key={rev.id} className="doc-rev-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: comment ? 10 : 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {patientInitials}
                            </div>
                            <div>
                              <span style={{ fontWeight: 700, color: '#1E293B', fontSize: 12, display: 'block' }}>{rev.patientName || 'Verified Patient'}</span>
                              <span style={{ fontSize: 11, color: '#94A3B8' }}>
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Verified Visit'}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={13} fill={i < stars ? '#F59E0B' : 'none'} color={i < stars ? '#F59E0B' : '#D1D5DB'} />
                            ))}
                          </div>
                        </div>
                        {comment && (
                          <p style={{ margin: 0, fontSize: 12.5, color: '#475569', fontStyle: 'italic', lineHeight: 1.6, paddingLeft: 44 }}>
                            "{comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '40px 24px', textAlign: 'center', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <MessageSquare size={36} color="#CBD5E1" />
                  <p style={{ margin: 0, fontWeight: 700, color: '#475569', fontSize: 14 }}>No patient reviews yet</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>Reviews appear after consultations are completed</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div style={{ padding: '14px 26px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            {doctor.hospitalClinic ? `${doctor.hospitalClinic} · ` : ''}SLMC Registered Specialist
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              id="close-profile-modal-btn"
              style={{ padding: '8px 18px', borderRadius: 12, border: '1px solid #CBD5E1', color: '#475569', background: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Close
            </button>
            {showBookButton && (
              <button
                type="button"
                onClick={handleBookNow}
                id="book-consultation-modal-btn"
                style={{
                  padding: '8px 20px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #0369A1, #1D4ED8)',
                  color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 14px rgba(3,105,161,0.35)',
                }}
              >
                <Calendar size={14} />
                Book Consultation Now
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DoctorProfileModal;
