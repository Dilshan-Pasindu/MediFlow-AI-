import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Plus, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetMyAppointments } from '../services/api';

const STATUS = {
  Pending:          { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', label: 'Payment Sent' },
  Confirmed:        { color: '#059669', bg: '#ECFDF5', label: 'Confirmed' },
  Completed:        { color: '#6366F1', bg: '#EEF2FF', label: 'Completed' },
  Cancelled:        { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelled' },
  NoShow:           { color: '#64748B', bg: '#F1F5F9', label: 'No Show' },
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAppointments(); }, []);

  async function loadAppointments() {
    try { setAppointments(await apiGetMyAppointments() || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const upcomingAppts = appointments.filter(a => ['Confirmed', 'PaymentSubmitted', 'Pending'].includes(a.status));
  const pastAppts = appointments.filter(a => ['Completed', 'Cancelled', 'NoShow'].includes(a.status));
  const displayAppts = activeTab === 'upcoming' ? upcomingAppts : pastAppts;

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
              <div className="empty-icon">📅</div>
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
                return (
                  <div key={appt.id} className="appt-card" onClick={() => navigate(`/appointments/${appt.id}`)} id={`appt-item-${appt.id}`}>
                    <div className="appt-date-block">
                      <div className="appt-day">{d.getDate()}</div>
                      <div className="appt-month">{d.toLocaleString('default', { month: 'short' })}</div>
                      <div className="appt-year">{d.getFullYear()}</div>
                    </div>
                    <div className="appt-info">
                      <div className="appt-doctor">{appt.doctorName}</div>
                      {appt.specialtyName && <div className="appt-spec">{appt.specialtyName}</div>}
                      <div className="appt-time"><Clock size={11} /> {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      {appt.appointmentNumber && <div className="appt-num">{appt.appointmentNumber}</div>}
                    </div>
                    <div className="appt-right">
                      <span className="badge" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                      <div className="appt-fee">Rs. {appt.fee?.toLocaleString()}</div>
                      <ChevronRight size={14} color="var(--text-muted)" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
