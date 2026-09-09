import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Calendar, CheckCircle2, Clock, ChevronRight,
  Brain, Activity, TrendingUp, Users, Star, AlertCircle,
  ClipboardList, Sparkles, ArrowRight, UserCheck,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { getUser } from '../../services/api';
import { useDoctorAppointments } from '../../hooks';
import type { ConsultationAppointment } from '../../types/consultation';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS: Record<string, { color: string; bg: string; border: string; label: string; dot: string }> = {
  Confirmed:        { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Confirmed',        dot: '#059669' },
  Completed:        { color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', label: 'Completed',        dot: '#6366F1' },
  Pending:          { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Pending',          dot: '#F59E0B' },
  PaymentSubmitted: { color: '#0369A1', bg: '#F0F9FF', border: '#BAE6FD', label: 'Awaiting Verify', dot: '#0EA5E9' },
  Cancelled:        { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Cancelled',        dot: '#EF4444' },
};
const getStatus = (s: string) => STATUS[s] ?? STATUS.Pending;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function fmtTime(dt: string) {
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(dt: string) {
  const d = new Date(dt);
  return { day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }), weekday: d.toLocaleString('default', { weekday: 'short' }) };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPICard({ icon: Icon, label, value, sub, color, bg, loading }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string;
  color: string; bg: string; loading: boolean;
}) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)', padding: '20px 22px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: 'var(--shadow-sm)', transition: 'var(--transition)',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--r-md)',
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {loading ? <span style={{ display: 'inline-block', width: 40, height: 28, background: 'var(--surface-3)', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} /> : value}
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function AppointmentRow({ appt, onConsult }: { appt: ConsultationAppointment; onConsult: () => void }) {
  const st = getStatus(appt.status);
  const { day, month, weekday } = fmtDate(appt.appointmentDateTime);
  const isConfirmed = appt.status === 'Confirmed';

  return (
    <div
      id={`doctor-appt-row-${appt.id}`}
      onClick={isConfirmed ? onConsult : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
        background: 'var(--surface)', cursor: isConfirmed ? 'pointer' : 'default',
        transition: 'var(--transition)',
      }}
      onMouseEnter={e => { if (isConfirmed) { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(5,150,105,0.12)'; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Date block */}
      <div style={{
        width: 50, flexShrink: 0, background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)',
        borderRadius: 'var(--r-sm)', padding: '8px 6px', textAlign: 'center',
        border: '1px solid #A7F3D0',
      }}>
        <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 800, color: '#065F46', lineHeight: 1 }}>{day}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: 0.5 }}>{month}</div>
        <div style={{ fontSize: 9, color: '#6EE7B7', fontWeight: 600, textTransform: 'uppercase' }}>{weekday}</div>
      </div>

      {/* Patient info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {appt.patientName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--text-secondary)' }}>
            <Clock size={11} /> {fmtTime(appt.appointmentDateTime)}
          </span>
          {appt.appointmentNumber && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0369A1', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 'var(--r-full)', padding: '1px 8px' }}>
              {appt.appointmentNumber}
            </span>
          )}
          {appt.specialtyName && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--r-full)', padding: '1px 8px' }}>
              {appt.specialtyName}
            </span>
          )}
        </div>
      </div>

      {/* Status + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{
          fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--r-full)',
          color: st.color, background: st.bg, border: `1px solid ${st.border}`,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
          {st.label}
        </span>
        {isConfirmed && (
          <button
            id={`start-consult-${appt.id}`}
            onClick={e => { e.stopPropagation(); onConsult(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
              background: 'var(--gradient-doctor)', color: 'white', borderRadius: 'var(--r-full)',
              fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5,150,105,0.3)', transition: 'var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(5,150,105,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(5,150,105,0.3)'; }}
          >
            <Stethoscope size={12} /> Consult
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const { data: appointments = [], isLoading: loading } = useDoctorAppointments();
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');

  const today = new Date().toDateString();

  const stats = useMemo(() => {
    const todayAll     = appointments.filter(a => new Date(a.appointmentDateTime).toDateString() === today);
    const todayQueue   = todayAll.filter(a => a.status === 'Confirmed');
    const allConfirmed = appointments.filter(a => a.status === 'Confirmed');
    const completed    = appointments.filter(a => a.status === 'Completed');
    const pending      = appointments.filter(a => a.status === 'Pending' || a.status === 'PaymentSubmitted');
    return { todayQueue, allConfirmed, completed, pending, todayAll };
  }, [appointments, today]);

  const displayAppts = useMemo(() =>
    activeTab === 'today' ? stats.todayQueue : stats.allConfirmed,
    [activeTab, stats]
  );

  const STEPS = [
    { n: '1', emoji: '👤', label: 'Review Patient History' },
    { n: '2', emoji: '🩺', label: 'Record Clinical Examination' },
    { n: '3', emoji: '🧠', label: 'Review AI Suggestions' },
    { n: '4', emoji: '💊', label: 'Write E-Prescription' },
    { n: '5', emoji: '✅', label: 'Complete Consultation' },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Doctor Dashboard"
          subtitle={`${getGreeting()}, ${user?.fullName?.split(' ').slice(0, 2).join(' ') ?? 'Doctor'}`}
        />
        <div className="page-body fade-in">

          {/* ── Hero Banner ────────────────────────────────────────── */}
          <div style={{
            background: 'var(--gradient-doctor)',
            borderRadius: 'var(--r-xl)', padding: '28px 32px', color: 'white',
            marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 12px 40px rgba(5,150,105,0.35)', position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-40%', right: '10%', width: 220, height: 220, background: 'radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30%', right: '25%', width: 160, height: 160, background: 'radial-gradient(circle,rgba(255,255,255,0.07) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 'var(--r-full)', padding: '3px 12px', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                  🩺 Clinical Portal
                </div>
              </div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>
                {getGreeting()}, Dr. {user?.fullName?.split(' ')[1] ?? 'Doctor'}
              </div>
              <div style={{ fontSize: 14, opacity: 0.88, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} />
                You have <strong style={{ margin: '0 3px' }}>{loading ? '…' : stats.todayQueue.length}</strong> confirmed appointment{stats.todayQueue.length !== 1 ? 's' : ''} in today's queue.
              </div>
            </div>

            {/* Hero stat chips */}
            <div style={{ display: 'flex', gap: 12, zIndex: 1 }}>
              {[
                { label: "Today's Queue", value: stats.todayQueue.length, emoji: '📋' },
                { label: 'All Confirmed',  value: stats.allConfirmed.length, emoji: '✅' },
                { label: 'Completed',      value: stats.completed.length, emoji: '✨' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.25)', borderRadius: 'var(--r-lg)',
                  padding: '14px 18px', textAlign: 'center', minWidth: 88,
                }}>
                  <div style={{ fontSize: 22 }}>{s.emoji}</div>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
                    {loading ? '—' : s.value}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── KPI Stats Row ───────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <KPICard icon={Calendar}     label="Today's Queue"   value={stats.todayQueue.length}   sub="Confirmed appointments" color="#059669" bg="#ECFDF5" loading={loading} />
            <KPICard icon={UserCheck}    label="All Confirmed"   value={stats.allConfirmed.length} sub="Ready for consultation"  color="#0369A1" bg="#F0F9FF" loading={loading} />
            <KPICard icon={CheckCircle2} label="Completed"       value={stats.completed.length}    sub="Sessions finished"       color="#6366F1" bg="#EEF2FF" loading={loading} />
            <KPICard icon={Clock}        label="Pending"         value={stats.pending.length}      sub="Awaiting verification"   color="#D97706" bg="#FFFBEB" loading={loading} />
          </div>

          {/* ── Main Grid ───────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 308px', gap: 24, alignItems: 'start' }}>

            {/* ── Appointment Queue ───────────────────────────────── */}
            <div className="card">
              <div className="card-header" style={{ paddingBottom: 0 }}>
                <div>
                  <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ClipboardList size={17} color="#059669" /> Appointment Queue
                  </div>
                  <div className="section-sub">Verified appointments ready for consultation</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="tabs">
                    <button id="tab-today" className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')}>
                      Today ({loading ? '…' : stats.todayQueue.length})
                    </button>
                    <button id="tab-all" className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                      All ({loading ? '…' : stats.allConfirmed.length})
                    </button>
                  </div>
                  <button
                    id="view-all-appointments-btn"
                    onClick={() => navigate('/doctor/appointments')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 12, fontWeight: 600, color: '#059669',
                      background: '#ECFDF5', border: '1px solid #A7F3D0',
                      borderRadius: 'var(--r-full)', padding: '5px 12px', cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#D1FAE5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#ECFDF5'; }}
                  >
                    View All <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="card-body" style={{ padding: '16px 20px' }}>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="skeleton" style={{ height: 78, borderRadius: 'var(--r-md)' }} />
                    ))}
                  </div>
                ) : displayAppts.length === 0 ? (
                  <div className="empty-state" style={{ padding: '40px 20px' }}>
                    <div className="empty-icon">🎉</div>
                    <div className="empty-title">All caught up{activeTab === 'today' ? ' for today' : ''}!</div>
                    <div className="empty-sub">
                      {activeTab === 'today'
                        ? "No confirmed appointments in today's queue."
                        : 'No confirmed appointments at the moment.'}
                    </div>
                    <button
                      onClick={() => navigate('/doctor/appointments')}
                      style={{
                        marginTop: 14, padding: '8px 18px', background: 'var(--gradient-doctor)',
                        color: 'white', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                      }}
                    >
                      View All Appointments
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {displayAppts.map(appt => (
                      <AppointmentRow
                        key={appt.id}
                        appt={appt}
                        onConsult={() => navigate(`/doctor/consultation/${appt.id}`)}
                      />
                    ))}
                    {displayAppts.length >= 5 && (
                      <button
                        id="load-more-appts-btn"
                        onClick={() => navigate('/doctor/appointments')}
                        style={{
                          padding: '10px', textAlign: 'center', fontSize: 13, fontWeight: 600,
                          color: '#059669', background: '#ECFDF5', border: '1px dashed #A7F3D0',
                          borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'var(--transition)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#D1FAE5'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ECFDF5'; }}
                      >
                        View All Appointments <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Panel ─────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* AI CDS Info */}
              <div style={{
                background: 'linear-gradient(135deg,#ECFDF5 0%,#D1FAE5 100%)',
                borderRadius: 'var(--r-lg)', padding: '20px',
                border: '1px solid #A7F3D0', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, background: '#059669', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={17} color="white" />
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#065F46' }}>AI Clinical Decision Support</div>
                </div>
                <div style={{ fontSize: 12.5, color: '#047857', lineHeight: 1.75 }}>
                  During consultation, the <strong>Clinical Analysis Agent</strong> suggests differential diagnoses with confidence scores based on vitals, symptoms, and patient history.
                </div>
                <div style={{
                  marginTop: 12, padding: '8px 12px', background: 'rgba(5,150,105,0.1)',
                  borderRadius: 'var(--r-sm)', border: '1px solid rgba(5,150,105,0.2)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <AlertCircle size={13} color="#059669" />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#065F46' }}>You must Accept, Modify, or Reject all AI suggestions.</span>
                </div>
              </div>

              {/* Consultation Workflow */}
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Sparkles size={15} color="#059669" />
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-primary)' }}>Consultation Workflow</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {STEPS.map(({ n, emoji, label }, idx) => (
                      <div key={n} style={{ display: 'flex', gap: 0, position: 'relative' }}>
                        {/* Vertical line */}
                        {idx < STEPS.length - 1 && (
                          <div style={{
                            position: 'absolute', left: 15, top: 32, width: 2, height: 28,
                            background: 'linear-gradient(to bottom,#A7F3D0,#D1FAE5)', zIndex: 0,
                          }} />
                        )}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '6px 0', zIndex: 1 }}>
                          <div style={{
                            width: 30, height: 30, background: '#ECFDF5', border: '2px solid #A7F3D0',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 800, color: '#059669', flexShrink: 0,
                          }}>{n}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 5 }}>
                            <span style={{ fontSize: 15 }}>{emoji}</span>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-body">
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Quick Actions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'View All Appointments', icon: Calendar, path: '/doctor/appointments', color: '#059669', bg: '#ECFDF5', id: 'qa-all-appts' },
                      { label: 'My Profile',            icon: Activity, path: '/profile',              color: '#0369A1', bg: '#F0F9FF', id: 'qa-profile' },
                    ].map(({ label, icon: Icon, path, color, bg, id }) => (
                      <button
                        key={path}
                        id={id}
                        onClick={() => navigate(path)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', background: bg, border: `1px solid ${color}22`,
                          borderRadius: 'var(--r-md)', cursor: 'pointer', transition: 'var(--transition)',
                          width: '100%', textAlign: 'left',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; }}
                      >
                        <Icon size={15} color={color} />
                        <span style={{ fontSize: 13, fontWeight: 600, color }}>{label}</span>
                        <ChevronRight size={14} color={color} style={{ marginLeft: 'auto' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
