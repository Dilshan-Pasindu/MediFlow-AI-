import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Trash2, Clock, AlertTriangle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiGetDoctorLeaves, apiCreateDoctorLeave, apiDeleteDoctorLeave, getUser } from '../../services/api';

interface DoctorLeave {
  id: number;
  doctorId: number;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
}

export default function DoctorLeavePage() {
  const navigate = useNavigate();
  const user = getUser();
  const doctorId = user?.id; // Assuming user.id corresponds to doctorId

  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);

  useEffect(() => {
    if (doctorId) fetchLeaves();
  }, [doctorId]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await apiGetDoctorLeaves(doctorId as number);
      setLeaves(data);
    } catch (err: any) {
      console.error(err);
      setAlertMessage({ type: 'error', text: 'Failed to load leaves.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      setAlertMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      setAlertMessage({ type: 'error', text: 'Start date must be before end date.' });
      return;
    }

    setSubmitLoading(true);
    setAlertMessage(null);
    try {
      const res: any = await apiCreateDoctorLeave(doctorId as number, { startDate, endDate, reason });
      setAlertMessage({ 
        type: res.cancelledAppointmentsCount > 0 ? 'warning' : 'success', 
        text: res.message 
      });
      setShowModal(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
    } catch (err: any) {
      console.error(err);
      setAlertMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add leave.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (leaveId: number) => {
    if (!confirm('Are you sure you want to cancel this leave?')) return;
    try {
      await apiDeleteDoctorLeave(doctorId as number, leaveId);
      setAlertMessage({ type: 'success', text: 'Leave cancelled successfully.' });
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setAlertMessage({ type: 'error', text: 'Failed to cancel leave.' });
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Leave & Schedule"
          subtitle="Manage your upcoming time off"
        />
        
        <div className="page-body fade-in">
          {alertMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              backgroundColor: alertMessage.type === 'error' ? '#FEF2F2' : alertMessage.type === 'warning' ? '#FFFBEB' : '#ECFDF5',
              border: `1px solid ${alertMessage.type === 'error' ? '#FECACA' : alertMessage.type === 'warning' ? '#FDE68A' : '#A7F3D0'}`,
              color: alertMessage.type === 'error' ? '#DC2626' : alertMessage.type === 'warning' ? '#D97706' : '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {alertMessage.type === 'warning' && <AlertTriangle size={18} />}
              <span>{alertMessage.text}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Your Leave Schedule</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Adding a leave will prevent new bookings and cancel overlapping appointments.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', background: 'var(--gradient-doctor)',
                color: 'white', border: 'none', borderRadius: 'var(--r-full)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5,150,105,0.2)'
              }}
            >
              <Plus size={16} /> Add Leave
            </button>
          </div>

          <div className="card">
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading leaves...</div>
            ) : leaves.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px 20px' }}>
                <div className="empty-icon">🏖️</div>
                <div className="empty-title">No Leaves Scheduled</div>
                <div className="empty-sub">You don't have any upcoming leaves scheduled.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-secondary)' }}>Start Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-secondary)' }}>End Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-secondary)' }}>Reason</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, color: 'var(--text-secondary)' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => {
                      const isPast = new Date(leave.endDate) < new Date();
                      return (
                        <tr key={leave.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '16px', fontSize: 14, fontWeight: 600 }}>{new Date(leave.startDate).toLocaleDateString()}</td>
                          <td style={{ padding: '16px', fontSize: 14, fontWeight: 600 }}>{new Date(leave.endDate).toLocaleDateString()}</td>
                          <td style={{ padding: '16px', fontSize: 14, color: 'var(--text-secondary)' }}>{leave.reason}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '12px', fontSize: 12, fontWeight: 600,
                              background: isPast ? '#F3F4F6' : '#ECFDF5',
                              color: isPast ? '#6B7280' : '#059669'
                            }}>
                              {isPast ? 'Completed' : 'Upcoming'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            {!isPast && (
                              <button
                                onClick={() => handleDelete(leave.id)}
                                style={{
                                  background: 'none', border: 'none', color: '#EF4444',
                                  cursor: 'pointer', padding: '6px', borderRadius: '6px',
                                }}
                                title="Cancel Leave"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
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

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--r-lg)',
            width: 400, padding: 24, boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Add New Leave</h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  required
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Reason (Optional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Annual Leave, Sick Leave"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '6px', cursor: 'pointer', fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{
                    padding: '8px 16px', background: 'var(--gradient-doctor)', color: 'white',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
                    opacity: submitLoading ? 0.7 : 1
                  }}
                >
                  {submitLoading ? 'Saving...' : 'Save Leave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
