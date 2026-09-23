import { useState } from 'react';
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
          {ratingModalAppt && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
              onClick={handleCloseRatingModal}
            >
              <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-slate-800"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCloseRatingModal}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="text-center mb-5">
                  <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200 shadow-sm">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {ratingModalAppt.hasRated || ratedApptIds.has(ratingModalAppt.id)
                      ? 'Update Consultation Review'
                      : 'Rate Your Consultation'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Dr. {ratingModalAppt.doctorName} • {ratingModalAppt.specialtyName || 'Specialist'}
                  </p>
                </div>

                {ratingSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-sm font-medium space-y-1">
                    <CheckCircle2 size={24} className="text-emerald-600 mx-auto mb-1" />
                    <div>{ratingSuccess}</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitRating} className="space-y-4">
                    {ratingError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{ratingError}</span>
                      </div>
                    )}

                    {/* Star Rating Selector */}
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="flex items-center gap-2 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingScore(star)}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                            id={`star-btn-${star}`}
                          >
                            <Star
                              size={32}
                              className={
                                star <= ratingScore
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200 hover:text-amber-200'
                              }
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {ratingScore === 5 && 'Outstanding Care (5/5)'}
                        {ratingScore === 4 && 'Very Good Consultation (4/5)'}
                        {ratingScore === 3 && 'Average Experience (3/5)'}
                        {ratingScore === 2 && 'Needs Improvement (2/5)'}
                        {ratingScore === 1 && 'Unsatisfactory (1/5)'}
                      </span>
                    </div>

                    {/* Review Comments */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Written Review <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience regarding the doctor's communication, diagnosis explanation, and care quality..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        id="review-comment-textarea"
                      />
                      <span className="text-[10px] text-slate-400 block text-right mt-0.5">
                        {reviewText.length}/500
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleCloseRatingModal}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={ratingSubmitting}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-500/20 transition disabled:opacity-50"
                        id="submit-rating-btn"
                      >
                        {ratingSubmitting
                          ? 'Submitting...'
                          : (ratingModalAppt.hasRated || ratedApptIds.has(ratingModalAppt.id) ? 'Update Review' : 'Submit Review')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
