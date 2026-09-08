import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Activity, Calendar, Star, Pill } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getUser, apiGetMyAppointments, apiGetProfile } from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadData();
  }, []);

  async function loadData() {
    try {
      const appts = await apiGetMyAppointments();
      setAppointments(appts || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const formatMonth = today.toLocaleString('default', { month: 'short' });
  const formatDay = today.getDate();
  const formatYear = today.getFullYear();

  const upcomingAppts = appointments.filter(a => ['Pending', 'PaymentSubmitted', 'Confirmed'].includes(a.status));
  const completedAppts = appointments.filter(a => a.status === 'Completed');

  const statusStyles = {
    Pending: { color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
    PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', border: '#BFDBFE' },
    Confirmed: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    Completed: { color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' },
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Overview" subtitle="Your personal health dashboard" />
        <div className="page-body fade-in">

          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>{greeting}, {user?.fullName?.split(' ')[0] || 'Patient'} 👋</h1>
              <p>Your health is our priority. You have {upcomingAppts.length} upcoming appointment{upcomingAppts.length !== 1 ? 's' : ''}.</p>
            </div>
            <div className="welcome-date">
              <div className="day">{formatDay}</div>
              <div className="month-year">{formatMonth} {formatYear}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="stat-grid" style={{ marginBottom: 32 }}>
            {[
              { icon: <Calendar size={24} color="#0369A1" />, label: 'Upcoming Visits', value: upcomingAppts.length, sub: 'Scheduled', color: '#EFF6FF' },
              { icon: <Activity size={24} color="#059669" />, label: 'Completed Visits', value: completedAppts.length, sub: 'All time', color: '#ECFDF5' },
              { icon: <Pill size={24} color="#0D9488" />, label: 'Total Appointments', value: appointments.length, sub: 'Overall', color: '#F0FDFA' },
              { icon: <Star size={24} color="#B45309" />, label: 'Account Status', value: '✓', sub: 'Active', color: '#FFFBEB' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon-wrap" style={{ background: s.color }}>{s.icon}</div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label" style={{ marginTop: 2 }}>{s.label}</div>
                  <div className="stat-change" style={{ marginTop: 4 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

            {/* Upcoming Appointments */}
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div className="section-title">Upcoming Appointments</div>
                    <div className="section-sub">Your scheduled visits</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/appointments')}>
                    View all <ArrowRight size={13} />
                  </button>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>Loading...</div>
                ) : upcomingAppts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <div className="empty-title">No upcoming appointments</div>
                    <div className="empty-sub" style={{ marginBottom: 16 }}>Book an appointment with a specialist</div>
                    <button className="btn btn-primary" onClick={() => navigate('/find-doctor')}>Find a Doctor</button>
                  </div>
                ) : (
                  <div className="appt-list">
                    {upcomingAppts.slice(0, 5).map(appt => {
                      const d = new Date(appt.appointmentDateTime);
                      const st = statusStyles[appt.status] || statusStyles.Pending;
                      return (
                        <div key={appt.id} className="appt-card" onClick={() => navigate(`/appointments/${appt.id}`)}>
                          <div className="appt-date-block">
                            <div className="appt-day">{d.getDate()}</div>
                            <div className="appt-month">{d.toLocaleString('default', { month: 'short' })}</div>
                          </div>
                          <div className="appt-info">
                            <div className="appt-doctor">{appt.doctorName}</div>
                            <div className="appt-time"><Clock size={11} /> {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div className="appt-right">
                            <span className="badge" style={{ color: st.color, background: st.bg, borderColor: st.border }}>{appt.status}</span>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <div className="section-title" style={{ marginBottom: 16 }}>Quick Actions</div>
                <div className="quick-action-grid">
                  {[
                    { icon: '🔍', label: 'Find Doctor', action: () => navigate('/find-doctor'), color: '#EFF6FF' },
                    { icon: '📋', label: 'Appointments', action: () => navigate('/appointments'), color: '#F0FDFA' },
                  ].map((q, i) => (
                    <div key={i} className="quick-action-tile" onClick={q.action}>
                      <div className="quick-action-icon" style={{ background: q.color }}>{q.icon}</div>
                      <div className="quick-action-title">{q.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="section-title" style={{ marginBottom: 12 }}>Your Profile</div>
                  <div style={{ fontSize: 13, color: '#475569' }}>
                    <div style={{ marginBottom: 8 }}><strong>Name:</strong> {user?.fullName}</div>
                    <div style={{ marginBottom: 8 }}><strong>Email:</strong> {user?.email}</div>
                    <div><strong>Role:</strong> {user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
