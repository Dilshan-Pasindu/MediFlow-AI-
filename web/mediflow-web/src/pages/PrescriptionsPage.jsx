import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { appointments } from '../data/mockData';

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const rxAppointments = appointments.filter(a => a.prescription);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="My Prescriptions"
          subtitle="View and order your digital e-prescriptions"
        />
        
        <div className="page-body fade-in">
          
          {rxAppointments.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No prescriptions found</div>
              <div className="empty-sub">You don't have any digital prescriptions yet.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
              {rxAppointments.map(appt => {
                const rx = appt.prescription;
                return (
                  <div key={rx.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #F0FDFA, #E0F2FE)', border: '1px solid #CCFBF1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                            💊
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{rx.id}</div>
                            <div style={{ fontSize: 12, color: '#64748B' }}>{rx.issuedDate}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{appt.doctorName}</div>
                        <div style={{ fontSize: 12, color: '#0369A1' }}>{appt.specialty}</div>
                      </div>

                      <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 12, marginBottom: 16, border: '1px solid #E8EDF2', flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>Medicines ({rx.medicines.length})</div>
                        <ul style={{ paddingLeft: 16, fontSize: 13, color: '#475569', margin: 0 }}>
                          {rx.medicines.slice(0, 2).map((m, i) => (
                            <li key={i} style={{ marginBottom: 4 }}><strong style={{ color: '#0F172A' }}>{m.name}</strong> - {m.quantity}</li>
                          ))}
                          {rx.medicines.length > 2 && (
                            <li style={{ listStyle: 'none', marginLeft: -16, marginTop: 4, color: '#94A3B8', fontSize: 12 }}>+ {rx.medicines.length - 2} more...</li>
                          )}
                        </ul>
                      </div>
                      
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button 
                          className="btn btn-ghost" 
                          style={{ flex: 1 }}
                          onClick={() => navigate(`/appointments/${appt.id}`)}
                        >
                          View Details
                        </button>
                        <button className="btn btn-teal" style={{ flex: 1 }}>
                          Order Now
                        </button>
                      </div>
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
