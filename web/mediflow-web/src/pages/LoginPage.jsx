import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { apiLogin, apiRegister } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiLogin(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiRegister(form.name, form.email, form.password, form.phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left — Branding */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">🏥</div>
          <div className="login-brand-title">MediFlow AI</div>
          <div className="login-brand-sub">
            Your intelligent healthcare companion. Book appointments, access prescriptions, and manage your health — all in one place.
          </div>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '🩺', text: 'AI-powered specialist recommendations' },
              { icon: '📅', text: 'Seamless appointment booking' },
              { icon: '💊', text: 'Digital e-prescriptions & order tracking' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 12, backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ color: 'white', fontSize: 14, fontWeight: 500, opacity: 0.9 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0369A1, #0D9488)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartPulse size={20} color="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>MediFlow AI</span>
          </div>

          <div className="tabs">
            <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Sign In</button>
            <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>Create Account</button>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <>
              <div className="login-title">Welcome back</div>
              <div className="login-sub">Sign in to your patient account</div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="dilshan@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Password</label>
                  <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 42 }} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: 32, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                  <a href="#" style={{ fontSize: 12.5, color: '#0369A1', fontWeight: 500 }}>Forgot password?</a>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? <><Loader size={16} className="spin" /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
                Use: <strong>dilshan@gmail.com</strong> / <strong>Test@123</strong>
              </div>
            </>
          ) : (
            <>
              <div className="login-title">Create your account</div>
              <div className="login-sub">Join MediFlow AI as a patient</div>

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="Dilshan Pasindu" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="dilshan@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" placeholder="+94 77 123 4567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Password</label>
                  <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 42 }} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: 32, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
                  {loading ? <><Loader size={16} className="spin" /> Creating...</> : <>Create Account <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
