import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, Clock, Truck, AlertCircle, Star } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetMyOrders } from '../services/api';

const ORDER_STEPS = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Dispensed'];
const STEP_ICONS = { Pending: '🕐', Confirmed: '✅', Preparing: '⚗️', Ready: '📦', Dispensed: '✨' };

const STATUS_STYLES = {
  Pending:   { color: '#B45309', bg: '#FFFBEB', label: 'Pending' },
  Confirmed: { color: '#0369A1', bg: '#EFF6FF', label: 'Confirmed' },
  Preparing: { color: '#7C3AED', bg: '#EEF2FF', label: 'Preparing' },
  Ready:     { color: '#059669', bg: '#ECFDF5', label: 'Ready for Collection' },
  Dispensed: { color: '#6366F1', bg: '#EEF2FF', label: 'Dispensed' },
  Cancelled: { color: '#DC2626', bg: '#FEF2F2', label: 'Cancelled' },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    apiGetMyOrders().then(d => setOrders(d || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter(o => !['Dispensed','Cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => ['Dispensed'].includes(o.status));

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Medicine Orders" subtitle="Track your medicine orders and dispensing status" />
        <div className="page-body fade-in">

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--r-xl)' }} />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">📦</div>
              <div className="empty-title">No medicine orders yet</div>
              <div className="empty-sub">After your doctor prescribes medicines, you can order them through MediFlow.</div>
              <button className="btn btn-primary" onClick={() => navigate('/prescriptions')} id="view-prescriptions-btn">View Prescriptions</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: 24 }}>
              <div>
                {activeOrders.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div className="section-title" style={{ marginBottom: 16 }}>Active Orders</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {activeOrders.map(order => <OrderCard key={order.id} order={order} onSelect={() => setSelectedOrder(order)} selected={selectedOrder?.id === order.id} />)}
                    </div>
                  </div>
                )}
                {completedOrders.length > 0 && (
                  <div>
                    <div className="section-title" style={{ marginBottom: 16 }}>Order History</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {completedOrders.map(order => <OrderCard key={order.id} order={order} onSelect={() => setSelectedOrder(order)} selected={selectedOrder?.id === order.id} />)}
                    </div>
                  </div>
                )}
              </div>

              {selectedOrder && (
                <div className="card scale-in" style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
                  <div className="card-header">
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Order #{selectedOrder.id}</div>
                    <button className="close-btn" onClick={() => setSelectedOrder(null)} id="close-order-panel-btn">✕</button>
                  </div>
                  <div className="card-body">
                    <div style={{ marginBottom: 20 }}>
                      <div className="info-row"><span className="info-row-label">Pharmacy:</span>{selectedOrder.pharmacyName}</div>
                      <div className="info-row"><span className="info-row-label">Appointment:</span><span style={{ color: 'var(--med-teal)', fontWeight: 700 }}>{selectedOrder.appointmentNumber}</span></div>
                      <div className="info-row"><span className="info-row-label">Doctor:</span>{selectedOrder.doctorName}</div>
                    </div>

                    {/* Order Progress */}
                    <div className="section-title" style={{ fontSize: 13, marginBottom: 12 }}>Order Progress</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
                      {ORDER_STEPS.map((step, idx) => {
                        const currentIdx = ORDER_STEPS.indexOf(selectedOrder.status);
                        const isDone = idx <= currentIdx;
                        return (
                          <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: '50%',
                              background: isDone ? 'var(--gradient-primary)' : 'var(--surface-3)',
                              border: `2px solid ${isDone ? 'transparent' : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, color: isDone ? 'white' : 'var(--text-muted)',
                              fontWeight: 700, transition: 'var(--transition)',
                            }}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <div style={{ fontSize: 9, color: isDone ? 'var(--med-blue)' : 'var(--text-muted)', textAlign: 'center', fontWeight: isDone ? 700 : 400 }}>
                              {step}
                            </div>
                            {idx < ORDER_STEPS.length - 1 && (
                              <div style={{ position: 'absolute', display: 'none' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Items */}
                    <div className="section-title" style={{ fontSize: 13, marginBottom: 10 }}>Order Items</div>
                    {(selectedOrder.items || []).map((item, i) => (
                      <div key={i} className="rx-medicine-item">
                        <div>
                          <div className="rx-med-name">{item.medicineName}</div>
                          <div className="rx-med-dosage">{item.dosage}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="rx-med-qty">×{item.quantity}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>Rs. {item.subtotal?.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}

                    {/* Price */}
                    <div className="price-breakdown" style={{ marginTop: 16 }}>
                      <div className="price-row"><span>Subtotal</span><span>Rs. {selectedOrder.totalAmount?.toLocaleString()}</span></div>
                      <div className="price-row total"><span>Total</span><strong>Rs. {selectedOrder.totalAmount?.toLocaleString()}</strong></div>
                    </div>

                    {selectedOrder.status === 'Dispensed' && (
                      <button className="btn btn-teal" style={{ width: '100%', marginTop: 16 }} id="rate-pharmacy-btn">
                        <Star size={14} /> Rate Pharmacy
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

function OrderCard({ order, onSelect, selected }) {
  const st = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
  return (
    <div
      className="card"
      onClick={onSelect}
      id={`order-card-${order.id}`}
      style={{ cursor: 'pointer', border: selected ? '1.5px solid var(--med-blue)' : '1.5px solid var(--border)', transition: 'var(--transition)' }}
    >
      <div className="card-body" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Order #{order.id}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>🏥 {order.pharmacyName} · {order.appointmentNumber}</div>
          </div>
          <span className="badge" style={{ color: st.color, background: st.bg }}>{st.label}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {(order.items || []).slice(0, 3).map((item, i) => (
            <span key={i} className="pill"><Package size={10} /> {item.medicineName} ×{item.quantity}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>Rs. {order.totalAmount?.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
