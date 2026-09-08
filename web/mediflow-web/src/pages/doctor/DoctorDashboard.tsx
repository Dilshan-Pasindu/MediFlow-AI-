import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, User, ChevronRight, Activity, Stethoscope, FileText, Loader } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiGetDoctorAppointments, getUser } from '../../services/api';

const STATUS_STYLES = {
  Confirmed: { color: '#059669', bg: '#ECFDF5', label: 'Confirmed ✅' },
  Completed: { color: '#6366F1', bg: '#EEF2FF', label: 'Completed' },
  Pending:   { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    apiGetDoctorAppointments().then(d => setAppointments(d || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const todayAppts = appointments.filter(a => new Date(a.appointmentDateTime).toDateString() === today && a.status === 'Confirmed');
  const allConfirmed = appointments.filter(a => a.status === 'Confirmed');
  const completed = appointments.filter(a => a.status === 'Completed');

  const displayAppts = activeTab === 'today' ? todayAppts : allConfirmed;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Doctor Dashboard"
          subtitle={`Welcome, ${user?.fullName?.split(' ').slice(0, 2).join(' ') || 'Doctor'}`}
        />
        <div className="page-body fade-in">

          {/* Welcome banner — Doctor green */}
          <div style={{ background: 'var(--gradient-doctor)', borderRadius: 'var(--r-xl)', padding: '24px 28px', color: 'white', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(5,150,105,0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-30%', right: '5%', width: 200, height: 200, background: 'radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%)', borderRadius: '50%' }} />
            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7, marginBottom: 4 }}>Clinical Portal</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.fullName?.split(' ')[1] || 'Doctor'}</div>
              <div style={{ fontSize: 13.5, opacity: 0.85 }}>
                You have <strong>{todayAppts.length}</strong> confirmed appointments today.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, zIndex: 1 }}>
              {[
                { label: "Today's Appts", value: todayAppts.length, icon: '📋' },
                { label: 'Total Confirmed', value: allConfirmed.length, icon: '✅' },
                { label: 'Completed', value: completed.length, icon: '✨' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--r-lg)', padding: '12px 16px', textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900 }}>{loading ? '—' : s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.75, marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

            {/* Appointment Queue */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="section-title">Appointment Queue</div>
                  <div className="section-sub">Verified appointments ready for consultation</div>
                </div>
                <div className="tabs">
                  <button className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`} onClick={() => setActiveTab('today')} id="tab-today-appts">Today ({todayAppts.length})</button>
                  <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')} id="tab-all-appts">All ({allConfirmed.length})</button>
                </div>
              </div>
              <div className="card-body" style={{ padding: '16px 20px' }}>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--r-md)' }} />)}
                  </div>
                ) : displayAppts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎉</div>
                    <div className="empty-title">All done for {activeTab === 'today' ? 'today' : 'now'}!</div>
                    <div className="empty-sub">No {activeTab === 'today' ? "today's " : ''}appointments in queue.</div>
                  </div>
                ) : (
                  <div className="appt-list">
                    {displayAppts.map(appt => {
                      const d = new Date(appt.appointmentDateTime);
                      const st = (STATUS_STYLES as any)[appt.status] || STATUS_STYLES.Confirmed;
                      return (
                        <div key={appt.id} className="appt-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/doctor/consultation/${appt.id}`)} id={`doctor-appt-${appt.id}`}>
                          <div className="appt-date-block">
                            <div className="appt-day">{d.getDate()}</div>
                            <div className="appt-month">{d.toLocaleString('default', { month: 'short' })}</div>
                          </div>
                          <div className="appt-info">
                            <div className="appt-doctor" style={{ color: 'var(--text-primary)' }}>{appt.patientName}</div>
                            <div className="appt-time"><Clock size={11} /> {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            {appt.appointmentNumber && <div className="appt-num">{appt.appointmentNumber}</div>}
                          </div>
                          <div className="appt-right">
                            <span className="badge" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                            <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/doctor/consultation/${appt.id}`); }} id={`start-consult-${appt.id}`}>
                              <Stethoscope size={12} /> Consult
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' }}>
                <div className="card-body">
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', marginBottom: 12 }}>🤖 AI Clinical Decision Support</div>
                  <div style={{ fontSize: 12.5, color: '#047857', lineHeight: 1.7 }}>
                    When consulting a patient, the Clinical Analysis AI Agent will suggest diagnoses based on symptoms and history. You must <strong>Accept, Modify, or Reject</strong> all AI suggestions.
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Consultation Workflow</div>
                  {[
                    { step: '1', label: 'Review Patient History', icon: '👤' },
                    { step: '2', label: 'Record Examination', icon: '🩺' },
                    { step: '3', label: 'Review AI Suggestions', icon: '🧠' },
                    { step: '4', label: 'Write E-Prescription', icon: '💊' },
                    { step: '5', label: 'Complete Consultation', icon: '✅' },
                  ].map(({ step, label, icon }) => (
                    <div key={step} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 24, height: 24, background: 'var(--med-blue-50)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--med-blue)', flexShrink: 0 }}>{step}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><span>{icon}</span>{label}</div>
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
