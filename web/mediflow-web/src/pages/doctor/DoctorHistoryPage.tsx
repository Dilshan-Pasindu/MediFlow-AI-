import { useState, useMemo } from 'react';
import { ClipboardList, Search, Calendar, User, Clock, FileText, ArrowRight, RefreshCw, CheckCircle2, Stethoscope, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { useDoctorAppointments } from '../../hooks';

export default function DoctorHistoryPage() {
  const navigate = useNavigate();
  const { data: appointments = [], isLoading: loading, refetch } = useDoctorAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  const filtered = useMemo(() => {
    return appointments.filter((appt: any) => {
      const matchSearch =
        appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.appointmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterPeriod === 'ALL') return matchSearch;
      if (filterPeriod === 'CONFIRMED') return matchSearch && appt.status === 'Confirmed';
      return matchSearch && (appt.status === 'Completed' || appt.status === 'Confirmed');
    });
  }, [appointments, searchTerm, filterPeriod]);

  const totalPatients = new Set(appointments.map((a: any) => a.patientName)).size;
  const completedConsults = appointments.filter((a: any) => a.status === 'Confirmed' || a.status === 'Completed').length;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Patient Consultation History"
          subtitle="Review completed patient encounter records, clinical notes, and treatment histories"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => refetch()} id="refresh-doctor-history-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="doctor"
            title="Clinical History Archive"
            subtitle="Search and review past consultations, vital trends, and diagnostic summaries"
            loading={loading}
            stats={[
              { label: 'Completed Consults', value: completedConsults, icon: <Stethoscope size={18} /> },
              { label: 'Unique Patients', value: totalPatients, icon: <Users size={18} /> },
              { label: 'Encounter Records', value: appointments.length, icon: <ClipboardList size={18} /> },
            ]}
          />

          {/* Search & Filter */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by patient name, appointment #, or clinical notes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--border-color)', fontSize: 13.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {(['ALL', 'CONFIRMED', 'COMPLETED'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterPeriod(tab)}
                    className={`btn btn-sm ${filterPeriod === tab ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 12, height: 34, borderRadius: 'var(--r-md)' }}
                  >
                    {tab === 'ALL' ? 'All Records' : tab === 'CONFIRMED' ? 'Confirmed' : 'Completed'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Consultation History Table */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-title">Past Encounters ({filtered.length})</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing {filtered.length} total encounters</span>
            </div>

            {loading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--r-md)' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <ClipboardList size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <div className="empty-title">No consultation records match your query</div>
                <div className="empty-sub">Patient appointments will be archived here upon confirmation.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      <th>Appt #</th>
                      <th>Patient Name</th>
                      <th>Date & Time</th>
                      <th>Allergies & Blood</th>
                      <th>Clinical Notes / Symptoms</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((appt: any) => {
                      const formattedDate = appt.appointmentDateTime
                        ? new Date(appt.appointmentDateTime).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Scheduled';

                      return (
                        <tr key={appt.id}>
                          <td>
                            <strong style={{ color: 'var(--med-teal)', fontFamily: 'Outfit, sans-serif' }}>
                              {appt.appointmentNumber || `APT-${appt.id}`}
                            </strong>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{appt.patientName}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                              <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                              <span>{formattedDate}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 12 }}>
                              <span className="badge badge-teal" style={{ marginRight: 6 }}>{appt.patientBloodGroup || 'O+'}</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{appt.patientAllergies || 'None reported'}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                              {appt.notes || 'Routine checkup & consultation'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${appt.status === 'Confirmed' ? 'badge-green' : 'badge-blue'}`}>
                              {appt.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => navigate(`/doctor/consultation/${appt.id}`)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--med-teal)' }}
                            >
                              Open Chart <ArrowRight size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
