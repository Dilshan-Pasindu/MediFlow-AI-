import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, X, Loader, Truck, RefreshCw, Package, AlertTriangle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiGetRestockRequests, apiUpdateRestockStatus, apiGetMySupplierProfile, getUser } from '../../services/api';

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
}

// ─── Batch input for dispatch ──────────────────────────────────────────────

interface BatchInfo {
  restockRequestItemId: number;
  batchNumber: string;
  expiryDate: string;
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
      // Default: generate batch number, set expiry 18 months from now
      const defaultExpiry = new Date();
      defaultExpiry.setMonth(defaultExpiry.getMonth() + 18);
      init[item.id] = {
        restockRequestItemId: item.id,
        batchNumber: `BATCH-${req.id}-${item.medicineId}-${Date.now()}`,
        expiryDate: defaultExpiry.toISOString().split('T')[0]
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
        Object.values(batchInputs)
      );
      setMessages(m => ({ ...m, [dispatchingId]: { type: 'success', text: 'Dispatched! Pharmacy will confirm receipt.' } }));
      setDispatchingId(null);
      loadData();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Dispatch failed.');
    } finally {
      setDispatchLoading(false);
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

          {/* Header banner */}
          <div style={{ background: 'linear-gradient(135deg,#155E75,#0891B2)', borderRadius: 'var(--r-xl)', padding: '22px 28px', color: 'white', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(8,145,178,0.3)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 21, fontWeight: 800, marginBottom: 4 }}>Supplier Portal</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Review pharmacy restock requests and manage supply chain</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Pending', value: pending.length, icon: '📦', highlight: pending.length > 0 },
                { label: 'Approved', value: approved.length, icon: '✅' },
                { label: 'History', value: history.length, icon: '📊' },
              ].map(s => (
                <div key={s.label} style={{ background: s.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: `1.5px solid ${s.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 'var(--r-lg)', padding: '10px 16px', textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

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
                        <button className="btn btn-primary" onClick={() => openDispatch(req)} id={`dispatch-supply-${req.id}`} style={{ width: '100%' }}>
                          <Truck size={14} /> Dispatch Stock (Enter Batch Info)
                        </button>
                      )}

                      {req.status === 'Dispatched' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0891B2', fontWeight: 700, fontSize: 13 }}>
                          <Truck size={15} /> Dispatched — Awaiting pharmacy confirmation.
                        </div>
                      )}

                      {(req.status === 'Delivered' || req.status === 'Completed') && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 700, fontSize: 13 }}>
                          <CheckCircle size={15} /> Completed — Inventory updated at pharmacy.
                        </div>
                      )}

                      {req.status === 'Rejected' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
                          <X size={15} /> Rejected{req.supplierResponseNote ? `: ${req.supplierResponseNote}` : ''}
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
                Provide batch number and expiry date for each medicine. This information will be recorded for pharmacy inventory tracking.
              </div>

              {req.items.map(item => (
                <div key={item.id} style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>{item.medicineName} — {item.quantity} units</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Batch Number *</label>
                      <input
                        className="form-input"
                        value={batchInputs[item.id]?.batchNumber || ''}
                        onChange={e => setBatchInputs(prev => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], batchNumber: e.target.value }
                        }))}
                        id={`batch-number-${item.id}`}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Expiry Date *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={batchInputs[item.id]?.expiryDate || ''}
                        onChange={e => setBatchInputs(prev => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], expiryDate: e.target.value }
                        }))}
                        id={`expiry-date-${item.id}`}
                      />
                    </div>
                  </div>
                </div>
              ))}

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
    </div>
  );
}
