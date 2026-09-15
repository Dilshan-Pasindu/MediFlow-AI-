import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, X, Loader, Truck, RefreshCw, Package, AlertTriangle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiGetRestockRequests, apiUpdateRestockStatus, apiGetMySupplierProfile, getUser, apiSubmitBankDetails, apiVerifyRestockPayment } from '../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RestockRequestItem {
  id: number;
  medicineId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  batchNumber: string | null;
  expiryDate: string | null;
}

interface RestockRequest {
  id: number;
  pharmacyId: number;
  pharmacyName: string;
  supplierName: string;
  status: string;
  totalAmount: number;
  notes: string | null;
  supplierResponseNote: string | null;
  requestedAt: string;
  updatedAt: string;
  items: RestockRequestItem[];
  supplierBankName?: string;
  supplierAccountName?: string;
  supplierAccountNumber?: string;
  supplierBranch?: string;
  paymentStatus?: string;
  paymentSlipUrl?: string;
}

// ─── Batch input for dispatch ──────────────────────────────────────────────

interface BatchInfo {
  restockRequestItemId: number;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  Pending: 'badge-yellow',
  Approved: 'badge-blue',
  Rejected: 'badge-red',
  Dispatched: 'badge-blue',
  Delivered: 'badge-green',
  Completed: 'badge-green',
};

export default function SupplierDashboard() {
  const user = getUser();
  const [supplierName, setSupplierName] = useState('');
  const [requests, setRequests] = useState<RestockRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'history'>('pending');

  // Per-request state
  const [actionLoading, setActionLoading] = useState<Record<number, string>>({});
  const [messages, setMessages] = useState<Record<number, { type: string; text: string }>>({});
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Dispatch modal state
  const [dispatchingId, setDispatchingId] = useState<number | null>(null);
  const [batchInputs, setBatchInputs] = useState<Record<number, BatchInfo>>({});
  const [dispatchLoading, setDispatchLoading] = useState(false);

  // Bank Details state
  const [bankModalReq, setBankModalReq] = useState<RestockRequest | null>(null);
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountName: '', accountNumber: '', branch: '' });
  const [bankSubmitting, setBankSubmitting] = useState(false);

  // Verify Payment state
  const [verifyModalReq, setVerifyModalReq] = useState<RestockRequest | null>(null);
  const [verifySubmitting, setVerifySubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqs, profile] = await Promise.all([
        apiGetRestockRequests() as Promise<RestockRequest[]>,
        apiGetMySupplierProfile().catch(() => null) as Promise<{ companyName: string } | null>
      ]);
      setRequests(reqs || []);
      if (profile) setSupplierName(profile.companyName);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const pending = requests.filter(r => r.status === 'Pending');
  const approved = requests.filter(r => r.status === 'Approved');
  const history = requests.filter(r => ['Rejected', 'Dispatched', 'Delivered', 'Completed'].includes(r.status));

  const display = activeTab === 'pending' ? pending
    : activeTab === 'approved' ? approved
    : history;

  async function handleAction(id: number, status: string, responseNote?: string) {
    setActionLoading(a => ({ ...a, [id]: status }));
    try {
      await apiUpdateRestockStatus(id, status, responseNote);
      setMessages(m => ({
        ...m, [id]: {
          type: 'success',
          text: status === 'Approved' ? 'Order approved! Prepare for dispatch.'
            : status === 'Rejected' ? 'Order rejected.'
            : 'Status updated.'
        }
      }));
      loadData();
    } catch (e: any) {
      setMessages(m => ({ ...m, [id]: { type: 'error', text: e?.response?.data?.message || 'Action failed.' } }));
    } finally {
      setActionLoading(a => ({ ...a, [id]: '' }));
    }
  }

  function openDispatch(req: RestockRequest) {
    setDispatchingId(req.id);
    const init: Record<number, BatchInfo> = {};
    req.items.forEach(item => {
      const defaultExpiry = new Date();
      defaultExpiry.setMonth(defaultExpiry.getMonth() + 18);
      init[item.id] = {
        restockRequestItemId: item.id,
        batchNumber: `BATCH-${req.id}-${item.medicineId}-${Date.now()}`,
        expiryDate: defaultExpiry.toISOString().split('T')[0],
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subTotal: item.quantity * item.unitPrice,
      };
    });
    setBatchInputs(init);
  }

  async function handleDispatch() {
    if (!dispatchingId) return;
    setDispatchLoading(true);
    try {
      await apiUpdateRestockStatus(
        dispatchingId,
        'Dispatched',
        'Stock dispatched with batch and expiry information.',
        Object.values(batchInputs).map(b => ({
          restockRequestItemId: b.restockRequestItemId,
          batchNumber: b.batchNumber,
          expiryDate: b.expiryDate,
          quantity: b.quantity,
          unitPrice: b.unitPrice,
          subTotal: b.subTotal,
        }))
      );
      setMessages(m => ({ ...m, [dispatchingId]: { type: 'success', text: 'Dispatched! Pharmacy will confirm receipt.' } }));
      setDispatchingId(null);
      loadData();
    } catch (e: any) {
      setError(e?.message || 'Dispatch failed.');
    } finally {
      setDispatchLoading(false);
    }
  }

  // ── Payment Handlers ────────────────────────────────────────────────────────

  async function handleBankDetailsSubmit() {
    if (!bankModalReq) return;
    setBankSubmitting(true);
    try {
      await apiSubmitBankDetails(bankModalReq.id, bankDetails);
      setMessages(m => ({ ...m, [bankModalReq.id]: { type: 'success', text: 'Bank details submitted.' } }));
      setBankModalReq(null);
      loadData();
    } catch (e: any) {
      setError(e?.message || 'Failed to submit bank details.');
    } finally {
      setBankSubmitting(false);
    }
  }

  async function handleVerifyPayment() {
    if (!verifyModalReq) return;
    setVerifySubmitting(true);
    try {
      await apiVerifyRestockPayment(verifyModalReq.id);
      setMessages(m => ({ ...m, [verifyModalReq.id]: { type: 'success', text: 'Payment verified.' } }));
      setVerifyModalReq(null);
      loadData();
    } catch (e: any) {
      setError(e?.message || 'Failed to verify payment.');
    } finally {
      setVerifySubmitting(false);
    }
  }

  function toggleExpanded(id: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Supplier Dashboard"
          subtitle={supplierName ? `${supplierName} — Review and manage restock orders` : 'Review and approve pharmacy restock requests'}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadData} disabled={loading} id="refresh-supplier-btn">
              <RefreshCw size={13} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">

          <PortalHeader
            role="supplier"
            title="Supplier Portal"
            subtitle="Review pharmacy restock requests and manage supply chain"
            loading={loading}
            stats={[
              { label: 'Pending',  value: pending.length,  icon: '📦', highlight: pending.length > 0 },
              { label: 'Approved', value: approved.length, icon: '✅' },
              { label: 'History',  value: history.length,  icon: '📊' },
            ]}
          />

          {/* Human Approval Banner */}
          <div className="approval-banner" style={{ marginBottom: 20, background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', borderColor: '#BFDBFE' }}>
            <span className="approval-banner-icon">🚚</span>
            <div>
              <div className="approval-banner-title" style={{ color: '#1E40AF' }}>Human Approval Point #4 — Supply Approval</div>
              <div className="approval-banner-sub" style={{ color: '#1D4ED8' }}>
                Review each request carefully. Approve → prepare stock → Dispatch (with batch numbers &amp; expiry). Pharmacy confirms receipt and inventory updates automatically.
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 'var(--r-md)', background: '#FEF2F2', color: 'var(--danger)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertTriangle size={15} /> {error}
              <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setError(null)}><X size={13} /></button>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')} id="tab-pending-supply">
              📦 Pending ({pending.length})
            </button>
            <button className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')} id="tab-approved-supply">
              ✅ Approved — Ready to Dispatch ({approved.length})
            </button>
            <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} id="tab-history-supply">
              📊 History ({history.length})
            </button>
          </div>

          {loading ? (
            <div style={{ padding: 60, textAlign: 'center' }}><Loader className="spin" size={28} /></div>
          ) : display.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">{activeTab === 'pending' ? '🎉' : '📦'}</div>
              <div className="empty-title">{activeTab === 'pending' ? 'No pending requests!' : 'Nothing here yet'}</div>
              <div className="empty-sub">All caught up.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {display.map(req => {
                const msg = messages[req.id];
                const isActing = actionLoading[req.id];
                const isExpanded = expanded.has(req.id);
                const totalValue = req.totalAmount;
                return (
                  <div key={req.id} className="card" id={`supply-req-${req.id}`}>
                    <div className="card-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800 }}>
                            Request #{req.id}
                          </div>
                          <span className={`badge ${STATUS_COLOR[req.status] || 'badge-blue'}`}>{req.status}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>🏥 {req.pharmacyName}</div>
                        {req.notes && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>📝 {req.notes}</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Order Value</div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>Rs. {totalValue.toFixed(2)}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{req.items.length} medicine(s)</div>
                      </div>
                    </div>

                    <div className="card-body" style={{ padding: '14px 20px' }}>
                      {/* Items toggle */}
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ marginBottom: 12, fontSize: 12 }}
                        onClick={() => toggleExpanded(req.id)}
                      >
                        <Package size={13} /> {isExpanded ? 'Hide' : 'View'} Items ({req.items.length})
                      </button>

                      {isExpanded && (
                        <div style={{ marginBottom: 14, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                          <table className="table" style={{ margin: 0 }}>
                            <thead>
                              <tr>
                                <th>Medicine</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                                <th>Batch #</th>
                                <th>Expiry</th>
                              </tr>
                            </thead>
                            <tbody>
                              {req.items.map(item => (
                                <tr key={item.id}>
                                  <td style={{ fontWeight: 600 }}>{item.medicineName}</td>
                                  <td>{item.quantity}</td>
                                  <td>Rs. {item.unitPrice.toFixed(2)}</td>
                                  <td>Rs. {item.subTotal.toFixed(2)}</td>
                                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.batchNumber || '—'}</td>
                                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                        <span>Requested: {new Date(req.requestedAt).toLocaleString()}</span>
                        <span>Updated: {new Date(req.updatedAt).toLocaleString()}</span>
                      </div>

                      {msg && (
                        <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 'var(--r-md)', background: msg.type === 'success' ? 'var(--success-bg)' : '#FEF2F2', color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: 12.5, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                          {msg.type === 'success' ? <CheckCircle size={13} /> : <AlertTriangle size={13} />} {msg.text}
                        </div>
                      )}

                      {/* Actions by status */}
                      {req.status === 'Pending' && !messages[req.id] && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button className="btn btn-success" onClick={() => handleAction(req.id, 'Approved')} disabled={!!isActing} id={`approve-supply-${req.id}`} style={{ flex: 1 }}>
                            {isActing === 'Approved' ? <Loader size={14} className="spin" /> : <CheckCircle size={14} />}
                            {isActing === 'Approved' ? 'Processing...' : 'Approve Order'}
                          </button>
                          <button className="btn btn-danger" onClick={() => handleAction(req.id, 'Rejected', 'Order rejected by supplier.')} disabled={!!isActing} id={`reject-supply-${req.id}`}>
                            {isActing === 'Rejected' ? <Loader size={14} className="spin" /> : <X size={14} />}
                            Reject
                          </button>
                        </div>
                      )}

                      {req.status === 'Approved' && !messages[req.id] && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <button className="btn btn-primary" onClick={() => openDispatch(req)} id={`dispatch-supply-${req.id}`} style={{ width: '100%' }}>
                            <Truck size={14} /> Dispatch Stock (Enter Batch Info)
                          </button>
                        </div>
                      )}

                      {req.status === 'Dispatched' && !messages[req.id] && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0891B2', fontWeight: 700, fontSize: 13, flex: 1 }}>
                            <Truck size={15} /> Dispatched — In transit
                          </div>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAction(req.id, 'Delivered', 'Stock delivered to pharmacy.')}
                            disabled={!!isActing}
                            id={`deliver-supply-${req.id}`}
                          >
                            {isActing === 'Delivered' ? <Loader size={13} className="spin" /> : <CheckCircle size={13} />}
                            {isActing === 'Delivered' ? 'Updating...' : 'Mark Delivered'}
                          </button>
                        </div>
                      )}

                      {req.status === 'Delivered' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 700, fontSize: 13 }}>
                          <Truck size={15} /> Delivered — Awaiting pharmacy receipt confirmation.
                        </div>
                      )}

                      {req.status === 'Completed' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 700, fontSize: 13 }}>
                          <CheckCircle size={15} /> Completed — Inventory updated at pharmacy.
                        </div>
                      )}

                      {req.status === 'Rejected' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
                          <X size={15} /> Rejected{req.supplierResponseNote ? `: ${req.supplierResponseNote}` : ''}
                        </div>
                      )}

                      {/* Payment Actions (Independent of fulfillment status) */}
                      {req.status !== 'Pending' && req.status !== 'Rejected' && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {!req.supplierBankName && (
                            <button className="btn btn-ghost" onClick={() => { setBankModalReq(req); setBankDetails({ bankName: '', accountName: '', accountNumber: '', branch: '' }); }} style={{ width: '100%', fontSize: 13, background: 'var(--surface-2)' }}>
                              🏦 Submit Bank Details
                            </button>
                          )}
                          {req.supplierBankName && req.paymentStatus === 'Submitted' && (
                            <button className="btn btn-success" onClick={() => setVerifyModalReq(req)} style={{ width: '100%' }}>
                              ✅ Verify Payment (Slip Uploaded)
                            </button>
                          )}
                          {req.supplierBankName && req.paymentStatus === 'Verified' && (
                            <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600, textAlign: 'center', background: 'var(--surface-2)', padding: '10px', borderRadius: 'var(--r-md)' }}>
                              ✅ Payment Verified
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Dispatch Modal ──────────────────────────────────────────────── */}
      {dispatchingId !== null && (() => {
        const req = requests.find(r => r.id === dispatchingId);
        if (!req) return null;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--r-xl)', padding: 28, width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, fontWeight: 800 }}>
                  🚚 Dispatch Request #{dispatchingId}
                </div>
                <button className="close-btn" onClick={() => setDispatchingId(null)}><X size={16} /></button>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Confirm dispatch details for each medicine. Inventory will only be updated after the pharmacy confirms receipt.
              </div>

              {req.items.map(item => {
                const bi = batchInputs[item.id] || { quantity: item.quantity, unitPrice: item.unitPrice, subTotal: item.quantity * item.unitPrice, batchNumber: '', expiryDate: '' };
                return (
                  <div key={item.id} style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>{item.medicineName}</div>

                    {/* Row 1: pricing */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Unit Price (Rs.) *</label>
                        <input
                          type="number" min="0" step="0.01"
                          className="form-input"
                          value={bi.unitPrice}
                          onChange={e => {
                            const up = Math.max(0, parseFloat(e.target.value) || 0);
                            const st = parseFloat((bi.quantity * up).toFixed(2));
                            setBatchInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id], unitPrice: up, subTotal: st } }));
                          }}
                          id={`unit-price-${item.id}`}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Quantity (Units) *</label>
                        <input
                          type="number" min="1"
                          className="form-input"
                          value={bi.quantity}
                          onChange={e => {
                            const qty = Math.max(1, parseInt(e.target.value) || 1);
                            const st = parseFloat((qty * bi.unitPrice).toFixed(2));
                            setBatchInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id], quantity: qty, subTotal: st } }));
                          }}
                          id={`quantity-${item.id}`}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Subtotal (Rs.)</label>
                        <div style={{ padding: '8px 12px', background: 'var(--surface-card, #fff)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', fontWeight: 800, fontSize: 14, color: 'var(--primary)' }}>
                          Rs. {bi.subTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: batch info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Batch Number *</label>
                        <input
                          className="form-input"
                          value={bi.batchNumber}
                          onChange={e => setBatchInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id], batchNumber: e.target.value } }))}
                          id={`batch-number-${item.id}`}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Expiry Date *</label>
                        <input
                          type="date"
                          className="form-input"
                          value={bi.expiryDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setBatchInputs(prev => ({ ...prev, [item.id]: { ...prev[item.id], expiryDate: e.target.value } }))}
                          id={`expiry-date-${item.id}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Live order total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', marginBottom: 14, marginTop: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>Order Total</span>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900, color: 'var(--primary)' }}>
                  Rs. {Object.values(batchInputs).reduce((s, b) => s + b.subTotal, 0).toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                🔒 Inventory will only update when the pharmacy owner confirms receipt — not at dispatch.
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleDispatch} disabled={dispatchLoading} id="confirm-dispatch-btn">
                  {dispatchLoading ? <><Loader size={14} className="spin" /> Dispatching...</> : <><Truck size={14} /> Confirm Dispatch</>}
                </button>
                <button className="btn btn-ghost" onClick={() => setDispatchingId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Bank Details Modal ── */}
      {bankModalReq && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card scale-in" style={{ width: '100%', maxWidth: 450, background: 'white', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 800 }}>Submit Bank Details</div>
              <button onClick={() => setBankModalReq(null)} className="close-btn"><X size={20} /></button>
            </div>
            
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Provide bank details for Pharmacy #{bankModalReq.pharmacyId} to transfer Rs. {bankModalReq.totalAmount.toFixed(2)}.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Bank Name *</label>
                <input className="form-input" value={bankDetails.bankName} onChange={e => setBankDetails(p => ({ ...p, bankName: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Account Name *</label>
                <input className="form-input" value={bankDetails.accountName} onChange={e => setBankDetails(p => ({ ...p, accountName: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Account Number *</label>
                <input className="form-input" value={bankDetails.accountNumber} onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Branch *</label>
                <input className="form-input" value={bankDetails.branch} onChange={e => setBankDetails(p => ({ ...p, branch: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleBankDetailsSubmit} disabled={bankSubmitting || !bankDetails.bankName || !bankDetails.accountName || !bankDetails.accountNumber}>
                {bankSubmitting ? 'Submitting...' : 'Submit Details'}
              </button>
              <button className="btn btn-ghost" onClick={() => setBankModalReq(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Verify Payment Modal ── */}
      {verifyModalReq && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card scale-in" style={{ width: '100%', maxWidth: 500, background: 'white', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 800 }}>Verify Payment</div>
              <button onClick={() => setVerifyModalReq(null)} className="close-btn"><X size={20} /></button>
            </div>
            
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
              The pharmacy owner has submitted a payment slip for Order #{verifyModalReq.id} (Rs. {verifyModalReq.totalAmount.toFixed(2)}).
            </div>

            {verifyModalReq.paymentSlipUrl ? (
              <div style={{ marginBottom: 20, textAlign: 'center', background: 'var(--surface-2)', padding: 10, borderRadius: 'var(--r-md)' }}>
                {verifyModalReq.paymentSlipUrl.startsWith('data:image') || verifyModalReq.paymentSlipUrl.startsWith('http') ? (
                  <img src={verifyModalReq.paymentSlipUrl} alt="Payment Slip" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
                ) : (
                  <div style={{ padding: 20, fontSize: 13, wordBreak: 'break-all' }}>{verifyModalReq.paymentSlipUrl}</div>
                )}
              </div>
            ) : (
              <div style={{ padding: 20, background: 'var(--surface-2)', textAlign: 'center', marginBottom: 20, color: 'var(--text-muted)' }}>No slip provided.</div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-success" style={{ flex: 1 }} onClick={handleVerifyPayment} disabled={verifySubmitting}>
                {verifySubmitting ? 'Verifying...' : 'Mark as Verified'}
              </button>
              <button className="btn btn-ghost" onClick={() => setVerifyModalReq(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
