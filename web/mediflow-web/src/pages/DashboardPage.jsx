import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Activity, Calendar, Star, Pill } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { currentPatient, appointments, statusConfig } from '../data/mockData';

const upcomingAppts = appointments.filter(a => ['Confirmed', 'PaymentSubmitted', 'Pending'].includes(a.status));
const completedAppts = appointments.filter(a => a.status === 'Completed');
const prescriptions = appointments.filter(a => a.prescription).length;

function ApptStatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span className="badge" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
      {cfg.label}
    </span>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const formatMonth = today.toLocaleString('default', { month: 'short' });
  const formatDay = today.getDate();
  const formatYear = today.getFullYear();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Overview"
          subtitle="Your personal health dashboard"
        />
        <div className="page-body fade-in">

          {/* Enhanced Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>{greeting}, {currentPatient.name.split(' ')[0]} 👋</h1>
              <p>Your health is our priority. You have {upcomingAppts.length} upcoming appointments.</p>
            </div>
            <div className="welcome-date">
              <div className="day">{formatDay}</div>
              <div className="month-year">{formatMonth} {formatYear}</div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="stat-grid" style={{ marginBottom: 32 }}>
            {[
              { icon: <Calendar size={24} color="#0369A1" />, label: 'Upcoming Visits', value: upcomingAppts.length, sub: 'Scheduled', color: '#EFF6FF' },
              { icon: <Activity size={24} color="#059669" />, label: 'Completed Visits', value: completedAppts.length, sub: 'All time', color: '#ECFDF5' },
              { icon: <Pill size={24} color="#0D9488" />, label: 'E-Prescriptions', value: prescriptions, sub: 'Available', color: '#F0FDFA' },
              { icon: <Star size={24} color="#B45309" />, label: 'Doctor Ratings', value: 2, sub: 'Reviews submitted', color: '#FFFBEB' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-icon-wrap" style={{ background: s.color }}>
                  {s.icon}
                </div>
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

                {upcomingAppts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <div className="empty-title">No upcoming appointments</div>
                    <div className="empty-sub" style={{ marginBottom: 16 }}>Book an appointment with a specialist</div>
                    <button className="btn btn-primary" onClick={() => navigate('/find-doctor')}>Find a Doctor</button>
                  </div>
                ) : (
                  <div className="appt-list">
                    {upcomingAppts.map(appt => {
                      const d = new Date(appt.date);
                      return (
                        <div key={appt.id} className="appt-card" onClick={() => navigate(`/appointments/${appt.id}`)}>
                          <div className="appt-date-block">
                            <div className="appt-day">{d.getDate()}</div>
                            <div className="appt-month">{d.toLocaleString('default', { month: 'short' })}</div>
                          </div>
                          <div className="appt-info">
                            <div className="appt-doctor">{appt.doctorName}</div>
                            <div className="appt-spec">{appt.specialty}</div>
                            <div className="appt-time"><Clock size={11} /> {appt.time} · {appt.hospital}</div>
                          </div>
                          <div className="appt-right">
                            <ApptStatusBadge status={appt.status} />
                            <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}>View Details</button>
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

              {/* Enhanced Quick Actions */}
              <div>
                <div className="section-title" style={{ marginBottom: 16 }}>Quick Actions</div>
                <div className="quick-action-grid">
                  {[
                    { icon: '🔍', label: 'Find Doctor', action: () => navigate('/find-doctor'), color: '#EFF6FF', textColor: '#0369A1' },
                    { icon: '📋', label: 'Prescriptions', action: () => navigate('/prescriptions'), color: '#F0FDFA', textColor: '#0D9488' },
                  ].map((q, i) => (
                    <div key={i} className="quick-action-tile" onClick={q.action}>
                      <div className="quick-action-icon" style={{ background: q.color, color: q.textColor }}>
                        {q.icon}
                      </div>
                      <div className="quick-action-title">{q.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Recent Prescriptions */}
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div className="section-title">Recent Prescriptions</div>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/prescriptions')}>All</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {appointments.filter(a => a.prescription).map(appt => (
                      <div key={appt.id} className="recent-rx-item" onClick={() => navigate(`/appointments/${appt.id}`)}>
                        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #F0FDFA, #EFF6FF)', border: '1px solid #D1FAE5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💊</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.prescription.id}</div>
                          <div style={{ fontSize: 11.5, color: '#64748B' }}>{appt.doctorName}</div>
                        </div>
                        <ArrowRight size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
                      </div>
                    ))}
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
