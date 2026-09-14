import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, PackageSearch, AlertTriangle, Sparkles, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiGetInventoryForecast, type InventoryForecastResult } from '../../services/api';

export default function OwnerAnalyticsPage() {
  const [forecast, setForecast] = useState<InventoryForecastResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecast();
  }, []);

  async function loadForecast() {
    setLoading(true);
    try {
      const res = await apiGetInventoryForecast(1);
      setForecast(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const kpis = [
    { title: 'Monthly Revenue', value: 'Rs. 485,200', change: '+14.2%', isPositive: true, sub: 'vs last month' },
    { title: 'Avg Restock Lead Time', value: '2.4 Days', change: '-18%', isPositive: true, sub: 'supplier fulfillment speed' },
    { title: 'Inventory Turn Rate', value: '4.8× / yr', change: '+0.5×', isPositive: true, sub: 'annualized velocity' },
    { title: 'Stockout Prevention Rate', value: '98.5%', change: '+3.1%', isPositive: true, sub: 'AI forecasting accuracy' },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Pharmacy Financial & Inventory Analytics"
          subtitle="Revenue velocity, restock forecasting, and predictive supply chain insights"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadForecast} id="refresh-analytics-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="owner"
            title="Pharmacy Business Intelligence"
            subtitle="Executive analytics dashboard tracking revenue, demand velocity, and AI restock budgets"
            loading={loading}
            stats={[
              { label: 'Forecasted Budget', value: forecast ? `Rs. ${forecast.total_projected_cost.toLocaleString()}` : 'Rs. 22,400', icon: '💰' },
              { label: 'Stockout Hazards', value: forecast ? forecast.risk_items.filter(i => i.urgency === 'CRITICAL').length : 2, icon: '⚠️', highlight: true },
              { label: 'Supply Health', value: 'Optimal', icon: '📈' },
            ]}
          />

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
            {kpis.map((kpi, idx) => (
              <div key={idx} className="card">
                <div className="card-body" style={{ padding: '18px 20px' }}>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.title}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0' }}>
                    {kpi.value}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span style={{ color: kpi.isPositive ? '#059669' : '#DC2626', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {kpi.change}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{kpi.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Agent 4 Forecast Section */}
          <div className="card" style={{ marginBottom: 24, border: '1.5px solid rgba(14, 165, 233, 0.3)', background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.5), rgba(255, 255, 255, 0.95))' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0369A1' }}>Agent 4: Predictive Stockout & Restock Model</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Calculates daily burn rates, project stockout horizons, and synthesizes 30-day safety restock orders
                  </div>
                </div>
              </div>
              <span className="badge badge-teal">30-Day Lookback</span>
            </div>

            <div className="card-body" style={{ padding: '20px' }}>
              {forecast && (
                <>
                  <div style={{ padding: '12px 16px', background: 'white', borderRadius: 'var(--r-md)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 18 }}>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{forecast.summary}</p>
                  </div>

                  <div className="section-title" style={{ fontSize: 13, marginBottom: 12 }}>At-Risk Formulary Items (Urgent Horizons):</div>
                  <div style={{ overflowX: 'auto', marginBottom: 20 }}>
                    <table className="table" style={{ width: '100%', fontSize: 13 }}>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>On Hand</th>
                          <th>Daily Consumption</th>
                          <th>Horizon</th>
                          <th>Risk Assessment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecast.risk_items.map(item => (
                          <tr key={item.medicine_id}>
                            <td><strong>{item.medicine_name}</strong></td>
                            <td>{item.current_stock} units</td>
                            <td>{item.daily_burn_rate} units/day</td>
                            <td>
                              <strong style={{ color: item.days_until_stockout <= 5 ? '#DC2626' : '#D97706' }}>
                                ~{item.days_until_stockout} days left
                              </strong>
                            </td>
                            <td>
                              <span className={`badge ${item.urgency === 'CRITICAL' ? 'badge-danger' : item.urgency === 'WARNING' ? 'badge-amber' : 'badge-green'}`}>
                                {item.urgency}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="section-title" style={{ fontSize: 13, marginBottom: 12 }}>Recommended Automated Batch Proposals:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
                    {forecast.restock_recommendations.map(prop => (
                      <div key={prop.medicine_id} className="card" style={{ border: '1px solid var(--border-color)', background: 'white' }}>
                        <div className="card-body" style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <strong style={{ fontSize: 13.5 }}>{prop.medicine_name}</strong>
                            <span className={`badge ${prop.priority === 'HIGH' ? 'badge-danger' : 'badge-teal'}`}>
                              {prop.priority}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{prop.reason}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-color)', fontSize: 12 }}>
                            <span>Reorder Qty: <strong>{prop.suggested_quantity} units</strong></span>
                            <span style={{ color: 'var(--med-teal)', fontWeight: 700 }}>
                              Est. Cost: Rs. {(prop.suggested_quantity * prop.estimated_unit_cost).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
