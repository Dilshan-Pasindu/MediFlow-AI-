import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse, Eye, EyeOff, ArrowRight, Loader,
  CheckCircle2, XCircle, ShieldCheck, Sparkles,
  Stethoscope, Pill, Brain, Bot, KeyRound, UserCheck
} from 'lucide-react';
import { apiLogin, apiRegister } from '../services/api';

// Demo quick-login credentials for easy multi-role testing
const DEMO_PERSONAS = [
  { role: 'Patient', label: 'Patient', email: 'dilshan@gmail.com', password: 'Test@123', icon: '👤', desc: 'Dilshan Pasindu' },
  { role: 'Doctor', label: 'Doctor', email: 'nimal.perera@mediflow.lk', password: 'Doctor@123', icon: '🩺', desc: 'Dr. Nimal Perera' },
  { role: 'Receptionist', label: 'Receptionist', email: 'receptionist@mediflow.lk', password: 'Staff@123', icon: '👩‍💼', desc: 'Kamani Rajapaksa' },
  { role: 'Pharmacist', label: 'Pharmacist', email: 'pharmacist@mediflow.lk', password: 'Staff@123', icon: '💊', desc: 'Sunil Weerasinghe' },
  { role: 'Administrator', label: 'Admin', email: 'admin@mediflow.lk', password: 'Admin@123', icon: '🛡️', desc: 'System Admin' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [selectedPersona, setSelectedPersona] = useState('Patient');

  // Form states
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: 'dilshan@gmail.com',
    password: 'Test@123',
    confirmPassword: '',
    phone: '',
    role: 'Patient'
  });

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // ── Password Strength Calculation ──────────────────────────────────────────
  const passwordCriteria = useMemo(() => {
    const p = form.password || '';
    return {
      hasLength: p.length >= 8,
      hasUpper: /[A-Z]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasNumber: /[0-9]/.test(p),
      hasSpecial: /[^A-Za-z0-9]/.test(p)
    };
  }, [form.password]);

  const strengthScore = useMemo(() => {
    const { hasLength, hasUpper, hasLower, hasNumber, hasSpecial } = passwordCriteria;
    let score = 0;
    if (hasLength) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    return score; // 0 to 4
  }, [passwordCriteria]);

  const strengthLabel = useMemo(() => {
    switch (strengthScore) {
      case 0:
      case 1: return { label: 'Weak', class: 'weak' };
      case 2: return { label: 'Fair', class: 'fair' };
      case 3: return { label: 'Good', class: 'good' };
      case 4: return { label: 'Strong', class: 'strong' };
      default: return { label: 'Weak', class: 'weak' };
    }
  }, [strengthScore]);

  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

  // ── Quick Persona Switch ───────────────────────────────────────────────────
  const applyPersona = (persona) => {
    setSelectedPersona(persona.role);
    setForm(prev => ({
      ...prev,
      email: persona.email,
      password: persona.password
    }));
    setError('');
  };

  // ── Submit Handlers ────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiLogin(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (strengthScore < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await apiRegister(form.name, form.email, form.password, form.phone, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotSent(true);
    }, 800);
  };

  return (
    <div className="login-page">
      {/* ── Left Hero Panel ─────────────────────────────────────────────────── */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-header">
            <div className="login-brand-icon">
              <HeartPulse size={30} color="white" />
            </div>
            <div>
              <div className="login-brand-title">MediFlow AI</div>
              <div style={{ fontSize: 13, color: '#BAE6FD', fontWeight: 600 }}>
                Intelligent Healthcare & Channeling
              </div>
            </div>
          </div>

          <div className="login-brand-sub">
            A next-generation healthcare platform combining role-based channeling, digital prescriptions, and multi-agent clinical intelligence.
          </div>

          {/* 4 Agent AI Feature Highlights */}
          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#BAE6FD', marginBottom: 6 }}>
            Powered by 4 Agentic AI Subsystems
          </div>

          <div className="agent-badges-grid">
            <div className="agent-feature-card">
              <div className="agent-icon">🩺</div>
              <div>
                <div className="agent-title">Specialist Agent</div>
                <div className="agent-desc">Symptom analysis & doctor matching</div>
              </div>
            </div>

            <div className="agent-feature-card">
              <div className="agent-icon">🧠</div>
              <div>
                <div className="agent-title">Clinical CDS Agent</div>
                <div className="agent-desc">Diagnosis assist & safety checks</div>
              </div>
            </div>

            <div className="agent-feature-card">
              <div className="agent-icon">💊</div>
              <div>
                <div className="agent-title">Rx Validator Agent</div>
                <div className="agent-desc">Drug interactions & dosage alerts</div>
              </div>
            </div>

            <div className="agent-feature-card">
              <div className="agent-icon">📦</div>
              <div>
                <div className="agent-title">Inventory Agent</div>
                <div className="agent-desc">Stock forecasting & reorders</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
            <ShieldCheck size={16} color="#34D399" />
            <span>Encrypted with JWT & Role-Based Access Control</span>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ────────────────────────────────────────────────── */}
      <div className="login-right">
        <div className="login-form-wrap">

          {/* Top Logo / Mode Switch */}
          <div className="tabs">
            <button
              className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError(''); }}
            >
              Create Account
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }} className="fade-in">
              <XCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: LOGIN                                                         */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          {tab === 'login' && (
            <div className="fade-in">
              <div className="login-title">Welcome back</div>
              <div className="login-sub">Sign in to your MediFlow AI account</div>

              {/* Demo Persona Switcher */}
              <div className="demo-bar-title">
                <span>⚡ Quick Demo Switcher</span>
                <span style={{ fontSize: 10, color: '#0369A1' }}>Select Persona</span>
              </div>
              <div className="persona-bar">
                {DEMO_PERSONAS.map(p => (
                  <button
                    key={p.role}
                    type="button"
                    className={`persona-pill ${selectedPersona === p.role ? 'active' : ''}`}
                    onClick={() => applyPersona(p)}
                    title={p.desc}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="name@mediflow.lk"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ paddingRight: 42 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: 32, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="form-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me on this device</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setError(''); }}
                    style={{ fontSize: 12.5, color: '#0369A1', fontWeight: 600 }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                  {loading ? (
                    <><Loader size={16} className="spin" /> Authenticating...</>
                  ) : (
                    <>Sign In as {selectedPersona} <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: REGISTER                                                      */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          {tab === 'register' && (
            <div className="fade-in">
              <div className="login-title">Create an Account</div>
              <div className="login-sub">Register to access channeling and prescriptions</div>

              {/* Role Picker */}
              <label className="role-select-label">Select Account Type</label>
              <div className="role-select-grid">
                {[
                  { role: 'Patient', icon: '👤', name: 'Patient', desc: 'Book & Prescriptions' },
                  { role: 'Doctor', icon: '🩺', name: 'Doctor', desc: 'Consultations & CDS' },
                  { role: 'Pharmacist', icon: '💊', name: 'Pharmacist', desc: 'Dispensing & Orders' },
                ].map(r => (
                  <div
                    key={r.role}
                    className={`role-select-card ${form.role === r.role ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, role: r.role })}
                  >
                    <div className="role-card-icon">{r.icon}</div>
                    <div className="role-card-name">{r.name}</div>
                    <div className="role-card-desc">{r.desc}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Dilshan Pasindu"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password Field + Live Strength Meter */}
                <div className="form-group" style={{ position: 'relative', marginBottom: 8 }}>
                  <label className="form-label">Create Password</label>
                  <input
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ paddingRight: 42 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: 32, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Interactive Password Strength Meter */}
                {form.password && (
                  <div className="strength-meter-wrap fade-in">
                    <div className="strength-bar-track">
                      <div className={`strength-seg ${strengthScore >= 1 ? strengthLabel.class : ''}`}></div>
                      <div className={`strength-seg ${strengthScore >= 2 ? strengthLabel.class : ''}`}></div>
                      <div className={`strength-seg ${strengthScore >= 3 ? strengthLabel.class : ''}`}></div>
                      <div className={`strength-seg ${strengthScore >= 4 ? strengthLabel.class : ''}`}></div>
                    </div>
                    <div className="strength-label-row">
                      <span>Password Strength:</span>
                      <span className={`strength-text ${strengthLabel.class}`}>{strengthLabel.label}</span>
                    </div>

                    <div className="strength-rules">
                      <div className={`strength-rule-item ${passwordCriteria.hasLength ? 'valid' : ''}`}>
                        {passwordCriteria.hasLength ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 8+ Characters
                      </div>
                      <div className={`strength-rule-item ${passwordCriteria.hasUpper && passwordCriteria.hasLower ? 'valid' : ''}`}>
                        {passwordCriteria.hasUpper && passwordCriteria.hasLower ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Upper & Lowercase
                      </div>
                      <div className={`strength-rule-item ${passwordCriteria.hasNumber ? 'valid' : ''}`}>
                        {passwordCriteria.hasNumber ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Number (0-9)
                      </div>
                      <div className={`strength-rule-item ${passwordCriteria.hasSpecial ? 'valid' : ''}`}>
                        {passwordCriteria.hasSpecial ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Special Symbol
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="form-group" style={{ position: 'relative', marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Confirm Password</label>
                    {form.confirmPassword && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: passwordsMatch ? '#059669' : '#DC2626' }}>
                        {passwordsMatch ? '✓ Passwords Match' : '✗ Do not match'}
                      </span>
                    )}
                  </div>
                  <input
                    className="form-input"
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    style={{ paddingRight: 42 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{ position: 'absolute', right: 12, top: 32, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Terms Agreement */}
                <div style={{ marginBottom: 20 }}>
                  <label className="checkbox-label" style={{ fontSize: 12.5 }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      required
                    />
                    <span>
                      I agree to the{' '}
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                        style={{ color: '#0369A1', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        Terms of Service
                      </a>{' '}
                      & Privacy Policy
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={loading || !passwordsMatch || !agreeTerms}
                >
                  {loading ? (
                    <><Loader size={16} className="spin" /> Registering Account...</>
                  ) : (
                    <>Create {form.role} Account <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: FORGOT PASSWORD                                               */}
          {/* ═════════════════════════════════════════════════════════════════════ */}
          {tab === 'forgot' && (
            <div className="fade-in">
              <div className="login-title">Reset Password</div>
              <div className="login-sub">Enter your email to receive a password reset token</div>

              {forgotSent ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: '#10B981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>Reset Link Dispatched</div>
                  <div style={{ fontSize: 13, color: '#047857' }}>
                    We sent a secure password reset link to <strong>{forgotEmail}</strong>.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <div className="form-group">
                    <label className="form-label">Account Email</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="your.email@mediflow.lk"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 12 }} disabled={loading}>
                    {loading ? <><Loader size={16} className="spin" /> Sending...</> : 'Send Reset Instructions'}
                  </button>
                </form>
              )}

              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: '100%' }}
                onClick={() => { setTab('login'); setForgotSent(false); setError(''); }}
              >
                Back to Sign In
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── Terms & Conditions Modal ────────────────────────────────────────── */}
      {showTermsModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div className="modal-title">Terms of Service & Privacy</div>
              <button className="close-btn" onClick={() => setShowTermsModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              <p style={{ marginBottom: 12 }}>
                <strong>1. Healthcare AI Disclaimer:</strong> MediFlow AI provides recommendation assistance for doctor channeling and clinical decision support. All final medical decisions remain under the authority of certified medical professionals.
              </p>
              <p style={{ marginBottom: 12 }}>
                <strong>2. Data Security:</strong> Patient data and e-prescriptions are encrypted using industry-standard protocols in compliance with medical data privacy guidelines.
              </p>
              <p>
                <strong>3. Role-Based Access:</strong> Your login credentials grant access only to your authorized portal (Patient, Doctor, Pharmacist, or Admin).
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => { setAgreeTerms(true); setShowTermsModal(false); }}
              >
                I Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
