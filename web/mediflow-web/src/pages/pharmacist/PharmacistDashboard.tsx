import { useState } from 'react';
import { CheckCircle, Loader, RefreshCw, AlertCircle, Pill, ShoppingCart, Calculator, Trash2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiUpdateOrderStatus, apiCreateOrder, apiCalculateOrderPrice, apiDeleteOrder } from '../../services/api';

import { usePharmacistPrescriptions, usePharmacistOrders, useMyPharmacy } from '../../hooks';
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
  const queryClient = useQueryClient();
  const { data: prescriptions = [], isLoading: rxLoading } = usePharmacistPrescriptions();
  const { data: orders = [], isLoading: ordLoading } = usePharmacistOrders();
  const { data: myPharmacy } = useMyPharmacy();
  const loading = rxLoading || ordLoading;

  const [actionLoading, setActionLoading] = useState<Record<string | number, string | null>>({});
  const [activeTab, setActiveTab] = useState('orders');
  const [messages, setMessages] = useState<Record<string | number, { type: string; text: string } | null>>({});

  const pharmacyId = myPharmacy?.id;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['pharmacist'] });
  };

  // ─── Status advancement ──────────────────────────────────────────────────

  async function handleStatusUpdate(orderId: number | string, newStatus: string) {
    setActionLoading(a => ({ ...a, [orderId]: newStatus }));
    try {
      await apiUpdateOrderStatus(orderId, newStatus);
      setMessages(m => ({ ...m, [orderId]: { type: 'success', text: `Order status updated to ${newStatus}` } }));
      invalidate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setMessages(m => ({ ...m, [orderId]: { type: 'error', text: msg } }));
    } finally { setActionLoading(a => ({ ...a, [orderId]: null })); }
  }

  // ─── Delete order ─────────────────────────────────────────────────────────

  async function handleDeleteOrder(orderId: number | string) {
    if (!window.confirm(`Are you sure you want to delete / cancel Order #${orderId}?`)) return;
    setActionLoading(a => ({ ...a, [`del-${orderId}`]: 'deleting' }));
    try {
      await apiDeleteOrder(orderId);
      setMessages(m => ({ ...m, [orderId]: { type: 'success', text: `Order #${orderId} deleted successfully.` } }));
      invalidate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete order failed';
      setMessages(m => ({ ...m, [orderId]: { type: 'error', text: msg } }));
    } finally { setActionLoading(a => ({ ...a, [`del-${orderId}`]: null })); }
  }


  // ─── Convert prescription → order ───────────────────────────────────────

  async function handleConvertToOrder(rx: Prescription) {
    if (!pharmacyId) {
      setMessages(m => ({ ...m, [`rx-${rx.id}`]: { type: 'error', text: 'Pharmacy not found. Please refresh.' } }));
      return;
    }
    setActionLoading(a => ({ ...a, [`rx-${rx.id}`]: 'converting' }));
    try {
      await apiCreateOrder({ prescriptionId: Number(rx.id), pharmacyId, items: [] });
      setMessages(m => ({ ...m, [`rx-${rx.id}`]: { type: 'success', text: 'Order created successfully!' } }));
      // Refresh both prescription queue and orders list
      queryClient.invalidateQueries({ queryKey: ['pharmacist', 'prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacist', 'orders'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      setMessages(m => ({ ...m, [`rx-${rx.id}`]: { type: 'error', text: msg } }));
    } finally { setActionLoading(a => ({ ...a, [`rx-${rx.id}`]: null })); }
  }

  // ─── Calculate price ─────────────────────────────────────────────────────

  async function handleCalculatePrice(orderId: number | string) {
    if (!pharmacyId) return;
    setActionLoading(a => ({ ...a, [`calc-${orderId}`]: 'calculating' }));
    try {
      await apiCalculateOrderPrice(orderId, pharmacyId);
      setMessages(m => ({ ...m, [orderId]: { type: 'success', text: 'Prices updated from inventory.' } }));
      invalidate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Price calculation failed';
      setMessages(m => ({ ...m, [orderId]: { type: 'error', text: msg } }));
    } finally { setActionLoading(a => ({ ...a, [`calc-${orderId}`]: null })); }
  }

  const activeOrders    = orders.filter((o: Order) => !['Dispensed', 'Cancelled'].includes(o.status));
  const completedOrders = orders.filter((o: Order) => o.status === 'Dispensed');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Pharmacist Dashboard"
          subtitle="Manage prescriptions and process medicine orders"
          actions={<button className="btn btn-ghost btn-sm" onClick={invalidate} id="refresh-pharma-btn"><RefreshCw size={14} /> Refresh</button>}
        />
        <div className="page-body fade-in">

          <PortalHeader
            role="pharma"
            title="Pharmacist Portal"
            subtitle="Process prescriptions and manage medicine dispensing"
            loading={loading}
            stats={[
              { label: 'New Prescriptions', value: prescriptions.filter((p: Prescription) => p.status === 'Active').length, icon: '📋' },
              { label: 'Active Orders',      value: activeOrders.length, icon: '⚗️', highlight: activeOrders.length > 0 },
              { label: 'Dispensed Today',    value: completedOrders.length, icon: '✅' },
            ]}
          />

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

          {/* ── Active Orders Tab ──────────────────────────────────────────── */}
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
                {activeOrders.map((order: Order) => {
                  const st = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
                  const nextStatusIdx = ORDER_STATUS_FLOW.indexOf(order.status) + 1;
                  const nextStatus = ORDER_STATUS_FLOW[nextStatusIdx] as string | undefined;
                  const isAdvancing = actionLoading[order.id];
                  const isCalcing   = actionLoading[`calc-${order.id}`];
                  const msg = messages[order.id];
                  return (
                    <div key={order.id} className="card" id={`pharma-order-${order.id}`}>
                      <div className="card-header">
                        <div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 800 }}>Order #{order.id}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            Patient: {order.patientName} · Appt: <strong style={{ color: 'var(--med-teal)' }}>{order.appointmentNumber ?? '—'}</strong>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <span className="badge" style={{ color: st.color, background: st.bg }}>{order.status}</span>

                          {/* Calculate Price */}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleCalculatePrice(order.id)}
                            disabled={!!isCalcing}
                            id={`calc-price-order-${order.id}`}
                            title="Recalculate prices from inventory"
                          >
                            {isCalcing ? <Loader size={12} className="spin" /> : <Calculator size={12} />}
                            Price
                          </button>

                          {/* Delete / Cancel Order */}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={!!actionLoading[`del-${order.id}`]}
                            id={`delete-order-${order.id}`}
                            title="Cancel / Delete Order"
                            style={{ color: 'var(--danger)' }}
                          >
                            {actionLoading[`del-${order.id}`] ? <Loader size={12} className="spin" /> : <Trash2 size={12} />}
                            Delete
                          </button>


                          {/* Advance Status */}
                          {nextStatus && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order.id, nextStatus)}
                              disabled={!!isAdvancing}
                              id={`advance-order-${order.id}`}
                            >
                              {isAdvancing ? <Loader size={12} className="spin" /> : <CheckCircle size={12} />}
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

          {/* ── Prescriptions Tab ─────────────────────────────────────────── */}
          {activeTab === 'prescriptions' && (
            loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--r-lg)' }} />)}
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">💊</div>
                <div className="empty-title">No pending prescriptions</div>
                <div className="empty-sub">All prescriptions have been processed into orders.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {prescriptions.map((rx: Prescription) => {
                  const rxKey = `rx-${rx.id}`;
                  const isConverting = actionLoading[rxKey];
                  const msg = messages[rxKey];
                  return (
                    <div key={rx.id} className="rx-card" id={`rx-pharma-${rx.id}`}>
                      <div className="rx-header">
                        <div className="rx-id">Rx #{rx.id} — {rx.appointmentNumber ?? '—'}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`badge ${rx.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>{rx.status}</span>
                          {/* ── Convert to Order ── */}
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleConvertToOrder(rx)}
                            disabled={!!isConverting}
                            id={`convert-rx-${rx.id}`}
                            title="Create a medicine order from this prescription"
                          >
                            {isConverting ? <Loader size={12} className="spin" /> : <ShoppingCart size={12} />}
                            Convert to Order
                          </button>
                        </div>
                      </div>
                      <div className="rx-body">
                        {msg && (
                          <div style={{ marginBottom: 10, padding: '6px 10px', borderRadius: 'var(--r-md)', background: msg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: 12, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                            {msg.type === 'success' ? <CheckCircle size={11} /> : <AlertCircle size={11} />} {msg.text}
                          </div>
                        )}
                        <div className="info-row"><span className="info-row-label">Patient:</span>{rx.patientName}</div>
                        <div className="info-row"><span className="info-row-label">Doctor:</span>{rx.doctorName}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                          {(rx.items || []).map((item, i) => (
                            <span key={i} className="badge badge-teal"><Pill size={10} /> {item.medicineName}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── Dispensed Tab ─────────────────────────────────────────────── */}
          {activeTab === 'completed' && (
            completedOrders.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">✅</div>
                <div className="empty-title">No dispensed orders yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {completedOrders.map((order: Order) => (
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
