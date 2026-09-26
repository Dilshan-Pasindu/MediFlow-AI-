import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Search, Filter, Stethoscope, Clock, CheckCircle2,
  AlertCircle, AlertTriangle, ChevronRight, RefreshCw, FileText, User, Tag,
  ArrowUpDown, ShieldAlert, X, Sparkles, ArrowRight
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { useDoctorAppointments } from '../../hooks';
import type { ConsultationAppointment } from '../../types/consultation';
import { apiStartConsultation, apiCompleteConsultation } from '../../services/api';

// ─── Status Configuration ───────────────────────────────────────────────────

const STATUS_MAP: Record<string, { color: string; bg: string; border: string; label: string; dot: string }> = {
  Confirmed:        { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Confirmed',        dot: '#059669' },
  InConsultation:   { color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', label: 'In Consultation',  dot: '#DC2626' },
  Completed:        { color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', label: 'Completed',        dot: '#6366F1' },
  Pending:          { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Pending',          dot: '#F59E0B' },
  PaymentSubmitted: { color: '#0369A1', bg: '#F0F9FF', border: '#BAE6FD', label: 'Awaiting Verify', dot: '#0EA5E9' },
  Cancelled:        { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Cancelled',        dot: '#EF4444' },
};

const getStatusStyle = (status: string) => STATUS_MAP[status] ?? STATUS_MAP.Pending;

// ─── Date Formatter Helpers ─────────────────────────────────────────────────

function parseDateInfo(dateTimeStr: string) {
  const date = new Date(dateTimeStr);
  return {
    day: date.getDate(),
    month: date.toLocaleString('default', { month: 'short' }),
    year: date.getFullYear(),
    weekday: date.toLocaleString('default', { weekday: 'short' }),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    formattedDate: date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }),
    rawDateString: date.toISOString().split('T')[0],
  };
}

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const { data: appointments = [], isLoading, error, refetch, isRefetching } = useDoctorAppointments();

  const [activeConsultationSession, setActiveConsultationSession] = useState<{
    appointmentId: string;
    patientName: string;
    step: string;
    updatedAt: string;
  } | null>(null);

  useEffect(() => {
    const activeId = localStorage.getItem('mediflow_active_consultation_id');
    if (activeId) {
      const sessionKey = `mediflow_consultation_session_${activeId}`;
      const raw = sessionStorage.getItem(sessionKey) || localStorage.getItem(sessionKey);
      if (raw) {
        try {
          const session = JSON.parse(raw);
          if (session && !session.isCompleted) {
            setActiveConsultationSession({
              appointmentId: String(activeId),
              patientName: session.manualPatientName || session.autoFilledDraft?.patientName || 'Active Patient',
              step: session.step || 'review',
              updatedAt: session.updatedAt ? new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Compute filtered & sorted appointments
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appt) => {
        // Status filter
        if (selectedStatus !== 'ALL' && appt.status !== selectedStatus) return false;

        // Search query filter (patient name, appt number, notes)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = appt.patientName?.toLowerCase().includes(q);
          const matchesNumber = appt.appointmentNumber?.toLowerCase().includes(q);
          const matchesNotes = appt.notes?.toLowerCase().includes(q);
          if (!matchesName && !matchesNumber && !matchesNotes) return false;
        }

        // Date filter
        if (selectedDate) {
          const apptDate = new Date(appt.appointmentDateTime).toISOString().split('T')[0];
          if (apptDate !== selectedDate) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.appointmentDateTime).getTime();
        const timeB = new Date(b.appointmentDateTime).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
  }, [appointments, selectedStatus, searchQuery, selectedDate, sortOrder]);

  // Statistics counters
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(
      (a) => new Date(a.appointmentDateTime).toISOString().split('T')[0] === todayStr
    );

    return {
      total: appointments.length,
      today: todayAppts.length,
      inConsultation: appointments.filter((a) => a.status === 'InConsultation').length,
      confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
      completed: appointments.filter((a) => a.status === 'Completed').length,
      pending: appointments.filter((a) => a.status === 'Pending' || a.status === 'PaymentSubmitted').length,
    };
  }, [appointments]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedDate('');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedStatus !== 'ALL' || selectedDate !== '';

  const [consultError, setConsultError] = useState<string | null>(null);

  const handleStartConsultation = async (appt: ConsultationAppointment) => {
    setConsultError(null);
    const apptDate = new Date(appt.appointmentDateTime);
    const now = new Date();
    // Allow consultation if the appointment date is today or already passed
    const apptDay = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (apptDay > today) {
      setConsultError(`This appointment is scheduled for ${apptDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. You can only start consultations on or after the appointment date.`);
      return;
    }
    if (appt.status !== 'Confirmed' && appt.status !== 'InConsultation') {
      setConsultError('Only confirmed appointments can start a consultation.');
      return;
    }

    try {
      if (appt.status === 'Confirmed') {
        await apiStartConsultation(appt.id);
      }
      navigate(`/doctor/consultation/${appt.id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to start consultation';
      setConsultError(msg);
    }
  };

  const handleCompleteConsultation = async (apptId: number) => {
    try {
      await apiCompleteConsultation(apptId);
      refetch();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to complete consultation';
      setConsultError(msg);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Appointments & Consultations"
          subtitle="View appointment queue, review patient details, and manage clinical consultations."
        />

        <div className="page-body fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Active Consultation Resume Banner */}
          {activeConsultationSession && (
            <div
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#FFFFFF',
                borderRadius: 'var(--r-xl)',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 25px rgba(5, 150, 105, 0.25)',
                border: '1px solid #10B981'
              }}
              id="active-consultation-resume-banner-appointments-page"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Stethoscope size={24} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Ongoing Consultation In Progress</span>
                    <span style={{ fontSize: 11, background: '#10B981', color: '#FFFFFF', padding: '2px 10px', borderRadius: 12, textTransform: 'uppercase', fontWeight: 800 }}>
                      State Saved
                    </span>
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.95, marginTop: 3 }}>
                    Patient: <strong>{activeConsultationSession.patientName}</strong> (Appt #{activeConsultationSession.appointmentId}) • Stage: <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{activeConsultationSession.step}</span> {activeConsultationSession.updatedAt ? `• Last synced at ${activeConsultationSession.updatedAt}` : ''}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => navigate(`/doctor/consultation/${activeConsultationSession.appointmentId}`)}
                  className="btn"
                  style={{
                    background: '#FFFFFF',
                    color: '#047857',
                    fontWeight: 800,
                    fontSize: 13.5,
                    padding: '10px 22px',
                    borderRadius: 'var(--r-full)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    border: 'none'
                  }}
                  id="resume-active-consultation-btn-appointments"
                >
                  <Sparkles size={16} color="#059669" /> Resume Active Consultation <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Header Banner & Stats */}
          <div
            style={{
              background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
              borderRadius: 'var(--r-xl)',
              padding: '24px 28px',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <div style={{ maxWidth: 520 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, backdropFilter: 'blur(4px)', marginBottom: 8 }}>
                <Stethoscope size={14} /> Doctor Clinical Portal
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 700, margin: 0, color: '#FFF' }}>
                Patient Appointments Schedule
              </h2>
              <p style={{ fontSize: 13.5, color: '#D1FAE5', marginTop: 4, opacity: 0.9 }}>
                Select a confirmed patient appointment to launch the AI Diagnostic & E-Prescription workspace.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: 'var(--r-md)', minWidth: 100, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800 }}>{stats.total}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: 'var(--r-md)', minWidth: 100, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: '#FDE68A' }}>{stats.today}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: 0.5 }}>Today</div>
              </div>
              {stats.inConsultation > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.25)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: 'var(--r-md)', minWidth: 100, textAlign: 'center', border: '1px solid rgba(254, 202, 202, 0.5)' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: '#FECACA' }}>{stats.inConsultation}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#FECACA', textTransform: 'uppercase', letterSpacing: 0.5 }}>Consulting</div>
                </div>
              )}
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: 'var(--r-md)', minWidth: 100, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: '#6EE7B7' }}>{stats.confirmed}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirmed</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: 'var(--r-md)', minWidth: 100, textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: '#C7D2FE' }}>{stats.completed}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#C7D2FE', textTransform: 'uppercase', letterSpacing: 0.5 }}>Completed</div>
              </div>
            </div>
          </div>

          {/* Controls & Filter Bar */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Top Row: Search & Action Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Search Box */}
              <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
                <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="doctor-appt-search-input"
                  type="text"
                  placeholder="Search by patient name, appt #, or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                    color: 'var(--text-primary)',
                    fontSize: 13.5,
                    outline: 'none',
                    transition: 'var(--transition)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Date Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                <input
                  id="doctor-appt-date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Sort toggle */}
              <button
                id="doctor-appt-sort-toggle"
                onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 14px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ArrowUpDown size={15} />
                {sortOrder === 'asc' ? 'Earliest First' : 'Latest First'}
              </button>

              {/* Refresh button */}
              <button
                id="doctor-appt-refresh-btn"
                onClick={() => refetch()}
                disabled={isRefetching}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 14px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={15} className={isRefetching ? 'spin' : ''} />
                Refresh
              </button>
            </div>

            {/* Bottom Row: Status Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4, letterSpacing: 0.5 }}>
                  Status:
                </span>
                {[
                  { id: 'ALL', label: `All (${appointments.length})` },
                  ...(stats.inConsultation > 0 ? [{ id: 'InConsultation', label: `In Consultation (${stats.inConsultation})` }] : []),
                  { id: 'Confirmed', label: `Confirmed (${stats.confirmed})` },
                  { id: 'Completed', label: `Completed (${stats.completed})` },
                  { id: 'Pending', label: `Pending (${stats.pending})` },
                  { id: 'Cancelled', label: 'Cancelled' },
                ].map((tab) => {
                  const isActive = selectedStatus === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`filter-tab-${tab.id}`}
                      onClick={() => setSelectedStatus(tab.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--r-sm)',
                        fontSize: 12.5,
                        fontWeight: isActive ? 700 : 500,
                        border: isActive ? '1px solid #059669' : '1px solid var(--border)',
                        background: isActive ? '#ECFDF5' : 'var(--surface-2)',
                        color: isActive ? '#065F46' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {hasActiveFilters && (
                <button
                  id="doctor-appt-clear-filters"
                  onClick={clearFilters}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#DC2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginLeft: 'auto',
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Appointments List / Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Showing {filteredAppointments.length} appointment{filteredAppointments.length === 1 ? '' : 's'}
              </h3>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--r-md)',
                  padding: '16px 20px',
                  color: '#991B1B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={20} color="#DC2626" />
                <div style={{ fontSize: 13.5 }}>
                  <strong>Failed to load appointments:</strong> {(error as Error)?.message || 'Server error'}
                </div>
              </div>
            )}

            {/* Consultation Validation Error */}
            {consultError && (
              <div
                style={{
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: 'var(--r-md)',
                  padding: '14px 18px',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
                id="consult-validation-error"
              >
                <AlertCircle size={18} color="#D97706" />
                {consultError}
                <button
                  onClick={() => setConsultError(null)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', padding: 4 }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {/* Loading Skeletons */}
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    style={{
                      height: 90,
                      borderRadius: 'var(--r-md)',
                      background: 'var(--surface-3)',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              /* Empty State */
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px border-dashed var(--border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '48px 24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Calendar size={28} />
                </div>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  No Appointments Found
                </h4>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 18px' }}>
                  {hasActiveFilters
                    ? 'No records match your active search query or status filter. Try clearing filters.'
                    : 'You currently have no scheduled patient appointments in the system.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    style={{
                      background: '#059669',
                      color: '#FFF',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: 'var(--r-md)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Clear Search & Filters
                  </button>
                )}
              </div>
            ) : (
              /* Appointment List Cards */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredAppointments.map((appt) => {
                  const st = getStatusStyle(appt.status);
                  const { day, month, weekday, time, formattedDate } = parseDateInfo(appt.appointmentDateTime);
                  const isConfirmed = appt.status === 'Confirmed';
                  const isInConsultation = appt.status === 'InConsultation';
                  const isCompleted = appt.status === 'Completed';

                  return (
                    <div
                      key={appt.id}
                      id={`doctor-appt-card-${appt.id}`}
                      style={{
                        background: isInConsultation ? '#FFF5F5' : 'var(--surface)',
                        border: isInConsultation ? '1.5px solid #FCA5A5' : '1px solid var(--border)',
                        borderRadius: 'var(--r-lg)',
                        padding: '16px 20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        boxShadow: isInConsultation ? '0 4px 14px rgba(220, 38, 38, 0.12)' : 'var(--shadow-sm)',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        e.currentTarget.style.borderColor = isInConsultation ? '#EF4444' : isConfirmed ? '#059669' : 'var(--border-strong)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = isInConsultation ? '0 4px 14px rgba(220, 38, 38, 0.12)' : 'var(--shadow-sm)';
                        e.currentTarget.style.borderColor = isInConsultation ? '#FCA5A5' : 'var(--border)';
                      }}
                    >
                      {/* Left Block: Date Badge & Patient Metadata */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 }}>
                        {/* Date Pillar */}
                        <div
                          style={{
                            width: 60,
                            flexShrink: 0,
                            background: isInConsultation
                              ? 'linear-gradient(135deg,#FEE2E2,#FECACA)'
                              : isConfirmed
                              ? 'linear-gradient(135deg,#ECFDF5,#D1FAE5)'
                              : 'var(--surface-2)',
                            borderRadius: 'var(--r-md)',
                            padding: '10px 6px',
                            textAlign: 'center',
                            border: isInConsultation ? '1px solid #FCA5A5' : isConfirmed ? '1px solid #A7F3D0' : '1px solid var(--border)',
                          }}
                        >
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: isInConsultation ? '#991B1B' : isConfirmed ? '#065F46' : 'var(--text-primary)', lineHeight: 1 }}>
                            {day}
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: isInConsultation ? '#DC2626' : isConfirmed ? '#059669' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {month}
                          </div>
                          <div style={{ fontSize: 9.5, color: isInConsultation ? '#B91C1C' : isConfirmed ? '#047857' : 'var(--text-muted)', marginTop: 2 }}>
                            {weekday}
                          </div>
                        </div>

                        {/* Patient & Booking Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                              {appt.patientName || 'Anonymous Patient'}
                            </span>

                            {appt.appointmentNumber && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                                #{appt.appointmentNumber}
                              </span>
                            )}

                            {/* Medical badges */}
                            {appt.patientBloodGroup && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', background: '#FEF2F2', padding: '2px 7px', borderRadius: 6, border: '1px solid #FECACA' }}>
                                Blood: {appt.patientBloodGroup}
                              </span>
                            )}

                            {appt.patientAllergies && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#D97706', background: '#FFFBEB', padding: '2px 7px', borderRadius: 6, border: '1px solid #FDE68A', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <ShieldAlert size={11} /> {appt.patientAllergies}
                              </span>
                            )}
                          </div>

                          {/* Time & Specialty info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                              <Clock size={14} color={isInConsultation ? '#DC2626' : '#059669'} /> {time} ({formattedDate})
                            </span>
                            {appt.specialtyName && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Tag size={13} color="var(--text-muted)" /> {appt.specialtyName}
                              </span>
                            )}
                            {appt.fee != null && appt.fee > 0 && (
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                LKR {appt.fee.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Chief Complaint / Notes */}
                          {appt.notes && (
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <FileText size={12} /> Notes: "{appt.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Block: Status Badge & Action CTA */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                        {/* Status Badge */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            borderRadius: 99,
                            fontSize: 12,
                            fontWeight: 700,
                            background: st.bg,
                            color: st.color,
                            border: `1px solid ${st.border}`,
                          }}
                        >
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot }} />
                          {st.label}
                        </div>

                        {/* CTA Actions */}
                        {isInConsultation && (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button
                              id={`continue-consult-btn-${appt.id}`}
                              onClick={() => navigate(`/doctor/consultation/${appt.id}`)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '9px 18px',
                                borderRadius: 'var(--r-md)',
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(220,38,38,0.25)',
                                transition: 'var(--transition)',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                              <Stethoscope size={16} />
                              Continue Consultation
                              <ChevronRight size={15} />
                            </button>
                            <button
                              id={`complete-consult-btn-${appt.id}`}
                              onClick={() => handleCompleteConsultation(appt.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: '#FFFFFF',
                                color: '#059669',
                                border: '1px solid #A7F3D0',
                                padding: '9px 14px',
                                borderRadius: 'var(--r-md)',
                                fontSize: 12.5,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'var(--transition)',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#ECFDF5')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                            >
                              <CheckCircle2 size={14} />
                              Complete
                            </button>
                          </div>
                        )}

                        {isConfirmed && (
                          <button
                            id={`start-consult-btn-${appt.id}`}
                            onClick={() => handleStartConsultation(appt)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8,
                              background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '9px 18px',
                              borderRadius: 'var(--r-md)',
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(5,150,105,0.25)',
                              transition: 'var(--transition)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                          >
                            <Stethoscope size={16} />
                            Start Consultation
                            <ChevronRight size={15} />
                          </button>
                        )}

                        {isCompleted && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              id={`view-record-btn-${appt.id}`}
                              onClick={() => navigate(`/doctor/consultation/${appt.id}`)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: 'var(--surface-2)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                padding: '8px 14px',
                                borderRadius: 'var(--r-md)',
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              <FileText size={14} />
                              View Record
                            </button>
                            <button
                              id={`re-consult-btn-${appt.id}`}
                              onClick={() => {
                                if (window.confirm(
                                  `This appointment has already been completed.\n\nAre you sure you want to re-consult patient "${appt.patientName || 'Patient'}"?\n\nThis will open a new consultation workspace for this appointment.`
                                )) {
                                  navigate(`/doctor/consultation/${appt.id}`);
                                }
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: '#FEF3C7',
                                color: '#92400E',
                                border: '1px solid #FDE68A',
                                padding: '8px 14px',
                                borderRadius: 'var(--r-md)',
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'var(--transition)',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#FDE68A'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#FEF3C7'; }}
                            >
                              <RefreshCw size={14} />
                              Re-Consult
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
