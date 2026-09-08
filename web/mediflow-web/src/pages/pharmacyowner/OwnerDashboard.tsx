import { useState, useEffect } from 'react';
import { CheckCircle, X, AlertTriangle, BarChart3, Package, RefreshCw, Loader, Sparkles, TrendingDown } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiGetPharmacyInventory, apiGetLowStockItems, apiGenerateRestockRecommendations, apiCreateRestockRequest, getUser } from '../../services/api';

// Mock data for demo when API is not running
const MOCK_INVENTORY = [
  { id: 1, medicineName: 'Omeprazole 20mg', currentStock: 8, minStock: 50, unitPrice: 45, category: 'Gastro' },
  { id: 2, medicineName: 'Paracetamol 500mg', currentStock: 420, minStock: 200, unitPrice: 12, category: 'Pain' },
  { id: 3, medicineName: 'Amoxicillin 250mg', currentStock: 12, minStock: 80, unitPrice: 35, category: 'Antibiotics' },
  { id: 4, medicineName: 'Metformin 500mg', currentStock: 95, minStock: 100, unitPrice: 28, category: 'Diabetes' },
  { id: 5, medicineName: 'Atorvastatin 10mg', currentStock: 5, minStock: 60, unitPrice: 62, category: 'Cardio' },
  { id: 6, medicineName: 'Aspirin 75mg', currentStock: 310, minStock: 150, unitPrice: 15, category: 'Cardio' },
  { id: 7, medicineName: 'Losartan 50mg', currentStock: 18, minStock: 70, unitPrice: 55, category: 'Cardio' },
  { id: 8, medicineName: 'Cetirizine 10mg', currentStock: 200, minStock: 100, unitPrice: 22, category: 'Allergy' },
];

const MOCK_RESTOCK = [
  { medicineId: 1, medicineName: 'Omeprazole 20mg', suggestedQty: 200, urgency: 'High', reason: 'Stock critically low (8 units). Average daily usage: 12 units.' },
  { medicineId: 3, medicineName: 'Amoxicillin 250mg', suggestedQty: 150, urgency: 'High', reason: 'Stock critically low (12 units). 15 active prescriptions pending.' },
  { medicineId: 5, medicineName: 'Atorvastatin 10mg', suggestedQty: 120, urgency: 'Critical', reason: 'Stock dangerously low (5 units). Forecasted demand spike next week.' },
  { medicineId: 7, medicineName: 'Losartan 50mg', suggestedQty: 100, urgency: 'Medium', reason: 'Stock below minimum threshold (18/70). Regular patient orders expected.' },
];

export default function OwnerDashboard() {
  const user = getUser();
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [restockRecs, setRestockRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [decisions, setDecisions] = useState<Record<string | number, any>>({});
  const [submitting, setSubmitting] = useState<Record<string | number, any>>({});
  const [messages, setMessages] = useState<Record<string | number, any>>({});
  const [activeTab, setActiveTab] = useState('inventory');

  const lowStockItems = inventory.filter(i => i.currentStock < i.minStock);
  const criticalItems = lowStockItems.filter(i => (i.currentStock / i.minStock) < 0.2);

  async function handleGenerateRestock() {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setRestockRecs(MOCK_RESTOCK);
    const d: Record<string | number, any> = {};
    MOCK_RESTOCK.forEach(r => { d[r.medicineId] = null; });
    setDecisions(d);
    setActiveTab('restock');
    setAiLoading(false);
  }

  async function handleApprove(rec: any) {
    setSubmitting(s => ({ ...s, [rec.medicineId]: true }));
    await new Promise(r => setTimeout(r, 800));
    setMessages(m => ({ ...m, [rec.medicineId]: { type: 'success', text: `Restock request for ${rec.medicineName} sent to supplier!` } }));
    setDecisions(d => ({ ...d, [rec.medicineId]: 'approve' }));
    setSubmitting(s => ({ ...s, [rec.medicineId]: false }));
  }

  function handleDismiss(rec: any) {
    setDecisions(d => ({ ...d, [rec.medicineId]: 'dismiss' }));
  }

  const stockPct = (item: any) => Math.min(100, Math.round((item.currentStock / item.minStock) * 100));
  const stockLevel = (pct: number) => pct <= 15 ? 'critical' : pct <= 30 ? 'low' : pct <= 70 ? 'medium' : 'high';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Pharmacy Owner Dashboard"
          subtitle="Manage inventory, AI restocking, and analytics"
          actions={
            <button className="btn btn-primary btn-sm" onClick={handleGenerateRestock} disabled={aiLoading} id="generate-restock-btn">
              {aiLoading ? <><Loader size={13} className="spin" /> Analyzing...</> : <><Sparkles size={13} /> AI Restock Analysis</>}
            </button>
          }
        />
        <div className="page-body fade-in">

          {/* Red banner */}
          <div style={{ background: 'linear-gradient(135deg,#991B1B,#DC2626)', borderRadius: 'var(--r-xl)', padding: '22px 28px', color: 'white', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(220,38,38,0.3)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 21, fontWeight: 800, marginBottom: 4 }}>Pharmacy Owner Portal</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Inventory management, AI demand forecasting, and restock automation</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Total Medicines', value: inventory.length, icon: '💊' },
                { label: 'Low Stock', value: lowStockItems.length, icon: '⚠️', highlight: lowStockItems.length > 0 },
                { label: 'Critical', value: criticalItems.length, icon: '🚨', highlight: criticalItems.length > 0 },
              ].map(s => (
                <div key={s.label} style={{ background: s.highlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: `1.5px solid ${s.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`, borderRadius: 'var(--r-lg)', padding: '10px 16px', textAlign: 'center', minWidth: 90 }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alert */}
          {criticalItems.length > 0 && (
            <div className="approval-banner" style={{ background: 'linear-gradient(135deg,#FEF2F2,#FEE2E2)', borderColor: '#FECACA', marginBottom: 20 }}>
              <span className="approval-banner-icon">🚨</span>
              <div>
                <div className="approval-banner-title" style={{ color: '#991B1B' }}>Critical Stock Alert</div>
                <div className="approval-banner-sub" style={{ color: '#DC2626' }}>
                  {criticalItems.map(i => i.medicineName).join(', ')} — stock levels critical! Run AI Restock Analysis immediately.
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')} id="tab-inventory">
              💊 Inventory ({inventory.length})
            </button>
            <button className={`tab-btn ${activeTab === 'restock' ? 'active' : ''}`} onClick={() => setActiveTab('restock')} id="tab-restock">
              🤖 AI Restock {restockRecs.length > 0 && `(${restockRecs.length})`}
            </button>
          </div>

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="card">
              <div className="card-header">
                <div className="section-title">Current Inventory</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-red" style={{ alignSelf: 'center' }}>{lowStockItems.length} Low Stock</span>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Min Required</th>
                      <th>Stock Level</th>
                      <th>Unit Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => {
                      const pct = stockPct(item);
                      const level = stockLevel(pct);
                      return (
                        <tr key={item.id} id={`inventory-row-${item.id}`}>
                          <td style={{ fontWeight: 700 }}>{item.medicineName}</td>
                          <td><span className="badge badge-blue">{item.category}</span></td>
                          <td>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 800, color: level === 'critical' || level === 'low' ? 'var(--danger)' : 'var(--text-primary)' }}>
                              {item.currentStock}
                            </span> units
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{item.minStock} units</td>
                          <td style={{ width: 160 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="stock-indicator">
                                <div className={`stock-fill ${level}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                              </div>
                              <span style={{ fontSize: 11.5, fontWeight: 700, minWidth: 32 }}>{pct}%</span>
                            </div>
                          </td>
                          <td>Rs. {item.unitPrice}</td>
                          <td>
                            {level === 'critical' ? <span className="low-stock-badge">🚨 Critical</span> :
                             level === 'low' ? <span className="low-stock-badge">⚠️ Low</span> :
                             <span className="badge badge-green">✓ OK</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Restock Tab */}
          {activeTab === 'restock' && (
            restockRecs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>AI Restock Analysis</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
                  The AI Inventory Agent will analyze your current stock levels, prescription patterns, and demand forecasts to recommend optimal restock quantities.
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleGenerateRestock} disabled={aiLoading} id="start-ai-restock-btn">
                  {aiLoading ? <><Loader size={16} className="spin" /> Analyzing inventory...</> : <><Sparkles size={16} /> Run AI Restock Analysis</>}
                </button>
              </div>
            ) : (
              <div>
                <div className="approval-banner" style={{ marginBottom: 20 }}>
                  <span className="approval-banner-icon">🤖</span>
                  <div>
                    <div className="approval-banner-title">Human Approval Point #3 — AI Restock Recommendations</div>
                    <div className="approval-banner-sub">Review each AI restock recommendation. Approve to send to supplier, or Dismiss to ignore.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {restockRecs.map(rec => {
                    const dec = decisions[rec.medicineId];
                    const msg = messages[rec.medicineId];
                    const isSubmitting = submitting[rec.medicineId];
                    if (dec === 'dismiss') return null;
                    return (
                      <div key={rec.medicineId} className="card" id={`restock-rec-${rec.medicineId}`} style={{ opacity: dec === 'approve' ? 0.7 : 1 }}>
                        <div className="card-header">
                          <div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800 }}>{rec.medicineName}</div>
                              <span className={`badge ${rec.urgency === 'Critical' ? 'badge-red' : rec.urgency === 'High' ? 'badge-yellow' : 'badge-blue'}`}>{rec.urgency} Priority</span>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>🤖 AI Recommendation</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Suggested Quantity</div>
                            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{rec.suggestedQty} units</div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                            💡 {rec.reason}
                          </div>
                          {msg && (
                            <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--success-bg)', color: 'var(--success)', fontSize: 12.5, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                              <CheckCircle size={13} /> {msg.text}
                            </div>
                          )}
                          {dec !== 'approve' && (
                            <div style={{ display: 'flex', gap: 10 }}>
                              <button className="btn btn-success" onClick={() => handleApprove(rec)} disabled={isSubmitting} id={`approve-restock-${rec.medicineId}`}>
                                {isSubmitting ? <Loader size={13} className="spin" /> : <CheckCircle size={13} />}
                                {isSubmitting ? 'Sending...' : 'Approve & Send to Supplier'}
                              </button>
                              <button className="btn btn-ghost" style={{ color: 'var(--text-muted)' }} onClick={() => handleDismiss(rec)} id={`dismiss-restock-${rec.medicineId}`}>
                                <X size={13} /> Dismiss
                              </button>
                            </div>
                          )}
                          {dec === 'approve' && (
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
        </div>
      </div>
    </div>
  );
}
