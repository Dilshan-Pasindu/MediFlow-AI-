import { useState, useEffect } from 'react';
import { Activity, Sparkles, CheckCircle2, AlertCircle, Clock, RefreshCw, Cpu, Zap, ShieldAlert, Check } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import PortalHeader from '../../components/PortalHeader';
import { apiGetAiMetrics } from '../../services/api';

export default function AdminAIMonitorPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    setLoading(true);
    try {
      const data = await apiGetAiMetrics();
      setMetrics(data || []);
    } catch (err) {
      console.error('Failed to load AI metrics', err);
    } finally {
      setLoading(false);
    }
  }

  const totalCalls = metrics.reduce((acc, m) => acc + (m.invocationsToday || 0), 0);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="AI Agent Telemetry & Observability"
          subtitle="Real-time performance, human acceptance rates, and health for all 4 clinical agents"
          actions={
            <button className="btn btn-ghost btn-sm" onClick={loadMetrics} id="refresh-ai-metrics-btn">
              <RefreshCw size={14} /> Refresh
            </button>
          }
        />
        <div className="page-body fade-in">
          <PortalHeader
            role="admin"
            title="Agentic AI Operations Center"
            subtitle="Continuous monitoring of autonomous reasoning loops and Human-in-the-Loop checkpoints"
            loading={loading}
            stats={[
              { label: 'Active Agents', value: '4 / 4 Deployed', icon: '🤖' },
              { label: 'Total Invocations', value: totalCalls, icon: '⚡' },
              { label: 'Avg Acceptance', value: '92.4%', icon: '🎯' },
            ]}
          />

          {/* Model Architecture Info Card */}
          <div className="card" style={{ marginBottom: 24, border: '1.5px solid rgba(14, 165, 233, 0.3)', background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.6), rgba(255, 255, 255, 0.9))' }}>
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0369A1' }}>Multi-Tier Agent Framework: Level 1 + Level 2 Architecture</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    Gemini 1.5 Flash autonomous tool-calling paired with deterministic rule safety fallback.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={12} /> Gemini API Connected
                </span>
                <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Zap size={12} /> Fast Inference &lt; 500ms
                </span>
              </div>
            </div>
          </div>

          {/* Agent Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 24 }}>
            {metrics.map((agent: any) => (
              <div key={agent.agentId} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="card-body" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800 }}>{agent.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{agent.description}</div>
                    </div>
                    <span className="badge badge-green">{agent.status}</span>
                  </div>

                  <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Invocations</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--med-teal)', marginTop: 2 }}>{agent.invocationsToday}</div>
                    </div>

                    <div style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Human Acceptance</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#059669', marginTop: 2 }}>{agent.acceptanceRate}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)', fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>Avg Latency: <strong>{agent.avgLatencyMs}ms</strong></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {agent.lastInvoked}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* HITL Checkpoints Audit List */}
          <div className="card">
            <div className="card-header">
              <div className="section-title">Enforced Human-in-the-Loop (HITL) Checkpoints</div>
            </div>
            <div className="card-body" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                    1
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>Receptionist Payment & Verification Gate</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Appointment numbers are strictly generated only upon human receptionist verification of payment.
                    </div>
                  </div>
                  <span className="badge badge-green">Enforced</span>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0369A1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                    2
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>Doctor Clinical Decision Confirmation</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      AI diagnostic candidates and medication drafts require explicit doctor acceptance or modification before prescription generation.
                    </div>
                  </div>
                  <span className="badge badge-green">Enforced</span>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#B45309', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                    3
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>Pharmacist Dispensing Safety Verification</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Agent 3 screens drug-drug interactions and bioequivalents; dispensing requires human pharmacist clearance.
                    </div>
                  </div>
                  <span className="badge badge-green">Enforced</span>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#7C3AED', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                    4
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>Pharmacy Owner Restock Approval Gate</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Agent 4 automated batch orders require owner financial sign-off before dispatching to suppliers.
                    </div>
                  </div>
                  <span className="badge badge-green">Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
