import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetMyAppointments } from '../services/api';

const statusStyles = {
  Pending: { color: '#B45309', bg: '#FFFBEB', border: '#FDE68A', label: 'Pending' },
  PaymentSubmitted: { color: '#0369A1', bg: '#EFF6FF', border: '#BFDBFE', label: 'Payment Sent' },
  Confirmed: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Confirmed' },
  Completed: { color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', label: 'Completed' },
  Cancelled: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Cancelled' },
  NoShow: { color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1', label: 'No Show' },
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const data = await apiGetMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
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
        />
        
        <div className="page-body fade-in">
          
          <div className="tabs" style={{ marginBottom: 24 }}>
            <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
              Upcoming ({upcomingAppts.length})
            </button>
            <button className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>
              Past ({pastAppts.length})
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>Loading appointments...</div>
          ) : displayAppts.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📅</div>
              <div className="empty-title">No appointments found</div>
              <div className="empty-sub" style={{ marginBottom: 20 }}>You don't have any {activeTab} appointments.</div>
              {activeTab === 'upcoming' && (
                <button className="btn btn-primary" onClick={() => navigate('/find-doctor')}>
                  Book an Appointment
                </button>
              )}
            </div>
          ) : (
            <div className="appt-list">
              {displayAppts.map(appt => {
                const d = new Date(appt.appointmentDateTime);
                const st = statusStyles[appt.status] || statusStyles.Pending;
                return (
                  <div key={appt.id} className="appt-card" onClick={() => navigate(`/appointments/${appt.id}`)}>
                    <div className="appt-date-block">
                      <div className="appt-day">{d.getDate()}</div>
                      <div className="appt-month">{d.toLocaleString('default', { month: 'short' })}</div>
                      <div className="appt-year">{d.getFullYear()}</div>
                    </div>
                    <div className="appt-info">
                      <div className="appt-doctor">{appt.doctorName}</div>
                      <div className="appt-time"><Clock size={11} /> {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      {appt.appointmentNumber && <div className="appt-num">{appt.appointmentNumber}</div>}
                    </div>
                    <div className="appt-right">
                      <span className="badge" style={{ color: st.color, background: st.bg, borderColor: st.border }}>
                        {st.label}
                      </span>
                      <div className="appt-fee">Rs. {appt.fee?.toLocaleString()}</div>
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
