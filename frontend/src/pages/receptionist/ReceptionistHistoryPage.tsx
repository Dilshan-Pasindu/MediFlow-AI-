import { useState, useMemo } from 'react';
import { Calendar, Search, Filter, CheckCircle2, XCircle, Clock, FileText, ArrowUpDown, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { usePendingAppointments } from '../../hooks';

export default function ReceptionistHistoryPage() {
  const { data: appointments = [], isLoading: loading, refetch } = usePendingAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt: any) => {
      const matchesSearch =
        appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.appointmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.specialtyName?.toLowerCase().includes(searchTerm.toLowerCase());

      if (statusFilter === 'ALL') return matchesSearch;
      return matchesSearch && appt.status === statusFilter;
    });
  }, [appointments, searchTerm, statusFilter]);

  const confirmedCount = appointments.filter((a: any) => a.status === 'Confirmed').length;
  const cancelledCount = appointments.filter((a: any) => a.status === 'Cancelled').length;
  const totalRevenue = appointments
    .filter((a: any) => a.status === 'Confirmed')
    .reduce((sum: number, a: any) => sum + (Number(a.fee) || 2500), 0);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Appointment Records & History"
          subtitle="Complete historical record of patient bookings, verifications, and cancellations"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => refetch()} id="refresh-history-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="recept"
            title="Appointment History Archive"
            subtitle="Search and audit processed appointment transactions across all clinical departments"
            loading={loading}
            stats={[
              { label: 'Confirmed Bookings', value: confirmedCount, icon: '✅' },
              { label: 'Cancelled Requests', value: cancelledCount, icon: '🚫' },
              { label: 'Verified Fees', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: '💳' },
            ]}
          />

          {/* Search & Filter Bar */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by patient, appt #, doctor or specialty..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--border-color)', fontSize: 13.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Filter size={15} style={{ color: 'var(--text-muted)' }} />
                {(['ALL', 'Confirmed', 'Cancelled', 'PaymentSubmitted', 'Pending'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 12.5, height: 34, borderRadius: 'var(--r-md)' }}
                  >
                    {st === 'ALL' ? 'All Records' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-title">Archived Appointments ({filteredAppointments.length})</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Showing {filteredAppointments.length} of {appointments.length} records</span>
            </div>

            {loading ? (
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton" style={{ height: 48, borderRadius: 'var(--r-md)' }} />
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <Calendar size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <div className="empty-title" style={{ fontSize: 16, fontWeight: 700 }}>No records found</div>
                <div className="empty-sub" style={{ fontSize: 13, color: 'var(--text-muted)' }}>No appointment records match your filter criteria.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      <th>Appt #</th>
                      <th>Patient</th>
                      <th>Doctor & Specialty</th>
                      <th>Date & Time</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appt: any) => {
                      const isConfirmed = appt.status === 'Confirmed';
                      const isCancelled = appt.status === 'Cancelled';
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
                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Blood Group: {appt.patientBloodGroup || 'O+'}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{appt.doctorName}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{appt.specialtyName}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                              <span>{formattedDate}</span>
                            </div>
                          </td>
                          <td>
                            <strong>Rs. {(appt.fee || 2500).toLocaleString()}</strong>
                          </td>
                          <td>
                            <span className={`badge ${isConfirmed ? 'badge-green' : isCancelled ? 'badge-danger' : 'badge-amber'}`}>
                              {appt.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${appt.paymentStatus === 'Verified' ? 'badge-green' : 'badge-blue'}`}>
                              {appt.paymentStatus || 'Pending'} ({appt.paymentMethod || 'Card'})
                            </span>
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
