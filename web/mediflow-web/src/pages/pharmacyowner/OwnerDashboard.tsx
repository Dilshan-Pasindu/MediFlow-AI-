import React, { useState, useEffect, useCallback, Fragment } from 'react';
import {
  CheckCircle, X, AlertTriangle, Package, Loader, Sparkles,
  RefreshCw, Search, Filter, ChevronDown, ChevronUp, Truck, Plus, Eye,
  Calendar, Clock, Edit3, AlertCircle
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import {
  apiGetMyPharmacy, apiGetPharmacyInventory, apiGenerateRestockRecommendations,
  apiCreateRestockRequest, apiGetSuppliers, apiGetRestockRequests,
  apiReceiveRestockRequest, apiAddInventoryBatch,
  apiCreateInventoryItem, apiUpdateInventoryItem, apiDeleteExpiredBatch, getUser
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
    id: number;
    batchNumber: string;
    quantity: number;
    expiryDate: string;
    receivedDate?: string;
    isExpired: boolean;
    isExpiringSoon: boolean;
    isCriticalExpiry?: boolean;
    daysUntilExpiry?: number;
    expiryStatus?: string;
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
  items: Array<{ id: number; medicineName: string; quantity: number; unitPrice: number }>;
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

function getFutureDate(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

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

  // Batch management & expiry state
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [addBatchModalItem, setAddBatchModalItem] = useState<InventoryItem | null>(null);
  const [batchNumber, setBatchNumber] = useState('');
  const [batchQuantity, setBatchQuantity] = useState<number | ''>(100);
  const [batchExpiryDate, setBatchExpiryDate] = useState(getFutureDate(18));
  const [batchNotes, setBatchNotes] = useState('');
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [batchModalError, setBatchModalError] = useState<string | null>(null);

  // Edit batch expiry state
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Delete expired batch state
  const [confirmDeleteBatch, setConfirmDeleteBatch] = useState<{ item: InventoryItem; batch: InventoryItem['batches'][0] } | null>(null);
  const [deletingBatchId, setDeletingBatchId] = useState<number | null>(null);

  // Edit Inventory Item modal state
  const [editItemModal, setEditItemModal] = useState<InventoryItem | null>(null);
  const [eiMinStock, setEiMinStock] = useState<number | ''>('');
  const [eiUnitPrice, setEiUnitPrice] = useState<number | ''>('');
  const [eiStockAdj, setEiStockAdj] = useState<number | ''>(0);
  const [eiAdjReason, setEiAdjReason] = useState('');
  const [eiSubmitting, setEiSubmitting] = useState(false);
  const [eiError, setEiError] = useState<string | null>(null);

  // Add Medicine modal state
  const [addMedicineModal, setAddMedicineModal] = useState(false);
  const [amMedicineName, setAmMedicineName] = useState('');
  const [amGenericName, setAmGenericName] = useState('');
  const [amCategory, setAmCategory] = useState('');
  const [amUnitOfMeasure, setAmUnitOfMeasure] = useState('Tablet');
  const [amMinStock, setAmMinStock] = useState<number | ''>(50);
  const [amUnitPrice, setAmUnitPrice] = useState<number | ''>(0);
  const [amInitialStock, setAmInitialStock] = useState<number | ''>(0);
  const [amBatchNumber, setAmBatchNumber] = useState('');
  const [amExpiryDate, setAmExpiryDate] = useState(getFutureDate(18));
  const [amBatchNotes, setAmBatchNotes] = useState('');
  const [amSubmitting, setAmSubmitting] = useState(false);
  const [amError, setAmError] = useState<string | null>(null);

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
      loadRequests();
      apiGetSuppliers().then((s: any) => setSuppliers(s || [])).catch(() => {});
    }
  }, [pharmacyId, loadRequests]);

  useEffect(() => {
    if (pharmacyId) {
      const timer = setTimeout(() => {
        loadInventory(pharmacyId);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pharmacyId, loadInventory]);

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

  function openAddBatchModal(item: InventoryItem) {
    setAddBatchModalItem(item);
    setBatchNumber(`B-${item.medicineId}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`);
    setBatchQuantity(100);
    setBatchExpiryDate(getFutureDate(18));
    setBatchNotes('');
    setBatchModalError(null);
  }

  async function handleDeleteBatch(item: InventoryItem, batch: InventoryItem['batches'][0]) {
    if (!pharmacyId) return;
    setDeletingBatchId(batch.id);
    setConfirmDeleteBatch(null);
    try {
      await apiDeleteExpiredBatch(pharmacyId, item.id, batch.id);
      setSuccessToast(`Expired batch ${batch.batchNumber} removed. Stock adjusted.`);
      loadInventory(pharmacyId);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      setSuccessToast(`Error: ${err?.message || 'Failed to delete batch.'}`);
      setTimeout(() => setSuccessToast(null), 6000);
    } finally {
      setDeletingBatchId(null);
    }
  }

  function openEditItemModal(item: InventoryItem) {
    setEditItemModal(item);
    setEiMinStock(item.minStockLevel);
    setEiUnitPrice(item.unitPrice);
    setEiStockAdj(0);
    setEiAdjReason('');
    setEiError(null);
  }

  async function handleSaveEditItem() {
    if (!pharmacyId || !editItemModal) return;
    const minStock = Number(eiMinStock);
    const unitPrice = Number(eiUnitPrice);
    const adj = Number(eiStockAdj);
    if (minStock < 0) { setEiError('Minimum stock level cannot be negative.'); return; }
    if (unitPrice < 0) { setEiError('Unit price cannot be negative.'); return; }
    if (editItemModal.currentStock + adj < 0) {
      setEiError(`Adjustment would result in negative stock (${editItemModal.currentStock + adj}). Current stock is ${editItemModal.currentStock}.`);
      return;
    }
    setEiSubmitting(true);
    setEiError(null);
    try {
      await apiUpdateInventoryItem(pharmacyId, editItemModal.id, {
        minStockLevel: minStock,
        unitPrice,
        stockAdjustment: adj,
        adjustmentReason: eiAdjReason.trim() || undefined,
      });
      const adjMsg = adj !== 0 ? ` Stock adjusted by ${adj > 0 ? '+' : ''}${adj}.` : '';
      setSuccessToast(`${editItemModal.medicineName} updated successfully.${adjMsg}`);
      setEditItemModal(null);
      loadInventory(pharmacyId);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      setEiError(err?.response?.data?.message || err?.message || 'Failed to update inventory item.');
    } finally {
      setEiSubmitting(false);
    }
  }

  function openAddMedicineModal() {
    setAmMedicineName('');
    setAmGenericName('');
    setAmCategory('');
    setAmUnitOfMeasure('Tablet');
    setAmMinStock(50);
    setAmUnitPrice(0);
    setAmInitialStock(0);
    setAmBatchNumber(`B-NEW-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`);
    setAmExpiryDate(getFutureDate(18));
    setAmBatchNotes('');
    setAmError(null);
    setAddMedicineModal(true);
  }

  async function handleSaveAddMedicine() {
    if (!pharmacyId) return;
    if (!amMedicineName.trim()) { setAmError('Medicine name is required.'); return; }
    if (!amCategory.trim()) { setAmError('Category is required.'); return; }
    if (!amUnitOfMeasure.trim()) { setAmError('Unit of measure is required.'); return; }
    const stock = Number(amInitialStock);
    if (stock > 0) {
      if (!amBatchNumber.trim()) { setAmError('Batch number is required when initial stock is greater than zero.'); return; }
      if (!amExpiryDate) { setAmError('Expiry date is required when initial stock is greater than zero.'); return; }
    }
    setAmSubmitting(true);
    setAmError(null);
    try {
      await apiCreateInventoryItem(pharmacyId, {
        medicineName: amMedicineName.trim(),
        genericName: amGenericName.trim(),
        category: amCategory.trim(),
        unitOfMeasure: amUnitOfMeasure.trim(),
        minStockLevel: Number(amMinStock) || 0,
        unitPrice: Number(amUnitPrice) || 0,
        initialStock: stock,
        batchNumber: stock > 0 ? amBatchNumber.trim() : undefined,
        expiryDate: stock > 0 ? amExpiryDate : undefined,
        batchNotes: amBatchNotes.trim() || undefined,
      });
      setSuccessToast(`'${amMedicineName}' added to inventory successfully!`);
      setAddMedicineModal(false);
      loadInventory(pharmacyId);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      setAmError(err?.response?.data?.message || err?.message || 'Failed to add medicine.');
    } finally {
      setAmSubmitting(false);
    }
  }

  async function handleSaveBatch() {
    if (!pharmacyId || !addBatchModalItem) return;
    if (!batchNumber.trim()) {
      setBatchModalError('Batch number is required.');
      return;
    }
    if (!batchQuantity || Number(batchQuantity) <= 0) {
      setBatchModalError('Batch quantity must be greater than 0.');
      return;
    }
    if (!batchExpiryDate) {
      setBatchModalError('Batch expiration date is required.');
      return;
    }

    setBatchSubmitting(true);
    setBatchModalError(null);
    try {
      await apiAddInventoryBatch(pharmacyId, addBatchModalItem.id, {
        batchNumber: batchNumber.trim(),
        quantity: Number(batchQuantity),
        expiryDate: batchExpiryDate,
        notes: batchNotes.trim() || undefined,
      });
      setSuccessToast(`Batch ${batchNumber} added successfully for ${addBatchModalItem.medicineName}!`);
      setAddBatchModalItem(null);
      loadInventory(pharmacyId);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      // err.message is already normalised by the Axios response interceptor
      setBatchModalError(err?.message || 'Failed to add batch.');
    } finally {
      setBatchSubmitting(false);
    }
  }

  const totalExpiringBatches = inventory.reduce(
    (acc, i) => acc + i.batches.filter(b => b.isExpiringSoon && !b.isExpired).length, 0
  );
  const totalExpiredBatches = inventory.reduce(
    (acc, i) => acc + i.batches.filter(b => b.isExpired).length, 0
  );

  const stockPct = (item: InventoryItem) =>
    Math.min(100, Math.round((item.currentStock / item.minStockLevel) * 100));

  const FILL_COLOR: Record<string, string> = {
    OK: '#22C55E', Low: '#F59E0B', Critical: '#EF4444', OutOfStock: '#7C3AED'
  };

  const deliveredRequests = requests.filter(r => r.status === 'Delivered' || r.status === 'Dispatched');

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

          <PortalHeader
            role="owner"
            title="Pharmacy Owner Portal"
            subtitle={pharmacyName ? `${pharmacyName} — Inventory & AI restocking` : 'Inventory management, AI demand forecasting, and restock automation'}
            loading={loading}
            stats={[
              { label: 'Total Medicines',  value: inventoryMeta.totalCount,      icon: '💊' },
              { label: 'Low Stock',         value: inventoryMeta.lowStockCount,   icon: '⚠️', highlight: inventoryMeta.lowStockCount > 0 },
              { label: 'Critical',          value: inventoryMeta.criticalCount,   icon: '🚨', highlight: inventoryMeta.criticalCount > 0 },
              { label: 'Expiring (<60d)',   value: totalExpiringBatches,          icon: '⏰', highlight: totalExpiringBatches > 0 },
            ]}
          />

          {/* Success toast */}
          {successToast && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 'var(--r-md)', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600 }}>
              <CheckCircle size={16} color="#059669" /> {successToast}
              <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setSuccessToast(null)}><X size={14} /></button>
            </div>
          )}

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
                  {deliveredRequests.length} order(s) dispatched or delivered — confirm receipt to update inventory.
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
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
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
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginLeft: 'auto' }}
                    onClick={openAddMedicineModal}
                    disabled={!pharmacyId}
                    id="add-medicine-btn"
                  >
                    <Plus size={13} /> Add Medicine
                  </button>
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
                        <th style={{ textAlign: 'right' }}>Batches & Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map(item => {
                        const pct = item.minStockLevel > 0 ? stockPct(item) : 100;
                        const expiringSoon = item.batches.some(b => b.isExpiringSoon && !b.isExpired);
                        const expired = item.batches.some(b => b.isExpired);
                        const isExpanded = expandedItemId === item.id;
                        return (
                          <React.Fragment key={item.id}>
                            <tr id={`inventory-row-${item.id}`}>
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
                              <td style={{ width: 140 }}>
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
                              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'inline-flex', gap: 6 }}>
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    style={{ fontSize: 12, padding: '4px 8px', color: 'var(--primary)' }}
                                    onClick={() => openEditItemModal(item)}
                                    id={`edit-item-btn-${item.id}`}
                                    title="Edit inventory settings"
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    style={{ fontSize: 12, padding: '4px 8px' }}
                                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                                    id={`toggle-batches-${item.id}`}
                                    title="View/Hide Batch Breakdown"
                                  >
                                    <Calendar size={13} /> {item.batches.length} {item.batches.length === 1 ? 'Batch' : 'Batches'}
                                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    style={{ fontSize: 12, padding: '4px 10px' }}
                                    onClick={() => openAddBatchModal(item)}
                                    id={`add-batch-btn-${item.id}`}
                                    title="Add new batch with real-world expiration date"
                                  >
                                    <Plus size={13} /> Add Batch
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="fade-in" style={{ background: 'var(--surface-2, #F8FAFC)' }}>
                                <td colSpan={9} style={{ padding: '14px 20px' }}>
                                  <div style={{ background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Calendar size={16} style={{ color: 'var(--primary)' }} />
                                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>Batch Expiry Breakdown for {item.medicineName}</span>
                                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>({item.batches.length} active batches)</span>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        style={{ fontSize: 11.5, padding: '4px 10px' }}
                                        onClick={() => openAddBatchModal(item)}
                                        id={`sub-add-batch-${item.id}`}
                                      >
                                        <Plus size={12} /> Log New Batch
                                      </button>
                                    </div>

                                    {item.batches.length === 0 ? (
                                      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', padding: '16px 0', textAlign: 'center' }}>
                                        No individual batches recorded for this medicine yet. Click "Log New Batch" to add one with a real-world expiry date.
                                      </div>
                                    ) : (
                                      <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
                                          <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                                              <th style={{ padding: '6px 8px' }}>Batch Number</th>
                                              <th style={{ padding: '6px 8px' }}>Quantity</th>
                                              <th style={{ padding: '6px 8px' }}>Received Date</th>
                                              <th style={{ padding: '6px 8px' }}>Expiration Date</th>
                                              <th style={{ padding: '6px 8px' }}>Days Remaining</th>
                                              <th style={{ padding: '6px 8px' }}>Quality / Status</th>
                                              <th style={{ padding: '6px 8px', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {item.batches.map(batch => {
                                              const now = new Date();
                                              const exp = new Date(batch.expiryDate);
                                              const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                              const isExp = diffDays <= 0;
                                              const isCrit = !isExp && diffDays <= 30;
                                              const isSoon = !isExp && diffDays <= 60;

                                              return (
                                                <tr key={batch.id} style={{ borderBottom: '1px solid var(--border-light, #F1F5F9)' }}>
                                                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>
                                                    <code>{batch.batchNumber}</code>
                                                  </td>
                                                  <td style={{ padding: '10px 8px', fontWeight: 700 }}>{batch.quantity} units</td>
                                                  <td style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>
                                                    {batch.receivedDate ? new Date(batch.receivedDate).toLocaleDateString() : '—'}
                                                  </td>
                                                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>
                                                    {new Date(batch.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                  </td>
                                                  <td style={{ padding: '10px 8px' }}>
                                                    {isExp ? (
                                                      <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Expired ({Math.abs(diffDays)}d ago)</span>
                                                    ) : isCrit ? (
                                                      <span style={{ color: '#DC2626', fontWeight: 700 }}>🚨 {diffDays} days left!</span>
                                                    ) : isSoon ? (
                                                      <span style={{ color: '#C2410C', fontWeight: 700 }}>⚠️ {diffDays} days left</span>
                                                    ) : (
                                                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>✅ {diffDays} days left</span>
                                                    )}
                                                  </td>
                                                  <td style={{ padding: '10px 8px' }}>
                                                    {isExp ? (
                                                      <span className="low-stock-badge" style={{ fontSize: 11, background: '#FEE2E2', color: '#991B1B', borderColor: '#FCA5A5' }}>
                                                        🔴 Expired
                                                      </span>
                                                    ) : isCrit ? (
                                                      <span className="low-stock-badge" style={{ fontSize: 11, background: '#FEF2F2', color: '#B91C1C', borderColor: '#F87171' }}>
                                                        🚨 Critical (&le;30d)
                                                      </span>
                                                    ) : isSoon ? (
                                                      <span className="low-stock-badge" style={{ fontSize: 11, background: '#FFF7ED', color: '#C2410C', borderColor: '#FED7AA' }}>
                                                        ⏰ Expiring (&le;60d)
                                                      </span>
                                                    ) : (
                                                      <span className="badge badge-green" style={{ fontSize: 11 }}>
                                                        ✓ Good
                                                      </span>
                                                    )}
                                                  </td>
                                                  <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                                                    {isExp && (
                                                      confirmDeleteBatch?.batch.id === batch.id ? (
                                                        // Inline confirm row
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                          <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, whiteSpace: 'nowrap' }}>Remove batch?</span>
                                                          <button
                                                            type="button"
                                                            className="btn btn-sm"
                                                            style={{ fontSize: 11, padding: '2px 8px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer' }}
                                                            onClick={() => handleDeleteBatch(item, batch)}
                                                            disabled={deletingBatchId === batch.id}
                                                            id={`confirm-delete-batch-${batch.id}`}
                                                          >
                                                            {deletingBatchId === batch.id ? 'Removing...' : 'Yes, Remove'}
                                                          </button>
                                                          <button
                                                            type="button"
                                                            className="btn btn-ghost btn-sm"
                                                            style={{ fontSize: 11, padding: '2px 8px' }}
                                                            onClick={() => setConfirmDeleteBatch(null)}
                                                            id={`cancel-delete-batch-${batch.id}`}
                                                          >
                                                            Cancel
                                                          </button>
                                                        </span>
                                                      ) : (
                                                        <button
                                                          type="button"
                                                          className="btn btn-ghost btn-sm"
                                                          style={{ fontSize: 11.5, padding: '3px 8px', color: '#DC2626', border: '1px solid #FCA5A5' }}
                                                          onClick={() => setConfirmDeleteBatch({ item, batch })}
                                                          disabled={deletingBatchId === batch.id}
                                                          id={`delete-batch-${batch.id}`}
                                                          title="Remove this expired batch and write off stock"
                                                        >
                                                          🗑 Delete
                                                        </button>
                                                      )
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
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
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
                          <th>Order ID</th>
                          <th>Supplier</th>
                          <th>Medicine(s)</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Requested</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map(r => (
                          <tr key={r.id} id={`request-row-${r.id}`}>
                            <td><span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>#{r.id}</span></td>
                            <td>{r.supplierName}</td>
                            <td>
                              {r.items?.map(i => <div key={i.id} style={{ padding: '2px 0' }}>{i.medicineName}</div>)}
                            </td>
                            <td>
                              {r.items?.map(i => <div key={i.id} style={{ padding: '2px 0' }}>{i.quantity}</div>)}
                            </td>
                            <td>
                              {r.items?.map(i => <div key={i.id} style={{ padding: '2px 0' }}>Rs. {i.unitPrice.toFixed(2)}</div>)}
                            </td>
                            <td>Rs. {r.totalAmount.toFixed(2)}</td>
                            <td><span className={`badge ${REQUEST_STATUS_COLOR[r.status] || 'badge-blue'}`}>{r.status}</span></td>
                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.requestedAt).toLocaleDateString()}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {(r.status === 'Delivered' || r.status === 'Dispatched') && (
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
                              </div>
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

          {/* ── Edit Inventory Item Modal ── */}
          {editItemModal && (
            <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
              <div className="card scale-in" style={{ width: '100%', maxWidth: 500, background: 'white', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 800, color: 'var(--text-primary)' }}>
                      <Edit3 size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />Edit Inventory Item
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {editItemModal.medicineName}
                      {editItemModal.genericName ? <span style={{ color: 'var(--text-muted)' }}> · {editItemModal.genericName}</span> : null}
                      <span className="badge badge-blue" style={{ marginLeft: 8, fontSize: 11 }}>{editItemModal.category}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditItemModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
                </div>

                {eiError && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 'var(--r-md)', background: '#FEF2F2', color: '#DC2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={15} /> {eiError}
                  </div>
                )}

                {/* Current read-only snapshot */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Current Stock</div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900, color: STATUS_COLOR[editItemModal.stockStatus] || 'var(--text-primary)' }}>{editItemModal.currentStock}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Min Stock Level</div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{editItemModal.minStockLevel}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Unit Price</div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>Rs. {editItemModal.unitPrice.toFixed(2)}</div>
                  </div>
                </div>

                {/* Editable fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Min Stock Level</label>
                    <input type="number" min="0" className="form-input" value={eiMinStock} onChange={e => setEiMinStock(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))} id="ei-min-stock" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Unit Price (Rs.)</label>
                    <input type="number" min="0" step="0.01" className="form-input" value={eiUnitPrice} onChange={e => setEiUnitPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))} id="ei-unit-price" />
                  </div>
                </div>

                {/* Stock adjustment */}
                <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Stock Adjustment (Optional)</div>
                <div style={{ padding: '14px 16px', borderRadius: 'var(--r-md)', background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border)', marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                        Adjustment (+ add / - remove)
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        value={eiStockAdj}
                        onChange={e => setEiStockAdj(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                        placeholder="0"
                        id="ei-stock-adj"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Stock after adjustment</div>
                      <div style={{
                        fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900,
                        color: (editItemModal.currentStock + Number(eiStockAdj)) < 0 ? '#DC2626' : 'var(--success)'
                      }}>
                        {editItemModal.currentStock + Number(eiStockAdj)}
                        {Number(eiStockAdj) !== 0 && (
                          <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 6, color: Number(eiStockAdj) > 0 ? 'var(--success)' : '#DC2626' }}>
                            ({Number(eiStockAdj) > 0 ? '+' : ''}{Number(eiStockAdj)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {Number(eiStockAdj) !== 0 && (
                    <div>
                      <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Reason for Adjustment <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(recommended)</span></label>
                      <input type="text" className="form-input" value={eiAdjReason} onChange={e => setEiAdjReason(e.target.value)} placeholder="e.g. Damaged stock removed, Cycle count correction" id="ei-adj-reason" />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditItemModal(null)} disabled={eiSubmitting}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveEditItem} disabled={eiSubmitting} id="ei-submit-btn">
                    {eiSubmitting ? <><Loader size={14} className="spin" /> Saving...</> : <><CheckCircle size={14} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Add Medicine Modal ── */}
          {addMedicineModal && (
            <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
              <div className="card scale-in" style={{ width: '100%', maxWidth: 580, background: 'white', borderRadius: 'var(--r-lg)', padding: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>💊 Add New Medicine</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Creates a medicine record, inventory item, and optional initial stock batch.</div>
                  </div>
                  <button onClick={() => setAddMedicineModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
                </div>

                {amError && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 'var(--r-md)', background: '#FEF2F2', color: '#DC2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={15} /> {amError}
                  </div>
                )}

                {/* Section 1: Medicine Details */}
                <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Medicine Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Medicine Name *</label>
                    <input type="text" className="form-input" value={amMedicineName} onChange={e => setAmMedicineName(e.target.value)} placeholder="e.g. Amoxicillin 500mg Capsule" id="am-medicine-name" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Generic Name</label>
                    <input type="text" className="form-input" value={amGenericName} onChange={e => setAmGenericName(e.target.value)} placeholder="e.g. Amoxicillin" id="am-generic-name" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category *</label>
                    <select className="form-select" value={amCategory} onChange={e => setAmCategory(e.target.value)} id="am-category">
                      <option value="">— Select —</option>
                      {['Antibiotics','Pain Relief','Gastro','Cardiovascular','Diabetes','Respiratory','Vitamins & Supplements','Dermatology','Neurology','Oncology','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Unit of Measure *</label>
                    <select className="form-select" value={amUnitOfMeasure} onChange={e => setAmUnitOfMeasure(e.target.value)} id="am-unit">
                      {['Tablet','Capsule','Bottle','Vial','Tube','Sachet','Injection','Syrup','Cream','Other'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                {/* Section 2: Pricing & Stock Settings */}
                <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Pricing & Stock Settings</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Min Stock Level</label>
                    <input type="number" min="0" className="form-input" value={amMinStock} onChange={e => setAmMinStock(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))} placeholder="50" id="am-min-stock" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Unit Price (Rs.)</label>
                    <input type="number" min="0" step="0.01" className="form-input" value={amUnitPrice} onChange={e => setAmUnitPrice(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))} placeholder="0.00" id="am-unit-price" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Initial Stock (Units)</label>
                    <input type="number" min="0" className="form-input" value={amInitialStock} onChange={e => setAmInitialStock(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))} placeholder="0" id="am-initial-stock" />
                  </div>
                </div>

                {/* Section 3: Initial Batch — shown only when stock > 0 */}
                {Number(amInitialStock) > 0 && (
                  <>
                    <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>Initial Batch Info <span style={{ color: '#EF4444' }}>*</span></div>
                    <div style={{ padding: '14px 16px', borderRadius: 'var(--r-md)', background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border)', marginBottom: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <label style={{ fontSize: 12.5, fontWeight: 600 }}>Batch Number *</label>
                            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                              onClick={() => setAmBatchNumber(`B-NEW-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`)}>
                              🔄 Auto
                            </button>
                          </div>
                          <input type="text" className="form-input" value={amBatchNumber} onChange={e => setAmBatchNumber(e.target.value)} placeholder="e.g. BATCH-2026-A01" id="am-batch-number" />
                        </div>
                        <div>
                          <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Expiry Date *</label>
                          <input type="date" className="form-input" value={amExpiryDate} min={new Date().toISOString().split('T')[0]} onChange={e => setAmExpiryDate(e.target.value)} id="am-expiry-date" style={{ fontWeight: 600 }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Batch Notes (Optional)</label>
                          <input type="text" className="form-input" value={amBatchNotes} onChange={e => setAmBatchNotes(e.target.value)} placeholder="e.g. Supplier Lot #9948" id="am-batch-notes" />
                        </div>
                      </div>
                      {/* Quick expiry presets */}
                      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expiry presets:</span>
                        {[{ label: '+6 Mo', m: 6 }, { label: '+1 Yr', m: 12 }, { label: '+2 Yrs', m: 24 }, { label: '+3 Yrs', m: 36 }].map(p => (
                          <button key={p.m} type="button" className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '2px 8px', border: '1px solid var(--border)' }} onClick={() => setAmExpiryDate(getFutureDate(p.m))}>{p.label}</button>
                        ))}
                      </div>
                      {/* 60-day expiry warning */}
                      {amExpiryDate && (() => { const d = Math.ceil((new Date(amExpiryDate).getTime() - Date.now()) / 86400000); return d > 0 && d <= 60 ? (
                        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 'var(--r-sm)', background: '#FFF7ED', border: '1px solid #FED7AA', color: '#C2410C', fontSize: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <AlertTriangle size={13} /> Batch expires in {d} days — within the 60-day warning threshold.
                        </div>
                      ) : null; })()}
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setAddMedicineModal(false)} disabled={amSubmitting}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveAddMedicine} disabled={amSubmitting} id="am-submit-btn">
                    {amSubmitting ? <><Loader size={14} className="spin" /> Adding...</> : <><Plus size={14} /> Add Medicine</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Add Batch Modal (Real-World Batch Date Picker & Input Fields) ── */}
          {addBatchModalItem && (
            <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
              <div className="card scale-in" style={{ width: '100%', maxWidth: 520, background: 'white', borderRadius: 'var(--r-lg)', padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                      📦 Add New Batch
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {addBatchModalItem.medicineName} ({addBatchModalItem.category})
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setAddBatchModalItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={18} />
                  </button>
                </div>

                {batchModalError && (
                  <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 'var(--r-md)', background: '#FEF2F2', color: '#DC2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={15} /> {batchModalError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <label style={{ fontSize: 12.5, fontWeight: 600 }}>Batch Number *</label>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => setBatchNumber(`B-${addBatchModalItem.medicineId}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`)}
                      >
                        🔄 Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      value={batchNumber}
                      onChange={e => setBatchNumber(e.target.value)}
                      placeholder="e.g. BATCH-2026-A12"
                      id="batch-number-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Batch Quantity (Units) *</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={batchQuantity}
                      onChange={e => setBatchQuantity(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))}
                      placeholder="100"
                      id="batch-quantity-input"
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <label style={{ fontSize: 12.5, fontWeight: 600 }}>Real-World Batch Expiration Date *</label>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Required for expiry tracking</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        className="form-input"
                        value={batchExpiryDate}
                        onChange={e => setBatchExpiryDate(e.target.value)}
                        id="batch-expiry-date-picker"
                        min={new Date().toISOString().split('T')[0]}
                        style={{ fontWeight: 600 }}
                      />
                    </div>
                    {/* Quick Date Presets */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>Presets:</span>
                      {[
                        { label: '+6 Mo', m: 6 },
                        { label: '+1 Yr', m: 12 },
                        { label: '+2 Yrs', m: 24 },
                        { label: '+3 Yrs', m: 36 },
                      ].map(preset => (
                        <button
                          key={preset.m}
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 11, padding: '2px 8px', border: '1px solid var(--border)' }}
                          onClick={() => setBatchExpiryDate(getFutureDate(preset.m))}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12.5, fontWeight: 600, display: 'block', marginBottom: 4 }}>Notes / Manufacturer Info (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={batchNotes}
                      onChange={e => setBatchNotes(e.target.value)}
                      placeholder="e.g. Supplier Lot #9948, Stored at 20°C"
                      id="batch-notes-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setAddBatchModalItem(null)}
                    disabled={batchSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveBatch}
                    disabled={batchSubmitting}
                    id="submit-save-batch-btn"
                  >
                    {batchSubmitting ? <><Loader size={14} className="spin" /> Saving Batch...</> : <><Plus size={14} /> Add Batch</>}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
