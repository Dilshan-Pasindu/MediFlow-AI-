import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Trash2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
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

function formatDateTime(dtStr: string) {
  if (!dtStr) return '';
  const d = new Date(dtStr);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getDefaultDateTimeStrings() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 9, 0, 0);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const toLocalIso = (d: Date) => 
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  return {
    startStr: toLocalIso(start),
    endStr: toLocalIso(end)
  };
}

export default function DoctorLeavePage() {
  const navigate = useNavigate();
  const user = getUser();
  const doctorId = user?.id;

  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const defaults = getDefaultDateTimeStrings();
  const [startDate, setStartDate] = useState(defaults.startStr);
  const [endDate, setEndDate] = useState(defaults.endStr);
  const [reason, setReason] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);

  useEffect(() => {
    if (doctorId) fetchLeaves();
  }, [doctorId]);

  const openAddModal = () => {
    const freshDefaults = getDefaultDateTimeStrings();
    setStartDate(freshDefaults.startStr);
    setEndDate(freshDefaults.endStr);
    setReason('');
    setShowModal(true);
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await apiGetDoctorLeaves(doctorId as number);
      setLeaves(data);
    } catch (err: any) {
      console.error(err);
      setAlertMessage({ type: 'error', text: 'Failed to load leaves schedule.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setAlertMessage({ type: 'error', text: 'Please select both start date & time and end date & time.' });
      return;
    }
    
    const startDt = new Date(startDate);
    const endDt = new Date(endDate);

    if (startDt >= endDt) {
      setAlertMessage({ type: 'error', text: 'Start date and time must be before end date and time.' });
      return;
    }

    setSubmitLoading(true);
    setAlertMessage(null);
    try {
      const res: any = await apiCreateDoctorLeave(doctorId as number, {
        startDate: startDt.toISOString(),
        endDate: endDt.toISOString(),
        reason: reason.trim() || 'Scheduled Time Off'
      });
      
      setAlertMessage({ 
        type: res.cancelledAppointmentsCount > 0 ? 'warning' : 'success', 
        text: res.message || 'Leave scheduled successfully!' 
      });
      setShowModal(false);
      fetchLeaves();
    } catch (err: any) {
      console.error('Create leave error:', err);
      const errMsg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null) || 'Failed to add leave.';
      setAlertMessage({ type: 'error', text: errMsg });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (leaveId: number) => {
    if (!confirm('Are you sure you want to cancel this scheduled leave?')) return;
    try {
      await apiDeleteDoctorLeave(doctorId as number, leaveId);
      setAlertMessage({ type: 'success', text: 'Leave cancelled successfully.' });
      fetchLeaves();
    } catch (err: any) {
      console.error(err);
      setAlertMessage({ type: 'error', text: 'Failed to cancel leave.' });
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Leave & Schedule Management"
          subtitle="Manage your time off and leave slots"
        />
        
        <div className="page-body fade-in">
          {alertMessage && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              backgroundColor: alertMessage.type === 'error' ? '#FEF2F2' : alertMessage.type === 'warning' ? '#FFFBEB' : '#ECFDF5',
              border: `1px solid ${alertMessage.type === 'error' ? '#FECACA' : alertMessage.type === 'warning' ? '#FDE68A' : '#A7F3D0'}`,
              color: alertMessage.type === 'error' ? '#DC2626' : alertMessage.type === 'warning' ? '#D97706' : '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              fontSize: '14px',
              fontWeight: 500
            }}>
              {alertMessage.type === 'warning' && <AlertTriangle size={20} />}
              {alertMessage.type === 'success' && <CheckCircle2 size={20} />}
              {alertMessage.type === 'error' && <AlertTriangle size={20} />}
              <span>{alertMessage.text}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Your Leave Schedule</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
                Schedule full-day or time-specific leave. Overlapping patient appointments will be automatically cancelled.
              </p>
            </div>
            <button
              onClick={openAddModal}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', background: 'var(--gradient-doctor)',
                color: 'white', border: 'none', borderRadius: 'var(--r-full)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Plus size={18} /> Schedule Leave
            </button>
          </div>

          <div className="card">
            {loading ? (
              <div style={{ padding: 50, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading leaves...</div>
            ) : leaves.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div className="empty-icon" style={{ fontSize: 40, marginBottom: 12 }}>🏖️</div>
                <div className="empty-title" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>No Leaves Scheduled</div>
                <div className="empty-sub" style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  You don't have any active or upcoming leaves scheduled.
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Start Date & Time</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>End Date & Time</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Reason</th>
                      <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => {
                      const isPast = new Date(leave.endDate) < new Date();
                      return (
                        <tr key={leave.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                          <td style={{ padding: '16px 18px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Clock size={16} style={{ color: 'var(--primary-doctor)' }} />
                              {formatDateTime(leave.startDate)}
                            </div>
                          </td>
                          <td style={{ padding: '16px 18px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Clock size={16} style={{ color: 'var(--primary-doctor)' }} />
                              {formatDateTime(leave.endDate)}
                            </div>
                          </td>
                          <td style={{ padding: '16px 18px', fontSize: 14, color: 'var(--text-secondary)' }}>
                            {leave.reason || 'Time Off'}
                          </td>
                          <td style={{ padding: '16px 18px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '12px', fontSize: 12, fontWeight: 600,
                              background: isPast ? '#F3F4F6' : '#ECFDF5',
                              color: isPast ? '#6B7280' : '#059669',
                              display: 'inline-flex', alignItems: 'center', gap: 4
                            }}>
                              {isPast ? 'Completed' : 'Upcoming'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                            {!isPast && (
                              <button
                                onClick={() => handleDelete(leave.id)}
                                style={{
                                  background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444',
                                  cursor: 'pointer', padding: '6px 12px', borderRadius: '6px',
                                  fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4
                                }}
                                title="Cancel Leave"
                              >
                                <Trash2 size={14} /> Remove
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
          background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '16px',
            width: 440, maxWidth: '90%', padding: 28, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Schedule Doctor Leave
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Select the exact start date & time and end date & time for your leave slot.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    fontSize: 14, outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    fontSize: 14, outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Reason / Description (Optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Conference, Personal Leave, Morning Off"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    fontSize: 14, outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 18px', background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    color: 'var(--text-secondary)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{
                    padding: '10px 20px', background: 'var(--gradient-doctor)', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
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
