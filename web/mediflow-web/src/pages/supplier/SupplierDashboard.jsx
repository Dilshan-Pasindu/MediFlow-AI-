import { useState, useEffect } from 'react';
import { CheckCircle, X, Loader, RefreshCw, Package, Truck } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { apiGetRestockRequests, apiApproveRestockRequest, getUser } from '../../services/api';

// Mock data for demo
const MOCK_REQUESTS = [
  { id: 1, pharmacyName: 'MediFlow Pharmacy - Colombo', medicineName: 'Omeprazole 20mg', quantity: 200, urgency: 'High', status: 'Pending', requestedAt: new Date(Date.now() - 2 * 3600000).toISOString(), unitPrice: 42 },
  { id: 2, pharmacyName: 'MediFlow Pharmacy - Colombo', medicineName: 'Amoxicillin 250mg', quantity: 150, urgency: 'High', status: 'Pending', requestedAt: new Date(Date.now() - 4 * 3600000).toISOString(), unitPrice: 33 },
  { id: 3, pharmacyName: 'MediFlow Pharmacy - Kandy', medicineName: 'Atorvastatin 10mg', quantity: 120, urgency: 'Critical', status: 'Pending', requestedAt: new Date(Date.now() - 1 * 3600000).toISOString(), unitPrice: 58 },
  { id: 4, pharmacyName: 'MediFlow Pharmacy - Galle', medicineName: 'Losartan 50mg', quantity: 100, urgency: 'Medium', status: 'Approved', requestedAt: new Date(Date.now() - 24 * 3600000).toISOString(), unitPrice: 52 },
];

export default function SupplierDashboard() {
  const user = getUser();
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [messages, setMessages] = useState({});
  const [activeTab, setActiveTab] = useState('pending');

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const approvedRequests = requests.filter(r => r.status === 'Approved');
  const display = activeTab === 'pending' ? pendingRequests : approvedRequests;

  async function handleApprove(id) {
    setActionLoading(a => ({ ...a, [id]: 'approve' }));
    await new Promise(r => setTimeout(r, 1000));
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    setMessages(m => ({ ...m, [id]: { type: 'success', text: 'Restock request approved! Supply scheduled.' } }));
    setActionLoading(a => ({ ...a, [id]: null }));
  }

  function handleReject(id) {
    setRequests(prev => prev.filter(r => r.id !== id));
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Supplier Dashboard" subtitle="Review and approve pharmacy restock requests" />
        <div className="page-body fade-in">

          {/* Cyan banner */}
          <div style={{ background: 'linear-gradient(135deg,#155E75,#0891B2)', borderRadius: 'var(--r-xl)', padding: '22px 28px', color: 'white', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(8,145,178,0.3)' }}>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 21, fontWeight: 800, marginBottom: 4 }}>Supplier Portal</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>Review pharmacy restock requests and manage supply chain</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Pending', value: pendingRequests.length, icon: '📦', highlight: pendingRequests.length > 0 },
                { label: 'Approved', value: approvedRequests.length, icon: '✅' },
                { label: 'Total', value: requests.length, icon: '📊' },
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
                Review each pharmacy restock request carefully. Approve to dispatch supply. Each approval creates a delivery record.
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')} id="tab-pending-supply">
              📦 Pending Requests ({pendingRequests.length})
            </button>
            <button className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')} id="tab-approved-supply">
              ✅ Approved ({approvedRequests.length})
            </button>
          </div>

          {display.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">{activeTab === 'pending' ? '🎉' : '📦'}</div>
              <div className="empty-title">{activeTab === 'pending' ? 'No pending requests!' : 'No approved requests yet'}</div>
              <div className="empty-sub">All caught up.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {display.map(req => {
                const msg = messages[req.id];
                const isLoading = actionLoading[req.id];
                const totalValue = req.quantity * req.unitPrice;
                return (
                  <div key={req.id} className="card" id={`supply-req-${req.id}`}>
                    <div className="card-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800 }}>{req.medicineName}</div>
                          <span className={`badge ${req.urgency === 'Critical' ? 'badge-red' : req.urgency === 'High' ? 'badge-yellow' : 'badge-blue'}`}>{req.urgency}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>🏥 {req.pharmacyName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Requested</div>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900 }}>{req.quantity} units</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Value: Rs. {totalValue.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="card-body" style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                        <span>Unit Price: Rs. {req.unitPrice}</span>
                        <span>Requested: {new Date(req.requestedAt).toLocaleString()}</span>
                      </div>
                      {msg && (
                        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--success-bg)', color: 'var(--success)', fontSize: 12.5, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <CheckCircle size={13} /> {msg.text}
                        </div>
                      )}
                      {req.status === 'Pending' && !messages[req.id] && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button className="btn btn-success" onClick={() => handleApprove(req.id)} disabled={!!isLoading} id={`approve-supply-${req.id}`} style={{ flex: 1 }}>
                            {isLoading === 'approve' ? <Loader size={14} className="spin" /> : <Truck size={14} />}
                            {isLoading === 'approve' ? 'Processing...' : 'Approve & Dispatch Supply'}
                          </button>
                          <button className="btn btn-danger" onClick={() => handleReject(req.id)} id={`reject-supply-${req.id}`}>
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}
                      {req.status === 'Approved' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 700, fontSize: 13 }}>
                          <CheckCircle size={15} /> <Truck size={15} /> Supply approved and dispatched!
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
    </div>
  );
}
