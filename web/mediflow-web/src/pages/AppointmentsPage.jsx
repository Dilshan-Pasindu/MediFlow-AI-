import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { appointments, statusConfig } from '../data/mockData';

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

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
            <button 
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} 
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({upcomingAppts.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} 
              onClick={() => setActiveTab('past')}
            >
              Past ({pastAppts.length})
            </button>
          </div>

          {displayAppts.length === 0 ? (
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
                const d = new Date(appt.date);
                const statusCfg = statusConfig[appt.status] || statusConfig.Pending;
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
                      <span className="badge" style={{ color: statusCfg.color, background: statusCfg.bg, borderColor: statusCfg.border }}>
                        {statusCfg.label}
                      </span>
                      <div className="appt-fee">Rs. {appt.fee.toLocaleString()}</div>
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
