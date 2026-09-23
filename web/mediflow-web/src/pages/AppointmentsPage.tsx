import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Clock, ChevronRight, Plus, FileText, Calendar,
  Star, MessageSquare, X, CheckCircle2, AlertCircle,
  ThumbsUp, Info, User
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import NowConsultingCard from '../components/NowConsultingCard';
import DoctorProfileModal from '../components/DoctorProfileModal';
import { useMyAppointments, useRateAppointment } from '../hooks';

const STATUS = {
  Pending:          { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', label: 'Payment Sent' },
  Confirmed:        { color: '#059669', bg: '#ECFDF5', label: 'Confirmed' },
  InConsultation:   { color: '#DC2626', bg: '#FEF2F2', label: '🔴 In Consultation' },
  Completed:        { color: '#6366F1', bg: '#EEF2FF', label: 'Completed' },
  Cancelled:        { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelled' },
  NoShow:           { color: '#64748B', bg: '#F1F5F9', label: 'No Show' },
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const { data: appointments = [], isLoading: loading, refetch } = useMyAppointments();
  const rateAppointmentMutation = useRateAppointment();

  // Doctor Profile Modal State
  const [profileDoctor, setProfileDoctor] = useState<any | null>(null);

  // Rating Modal State
  const [ratingModalAppt, setRatingModalAppt] = useState<any | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [ratingSubmitting, setRatingSubmitting] = useState<boolean>(false);
  const [ratingSuccess, setRatingSuccess] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratedApptIds, setRatedApptIds] = useState<Set<number>>(new Set());

  const upcomingAppts = appointments.filter(a => ['Confirmed', 'InConsultation', 'PaymentSubmitted', 'Pending'].includes(a.status));
  const pastAppts = appointments.filter(a => ['Completed', 'Cancelled', 'NoShow'].includes(a.status));
  const displayAppts = activeTab === 'upcoming' ? upcomingAppts : pastAppts;

  const handleOpenRatingModal = (appt: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setRatingModalAppt(appt);
    const existingStars = appt.rating?.stars ?? appt.rating?.Stars ?? 5;
    const existingComment = appt.rating?.comment ?? appt.rating?.Comment ?? '';
    setRatingScore(existingStars);
    setReviewText(existingComment);
    setRatingSuccess(null);
    setRatingError(null);
  };

  const handleCloseRatingModal = () => {
    setRatingModalAppt(null);
    setRatingSuccess(null);
    setRatingError(null);
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalAppt) return;
    if (ratingScore < 1 || ratingScore > 5) {
      setRatingError('Please select a star rating between 1 and 5.');
      return;
    }

    setRatingSubmitting(true);
    setRatingError(null);

    try {
      await rateAppointmentMutation.mutateAsync({
        appointmentId: ratingModalAppt.id,
        rating: ratingScore,
        review: reviewText.trim() || undefined,
      });

      setRatedApptIds(prev => new Set(prev).add(ratingModalAppt.id));
      setRatingSuccess('Thank you! Your feedback has been submitted and doctor profile updated.');
      refetch();
      setTimeout(() => {
        handleCloseRatingModal();
      }, 1800);
    } catch (err: any) {
      setRatingError(err?.response?.data?.message || err?.message || 'Could not submit rating. Please try again.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="My Appointments"
          subtitle="Manage your upcoming visits and view past history"
          actions={
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/find-doctor')} id="book-new-appointment-btn">
              <Plus size={14} /> Book Appointment
            </button>
          }
        />
        <div className="page-body fade-in">

          {/* 🔴 Real-Time Now Consulting Banner */}
          <NowConsultingCard style={{ marginBottom: 24 }} />

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Upcoming', value: upcomingAppts.length, color: '#0369A1', bg: 'var(--med-blue-50)' },
              { label: 'Completed', value: pastAppts.filter(a => a.status === 'Completed').length, color: '#059669', bg: '#ECFDF5' },
              { label: 'Total', value: appointments.length, color: '#6366F1', bg: '#EEF2FF' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900, color: s.color }}>
                    {loading ? '—' : s.value}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>appointments</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="tabs">
              <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')} id="tab-upcoming">
                Upcoming ({upcomingAppts.length})
              </button>
              <button className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')} id="tab-past">
                Past ({pastAppts.length})
              </button>
            </div>
          </div>

          {/* Appointment List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--r-md)' }} />)}
            </div>
          ) : displayAppts.length === 0 ? (
            <div className="empty-state card">
              <Calendar size={36} style={{ color: 'var(--med-blue)', margin: '0 auto 12px' }} />
              <div className="empty-title">No {activeTab} appointments</div>
              <div className="empty-sub">You don't have any {activeTab} appointments.</div>
              {activeTab === 'upcoming' && (
                <button className="btn btn-primary" onClick={() => navigate('/find-doctor')} id="empty-book-appointment-btn">
                  Book an Appointment
                </button>
              )}
            </div>
          ) : (
            <div className="appt-list">
              {displayAppts.map(appt => {
                const d = new Date(appt.appointmentDateTime);
                const st = (STATUS as any)[appt.status] || STATUS.Pending;
                const isCompleted = appt.status === 'Completed';
                const hasRated = ratedApptIds.has(appt.id) || appt.hasRated;

                return (
                  <div
                    key={appt.id}
                    className="appt-card"
                    onClick={() => navigate(`/appointments/${appt.id}`)}
                    id={`appt-item-${appt.id}`}
                    style={appt.status === 'InConsultation' ? { border: '1.5px solid #F87171', background: '#FEF2F2' } : {}}
                  >
                    <div className="appt-date-block">
                      <div className="appt-day">{d.getDate()}</div>
                      <div className="appt-month">{d.toLocaleString('default', { month: 'short' })}</div>
                      <div className="appt-year">{d.getFullYear()}</div>
                    </div>
                    <div className="appt-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div className="appt-doctor">{appt.doctorName}</div>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            color: 'var(--med-blue)',
                            background: 'var(--med-blue-50)',
                            borderRadius: 6,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            border: '1px solid var(--med-blue-200)',
                            fontWeight: 600,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileDoctor({
                              id: appt.doctorId,
                              fullName: appt.doctorName,
                              specialtyName: appt.specialtyName,
                              profilePhoto: appt.doctorProfilePhoto,
                              fee: appt.fee,
                            });
                          }}
                          id={`view-doc-profile-${appt.id}`}
                          title="View Doctor Full Profile, Credentials & Reviews"
                        >
                          <Info size={11} /> Profile &amp; Reviews
                        </button>
                      </div>
                      {appt.specialtyName && <div className="appt-spec">{appt.specialtyName}</div>}
                      <div className="appt-time"><Clock size={11} /> {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      {appt.appointmentNumber && <div className="appt-num">{appt.appointmentNumber}</div>}
                    </div>

                    <div className="appt-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                        <div className="appt-fee">Rs. {appt.fee?.toLocaleString()}</div>
                      </div>

                      {/* Post-Consultation Rating System Action */}
                      {isCompleted && (
                        <div>
                          {hasRated ? (
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{
                                fontSize: 11,
                                padding: '3px 9px',
                                background: '#ECFDF5',
                                color: '#065F46',
                                border: '1px solid #A7F3D0',
                                borderRadius: 6,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                cursor: 'pointer',
                              }}
                              onClick={(e) => handleOpenRatingModal(appt, e)}
                              id={`edit-rating-btn-${appt.id}`}
                              title="Click to view or edit your submitted review"
                            >
                              <Star size={12} fill="#059669" color="#059669" /> Rated ({appt.rating?.stars || appt.rating?.Stars || 5}★) • Edit
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{
                                fontSize: 11,
                                padding: '3px 9px',
                                background: '#FFFBEB',
                                color: '#B45309',
                                border: '1px solid #FDE68A',
                                borderRadius: 6,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                cursor: 'pointer',
                              }}
                              onClick={(e) => handleOpenRatingModal(appt, e)}
                              id={`rate-appt-btn-${appt.id}`}
                            >
                              <Star size={12} fill="#F59E0B" color="#F59E0B" /> Rate &amp; Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pre-Booking / Post-Consultation Doctor Profile Modal */}
          <DoctorProfileModal
            doctor={profileDoctor}
            isOpen={Boolean(profileDoctor)}
            onClose={() => setProfileDoctor(null)}
            showBookButton={true}
          />

          {/* Post-Consultation Rating & Review Modal */}
          {ratingModalAppt && typeof document !== 'undefined' && createPortal(
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                background: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onClick={handleCloseRatingModal}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 460,
                  background: 'white',
                  borderRadius: 20,
                  boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                  border: '1px solid #E2E8F0',
                  padding: '24px 26px',
                  color: '#1E293B',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCloseRatingModal}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: '#FEF3C7',
                    color: '#D97706',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    border: '1px solid #FDE68A',
                  }}>
                    <Star size={24} fill="currentColor" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                    {ratingModalAppt.hasRated || ratedApptIds.has(ratingModalAppt.id)
                      ? 'Update Consultation Review'
                      : 'Rate Your Consultation'}
                  </h3>
                  <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                    Dr. {ratingModalAppt.doctorName} • {ratingModalAppt.specialtyName || 'Specialist'}
                  </p>
                </div>

                {ratingSuccess ? (
                  <div style={{
                    padding: '16px',
                    background: '#ECFDF5',
                    border: '1.5px solid #A7F3D0',
                    color: '#065F46',
                    borderRadius: 14,
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    <CheckCircle2 size={24} color="#059669" style={{ margin: '0 auto 6px', display: 'block' }} />
                    <div>{ratingSuccess}</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitRating} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {ratingError && (
                      <div style={{
                        padding: '10px 14px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#DC2626',
                        borderRadius: 10,
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <AlertCircle size={14} style={{ flexShrink: 0 }} />
                        <span>{ratingError}</span>
                      </div>
                    )}

                    {/* Star Rating Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingScore(star)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 4,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            id={`star-btn-${star}`}
                          >
                            <Star
                              size={32}
                              fill={star <= ratingScore ? '#F59E0B' : 'none'}
                              color={star <= ratingScore ? '#F59E0B' : '#CBD5E1'}
                            />
                          </button>
                        ))}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                        {ratingScore === 5 && 'Outstanding Care (5/5)'}
                        {ratingScore === 4 && 'Very Good Consultation (4/5)'}
                        {ratingScore === 3 && 'Average Experience (3/5)'}
                        {ratingScore === 2 && 'Needs Improvement (2/5)'}
                        {ratingScore === 1 && 'Unsatisfactory (1/5)'}
                      </span>
                    </div>

                    {/* Review Comments */}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                        Written Review <span style={{ color: '#94A3B8', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience regarding the doctor's communication, diagnosis explanation, and care quality..."
                        className="form-textarea"
                        id="review-comment-textarea"
                        style={{ width: '100%', fontSize: 12.5 }}
                      />
                      <span style={{ fontSize: 10.5, color: '#94A3B8', display: 'block', textAlign: 'right', marginTop: 4 }}>
                        {reviewText.length}/500
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                      <button
                        type="button"
                        onClick={handleCloseRatingModal}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 10,
                          border: '1px solid #CBD5E1',
                          background: 'white',
                          color: '#475569',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={ratingSubmitting}
                        id="submit-rating-btn"
                        style={{
                          padding: '8px 20px',
                          borderRadius: 10,
                          border: 'none',
                          background: 'linear-gradient(135deg, #D97706, #B45309)',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: ratingSubmitting ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
                        }}
                      >
                        {ratingSubmitting
                          ? 'Submitting...'
                          : (ratingModalAppt.hasRated || ratedApptIds.has(ratingModalAppt.id) ? 'Update Review' : 'Submit Review')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>,
            document.body
          )}

        </div>
      </div>
    </div>
  );
}
