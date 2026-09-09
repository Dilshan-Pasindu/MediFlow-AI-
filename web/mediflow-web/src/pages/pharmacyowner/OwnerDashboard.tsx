import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, X, AlertTriangle, Package, Loader, Sparkles,
  RefreshCw, Search, Filter, ChevronDown, ChevronUp, Truck, Plus, Eye
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import {
  apiGetMyPharmacy, apiGetPharmacyInventory, apiGenerateRestockRecommendations,
  apiCreateRestockRequest, apiGetSuppliers, apiGetRestockRequests,
  apiReceiveRestockRequest, getUser
} from '../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryItem {
  id: number;
  medicineId: number;
  medicineName: string;
  genericName: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unitPrice: number;
  stockStatus: string;
  batches: Array<{
    id: number; batchNumber: string; quantity: number;
    expiryDate: string; isExpired: boolean; isExpiringSoon: boolean;
  }>;
}

interface RestockRec {
  medicineId: number;
  medicineName: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  demandRate: number;
  daysUntilStockOut: number;
  recommendedRestockQty: number;
  urgency: string;
  reason: string;
}

interface SupplierProfile {
  id: number;
  companyName: string;
  contactEmail: string;
}

interface RestockRequest {
  id: number;
  status: string;
  totalAmount: number;
  supplierName: string;
  requestedAt: string;
  items: Array<{ medicineName: string; quantity: number; unitPrice: number }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  OK: 'var(--success)',
  Low: '#F59E0B',
  Critical: 'var(--danger)',
  OutOfStock: '#7C3AED',
};

const URGENCY_COLOR: Record<string, string> = {
  Critical: 'badge-red',
  High: 'badge-yellow',
  Medium: 'badge-blue',
  Low: 'badge-green',
};

const REQUEST_STATUS_COLOR: Record<string, string> = {
  Pending: 'badge-yellow',
  Approved: 'badge-blue',
  Rejected: 'badge-red',
  Dispatched: 'badge-blue',
  Delivered: 'badge-green',
  Completed: 'badge-green',
};

export default function OwnerDashboard() {
  const user = getUser();
  const [pharmacyId, setPharmacyId] = useState<number | null>(null);
  const [pharmacyName, setPharmacyName] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryMeta, setInventoryMeta] = useState({ totalCount: 0, lowStockCount: 0, criticalCount: 0, outOfStockCount: 0 });
  const [restockRecs, setRestockRecs] = useState<RestockRec[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [requests, setRequests] = useState<RestockRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  // Restock request approval
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [approvedRecs, setApprovedRecs] = useState<Set<number>>(new Set());
  const [dismissedRecs, setDismissedRecs] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState<Record<number, boolean>>({});
  const [messages, setMessages] = useState<Record<number, string>>({});

  // Receive modal
  const [receivingId, setReceivingId] = useState<number | null>(null);
  const [receiveLoading, setReceiveLoading] = useState(false);

  const loadPharmacy = useCallback(async () => {
    try {
      const p = await apiGetMyPharmacy() as { id: number; name: string };
      setPharmacyId(p.id);
      setPharmacyName(p.name);
    } catch {
      setError('Could not load pharmacy. Ensure your account is linked to a pharmacy.');
    }
  }, []);

  const loadInventory = useCallback(async (pid: number) => {
    setLoading(true);
    try {
      const result = await apiGetPharmacyInventory(pid, {
        search: search || undefined,
        stockFilter: stockFilter || undefined,
        pageSize: 50
      }) as any;
      setInventory(result.items || []);
      setInventoryMeta({
        totalCount: result.totalCount,
        lowStockCount: result.lowStockCount,
        criticalCount: result.criticalCount,
        outOfStockCount: result.outOfStockCount
      });
    } catch {
      setError('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, [search, stockFilter]);

  const loadRequests = useCallback(async () => {
    try {
      const r = await apiGetRestockRequests() as RestockRequest[];
      setRequests(r || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { loadPharmacy(); }, [loadPharmacy]);

  useEffect(() => {
    if (pharmacyId) {
      loadInventory(pharmacyId);
      loadRequests();
      apiGetSuppliers().then((s: any) => setSuppliers(s || [])).catch(() => {});
    }
  }, [pharmacyId, loadInventory, loadRequests]);

  async function handleGenerateRestock() {
    if (!pharmacyId) return;
    setAiLoading(true);
    setError(null);
    try {
      const result = await apiGenerateRestockRecommendations(pharmacyId) as any;
      setRestockRecs(result.recommendations || []);
      setActiveTab('restock');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to generate recommendations.');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleApproveRec(rec: RestockRec) {
    if (!selectedSupplier) {
      setError('Please select a supplier before approving.');
      return;
    }
    setSubmitting(s => ({ ...s, [rec.medicineId]: true }));
    try {
      await apiCreateRestockRequest({
        supplierProfileId: selectedSupplier,
        notes: `AI restock recommendation - ${rec.urgency} urgency`,
        items: [{ medicineId: rec.medicineId, quantity: rec.recommendedRestockQty, unitPrice: 0 }]
      });
      setApprovedRecs(prev => new Set([...prev, rec.medicineId]));
      setMessages(m => ({ ...m, [rec.medicineId]: `Restock request created for ${rec.medicineName}!` }));
      loadRequests();
    } catch (e: any) {
      setMessages(m => ({ ...m, [rec.medicineId]: e?.response?.data?.message || 'Error creating request.' }));
    } finally {
      setSubmitting(s => ({ ...s, [rec.medicineId]: false }));
    }
  }

  async function handleReceive(id: number) {
    setReceivingId(id);
    setReceiveLoading(true);
    try {
      await apiReceiveRestockRequest(id, 'Confirmed receipt by pharmacy owner.');
      loadRequests();
      if (pharmacyId) loadInventory(pharmacyId);
      setReceivingId(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to confirm receipt.');
    } finally {
      setReceiveLoading(false);
    }
  }

  const stockPct = (item: InventoryItem) =>
    Math.min(100, Math.round((item.currentStock / item.minStockLevel) * 100));

  const FILL_COLOR: Record<string, string> = {
    OK: '#22C55E', Low: '#F59E0B', Critical: '#EF4444', OutOfStock: '#7C3AED'
  };

  const deliveredRequests = requests.filter(r => r.status === 'Delivered');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Pharmacy Owner Dashboard"
          subtitle={pharmacyName ? `${pharmacyName} — Inventory management & AI restocking` : 'Loading pharmacy...'}
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              {pharmacyId && (
                <button className="btn btn-ghost btn-sm" onClick={() => loadInventory(pharmacyId)} id="refresh-inventory-btn">
                  <RefreshCw size={13} /> Refresh
                </button>
              )}
              <button className="btn btn-primary btn-sm" onClick={handleGenerateRestock} disabled={aiLoading || !pharmacyId} id="generate-restock-btn">
                {aiLoading ? <><Loader size={13} className="spin" /> Analyzing...</> : <><Sparkles size={13} /> AI Restock Analysis</>}
              </button>
            </div>
          }
        />
        <div className="page-body fade-in">

          {/* Header banner */}
          <div style={{ background: 'linear-gradient(135deg,#991B1B,#DC2626)', borderRadius: 'var(--r-xl)', padding: '22px 28px', color: 'white', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(220,38,38,0.3)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 21, fontWeight: 800, marginBottom: 4 }}>Pharmacy Owner Portal</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Inventory management, AI demand forecasting, and restock automation</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Total Medicines', value: inventoryMeta.totalCount, icon: '💊' },
                { label: 'Low Stock', value: inventoryMeta.lowStockCount, icon: '⚠️', highlight: inventoryMeta.lowStockCount > 0 },
                { label: 'Critical', value: inventoryMeta.criticalCount, icon: '🚨', highlight: inventoryMeta.criticalCount > 0 },
                { label: 'Out of Stock', value: inventoryMeta.outOfStockCount, icon: '🔴', highlight: inventoryMeta.outOfStockCount > 0 },
              ].map(s => (
                <div key={s.label} style={{ background: s.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: `1.5px solid ${s.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 'var(--r-lg)', padding: '10px 16px', textAlign: 'center', minWidth: 85 }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'var(--danger-bg, #FEF2F2)', color: 'var(--danger)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertTriangle size={15} /> {error}
              <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setError(null)}><X size={13} /></button>
            </div>
          )}

          {/* Delivered items awaiting receipt */}
          {deliveredRequests.length > 0 && (
            <div className="approval-banner" style={{ marginBottom: 16, background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', borderColor: '#6EE7B7' }}>
              <span className="approval-banner-icon">📦</span>
              <div style={{ flex: 1 }}>
                <div className="approval-banner-title" style={{ color: '#065F46' }}>Stock Awaiting Your Confirmation</div>
                <div className="approval-banner-sub" style={{ color: '#047857' }}>
                  {deliveredRequests.length} delivery(ies) arrived — confirm receipt to update inventory.
                </div>
              </div>
              <button className="btn btn-success btn-sm" onClick={() => setActiveTab('requests')}>
                View Deliveries →
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')} id="tab-inventory">
              💊 Inventory ({inventoryMeta.totalCount})
            </button>
            <button className={`tab-btn ${activeTab === 'restock' ? 'active' : ''}`} onClick={() => setActiveTab('restock')} id="tab-restock">
              🤖 AI Restock {restockRecs.length > 0 && `(${restockRecs.length})`}
            </button>
            <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')} id="tab-requests">
              📋 Restock Requests ({requests.length})
              {deliveredRequests.length > 0 && <span className="nav-badge" style={{ marginLeft: 4 }}>{deliveredRequests.length}</span>}
            </button>
          </div>

          {/* ── Inventory Tab ─────────────────────────────────────────── */}
          {activeTab === 'inventory' && (
            <div className="card">
              <div className="card-header">
                <div className="section-title">Current Inventory</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      style={{ paddingLeft: 32, height: 34, minWidth: 200 }}
                      placeholder="Search medicines..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      id="inventory-search"
                    />
                  </div>
                  <select
                    className="form-select"
                    style={{ height: 34 }}
                    value={stockFilter}
                    onChange={e => setStockFilter(e.target.value)}
                    id="stock-filter-select"
                  >
                    <option value="">All Stock Levels</option>
                    <option value="OK">OK</option>
                    <option value="Low">Low</option>
                    <option value="Critical">Critical</option>
                    <option value="OutOfStock">Out of Stock</option>
                  </select>
                  {pharmacyId && (
                    <button className="btn btn-ghost btn-sm" onClick={() => loadInventory(pharmacyId)}>
                      <Filter size={13} /> Apply
                    </button>
                  )}
                </div>
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center' }}><Loader className="spin" size={28} /></div>
              ) : inventory.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <div className="empty-icon">📦</div>
                  <div className="empty-title">No inventory items found</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Min Level</th>
                        <th>Stock Bar</th>
                        <th>Unit Price</th>
                        <th>Status</th>
                        <th>Expiry Warning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(item => {
                        const pct = item.minStockLevel > 0 ? stockPct(item) : 100;
                        const expiringSoon = item.batches.some(b => b.isExpiringSoon && !b.isExpired);
                        const expired = item.batches.some(b => b.isExpired);
                        return (
                          <tr key={item.id} id={`inventory-row-${item.id}`}>
                            <td>
                              <div style={{ fontWeight: 700 }}>{item.medicineName}</div>
                              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{item.genericName}</div>
                            </td>
                            <td><span className="badge badge-blue">{item.category}</span></td>
                            <td>
                              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 800, color: STATUS_COLOR[item.stockStatus] || 'var(--text-primary)' }}>
                                {item.currentStock}
                              </span> {item.batches.length > 0 ? `(${item.batches.length} batch${item.batches.length > 1 ? 'es' : ''})` : ''}
                            </td>
                            <td style={{ color: 'var(--text-muted)' }}>{item.minStockLevel} units</td>
                            <td style={{ width: 150 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="stock-indicator">
                                  <div className="stock-fill" style={{ width: `${pct}%`, background: FILL_COLOR[item.stockStatus] || '#22C55E' }} />
                                </div>
                                <span style={{ fontSize: 11.5, fontWeight: 700, minWidth: 32 }}>{pct}%</span>
                              </div>
                            </td>
                            <td>Rs. {item.unitPrice.toFixed(2)}</td>
                            <td>
                              {item.stockStatus === 'OutOfStock' ? <span className="low-stock-badge" style={{ background: '#7C3AED', color: 'white', borderColor: '#7C3AED' }}>🔴 Out of Stock</span>
                                : item.stockStatus === 'Critical' ? <span className="low-stock-badge">🚨 Critical</span>
                                : item.stockStatus === 'Low' ? <span className="low-stock-badge">⚠️ Low</span>
                                : <span className="badge badge-green">✓ OK</span>}
                            </td>
                            <td>
                              {expired ? <span className="low-stock-badge">🔴 Batch Expired</span>
                                : expiringSoon ? <span className="low-stock-badge" style={{ background: '#FFF7ED', borderColor: '#FED7AA', color: '#C2410C' }}>⏰ Expiring Soon</span>
                                : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── AI Restock Tab ─────────────────────────────────────────── */}
          {activeTab === 'restock' && (
            restockRecs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>AI Restock Analysis</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 24px' }}>
                  The Inventory Intelligence Agent will analyze your 30-day demand history, current stock levels, and expiry data to generate optimized restock recommendations.
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleGenerateRestock} disabled={aiLoading || !pharmacyId} id="start-ai-restock-btn">
                  {aiLoading ? <><Loader size={16} className="spin" /> Analyzing inventory...</> : <><Sparkles size={16} /> Run AI Restock Analysis</>}
                </button>
              </div>
            ) : (
              <div>
                {/* Human Approval Banner */}
                <div className="approval-banner" style={{ marginBottom: 20 }}>
                  <span className="approval-banner-icon">🤖</span>
                  <div style={{ flex: 1 }}>
                    <div className="approval-banner-title">Human Approval Point #3 — AI Restock Recommendations</div>
                    <div className="approval-banner-sub">Review each recommendation. Select a supplier, then Approve to send a restock request, or Dismiss to ignore.</div>
                  </div>
                </div>

                {/* Supplier selector */}
                <div className="card" style={{ marginBottom: 16, padding: '16px 20px' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Select Supplier for Approved Orders</label>
                  <select
                    className="form-select"
                    style={{ maxWidth: 340 }}
                    value={selectedSupplier || ''}
                    onChange={e => setSelectedSupplier(Number(e.target.value) || null)}
                    id="supplier-select"
                  >
                    <option value="">— Choose a supplier —</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.companyName}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {restockRecs.map(rec => {
                    if (dismissedRecs.has(rec.medicineId)) return null;
                    const approved = approvedRecs.has(rec.medicineId);
                    const msg = messages[rec.medicineId];
                    return (
                      <div key={rec.medicineId} className="card" id={`restock-rec-${rec.medicineId}`} style={{ opacity: approved ? 0.75 : 1 }}>
                        <div className="card-header">
                          <div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800 }}>{rec.medicineName}</div>
                              <span className={`badge ${URGENCY_COLOR[rec.urgency] || 'badge-blue'}`}>{rec.urgency} Priority</span>
                              <span className="badge badge-blue">{rec.category}</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                              Stock: {rec.currentStock} / {rec.minStockLevel} min · Demand: {rec.demandRate.toFixed(1)} units/day · Stock-out in {rec.daysUntilStockOut > 900 ? '∞' : `${Math.round(rec.daysUntilStockOut)} days`}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Recommended Order</div>
                            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{rec.recommendedRestockQty} units</div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
                            💡 {rec.reason}
                          </div>
                          {msg && (
                            <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 'var(--r-md)', background: approved ? 'var(--success-bg)' : '#FEF2F2', color: approved ? 'var(--success)' : 'var(--danger)', fontSize: 12.5, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                              {approved ? <CheckCircle size={13} /> : <AlertTriangle size={13} />} {msg}
                            </div>
                          )}
                          {!approved && (
                            <div style={{ display: 'flex', gap: 10 }}>
                              <button className="btn btn-success" onClick={() => handleApproveRec(rec)} disabled={submitting[rec.medicineId]} id={`approve-restock-${rec.medicineId}`}>
                                {submitting[rec.medicineId] ? <Loader size={13} className="spin" /> : <CheckCircle size={13} />}
                                {submitting[rec.medicineId] ? 'Sending...' : 'Approve & Send to Supplier'}
                              </button>
                              <button className="btn btn-ghost" style={{ color: 'var(--text-muted)' }} onClick={() => setDismissedRecs(prev => new Set([...prev, rec.medicineId]))} id={`dismiss-restock-${rec.medicineId}`}>
                                <X size={13} /> Dismiss
                              </button>
                            </div>
                          )}
                          {approved && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 700, fontSize: 13 }}>
                              <CheckCircle size={15} /> Restock request sent to supplier!
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* ── Requests Tab ──────────────────────────────────────────── */}
          {activeTab === 'requests' && (
            <div>
              <div className="card">
                <div className="card-header">
                  <div className="section-title">Restock Requests</div>
                </div>
                {requests.length === 0 ? (
                  <div className="empty-state" style={{ padding: 40 }}>
                    <div className="empty-icon">📋</div>
                    <div className="empty-title">No restock requests yet</div>
                    <div className="empty-sub">Use AI Restock Analysis to generate and approve requests.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Supplier</th>
                          <th>Items</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Requested</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map(r => (
                          <tr key={r.id} id={`request-row-${r.id}`}>
                            <td><span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>#{r.id}</span></td>
                            <td>{r.supplierName}</td>
                            <td>{(r.items || []).length} item(s)</td>
                            <td>Rs. {r.totalAmount.toFixed(2)}</td>
                            <td><span className={`badge ${REQUEST_STATUS_COLOR[r.status] || 'badge-blue'}`}>{r.status}</span></td>
                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.requestedAt).toLocaleDateString()}</td>
                            <td>
                              {r.status === 'Delivered' && (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleReceive(r.id)}
                                  disabled={receiveLoading && receivingId === r.id}
                                  id={`receive-stock-${r.id}`}
                                >
                                  {receiveLoading && receivingId === r.id ? <Loader size={12} className="spin" /> : <Truck size={12} />}
                                  {receiveLoading && receivingId === r.id ? 'Confirming...' : 'Confirm Receipt'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
