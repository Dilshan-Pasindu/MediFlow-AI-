import { useState } from 'react';
import { CheckCircle, Loader, RefreshCw, AlertCircle, Pill } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiUpdateOrderStatus, getUser } from '../../services/api';
import { usePharmacistPrescriptions, usePharmacistOrders } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import type { Prescription } from '../../types/prescription';
import type { Order } from '../../types/order';

const ORDER_STATUS_FLOW = ['Confirmed', 'Preparing', 'Ready', 'Dispensed'];
const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Pending:   { color: '#B45309', bg: '#FFFBEB' },
  Confirmed: { color: '#0369A1', bg: '#EFF6FF' },
  Preparing: { color: '#7C3AED', bg: '#EEF2FF' },
  Ready:     { color: '#059669', bg: '#ECFDF5' },
  Dispensed: { color: '#6366F1', bg: '#EEF2FF' },
};

export default function PharmacistDashboard() {
  const user = getUser();
  const queryClient = useQueryClient();
  const { data: prescriptions = [], isLoading: rxLoading } = usePharmacistPrescriptions();
  const { data: orders = [], isLoading: ordLoading, refetch: refetchOrders } = usePharmacistOrders();
  const loading = rxLoading || ordLoading;
  const [actionLoading, setActionLoading] = useState<Record<string | number, string | null>>({});
  const [activeTab, setActiveTab] = useState('orders');
  const [messages, setMessages] = useState<Record<string | number, { type: string; text: string } | null>>({});

  const load = () => {
    queryClient.invalidateQueries({ queryKey: ['pharmacist'] });
  };

  async function handleStatusUpdate(orderId: number | string, newStatus: string) {
    setActionLoading(a => ({ ...a, [orderId]: newStatus }));
    try {
      await apiUpdateOrderStatus(orderId, newStatus);
      setMessages(m => ({ ...m, [orderId]: { type: 'success', text: `Order status updated to ${newStatus}` } }));
      load();
    } catch (err: any) {
      setMessages(m => ({ ...m, [orderId]: { type: 'error', text: err?.message || 'Update failed' } }));
    } finally { setActionLoading(a => ({ ...a, [orderId]: null })); }
  }

  const activeOrders = orders.filter(o => !['Dispensed', 'Cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'Dispensed');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Pharmacist Dashboard"
          subtitle="Manage prescriptions and process medicine orders"
          actions={<button className="btn btn-ghost btn-sm" onClick={load} id="refresh-pharma-btn"><RefreshCw size={14} /> Refresh</button>}
        />
        <div className="page-body fade-in">

          {/* Amber banner */}
          <div style={{ background: 'linear-gradient(135deg,#78350F,#B45309)', borderRadius: 'var(--r-xl)', padding: '22px 28px', color: 'white', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(180,83,9,0.3)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 21, fontWeight: 800, marginBottom: 4 }}>Pharmacist Portal</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Process prescriptions and manage medicine dispensing</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'New Prescriptions', value: prescriptions.filter(p => p.status === 'Active').length, icon: '📋' },
                { label: 'Active Orders', value: activeOrders.length, icon: '⚗️', highlight: true },
                { label: 'Dispensed Today', value: completedOrders.length, icon: '✅' },
              ].map(s => (
                <div key={s.label} style={{ background: s.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: `1.5px solid ${s.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 'var(--r-lg)', padding: '10px 16px', textAlign: 'center', minWidth: 90 }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{loading ? '—' : s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')} id="tab-orders-pharma">
              ⚗️ Active Orders ({activeOrders.length})
            </button>
            <button className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')} id="tab-rx-pharma">
              📋 Prescriptions ({prescriptions.length})
            </button>
            <button className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')} id="tab-completed-pharma">
              ✅ Dispensed ({completedOrders.length})
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--r-lg)' }} />)}
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">🎉</div>
                <div className="empty-title">No active orders!</div>
                <div className="empty-sub">All orders have been processed.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeOrders.map(order => {
                  const st = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                  const nextStatusIdx = ORDER_STATUS_FLOW.indexOf(order.status) + 1;
                  const nextStatus = ORDER_STATUS_FLOW[nextStatusIdx];
                  const isLoading = actionLoading[order.id];
                  const msg = messages[order.id];
                  return (
                    <div key={order.id} className="card" id={`pharma-order-${order.id}`}>
                      <div className="card-header">
                        <div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 800 }}>Order #{order.id}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Patient: {order.patientName} · Appt: <strong style={{ color: 'var(--med-teal)' }}>{order.appointmentNumber}</strong>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className="badge" style={{ color: st.color, background: st.bg }}>{order.status}</span>
                          {nextStatus && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order.id, nextStatus)}
                              disabled={!!isLoading}
                              id={`advance-order-${order.id}`}
                            >
                              {isLoading ? <Loader size={12} className="spin" /> : <CheckCircle size={12} />}
                              Mark as {nextStatus}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="card-body" style={{ padding: '14px 20px' }}>
                        {msg && (
                          <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 'var(--r-md)', background: msg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: 12.5, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                            {msg.type === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />} {msg.text}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                          {(order.items || []).map((item, i) => (
                            <span key={i} className="badge badge-teal"><Pill size={10} /> {item.medicineName} ×{item.quantity}</span>
                          ))}
                        </div>
                        <div className="price-breakdown">
                          {(order.items || []).map((item, i) => (
                            <div key={i} className="price-row">
                              <span>{item.medicineName} ×{item.quantity}</span>
                              <span>Rs. {item.subtotal?.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="price-row total">
                            <span>Total</span><strong>Rs. {order.totalAmount?.toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--r-lg)' }} />)}
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">💊</div>
                <div className="empty-title">No prescriptions yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {prescriptions.map(rx => (
                  <div key={rx.id} className="rx-card" id={`rx-pharma-${rx.id}`}>
                    <div className="rx-header">
                      <div className="rx-id">Rx #{rx.id} — {rx.appointmentNumber}</div>
                      <span className={`badge ${rx.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>{rx.status}</span>
                    </div>
                    <div className="rx-body">
                      <div className="info-row"><span className="info-row-label">Patient:</span>{rx.patientName}</div>
                      <div className="info-row"><span className="info-row-label">Doctor:</span>{rx.doctorName}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                        {(rx.items || []).map((item, i) => (
                          <span key={i} className="badge badge-teal"><Pill size={10} /> {item.medicineName}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Completed Tab */}
          {activeTab === 'completed' && (
            completedOrders.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">✅</div>
                <div className="empty-title">No dispensed orders yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {completedOrders.map(order => (
                  <div key={order.id} className="card" id={`dispensed-order-${order.id}`}>
                    <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>Order #{order.id} — {order.patientName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Dispensed · Rs. {order.totalAmount?.toLocaleString()}</div>
                      </div>
                      <span className="badge badge-purple">Dispensed</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
