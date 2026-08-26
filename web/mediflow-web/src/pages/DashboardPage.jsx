import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, ArrowRight, TrendingUp, CheckCircle, AlertCircle, Hourglass } from 'lucide-react';
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

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title={`${greeting}, ${currentPatient.name.split(' ')[0]} 👋`}
          subtitle="Here's your health overview for today"
        />
        <div className="page-body fade-in">

          {/* Stats */}
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            {[
              { icon: '📅', label: 'Upcoming Appointments', value: upcomingAppts.length, sub: 'Scheduled', color: '#EFF6FF', iconColor: '#0369A1' },
              { icon: '✅', label: 'Completed Visits', value: completedAppts.length, sub: 'All time', color: '#ECFDF5', iconColor: '#059669' },
              { icon: '💊', label: 'E-Prescriptions', value: prescriptions, sub: 'Available', color: '#F0FDFA', iconColor: '#0D9488' },
              { icon: '⭐', label: 'Doctor Ratings Given', value: 2, sub: 'Reviews submitted', color: '#FFFBEB', iconColor: '#B45309' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon-wrap" style={{ background: s.color }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                </div>
                <div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-change">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

            {/* Upcoming Appointments */}
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
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
                            <div className="appt-year">{d.getFullYear()}</div>
                          </div>
                          <div className="appt-info">
                            <div className="appt-doctor">{appt.doctorName}</div>
                            <div className="appt-spec">{appt.specialty}</div>
                            <div className="appt-time"><Clock size={11} /> {appt.time} · {appt.hospital}</div>
                            {appt.appointmentNumber && <div className="appt-num">{appt.appointmentNumber}</div>}
                          </div>
                          <div className="appt-right">
                            <ApptStatusBadge status={appt.status} />
                            <div className="appt-fee">Rs. {appt.fee.toLocaleString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-body">
                  <div className="section-title" style={{ marginBottom: 14 }}>Quick Actions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { icon: '🔍', label: 'Find a Doctor', sub: 'AI-powered recommendations', action: () => navigate('/find-doctor'), color: '#EFF6FF' },
                      { icon: '📋', label: 'My Prescriptions', sub: 'View e-prescriptions', action: () => navigate('/prescriptions'), color: '#F0FDFA' },
                    ].map((q, i) => (
                      <button key={i} onClick={q.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: q.color, border: '1px solid #E8EDF2', borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                        <span style={{ fontSize: 20 }}>{q.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{q.label}</div>
                          <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 1 }}>{q.sub}</div>
                        </div>
                        <ArrowRight size={14} style={{ marginLeft: 'auto', color: '#94A3B8' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Prescriptions */}
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div className="section-title">Recent Prescriptions</div>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/prescriptions')}>View all</button>
                  </div>
                  {appointments.filter(a => a.prescription).map(appt => (
                    <div key={appt.id} onClick={() => navigate(`/appointments/${appt.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #E8EDF2', cursor: 'pointer' }}>
                      <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F0FDFA, #EFF6FF)', border: '1px solid #D1FAE5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>💊</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.prescription.id}</div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>{appt.doctorName} · {appt.date}</div>
                      </div>
                      <ArrowRight size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
