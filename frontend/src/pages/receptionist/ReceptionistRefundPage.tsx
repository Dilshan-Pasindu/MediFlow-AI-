import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, XCircle, Loader, RefreshCw, AlertCircle, Clock, Eye,
  ClipboardList, CheckCircle2, Coins, BarChart3, Zap, Stethoscope, Calendar, CreditCard
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import {
  apiGetRefundRequests,
  apiApproveRefund,
  apiRejectRefund,
} from '../../api/payment.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const STATUS_META: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  RefundRequested:  { color: '#B45309', bg: '#FFFBEB', label: 'Requested', icon: <ClipboardList size={12} /> },
  RefundApproved:   { color: '#0369A1', bg: '#EFF6FF', label: 'Approved', icon: <CheckCircle2 size={12} /> },
  RefundProcessing: { color: '#7C3AED', bg: '#F5F3FF', label: 'Processing', icon: <Clock size={12} /> },
  RefundCompleted:  { color: '#059669', bg: '#ECFDF5', label: 'Completed', icon: <Coins size={12} /> },
  RefundRejected:   { color: '#DC2626', bg: '#FEF2F2', label: 'Rejected', icon: <XCircle size={12} /> },
  RefundFailed:     { color: '#DC2626', bg: '#FEF2F2', label: 'Failed', icon: <AlertCircle size={12} /> },
};

export default function ReceptionistRefundPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('RefundRequested');
  const [actionLoading, setActionLoading] = useState<Record<number, string | null>>({});
  const [messages, setMessages] = useState<Record<number, { type: string; text: string } | null>>({});
  const [rejectForms, setRejectForms] = useState<Record<number, { open: boolean; reason: string; notes: string }>>({});
  const [selectedRefund, setSelectedRefund] = useState<any>(null);

  const { data: allRefunds = [], isLoading, refetch } = useQuery({
    queryKey: ['refunds'],
    queryFn: () => apiGetRefundRequests(),
    refetchInterval: 30000,
  });

  const filtered = (allRefunds as any[]).filter((r: any) => r.refundStatus === tab);
  const pendingCount = (allRefunds as any[]).filter((r: any) => r.refundStatus === 'RefundRequested').length;

  async function handleApprove(refundId: number) {
    setActionLoading(a => ({ ...a, [refundId]: 'approve' }));
    try {
      await apiApproveRefund(refundId);
      setMessages(m => ({ ...m, [refundId]: { type: 'success', text: 'Refund approved and completed successfully.' } }));
      qc.invalidateQueries({ queryKey: ['refunds'] });
      await refetch();
    } catch (err: any) {
      setMessages(m => ({ ...m, [refundId]: { type: 'error', text: err?.response?.data?.message || err?.message || 'Failed to approve refund.' } }));
    } finally {
      setActionLoading(a => ({ ...a, [refundId]: null }));
    }
  }

  async function handleReject(refundId: number) {
    const form = rejectForms[refundId];
    if (!form?.reason) {
      setMessages(m => ({ ...m, [refundId]: { type: 'error', text: 'Please provide a rejection reason.' } }));
      return;
    }
    setActionLoading(a => ({ ...a, [refundId]: 'reject' }));
    try {
      await apiRejectRefund(refundId, form.reason, form.notes);
      setMessages(m => ({ ...m, [refundId]: { type: 'error', text: 'Refund request rejected.' } }));
      setRejectForms(f => ({ ...f, [refundId]: { open: false, reason: '', notes: '' } }));
      qc.invalidateQueries({ queryKey: ['refunds'] });
      await refetch();
    } catch (err: any) {
      setMessages(m => ({ ...m, [refundId]: { type: 'error', text: err?.response?.data?.message || err?.message || 'Failed to reject refund.' } }));
    } finally {
      setActionLoading(a => ({ ...a, [refundId]: null }));
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Refund Management"
          subtitle="Review and process patient refund requests"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => refetch()} id="refresh-refunds-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />

        <div className="page-body fade-in">
          <PortalHeader
            role="recept"
            title="Refund Review Queue"
            subtitle="Approve or reject patient refund requests. Approved refunds are automatically processed via PayHere."
            loading={isLoading}
            stats={[
              { label: 'Pending', value: pendingCount, icon: <ClipboardList size={16} />, highlight: pendingCount > 0 },
              { label: 'Completed Today', value: (allRefunds as any[]).filter((r: any) => r.refundStatus === 'RefundCompleted').length, icon: <Coins size={16} /> },
              { label: 'Total', value: (allRefunds as any[]).length, icon: <BarChart3 size={16} /> },
            ]}
          />

          {/* Info Banner */}
          <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)', border: '1.5px solid #BFDBFE', borderRadius: 'var(--r-lg)', padding: '14px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <Zap size={22} color="#1D4ED8" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E40AF' }}>Auto-Refund Policy</div>
              <div style={{ fontSize: 12, color: '#1D4ED8', marginTop: 2 }}>
                When you <strong>Reject</strong> an appointment booking, the system automatically initiates a full refund via PayHere.
                Manual refund requests below come from patient-cancelled appointments.
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            {Object.entries(STATUS_META).map(([key, meta]) => {
              const count = (allRefunds as any[]).filter((r: any) => r.refundStatus === key).length;
              return (
                <button
                  key={key}
                  className={`tab-btn ${tab === key ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onClick={() => setTab(key)}
                  id={`refund-tab-${key.toLowerCase()}`}
                >
                  {meta.icon} {meta.label} ({count})
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--r-lg)' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                {tab === 'RefundRequested' ? <CheckCircle2 size={40} color="#059669" /> : <ClipboardList size={40} color="var(--text-muted)" />}
              </div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {tab === 'RefundRequested' ? 'No pending refund requests' : 'No refunds in this status'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                {tab === 'RefundRequested' ? 'All caught up! No refunds waiting for review.' : 'Try a different tab.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((refund: any) => {
                const meta = STATUS_META[refund.refundStatus] ?? STATUS_META.RefundRequested;
                const isLoading = actionLoading[refund.id];
                const msg = messages[refund.id];
                const rejectForm = rejectForms[refund.id] ?? { open: false, reason: '', notes: '' };

                return (
                  <div key={refund.id} className="card" id={`refund-card-${refund.id}`}>
                    <div className="card-body" style={{ padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div
                              style={{ fontWeight: 800, fontSize: 16, cursor: 'pointer', color: 'var(--text-primary)' }}
                              onClick={() => navigate(`/appointments/${refund.appointmentId}/refund`)}
                              title="Click to view live refund tracking"
                            >
                              {refund.patientName}
                            </div>
                            <span className="badge" style={{ color: meta.color, background: meta.bg, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              {meta.icon} {meta.label}
                            </span>
                            <button
                              type="button"
                              onClick={() => navigate(`/appointments/${refund.appointmentId}/refund`)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                fontSize: 12,
                                color: 'var(--med-blue)',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Click to view refund tracking"
                            >
                              {refund.refundReference}
                            </button>
                          </div>

                          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <Stethoscope size={13} /> <strong>{refund.doctorName}</strong> ({refund.specialtyName})
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <Calendar size={13} /> {new Date(refund.appointmentDate).toLocaleDateString()}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              <Coins size={13} /> Refund: <strong style={{ color: '#059669' }}>Rs. {refund.amount?.toLocaleString()}</strong>
                            </span>
                          </div>

                          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <span>Payment Ref: <code style={{ fontSize: 11 }}>{refund.paymentTransactionRef ?? '—'}</code></span>
                            {refund.providerPaymentId && <span>PayHere ID: <code style={{ fontSize: 11 }}>{refund.providerPaymentId}</code></span>}
                            <span>Requested: {new Date(refund.requestedAt).toLocaleString()}</span>
                          </div>

                          {refund.additionalNotes && (
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 4 }}>
                              Patient note: "{refund.additionalNotes}"
                            </div>
                          )}

                          {msg && (
                            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 'var(--r-md)', background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: msg.type === 'success' ? '#059669' : '#DC2626', fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                              {msg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {msg.text}
                            </div>
                          )}

                          {/* Reject form */}
                          {rejectForm.open && (
                            <div style={{ marginTop: 12, padding: 14, background: '#FEF2F2', borderRadius: 'var(--r-md)', border: '1.5px solid #FCA5A5' }}>
                              <div style={{ fontWeight: 700, color: '#991B1B', marginBottom: 8, fontSize: 13 }}>Provide Rejection Reason</div>
                              <input
                                className="form-input"
                                placeholder="Reason for rejection *"
                                value={rejectForm.reason}
                                onChange={e => setRejectForms(f => ({ ...f, [refund.id]: { ...rejectForm, reason: e.target.value } }))}
                                style={{ marginBottom: 6, fontSize: 13 }}
                                id={`reject-reason-${refund.id}`}
                              />
                              <textarea
                                className="form-input"
                                placeholder="Additional notes (optional)..."
                                rows={2}
                                value={rejectForm.notes}
                                onChange={e => setRejectForms(f => ({ ...f, [refund.id]: { ...rejectForm, notes: e.target.value } }))}
                                style={{ marginBottom: 8, fontSize: 13 }}
                                id={`reject-notes-${refund.id}`}
                              />
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleReject(refund.id)}
                                  disabled={!!isLoading}
                                  id={`confirm-reject-${refund.id}`}
                                >
                                  {isLoading === 'reject' ? <Loader size={13} className="spin" /> : <XCircle size={13} />}
                                  Confirm Reject
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setRejectForms(f => ({ ...f, [refund.id]: { open: false, reason: '', notes: '' } }))}
                                  id={`cancel-reject-${refund.id}`}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              fontSize: 12.5,
                              padding: '7px 12px',
                              borderRadius: 'var(--r-md)',
                              color: 'var(--med-blue)',
                              borderColor: 'var(--border)',
                              background: 'var(--surface)',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                            onClick={() => navigate(`/appointments/${refund.appointmentId}/refund`)}
                            id={`track-refund-${refund.id}`}
                            title="Open live refund tracking timeline"
                          >
                            <CreditCard size={13} /> View Tracking
                          </button>

                          {refund.refundStatus === 'RefundRequested' && (
                            <>
                              <button
                                className="btn btn-success"
                                style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                onClick={() => handleApprove(refund.id)}
                                disabled={!!isLoading}
                                id={`approve-refund-${refund.id}`}
                              >
                                {isLoading === 'approve' ? <Loader size={14} className="spin" /> : <CheckCircle size={14} />}
                                {isLoading === 'approve' ? 'Processing...' : 'Approve Refund'}
                              </button>
                              <button
                                className="btn btn-danger"
                                style={{ padding: '8px 14px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13, background: '#DC2626', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                onClick={() => setRejectForms(f => ({ ...f, [refund.id]: { open: !rejectForm.open, reason: rejectForm.reason, notes: rejectForm.notes } }))}
                                disabled={!!isLoading}
                                id={`reject-refund-${refund.id}`}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </>
                          )}
                          {refund.refundStatus === 'RefundProcessing' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7C3AED', fontWeight: 600, fontSize: 13 }}>
                              <Clock size={16} /> Processing...
                            </div>
                          )}
                          {refund.refundStatus === 'RefundCompleted' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 600, fontSize: 13, background: '#ECFDF5', padding: '6px 12px', borderRadius: 'var(--r-md)' }}>
                              <CheckCircle size={16} /> Completed
                            </div>
                          )}
                        </div>
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
