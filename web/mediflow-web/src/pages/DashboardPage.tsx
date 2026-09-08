import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Activity, Pill, Star, ArrowRight, Clock,
  Plus, Brain, HeartPulse, ChevronRight, Sparkles, TrendingUp
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getUser } from '../services/api';
import { useMyAppointments, useMyPrescriptions } from '../hooks';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = getUser();

  const { data: appointments = [], isLoading: apptsLoading } = useMyAppointments();
  const { data: prescriptions = [], isLoading: rxsLoading } = useMyPrescriptions();
  const loading = apptsLoading || rxsLoading;

  useEffect(() => {
    if (!user) { navigate('/login'); }
  }, [user, navigate]);

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const upcomingAppts = appointments.filter(a => ['Pending', 'PaymentSubmitted', 'Confirmed'].includes(a.status));
  const completedAppts = appointments.filter(a => a.status === 'Completed');

  const statusStyles = {
    Pending:          { color: '#B45309', bg: '#FFFBEB' },
    PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF' },
    Confirmed:        { color: '#059669', bg: '#ECFDF5' },
    Completed:        { color: '#6366F1', bg: '#EEF2FF' },
    Cancelled:        { color: '#DC2626', bg: '#FEF2F2' },
  };

  const quickActions = [
    { icon: '🩺', label: 'Find Doctor',     desc: 'Search specialists',    action: () => navigate('/find-doctor'),   color: 'var(--med-blue-50)' },
    { icon: '🧠', label: 'AI Symptom Check',desc: 'Get AI recommendation', action: () => navigate('/symptom-check'), color: '#EEF2FF' },
    { icon: '📋', label: 'Appointments',     desc: 'View your visits',      action: () => navigate('/appointments'),  color: 'var(--med-teal-50)' },
    { icon: '💊', label: 'Prescriptions',    desc: 'My e-prescriptions',    action: () => navigate('/prescriptions'), color: '#FFF7ED' },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Dashboard"
          subtitle="Your personal health overview"
          actions={
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/find-doctor')} id="find-doctor-topbar-btn">
              <Plus size={14} /> Book Appointment
            </button>
          }
        />
        <div className="page-body fade-in">

          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>{greeting}, {user?.fullName?.split(' ')[0] || 'Patient'} 👋</h1>
              <p>
                {upcomingAppts.length > 0
                  ? `You have ${upcomingAppts.length} upcoming appointment${upcomingAppts.length !== 1 ? 's' : ''}. Stay healthy!`
                  : 'No upcoming appointments. Feeling unwell? Let AI help you find the right doctor.'}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button className="btn btn-xl" style={{ background: 'white', color: 'var(--med-blue)', fontWeight: 800, height: 42, fontSize: 13.5 }} onClick={() => navigate('/symptom-check')} id="dashboard-ai-check-btn">
                  <Sparkles size={15} /> AI Symptom Check
                </button>
                <button className="btn btn-xl" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', height: 42, fontSize: 13.5 }} onClick={() => navigate('/find-doctor')} id="dashboard-find-doctor-btn">
                  <HeartPulse size={15} /> Find Doctor
                </button>
              </div>
            </div>
            <div className="welcome-date">
              <div className="day">{today.getDate()}</div>
              <div className="month-year">
                {today.toLocaleString('default', { month: 'short' })} {today.getFullYear()}
              </div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                {today.toLocaleString('default', { weekday: 'long' })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stat-grid stagger" style={{ marginBottom: 28 }}>
            {[
              { icon: <Calendar size={22} color="#0369A1" />, label: 'Upcoming', value: upcomingAppts.length, sub: 'appointments', bg: 'var(--med-blue-50)' },
              { icon: <Activity size={22} color="#059669" />,  label: 'Completed', value: completedAppts.length, sub: 'visits total', bg: '#ECFDF5' },
              { icon: <Pill size={22} color="#0D9488" />,      label: 'Prescriptions', value: prescriptions.length, sub: 'active', bg: 'var(--med-teal-50)' },
              { icon: <Star size={22} color="#B45309" />,       label: 'Health Score', value: '92', sub: 'excellent', bg: '#FFFBEB' },
            ].map((s, i) => (
              <div key={i} className="stat-card fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="stat-icon-wrap" style={{ background: s.bg }}>{s.icon}</div>
                <div>
                  <div className="stat-value">{loading ? '—' : s.value}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-change">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

            {/* Upcoming Appointments */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="section-title">Upcoming Appointments</div>
                  <div className="section-sub">Your scheduled visits</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/appointments')} id="view-all-appointments-btn">
                  View all <ChevronRight size={13} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '16px 20px' }}>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 'var(--r-md)' }} />)}
                  </div>
                ) : upcomingAppts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <div className="empty-title">No upcoming appointments</div>
                    <div className="empty-sub">Book an appointment with a specialist today</div>
                    <button className="btn btn-primary" onClick={() => navigate('/find-doctor')} id="empty-book-btn">
                      <Plus size={15} /> Book Now
                    </button>
                  </div>
                ) : (
                  <div className="appt-list">
                    {upcomingAppts.slice(0, 4).map(appt => {
                      const d = new Date(appt.appointmentDateTime);
                      const st = (statusStyles as any)[appt.status] || statusStyles.Pending;
                      return (
                        <div key={appt.id} className="appt-card" onClick={() => navigate(`/appointments/${appt.id}`)} id={`appt-card-${appt.id}`}>
                          <div className="appt-date-block">
                            <div className="appt-day">{d.getDate()}</div>
                            <div className="appt-month">{d.toLocaleString('default', { month: 'short' })}</div>
                          </div>
                          <div className="appt-info">
                            <div className="appt-doctor">{appt.doctorName}</div>
                            <div className="appt-spec">{appt.specialtyName}</div>
                            <div className="appt-time"><Clock size={11} /> {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div className="appt-right">
                            <span className="badge" style={{ color: st.color, background: st.bg }}>{appt.status}</span>
                            <div className="appt-fee">Rs. {appt.fee?.toLocaleString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* AI Health Assistant Card */}
              <div className="ai-panel" style={{ borderRadius: 'var(--r-xl)', padding: 20, cursor: 'pointer' }} onClick={() => navigate('/symptom-check')} id="dashboard-ai-card">
                <div className="ai-badge"><Brain size={10} /> AI Health Assistant</div>
                <div className="ai-panel-title" style={{ fontSize: 16 }}>Feeling unwell?</div>
                <div className="ai-panel-sub" style={{ fontSize: 12 }}>
                  Describe your symptoms and get AI-powered doctor recommendations
                </div>
                <button className="ai-submit-btn" style={{ height: 38, fontSize: 13, width: '100%', justifyContent: 'center' }}>
                  <Sparkles size={14} /> Start AI Check
                </button>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header" style={{ padding: '14px 18px' }}>
                  <div className="section-title" style={{ fontSize: 14 }}>Quick Actions</div>
                </div>
                <div className="card-body" style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {quickActions.map((q, i) => (
                      <button
                        key={i}
                        onClick={q.action}
                        id={`quick-action-${q.label.replace(/\s+/g, '-').toLowerCase()}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 12px',
                          borderRadius: 'var(--r-md)',
                          background: q.color,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.97)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                      >
                        <span style={{ fontSize: 20 }}>{q.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{q.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.desc}</div>
                        </div>
                        <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Recent Prescriptions */}
          {prescriptions.length > 0 && (
            <div className="card" style={{ marginTop: 24 }}>
              <div className="card-header">
                <div>
                  <div className="section-title">Recent Prescriptions</div>
                  <div className="section-sub">Your latest e-prescriptions from doctors</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/prescriptions')} id="view-all-rx-btn">
                  View all <ChevronRight size={13} />
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Prescription</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Medicines</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.slice(0, 3).map(rx => (
                      <tr key={rx.id} className="clickable" onClick={() => navigate(`/prescriptions`)}>
                        <td><span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--med-blue)' }}>#{rx.id}</span></td>
                        <td style={{ fontWeight: 600 }}>{rx.doctorName}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{new Date(rx.dateIssued).toLocaleDateString()}</td>
                        <td><span className="badge badge-teal">{rx.itemCount || rx.items?.length || 1} medicines</span></td>
                        <td><span className={`badge ${rx.status === 'Active' ? 'badge-green' : rx.status === 'Fulfilled' ? 'badge-blue' : 'badge-gray'}`}>{rx.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
