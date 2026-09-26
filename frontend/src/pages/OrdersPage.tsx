import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Package, CheckCircle, Clock, Truck, AlertCircle, Star,
  ShieldCheck, ArrowRight, Sparkles, Building2, Calendar
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useMyOrders } from '../hooks';
import type { Order, OrderStatus } from '../types/order';

interface OrderStageMeta {
  key: OrderStatus;
  label: string;
  icon: typeof Clock;
  title: string;
  desc: string;
}

const ORDER_STAGES: OrderStageMeta[] = [
  { key: 'Pending',   label: 'In Queue',  icon: Clock,       title: 'Order Queued',          desc: 'Prescription received in pharmacy dispensing queue' },
  { key: 'Confirmed', label: 'Verified',  icon: ShieldCheck, title: 'Pharmacist Confirmed',  desc: 'Clinical safety & stock verified by pharmacist' },
  { key: 'Dispensed', label: 'Dispensed', icon: CheckCircle, title: 'Dispensed to Patient',  desc: 'Medications handed over and recorded by pharmacist' },
];

const ORDER_STEP_KEYS: OrderStatus[] = ['Pending', 'Confirmed', 'Dispensed'];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  Pending:   { color: '#B45309', bg: '#FFFBEB', label: 'In Queue', icon: '🕐' },
  Confirmed: { color: '#0369A1', bg: '#EFF6FF', label: 'Confirmed', icon: '✅' },
  Preparing: { color: '#0369A1', bg: '#EFF6FF', label: 'Confirmed', icon: '✅' },
  Ready:     { color: '#0369A1', bg: '#EFF6FF', label: 'Confirmed', icon: '✅' },
  Dispensed: { color: '#059669', bg: '#ECFDF5', label: 'Dispensed', icon: '✓' },
  Cancelled: { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelled', icon: '✕' },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get('orderId');
  const queryRxId = searchParams.get('prescriptionId');

  const { data: orders = [], isLoading: loading } = useMyOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'dispensed'>('all');

  const activeOrders = orders.filter(o => !['Dispensed', 'Cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'Dispensed');

  // Auto-select order based on URL params or default to first
  useEffect(() => {
    if (orders.length > 0) {
      if (queryOrderId) {
        const found = orders.find(o => String(o.id) === queryOrderId);
        if (found) {
          setSelectedOrder(found);
          if (found.status === 'Dispensed') setActiveTab('dispensed');
          else setActiveTab('active');
          return;
        }
      }
      if (queryRxId) {
        const found = orders.find(o => String(o.prescriptionId) === queryRxId);
        if (found) {
          setSelectedOrder(found);
          if (found.status === 'Dispensed') setActiveTab('dispensed');
          else setActiveTab('active');
          return;
        }
      }
      if (!selectedOrder) {
        setSelectedOrder(orders[0]);
      }
    }
  }, [orders, queryOrderId, queryRxId]);

  const displayedOrders =
    activeTab === 'active' ? activeOrders :
    activeTab === 'dispensed' ? completedOrders :
    orders;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Medicine Tracking & Orders"
          subtitle="Track real-time pharmacy dispensing status for your prescribed medicines"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/prescriptions')} id="view-rx-btn">
              View Prescriptions <ArrowRight size={14} />
            </button>
          }
        />
        <div className="page-body fade-in">

          {/* Quick Filter Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('all')}
              id="filter-all-orders"
            >
              All Prescriptions ({orders.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('active')}
              id="filter-active-orders"
            >
              Active Dispensing ({activeOrders.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'dispensed' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('dispensed')}
              id="filter-dispensed-orders"
            >
              ✓ Dispensed ({completedOrders.length})
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--r-xl)' }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📦</div>
              <div className="empty-title">No medicine dispensing records yet</div>
              <div className="empty-sub">
                When your doctor issues an e-prescription, the pharmacy prepares and dispenses your medications here. You can track each dispensing step in real time.
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/prescriptions')} id="view-prescriptions-btn">
                View My Prescriptions
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 430px' : '1fr', gap: 24 }}>

              {/* Order List */}
              <div>
                {displayedOrders.length === 0 ? (
                  <div className="card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No orders found in this filter category.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {displayedOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onSelect={() => setSelectedOrder(order)}
                        selected={selectedOrder?.id === order.id}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Detailed Tracking Panel */}
              {selectedOrder && (
                <div className="card scale-in" style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16 }}>
                        Dispensing Tracker #{selectedOrder.id}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Appt: <strong>{selectedOrder.appointmentNumber || 'N/A'}</strong>
                        {selectedOrder.prescriptionId && ` • Rx #${selectedOrder.prescriptionId}`}
                      </div>
                    </div>
                    <button className="close-btn" onClick={() => setSelectedOrder(null)} id="close-order-panel-btn">✕</button>
                  </div>

                  <div className="card-body">

                    {/* ── Official Dispensed Callout Banner ── */}
                    {selectedOrder.status === 'Dispensed' ? (
                      <div style={{
                        padding: '16px',
                        background: 'linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%)',
                        border: '1.5px solid #10B981',
                        borderRadius: 'var(--r-lg)',
                        marginBottom: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: '#059669', color: '#ffffff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20, fontWeight: 900, flexShrink: 0
                        }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#065F46' }}>
                            Prescription Dispensed & Completed
                          </div>
                          <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
                            Medications successfully dispensed by <strong>{selectedOrder.pharmacyName}</strong>.
                          </div>
                          <div style={{ fontSize: 11.5, color: '#065F46', fontWeight: 600, marginTop: 4 }}>
                            Dispensed: {selectedOrder.dispensedAt ? new Date(selectedOrder.dispensedAt).toLocaleString() : new Date(selectedOrder.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Pharmacy & Doctor Info */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      padding: '12px 14px',
                      borderRadius: 'var(--r-md)',
                      marginBottom: 20,
                      border: '1px solid var(--border)'
                    }}>
                      <div className="info-row"><span className="info-row-label">🏥 Pharmacy:</span><strong>{selectedOrder.pharmacyName}</strong></div>
                      <div className="info-row"><span className="info-row-label">🩺 Doctor:</span>{selectedOrder.doctorName}</div>
                      <div className="info-row"><span className="info-row-label">📋 Status:</span>
                        <span className={`badge ${
                          selectedOrder.status === 'Dispensed' ? 'badge-green' :
                          ['Confirmed', 'Preparing', 'Ready'].includes(selectedOrder.status) ? 'badge-blue' : 'badge-amber'
                        }`}>
                          {STATUS_STYLES[selectedOrder.status]?.label || selectedOrder.status}
                        </span>
                      </div>
                    </div>

                    {/* ── Real-Time Dispensing Progress Timeline ── */}
                    <div className="section-title" style={{ fontSize: 13, marginBottom: 14 }}>
                      Live Dispensing Timeline
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24, position: 'relative' }}>
                      {ORDER_STAGES.map((stage, idx) => {
                        const isCompleted =
                          stage.key === 'Pending' ? ['Confirmed', 'Preparing', 'Ready', 'Dispensed'].includes(selectedOrder.status) :
                          stage.key === 'Confirmed' ? selectedOrder.status === 'Dispensed' :
                          stage.key === 'Dispensed' ? selectedOrder.status === 'Dispensed' : false;

                        const isCurrent =
                          stage.key === 'Pending' ? selectedOrder.status === 'Pending' :
                          stage.key === 'Confirmed' ? ['Confirmed', 'Preparing', 'Ready'].includes(selectedOrder.status) :
                          false;

                        const StageIcon = stage.icon;

                        return (
                          <div key={stage.key} style={{ display: 'flex', gap: 14, minHeight: 48, position: 'relative' }}>
                            {/* Connecting Line */}
                            {idx < ORDER_STAGES.length - 1 && (
                              <div style={{
                                position: 'absolute',
                                left: 15,
                                top: 30,
                                bottom: -2,
                                width: 2,
                                background: isCompleted ? '#10B981' : 'var(--border)',
                                zIndex: 0,
                              }} />
                            )}

                            {/* Status Node Icon */}
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: isCompleted ? '#059669' : isCurrent ? 'var(--med-blue)' : 'var(--surface-3)',
                              border: `2px solid ${isCompleted ? '#059669' : isCurrent ? 'var(--med-blue)' : 'var(--border)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isCompleted || isCurrent ? '#ffffff' : 'var(--text-muted)',
                              fontWeight: 700,
                              fontSize: 13,
                              zIndex: 1,
                              flexShrink: 0,
                              boxShadow: isCurrent ? '0 0 0 3px rgba(42, 125, 225, 0.2)' : 'none',
                            }}>
                              {isCompleted ? '✓' : <StageIcon size={14} />}
                            </div>

                            {/* Node Details */}
                            <div style={{ paddingBottom: 16 }}>
                              <div style={{
                                fontSize: 13,
                                fontWeight: isCompleted || isCurrent ? 800 : 600,
                                color: isCompleted ? '#059669' : isCurrent ? 'var(--med-blue)' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}>
                                {stage.title}
                                {isCurrent && (
                                  <span className="badge badge-blue" style={{ fontSize: 10, padding: '1px 6px' }}>Current</span>
                                )}
                                {stage.key === 'Dispensed' && selectedOrder.status === 'Dispensed' && (
                                  <span className="badge badge-green" style={{ fontSize: 10, padding: '1px 6px' }}>Completed</span>
                                )}
                              </div>
                              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                                {stage.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Prescribed Items in Order */}
                    <div className="section-title" style={{ fontSize: 13, marginBottom: 10 }}>
                      Dispensed Medications ({(selectedOrder.items || []).length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      {(selectedOrder.items || []).map((item, i) => (
                        <div key={i} className="rx-medicine-item">
                          <div>
                            <div className="rx-med-name">{item.medicineName}</div>
                            <div className="rx-med-dosage">{item.dosage || 'Standard'}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="rx-med-qty">×{item.quantity}</div>
                            {item.subtotal ? (
                              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                                Rs. {item.subtotal.toLocaleString()}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    {selectedOrder.totalAmount > 0 && (
                      <div className="price-breakdown" style={{ marginTop: 12 }}>
                        <div className="price-row total">
                          <span>Total Amount</span>
                          <strong>Rs. {selectedOrder.totalAmount?.toLocaleString()}</strong>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === 'Dispensed' && (
                      <button className="btn btn-teal" style={{ width: '100%', marginTop: 16 }} id="rate-pharmacy-btn">
                        <Star size={14} /> Rate Pharmacy Experience
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onSelect, selected }: { order: Order; onSelect: () => void; selected: boolean }) {
  const isDispensed = order.status === 'Dispensed';
  const st = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;

  return (
    <div
      className="card"
      onClick={onSelect}
      id={`order-card-${order.id}`}
      style={{
        cursor: 'pointer',
        border: selected ? '2px solid var(--med-blue)' : isDispensed ? '1.5px solid #A7F3D0' : '1.5px solid var(--border)',
        background: isDispensed ? '#FBFDFB' : 'white',
        transition: 'var(--transition)',
        boxShadow: selected ? '0 8px 24px -4px rgba(42, 125, 225, 0.15)' : 'none',
      }}
    >
      <div className="card-body" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                Dispense Order #{order.id}
              </div>
              {isDispensed && (
                <span className="badge badge-green" style={{ fontSize: 11, padding: '2px 8px' }}>
                  ✓ Dispensed
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              🏥 {order.pharmacyName} • Appt: <strong>{order.appointmentNumber || 'N/A'}</strong>
              {order.prescriptionId && ` • Rx #${order.prescriptionId}`}
            </div>
          </div>
          <span className="badge" style={{ color: st.color, background: st.bg, fontWeight: 700 }}>
            {st.icon} {st.label}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {(order.items || []).map((item, i) => (
            <span key={i} className="pill" style={{ fontSize: 12 }}>
              <Package size={11} style={{ marginRight: 4 }} /> {item.medicineName} ×{item.quantity}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: isDispensed ? '#059669' : 'var(--text-muted)', fontWeight: isDispensed ? 600 : 400 }}>
            {isDispensed && order.dispensedAt
              ? `Dispensed on ${new Date(order.dispensedAt).toLocaleDateString()}`
              : `Created on ${new Date(order.createdAt).toLocaleDateString()}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--med-blue)', fontSize: 12.5, fontWeight: 700 }}>
            <span>Track Dispensing</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}
