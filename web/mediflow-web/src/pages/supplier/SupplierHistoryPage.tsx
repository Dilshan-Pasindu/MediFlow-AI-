import { useState, useEffect } from 'react';
import { Truck, Search, Calendar, CheckCircle2, Clock, PackageCheck, RefreshCw, FileText } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiGetSupplierOrders } from '../../services/api';

export default function SupplierHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await apiGetSupplierOrders();
      setOrders((data as any[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const completedOrders = orders.filter(
    o => o.status === 'Completed' || o.status === 'Delivered' || o.status === 'Dispatched'
  );

  const filtered = completedOrders.filter(o => {
    const matchSearch =
      o.id?.toString().includes(searchTerm) ||
      o.pharmacyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchSearch;
    return matchSearch && o.status === statusFilter;
  });

  const totalValue = completedOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Supply Fulfillment History"
          subtitle="Archive of dispatched pharmaceutical batches, delivered orders, and supplier invoices"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadOrders} id="refresh-supplier-history-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="supplier"
            title="Shipment & Dispatch History"
            subtitle="Full delivery audit trail with batch traceability and completion timestamps"
            loading={loading}
            stats={[
              { label: 'Completed Shipments', value: completedOrders.length, icon: '📦' },
              { label: 'Total Volume Dispatched', value: `Rs. ${totalValue.toLocaleString()}`, icon: '💳' },
              { label: 'On-Time Delivery', value: '98.4%', icon: '⏱️' },
            ]}
          />

          {/* Search & Filter */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by order #, pharmacy destination, or notes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 36, height: 38, borderRadius: 'var(--r-md)', border: '1px solid var(--border-color)', fontSize: 13.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {(['ALL', 'Completed', 'Delivered', 'Dispatched'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 12, height: 34, borderRadius: 'var(--r-md)' }}
                  >
                    {st === 'ALL' ? 'All Dispatched' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-title">Fulfillment Log ({filtered.length})</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Traceable delivery transactions</span>
            </div>

            {loading ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="skeleton" style={{ height: 52, borderRadius: 'var(--r-md)' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
                <Truck size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                <div className="empty-title">No completed deliveries found</div>
                <div className="empty-sub">Orders dispatched or delivered will automatically appear in this archive.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', fontSize: 13.5 }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Pharmacy Destination</th>
                      <th>Items & Batches</th>
                      <th>Total Value</th>
                      <th>Dispatched Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(order => {
                      const formattedDate = order.requestedAt
                        ? new Date(order.requestedAt).toLocaleDateString()
                        : 'Recent';

                      return (
                        <tr key={order.id}>
                          <td>
                            <strong style={{ color: 'var(--med-teal)', fontFamily: 'Outfit, sans-serif' }}>
                              #{order.id}
                            </strong>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{order.pharmacyName || 'MediFlow Central Pharmacy'}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {(order.items || []).map((it: any, idx: number) => (
                                <span key={idx} className="badge badge-teal" style={{ fontSize: 11 }}>
                                  {it.medicineName} ×{it.requestedQuantity}
                                </span>
                              ))}
                              {(!order.items || order.items.length === 0) && (
                                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Standard replenishment batch</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <strong>Rs. {(order.totalAmount || 0).toLocaleString()}</strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                              <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                              <span>{formattedDate}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${order.status === 'Completed' ? 'badge-green' : order.status === 'Delivered' ? 'badge-teal' : 'badge-blue'}`}>
                              <CheckCircle2 size={11} style={{ marginRight: 4 }} />
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
