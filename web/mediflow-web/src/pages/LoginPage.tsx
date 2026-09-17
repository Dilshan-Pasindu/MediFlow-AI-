import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  HeartPulse, Eye, EyeOff, ArrowRight, Loader,
  CheckCircle2, XCircle, ShieldCheck, Mail, Lock,
  User, Phone, Sparkles, Activity, Users, Star,
  Stethoscope, Brain, Pill, Clock, Plus
} from 'lucide-react';
import { apiLogin, apiRegister, apiGoogleAuth } from '../services/api';

// ─── Google Icon ───────────────────────────────────────────────────────────────
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Validation ────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

// ─── Constants ─────────────────────────────────────────────────────────────────
const DEMO_PERSONAS = [
  { role: 'Patient',       label: 'Patient',     email: 'dilshan@gmail.com',        password: 'Test@123',   icon: '👤', color: '#2A7DE1' },
  { role: 'Doctor',        label: 'Doctor',       email: 'nimal.perera@mediflow.lk', password: 'Doctor@123', icon: '🩺', color: '#059669' },
  { role: 'Receptionist',  label: 'Receptionist', email: 'receptionist@mediflow.lk', password: 'Staff@123',  icon: '👩‍💼', color: '#7C3AED' },
  { role: 'Pharmacist',    label: 'Pharmacist',   email: 'pharmacist@mediflow.lk',   password: 'Staff@123',  icon: '💊', color: '#D97706' },
  { role: 'PharmacyOwner', label: 'Owner',        email: 'owner@mediflow.lk',        password: 'Staff@123',  icon: '🏥', color: '#DC2626' },
  { role: 'Supplier',      label: 'Supplier',     email: 'supplier@mediflow.lk',     password: 'Staff@123',  icon: '🚚', color: '#0891B2' },
  { role: 'Administrator', label: 'Admin',        email: 'admin@mediflow.lk',        password: 'Admin@123',  icon: '🛡️', color: '#475569' },
];

const FEATURE_ROWS = [
  { icon: Stethoscope, title: 'Smart Doctor Matching',  desc: 'AI finds the best specialist instantly', color: '#2A7DE1', bg: '#EBF4FF' },
  { icon: Brain,       title: 'AI Clinical Support',    desc: 'Evidence-based decision support',        color: '#7C3AED', bg: '#F3EEFF' },
  { icon: Pill,        title: 'Digital Prescriptions',  desc: 'Secure e-prescriptions & pharmacy sync', color: '#059669', bg: '#ECFDF5' },
  { icon: Activity,    title: 'Real-time Monitoring',   desc: 'Track appointments & health metrics',    color: '#D97706', bg: '#FFFBEB' },
];

const STATS = [
  { icon: Users,  value: '10K+', label: 'Patients',  color: '#2A7DE1' },
  { icon: Stethoscope, value: '500+', label: 'Doctors', color: '#059669' },
  { icon: Star,   value: '4.9★', label: 'Rating',    color: '#D97706' },
  { icon: Clock,  value: '24/7', label: 'Support',   color: '#7C3AED' },
];

function getRoleHome(role: string) {
  switch (role) {
    case 'Doctor':        return '/doctor/dashboard';
    case 'Receptionist':  return '/receptionist/dashboard';
    case 'Pharmacist':    return '/pharmacist/dashboard';
    case 'PharmacyOwner': return '/owner/dashboard';
    case 'Supplier':      return '/supplier/dashboard';
    case 'Administrator': return '/admin/dashboard';
    default:              return '/dashboard';
  }
}

// ─── ECG Component ─────────────────────────────────────────────────────────────
function EcgLine() {
  return (
    <svg viewBox="0 0 700 40" style={{ width: '100%', height: 40, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ecgLightG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(42,125,225,0)" />
          <stop offset="25%"  stopColor="#2A7DE1" stopOpacity="0.6" />
          <stop offset="55%"  stopColor="#4FD1C5" stopOpacity="0.9" />
          <stop offset="80%"  stopColor="#2A7DE1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgba(79,209,197,0)" />
        </linearGradient>
        <filter id="ecgLightGlow">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <line x1="0" y1="20" x2="700" y2="20" stroke="rgba(42,125,225,0.12)" strokeWidth="1" strokeDasharray="4 7" />
      <path
        d="M0,20 L60,20 L78,20 L92,5 L106,35 L120,5 L134,35 L148,20 L220,20 L255,20 L270,12 L285,28 L300,20 L370,20 L392,20 L408,2 L424,38 L440,2 L456,38 L472,20 L550,20 L572,20 L586,9 L600,31 L614,20 L700,20"
        fill="none" stroke="url(#ecgLightG)" strokeWidth="2" strokeLinecap="round"
        filter="url(#ecgLightGlow)"
        style={{ strokeDasharray: 1600, strokeDashoffset: 1600, animation: 'ecgDraw 2.6s cubic-bezier(0.4,0,0.2,1) forwards, ecgIdle 3s ease 2.7s infinite' }}
      />
    </svg>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab]                   = useState('login');
  const [selectedPersona, setSelected] = useState('Patient');
  const [showPass, setShowPass]         = useState(false);
  const [showConf, setShowConf]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [rememberMe, setRememberMe]     = useState(true);
  const [agreeTerms, setAgreeTerms]     = useState(false);
  const [showTerms, setShowTerms]       = useState(false);
  const [forgotEmail, setForgotEmail]   = useState('');
  const [forgotSent, setForgotSent]     = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const [form, setForm] = useState({
    name: '', email: 'dilshan@gmail.com', password: 'Test@123',
    confirmPassword: '', phone: '', role: 'Patient',
  });

  const pCrit = useMemo(() => {
    const p = form.password || '';
    return { len: p.length >= 8, up: /[A-Z]/.test(p), lo: /[a-z]/.test(p), num: /[0-9]/.test(p), sym: /[^A-Za-z0-9]/.test(p) };
  }, [form.password]);

  const pScore = useMemo(() => {
    let s = 0;
    if (pCrit.len) s++; if (pCrit.up && pCrit.lo) s++; if (pCrit.num) s++; if (pCrit.sym) s++;
    return s;
  }, [pCrit]);

  const pLabel   = ({ 0: 'Weak', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' } as Record<number, string>)[pScore];
  const pColors  = { 0: '#EF4444', 1: '#EF4444', 2: '#F59E0B', 3: '#2A7DE1', 4: '#22C55E' } as Record<number, string>;
  const pColor   = pColors[pScore];
  const pMatch   = form.password && form.confirmPassword && form.password === form.confirmPassword;
  const persona  = DEMO_PERSONAS.find(p => p.role === selectedPersona) || DEMO_PERSONAS[0];

  const applyPersona = (p: typeof DEMO_PERSONAS[0]) => {
    setSelected(p.role);
    setForm(f => ({ ...f, email: p.email, password: p.password }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const v = loginSchema.safeParse({ email: form.email, password: form.password });
    if (!v.success) { setError(v.error.issues[0]?.message || 'Invalid credentials.'); return; }
    setLoading(true);
    try { const d = await apiLogin(form.email, form.password); navigate(getRoleHome(d.role)); }
    catch (err: any) { setError(err?.message || 'Login failed. Please verify credentials.'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const v = registerSchema.safeParse({ name: form.name, email: form.email, password: form.password, phone: form.phone });
    if (!v.success) { setError(v.error.issues[0]?.message || 'Please check the form.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (pScore < 2) { setError('Please choose a stronger password.'); return; }
    if (!agreeTerms) { setError('You must agree to the Terms of Service.'); return; }
    setLoading(true);
    try { await apiRegister(form.name, form.email, form.password, form.phone, form.role as any); navigate('/dashboard'); }
    catch (err: any) { setError(err?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) { setError('Please enter your email.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setForgotSent(true); }, 800);
  };

  // ── Google Auth Handlers & State ──────────────────────────────────────────
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleTargetRole, setGoogleTargetRole] = useState('Patient');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string>(() => {
    return (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('mediflow_google_client_id') || '';
  });
  const [inputClientId, setInputClientId] = useState<string>(googleClientId);

  const triggerRealGooglePopup = (clientId: string, role: string) => {
    if (!(window as any).google?.accounts?.oauth2) {
      setError('Google Identity Services SDK is not ready yet. Please wait a moment.');
      return false;
    }
    try {
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse?.access_token) {
            setLoading(true);
            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const googleProfile = await userInfoRes.json();
              if (!googleProfile?.email) {
                throw new Error('Unable to retrieve Google email address.');
              }
              const res = await apiGoogleAuth({
                email: googleProfile.email,
                fullName: googleProfile.name || googleProfile.email.split('@')[0],
                photoUrl: googleProfile.picture,
                role: role as any,
              });
              navigate(getRoleHome(res.role));
            } catch (err: any) {
              setError(err?.message || 'Google authentication failed.');
            } finally {
              setLoading(false);
            }
          }
        },
        error_callback: (err: any) => {
          console.error('Google OAuth popup error:', err);
          setError('Google sign-up window was closed or cancelled.');
        },
      });
      tokenClient.requestAccessToken({ prompt: 'select_account' });
      return true;
    } catch (e: any) {
      console.warn('Failed to launch Google OAuth popup:', e);
      setError(e?.message || 'Failed to open Google OAuth window.');
      return false;
    }
  };

  const handleGoogleAuth = (role: string = 'Patient') => {
    setError('');
    const activeClientId = googleClientId || (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('mediflow_google_client_id');

    if (activeClientId) {
      const started = triggerRealGooglePopup(activeClientId, role);
      if (started) return;
    }

    // If no client ID configured yet or popup needs configuration, open modal
    setGoogleTargetRole(role);
    setShowGoogleModal(true);
  };

  const executeGoogleAuth = async (email: string, fullName: string, role: string) => {
    if (!email || !email.includes('@')) {
      setError('Please provide a valid Google email address.');
      return;
    }
    setShowGoogleModal(false);
    setLoading(true);
    setError('');
    try {
      const res = await apiGoogleAuth({
        email: email.trim(),
        fullName: (fullName || email.split('@')[0]).trim(),
        role: role as any,
      });
      navigate(getRoleHome(res.role));
    } catch (err: any) {
      setError(err?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Field helpers ──────────────────────────────────────────────────────────
  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '10px 12px 10px 38px',
    background: focusedField === field ? '#FFFFFF' : '#F8FAFC',
    border: `1.5px solid ${focusedField === field ? '#2A7DE1' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: 10, fontSize: 13.5, color: '#1E293B',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif',
    transition: 'all 0.18s ease', boxSizing: 'border-box' as const, outline: 'none',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(42,125,225,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes ecgDraw {
          0%   { stroke-dashoffset: 1600; opacity: 0; }
          5%   { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes ecgIdle {
          0%,100% { opacity: 0.7; }
          50%     { opacity: 1; }
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%     { transform: scale(1.18); }
          28%     { transform: scale(1); }
          42%     { transform: scale(1.1); }
          56%     { transform: scale(1); }
        }
        @keyframes ringPulse {
          0%   { box-shadow: 0 0 0 0 rgba(42,125,225,0.35); }
          70%  { box-shadow: 0 0 0 12px rgba(42,125,225,0); }
          100% { box-shadow: 0 0 0 0 rgba(42,125,225,0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dotBlink { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes shimmerBar {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }

        html, body { height: 100%; margin: 0; padding: 0; }
        #root { height: 100%; }

        /* Root — macOS light, locked to viewport */
        .lp-root {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 460px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Helvetica Neue', Arial, sans-serif;
          background:
            radial-gradient(ellipse 55% 55% at 15% 25%, rgba(42,125,225,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 45% 45% at 88% 80%, rgba(79,209,197,0.06) 0%, transparent 60%),
            #F2F2F7;
          position: relative;
        }

        /* macOS-style window chrome line top */
        .lp-root::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #2A7DE1, #4FD1C5 40%, #22C55E 70%, #2A7DE1);
          background-size: 200% 100%;
          animation: shimmerBar 4s linear infinite;
          z-index: 100;
        }

        /* Subtle dot grid */
        .lp-root::after {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(42,125,225,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none; z-index: 0;
        }

        /* ── LEFT PANEL ── */
        .lp-left {
          padding: clamp(24px, 3.5vh, 48px) clamp(32px, 4vw, 60px);
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; z-index: 2; overflow: hidden;
        }

        /* Brand */
        .lp-brand {
          display: flex; align-items: center; gap: 12px;
          flex-shrink: 0;
        }
        .lp-brand-logo {
          width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0;
          background: linear-gradient(135deg, #1565C0 0%, #2A7DE1 50%, #4FD1C5 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(42,125,225,0.3);
          animation: ringPulse 3s ease-in-out infinite;
        }
        .lp-brand-logo svg { animation: heartbeat 2.8s ease-in-out infinite; }
        .lp-brand-name {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: 20px; font-weight: 800; color: #1E293B; letter-spacing: -0.3px;
        }
        .lp-brand-tag {
          font-size: 9.5px; font-weight: 700; letter-spacing: 1.4px;
          text-transform: uppercase; color: #2A7DE1; margin-top: 1px;
        }

        /* Badge */
        .lp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(42,125,225,0.08); border: 1px solid rgba(42,125,225,0.2);
          border-radius: 99px; padding: 4px 12px; width: fit-content; margin-bottom: 10px;
          font-size: 10px; font-weight: 700; color: #2A7DE1;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .lp-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #22C55E;
          animation: dotBlink 1.5s ease infinite; box-shadow: 0 0 5px rgba(34,197,94,0.5);
        }

        /* Hero */
        .lp-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 8px 0; }
        .lp-headline {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: clamp(32px, 4.5vw, 52px); font-weight: 900;
          color: #0F172A; line-height: 1.05; letter-spacing: -2px;
          margin-bottom: 10px;
        }
        .lp-headline-accent {
          display: block;
          background: linear-gradient(90deg, #2A7DE1 0%, #4FD1C5 50%, #22C55E 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-subtext {
          font-size: 14px; color: #64748B; line-height: 1.65;
          max-width: 400px; margin-bottom: 16px;
        }

        /* ECG */
        .lp-ecg-wrap { margin-bottom: 14px; }
        .lp-ecg-label {
          font-size: 9px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase;
          color: #94A3B8; display: flex; align-items: center; gap: 6px; margin-bottom: 5px;
        }
        .lp-ecg-dot { width: 5px; height: 5px; border-radius: 50%; background: #22C55E; animation: dotBlink 1.5s infinite; }

        /* Stats row */
        .lp-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px;
        }
        .lp-stat {
          background: #FFFFFF; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 12px; padding: 10px 8px; text-align: center;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
          cursor: default;
        }
        .lp-stat:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 6px 20px rgba(42,125,225,0.14);
          border-color: rgba(42,125,225,0.2);
        }
        .lp-stat-icon {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 5px;
        }
        .lp-stat-val {
          font-family: -apple-system, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: 16px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;
        }
        .lp-stat-lbl { font-size: 9.5px; color: #94A3B8; font-weight: 500; }

        /* Feature list */
        .lp-features { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
        .lp-feat {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 13px; border-radius: 12px;
          background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          cursor: default;
        }
        .lp-feat:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 16px rgba(42,125,225,0.1);
          border-color: rgba(42,125,225,0.18);
        }
        .lp-feat-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .lp-feat:hover .lp-feat-icon { transform: scale(1.1) rotate(-4deg); }
        .lp-feat-title { font-size: 13px; font-weight: 700; color: #1E293B; }
        .lp-feat-desc  { font-size: 11.5px; color: #94A3B8; margin-top: 1px; }

        /* Trust row */
        .lp-trust { display: flex; gap: 8px; flex-wrap: wrap; }
        .lp-trust-pill {
          display: flex; align-items: center; gap: 5px;
          font-size: 10px; color: #64748B; font-weight: 500;
          background: #FFFFFF; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 99px; padding: 4px 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        /* ── RIGHT PANEL ── */
        .lp-right {
          display: flex; align-items: center; justify-content: center;
          padding: clamp(16px, 2.5vh, 32px) clamp(20px, 2.5vw, 36px) clamp(16px, 2.5vh, 32px) 12px;
          position: relative; z-index: 2;
        }

        /* Auth Card */
        .lp-card {
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px) saturate(1.8);
          -webkit-backdrop-filter: blur(20px) saturate(1.8);
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 2px 8px rgba(0,0,0,0.06),
            0 8px 32px rgba(0,0,0,0.08),
            0 24px 64px rgba(0,0,0,0.06);
          overflow: hidden; position: relative;
          animation: slideIn 0.45s cubic-bezier(0.34,1.2,0.64,1);
        }
        /* Teal top accent */
        .lp-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2.5px;
          background: linear-gradient(90deg, #2A7DE1, #4FD1C5 40%, #22C55E);
          z-index: 10;
        }

        .lp-card-header { padding: 18px 24px 0; }
        .lp-card-body {
          padding: 0 24px 20px;
          overflow-y: auto; max-height: calc(100vh - 150px);
          scrollbar-width: thin; scrollbar-color: rgba(42,125,225,0.2) transparent;
        }
        .lp-card-body::-webkit-scrollbar { width: 3px; }
        .lp-card-body::-webkit-scrollbar-thumb { background: rgba(42,125,225,0.2); border-radius: 99px; }

        /* macOS Window Traffic Lights */
        .lp-mac-dots { display: flex; align-items: center; gap: 6px; }
        .lp-mac-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .lp-dot-red { background: #FF5F56; border: 0.5px solid #E0443E; }
        .lp-dot-yellow { background: #FFBD2E; border: 0.5px solid #DEA123; }
        .lp-dot-green { background: #27C93F; border: 0.5px solid #1AAB29; }

        /* Card top bar */
        .lp-card-topbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }

        /* Card logo */
        .lp-card-logo { display: flex; align-items: center; gap: 8px; }
        .lp-card-logo-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: linear-gradient(135deg, #2A7DE1, #4FD1C5);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(42,125,225,0.25);
        }
        .lp-card-logo-name {
          font-family: -apple-system, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: 14px; font-weight: 800; color: #1E293B;
        }

        /* Segment tabs — macOS style */
        .lp-tabs {
          display: flex; background: rgba(0,0,0,0.05); border-radius: 10px;
          padding: 3px; gap: 3px; margin-bottom: 18px;
        }
        .lp-tab {
          flex: 1; padding: 8px 6px; border: none; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          background: transparent; color: #64748B;
        }
        .lp-tab.active {
          background: #FFFFFF; color: #1E293B;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08);
        }
        .lp-tab:hover:not(.active) { color: #1E293B; background: rgba(255,255,255,0.5); }

        /* Error */
        .lp-error {
          background: #FEF2F2; border: 1px solid #FECACA;
          border-radius: 10px; padding: 9px 12px; font-size: 12.5px; color: #DC2626;
          margin-bottom: 12px; display: flex; align-items: center; gap: 7px;
          animation: fadeUp 0.2s ease;
        }

        /* Title */
        .lp-title {
          font-family: -apple-system, 'SF Pro Display', 'Outfit', sans-serif;
          font-size: 20px; font-weight: 800; color: #0F172A;
          letter-spacing: -0.3px; margin-bottom: 3px;
        }
        .lp-sub { font-size: 12.5px; color: #94A3B8; margin-bottom: 14px; }

        /* Persona accent */
        .lp-accent-bar { height: 2px; border-radius: 99px; margin-bottom: 12px; transition: background 0.5s ease; }

        /* Demo switcher */
        .lp-demo-row {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.7px;
          text-transform: uppercase; color: #94A3B8; margin-bottom: 7px;
        }
        .lp-portals-badge {
          font-size: 9.5px; font-weight: 700; color: #2A7DE1;
          background: rgba(42,125,225,0.08); border: 1px solid rgba(42,125,225,0.18);
          border-radius: 99px; padding: 2px 7px; text-transform: none; letter-spacing: 0;
        }
        .lp-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #22C55E; animation: dotBlink 1.5s infinite; display: inline-block; }

        /* Persona pills */
        .lp-persona-wrap {
          display: flex; flex-wrap: wrap; gap: 5px;
          background: #F8FAFC; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 12px; padding: 8px; margin-bottom: 14px;
        }
        .lp-pill {
          display: flex; align-items: center; gap: 4px; padding: 5px 10px;
          border-radius: 99px; font-size: 11.5px; font-weight: 600;
          border: 1.5px solid rgba(0,0,0,0.08); background: #FFFFFF;
          color: #475569; cursor: pointer; white-space: nowrap;
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .lp-pill:hover { border-color: rgba(42,125,225,0.35); color: #2A7DE1; transform: translateY(-1px); box-shadow: 0 3px 10px rgba(42,125,225,0.12); }
        .lp-pill.active {
          background: linear-gradient(135deg, var(--pill-color, #2A7DE1), #4FD1C5);
          color: #fff; border-color: transparent;
          box-shadow: 0 3px 12px rgba(42,125,225,0.3);
          transform: scale(1.06) translateY(-1px);
        }

        /* Fields */
        .lp-field { margin-bottom: 11px; }
        .lp-lbl {
          display: block; font-size: 11px; font-weight: 600; color: #64748B;
          margin-bottom: 5px; letter-spacing: 0.1px; transition: color 0.18s;
        }
        .lp-field.focused .lp-lbl { color: #2A7DE1; }
        .lp-input-wrap { position: relative; }
        .lp-input-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: #CBD5E1; display: flex; align-items: center;
          pointer-events: none; transition: color 0.18s;
        }
        .lp-field.focused .lp-input-icon { color: #2A7DE1; }
        .lp-inp {
          width: 100%; padding: 10px 12px 10px 36px;
          background: #F8FAFC; border: 1.5px solid rgba(0,0,0,0.1);
          border-radius: 10px; font-size: 13.5px; color: #1E293B;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
          transition: all 0.18s ease; box-sizing: border-box; outline: none;
        }
        .lp-inp::placeholder { color: #CBD5E1; }
        .lp-inp:focus {
          border-color: #2A7DE1; background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(42,125,225,0.1);
        }
        .lp-eye {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          color: #CBD5E1; background: none; border: none; cursor: pointer;
          display: flex; align-items: center; padding: 3px; border-radius: 6px;
          transition: color 0.18s;
        }
        .lp-eye:hover { color: #64748B; }

        /* Check row */
        .lp-chk-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .lp-chk-lbl { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #64748B; cursor: pointer; }
        .lp-chk-lbl input { accent-color: #2A7DE1; width: 13px; height: 13px; cursor: pointer; }
        .lp-forgot { font-size: 12px; color: #2A7DE1; font-weight: 600; background: none; border: none; cursor: pointer; padding: 0; transition: color 0.18s; }
        .lp-forgot:hover { color: #1565C0; }

        /* Submit button */
        .lp-submit {
          width: 100%; padding: 12px;
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700; color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: -apple-system, 'SF Pro Display', 'Outfit', sans-serif;
          background: linear-gradient(135deg, #1565C0 0%, #2A7DE1 50%, #4FD1C5 100%);
          box-shadow: 0 4px 16px rgba(42,125,225,0.38), 0 1px 0 rgba(255,255,255,0.2) inset;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          position: relative; overflow: hidden;
        }
        .lp-submit::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%);
          opacity: 0; transition: opacity 0.2s;
        }
        .lp-submit:hover::before { opacity: 1; }
        .lp-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(42,125,225,0.5), 0 1px 0 rgba(255,255,255,0.2) inset; }
        .lp-submit:active { transform: translateY(0) scale(0.99); }
        .lp-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none; }

        /* Ghost */
        .lp-ghost {
          width: 100%; padding: 10px;
          border: 1.5px solid rgba(0,0,0,0.1); border-radius: 12px;
          font-size: 12.5px; font-weight: 600; color: #64748B;
          background: transparent; cursor: pointer;
          font-family: -apple-system, 'Inter', sans-serif;
          transition: all 0.2s ease; margin-top: 8px;
        }
        .lp-ghost:hover { border-color: #2A7DE1; color: #2A7DE1; background: rgba(42,125,225,0.04); }

        /* 2-col */
        .lp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

        /* Role cards */
        .lp-role-lbl { font-size: 10px; font-weight: 700; letter-spacing: 0.7px; text-transform: uppercase; color: #94A3B8; display: block; margin-bottom: 7px; }
        .lp-role-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin-bottom: 12px; }
        .lp-role-card {
          border: 1.5px solid rgba(0,0,0,0.08); border-radius: 11px; padding: 10px 5px; text-align: center;
          cursor: pointer; background: #F8FAFC;
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .lp-role-card:hover { border-color: rgba(42,125,225,0.35); background: #EBF4FF; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(42,125,225,0.12); }
        .lp-role-card.active { border-color: #2A7DE1; background: #EBF4FF; box-shadow: 0 0 0 3px rgba(42,125,225,0.14); transform: scale(1.04); }
        .lp-role-ico { font-size: 18px; margin-bottom: 4px; }
        .lp-role-name { font-size: 11px; font-weight: 700; color: #1E293B; }
        .lp-role-desc { font-size: 9px; color: #94A3B8; margin-top: 1px; }

        /* Password strength */
        .lp-str-wrap { margin-bottom: 10px; }
        .lp-str-track { display: flex; gap: 3px; height: 4px; margin-bottom: 4px; }
        .lp-str-seg { flex: 1; border-radius: 99px; background: rgba(0,0,0,0.08); transition: background 0.3s ease; }
        .lp-str-lbl-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #94A3B8; }
        .lp-str-rules { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; margin-top: 5px; }
        .lp-str-rule { display: flex; align-items: center; gap: 4px; font-size: 10.5px; color: #CBD5E1; }
        .lp-str-rule.ok { color: #22C55E; }

        /* Terms */
        .lp-tlink { color: #2A7DE1; font-weight: 600; text-decoration: underline; cursor: pointer; background: none; border: none; font-size: inherit; font-family: inherit; padding: 0; }

        /* Success */
        .lp-success { background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 14px; padding: 20px 16px; text-align: center; animation: fadeUp 0.3s ease; }
        .lp-success-ico { width: 46px; height: 46px; background: linear-gradient(135deg,#22C55E,#059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }

        /* Shield footer */
        .lp-shield-row { display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 11px; color: #CBD5E1; margin-top: 12px; }

        /* Modal */
        .lp-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeUp 0.2s ease; }
        .lp-modal {
          background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1);
          border-radius: 20px; max-width: 440px; width: calc(100% - 40px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.2); animation: fadeUp 0.28s cubic-bezier(0.34,1.4,0.64,1); overflow: hidden;
        }
        .lp-modal::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg,#2A7DE1,#4FD1C5,#22C55E); }
        .lp-modal-head { padding: 18px 24px 14px; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; }
        .lp-modal-title { font-size: 17px; font-weight: 800; color: #1E293B; font-family: -apple-system, 'SF Pro Display', 'Outfit', sans-serif; }
        .lp-modal-close { width: 28px; height: 28px; border-radius: 8px; border: none; background: #F1F5F9; color: #64748B; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; }
        .lp-modal-close:hover { background: #E2E8F0; color: #1E293B; }
        .lp-modal-body { padding: 18px 24px; font-size: 13px; color: #64748B; line-height: 1.7; }
        .lp-modal-body strong { color: #1E293B; }
        .lp-modal-foot { padding: 12px 24px 20px; }

        .spin { animation: spin 0.9s linear infinite; }
        .fade-up { animation: fadeUp 0.28s ease; }

        /* Google Auth Button & Divider */
        .lp-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #FFFFFF;
          color: #1E293B;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          font-family: inherit;
        }
        .lp-google-btn:hover:not(:disabled) {
          background: #F8FAFC;
          border-color: #CBD5E1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }
        .lp-google-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .lp-google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lp-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 14px 0 12px;
          color: #94A3B8;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }
        .lp-divider::before,
        .lp-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #E2E8F0;
        }
        .lp-divider span {
          padding: 0 10px;
        }

        /* Google Modal Account Picker */
        .gmodal-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 12px 0 14px;
        }
        .gmodal-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.16s ease;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }
        .gmodal-item:hover {
          background: #F8FAFC;
          border-color: #2A7DE1;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(42, 125, 225, 0.08);
        }
        .gmodal-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13.5px;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        .gmodal-info {
          flex: 1;
          min-width: 0;
        }
        .gmodal-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gmodal-email {
          font-size: 11.5px;
          color: #64748B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gmodal-role-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #EFF6FF;
          color: #2A7DE1;
          border: 1px solid #BFDBFE;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
        }

        /* ── RESPONSIVE ── */

        /* Large screens — wider left */
        @media (min-width: 1400px) {
          .lp-root { grid-template-columns: 1fr 500px; }
          .lp-headline { font-size: 56px; }
        }

        /* Medium screens */
        @media (max-width: 1100px) {
          .lp-root { grid-template-columns: 1fr 420px; }
          .lp-headline { font-size: 38px; }
          .lp-features { gap: 6px; }
          .lp-feat { padding: 8px 11px; }
        }

        /* Small screens — hide left, show only card fullscreen */
        @media (max-width: 768px) {
          .lp-root { grid-template-columns: 1fr; background: #F2F2F7; }
          .lp-left { display: none; }
          .lp-right {
            padding: 24px 20px;
            align-items: flex-start;
            padding-top: 60px;
            overflow-y: auto;
          }
          .lp-card { max-width: 100%; }
          .lp-card-body { max-height: none; }
        }

        /* Medium/short viewports (standard 1366x768 or 1280x800 laptops) */
        @media (max-height: 780px) {
          .lp-left { padding: clamp(14px, 2vh, 24px) clamp(24px, 3.5vw, 44px); }
          .lp-hero { padding: 4px 0; }
          .lp-headline { font-size: clamp(28px, 3.8vw, 42px); margin-bottom: 6px; }
          .lp-subtext { font-size: 13px; line-height: 1.5; margin-bottom: 10px; }
          .lp-ecg-wrap { margin-bottom: 10px; }
          .lp-stats { margin-bottom: 10px; gap: 6px; }
          .lp-stat { padding: 7px 5px; }
          .lp-features { gap: 6px; margin-bottom: 10px; }
          .lp-feat { padding: 8px 10px; }
          .lp-card-header { padding: 14px 20px 0; }
          .lp-card-body { padding: 0 20px 14px; }
          .lp-tabs { margin-bottom: 12px; }
          .lp-field { margin-bottom: 8px; }
          .lp-inp { padding: 8px 12px 8px 34px; font-size: 13px; }
        }

        /* Very short viewports (screens under 680px height) */
        @media (max-height: 680px) {
          .lp-feat:nth-child(n+4) { display: none; }
          .lp-ecg-wrap { display: none; }
          .lp-subtext { display: none; }
          .lp-badge { margin-bottom: 4px; padding: 2px 10px; }
          .lp-stat-icon { display: none; }
          .lp-stat { padding: 5px 4px; }
          .lp-feat-desc { display: none; }
          .lp-feat { padding: 6px 10px; }
        }
      `}</style>

      <div className="lp-root">

        {/* ════════ LEFT PANEL ════════ */}
        <div className="lp-left">

          {/* Brand */}
          <div className="lp-brand">
            <div className="lp-brand-logo">
              <HeartPulse size={22} color="#fff" />
            </div>
            <div>
              <div className="lp-brand-name">MediFlow AI</div>
              <div className="lp-brand-tag">Health Portal</div>
            </div>
          </div>

          {/* Hero section */}
          <div className="lp-hero">
            <div className="lp-badge">
              <span className="lp-badge-dot" />
              <Sparkles size={9} />
              AI-Powered Healthcare
            </div>

            <div className="lp-headline">
              Smart Healthcare<br />
              <span className="lp-headline-accent">At Your Fingertips</span>
            </div>

            <div className="lp-subtext">
              Connect with certified specialists, manage appointments, and receive digital prescriptions — all in one secure AI platform.
            </div>

            {/* ECG */}
            <div className="lp-ecg-wrap">
              <div className="lp-ecg-label">
                <span className="lp-ecg-dot" />
                Live System Status — All AI Agents Operational
              </div>
              <EcgLine />
            </div>

            {/* Stats */}
            <div className="lp-stats">
              {STATS.map(s => (
                <div key={s.label} className="lp-stat">
                  <div className="lp-stat-icon" style={{ background: `${s.color}14`, border: `1px solid ${s.color}22` }}>
                    <s.icon size={13} color={s.color} />
                  </div>
                  <div className="lp-stat-val">{s.value}</div>
                  <div className="lp-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            <div className="lp-features">
              {FEATURE_ROWS.map((f) => (
                <div key={f.title} className="lp-feat">
                  <div className="lp-feat-icon" style={{ background: f.bg, border: `1px solid ${f.color}20` }}>
                    <f.icon size={16} color={f.color} />
                  </div>
                  <div>
                    <div className="lp-feat-title">{f.title}</div>
                    <div className="lp-feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="lp-trust">
            <div className="lp-trust-pill">
              <ShieldCheck size={10} color="#22C55E" /> 256-bit JWT
            </div>
            <div className="lp-trust-pill">
              <ShieldCheck size={10} color="#2A7DE1" /> RBAC Secured
            </div>
            <div className="lp-trust-pill">
              <ShieldCheck size={10} color="#7C3AED" /> HIPAA Aligned
            </div>
          </div>
        </div>

        {/* ════════ RIGHT PANEL ════════ */}
        <div className="lp-right">
          <div className="lp-card">

            {/* Card header */}
            <div className="lp-card-header">
              <div className="lp-card-topbar">
                <div className="lp-mac-dots" title="macOS Window">
                  <span className="lp-mac-dot lp-dot-red" />
                  <span className="lp-mac-dot lp-dot-yellow" />
                  <span className="lp-mac-dot lp-dot-green" />
                </div>
                <div className="lp-card-logo">
                  <div className="lp-card-logo-icon">
                    <HeartPulse size={15} color="#fff" />
                  </div>
                  <div className="lp-card-logo-name">MediFlow AI</div>
                </div>
                <div style={{ width: 44 }} />
              </div>

              <div className="lp-tabs">
                <button className={`lp-tab ${tab === 'login' ? 'active' : ''}`}
                  onClick={() => { setTab('login'); setError(''); }} id="tab-signin">
                  Sign In
                </button>
                <button className={`lp-tab ${tab === 'register' ? 'active' : ''}`}
                  onClick={() => { setTab('register'); setError(''); }} id="tab-register">
                  Register
                </button>
              </div>
            </div>

            <div className="lp-card-body">
              {error && (
                <div className="lp-error">
                  <XCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* ── LOGIN ── */}
              {tab === 'login' && (
                <div className="fade-up">
                  <div className="lp-title">Welcome back 👋</div>
                  <div className="lp-sub">Sign in to access your MediFlow AI portal</div>

                  <div className="lp-accent-bar" style={{ background: `linear-gradient(90deg, ${persona.color}, #4FD1C5)` }} />

                  <div className="lp-demo-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span className="lp-live-dot" /> Quick Demo — Pick a Role
                    </span>
                    <span className="lp-portals-badge">7 Portals</span>
                  </div>

                  <div className="lp-persona-wrap">
                    {DEMO_PERSONAS.map(p => (
                      <button key={p.role} type="button"
                        className={`lp-pill ${selectedPersona === p.role ? 'active' : ''}`}
                        style={{ '--pill-color': p.color } as any}
                        onClick={() => applyPersona(p)}
                        id={`persona-${p.role.toLowerCase()}`}>
                        <span>{p.icon}</span><span>{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleLogin} autoComplete="on">
                    <div className={`lp-field ${focusedField === 'email' ? 'focused' : ''}`}>
                      <label className="lp-lbl">Email Address</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Mail size={14} /></span>
                        <input id="login-email" className="lp-inp" type="email" placeholder="name@mediflow.lk"
                          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                          onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')}
                          autoComplete="email" required />
                      </div>
                    </div>

                    <div className={`lp-field ${focusedField === 'password' ? 'focused' : ''}`}>
                      <label className="lp-lbl">Password</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Lock size={14} /></span>
                        <input id="login-password" className="lp-inp" type={showPass ? 'text' : 'password'}
                          placeholder="••••••••" value={form.password}
                          onChange={e => setForm({ ...form, password: e.target.value })}
                          onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')}
                          style={{ paddingRight: 40 }} autoComplete="current-password" required />
                        <button type="button" className="lp-eye" onClick={() => setShowPass(!showPass)}>
                          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="lp-chk-row">
                      <label className="lp-chk-lbl">
                        <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                        <span>Remember me</span>
                      </label>
                      <button type="button" className="lp-forgot" onClick={() => { setTab('forgot'); setError(''); }}>
                        Forgot password?
                      </button>
                    </div>

                    <button type="submit" className="lp-submit" disabled={loading} id="login-submit-btn">
                      {loading
                        ? <><Loader size={15} className="spin" /> Authenticating...</>
                        : <>{persona.icon} Sign in as {selectedPersona} <ArrowRight size={15} /></>}
                    </button>
                  </form>

                  <div className="lp-divider">
                    <span>or continue with</span>
                  </div>

                  <button
                    type="button"
                    className="lp-google-btn"
                    onClick={() => handleGoogleAuth('Patient')}
                    id="google-signin-btn"
                    disabled={loading}
                  >
                    <GoogleIcon size={18} />
                    <span>Sign in with Google</span>
                  </button>

                  <div className="lp-shield-row">
                    <ShieldCheck size={11} color="#22C55E" />
                    Protected by 256-bit JWT &amp; Supabase PostgreSQL
                  </div>
                </div>
              )}

              {/* ── REGISTER ── */}
              {tab === 'register' && (
                <div className="fade-up">
                  <div className="lp-title">Create Account ✨</div>
                  <div className="lp-sub">Register to access channeling &amp; prescriptions</div>

                  <label className="lp-role-lbl">Account Type</label>
                  <div className="lp-role-grid">
                    {[
                      { role: 'Patient',    icon: '👤', name: 'Patient',    desc: 'Book & Prescriptions' },
                      { role: 'Doctor',     icon: '🩺', name: 'Doctor',     desc: 'Consultations & CDS' },
                      { role: 'Pharmacist', icon: '💊', name: 'Pharmacist', desc: 'Dispensing & Orders' },
                    ].map(r => (
                      <div key={r.role} id={`role-card-${r.role.toLowerCase()}`}
                        className={`lp-role-card ${form.role === r.role ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, role: r.role })}>
                        <div className="lp-role-ico">{r.icon}</div>
                        <div className="lp-role-name">{r.name}</div>
                        <div className="lp-role-desc">{r.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Google Sign Up Button */}
                  <button
                    type="button"
                    className="lp-google-btn"
                    onClick={() => handleGoogleAuth(form.role)}
                    id="google-signup-btn"
                    disabled={loading}
                  >
                    <GoogleIcon size={18} />
                    <span>Sign up with Google as {form.role}</span>
                  </button>

                  <div className="lp-divider">
                    <span>or register with email</span>
                  </div>

                  <form onSubmit={handleRegister} autoComplete="on">
                    <div className={`lp-field ${focusedField === 'name' ? 'focused' : ''}`}>
                      <label className="lp-lbl">Full Name</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><User size={14} /></span>
                        <input id="reg-name" className="lp-inp" type="text" placeholder="Dilshan Pasindu"
                          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')}
                          autoComplete="name" required />
                      </div>
                    </div>

                    <div className="lp-grid2">
                      <div className={`lp-field ${focusedField === 'reg-email' ? 'focused' : ''}`}>
                        <label className="lp-lbl">Email</label>
                        <div className="lp-input-wrap">
                          <span className="lp-input-icon"><Mail size={14} /></span>
                          <input id="reg-email" className="lp-inp" type="email" placeholder="you@email.com"
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                            onFocus={() => setFocusedField('reg-email')} onBlur={() => setFocusedField('')}
                            autoComplete="email" required />
                        </div>
                      </div>
                      <div className={`lp-field ${focusedField === 'phone' ? 'focused' : ''}`}>
                        <label className="lp-lbl">Phone</label>
                        <div className="lp-input-wrap">
                          <span className="lp-input-icon"><Phone size={14} /></span>
                          <input id="reg-phone" className="lp-inp" type="tel" placeholder="+94 77 123 4567"
                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                            onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')}
                            autoComplete="tel" required />
                        </div>
                      </div>
                    </div>

                    <div className={`lp-field ${focusedField === 'reg-pass' ? 'focused' : ''}`} style={{ marginBottom: 6 }}>
                      <label className="lp-lbl">Create Password</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Lock size={14} /></span>
                        <input id="reg-password" className="lp-inp" type={showPass ? 'text' : 'password'}
                          placeholder="Min 8 chars, uppercase, number"
                          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                          onFocus={() => setFocusedField('reg-pass')} onBlur={() => setFocusedField('')}
                          style={{ paddingRight: 40 }} autoComplete="new-password" required />
                        <button type="button" className="lp-eye" onClick={() => setShowPass(!showPass)}>
                          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {form.password && (
                      <div className="lp-str-wrap">
                        <div className="lp-str-track">
                          {[1,2,3,4].map(n => (
                            <div key={n} className="lp-str-seg" style={{ background: pScore >= n ? pColor : undefined }} />
                          ))}
                        </div>
                        <div className="lp-str-lbl-row">
                          <span>Password Strength</span>
                          <span style={{ color: pColor, fontWeight: 700 }}>{pLabel}</span>
                        </div>
                        <div className="lp-str-rules">
                          {[
                            { ok: pCrit.len, lbl: '8+ Characters' },
                            { ok: pCrit.up && pCrit.lo, lbl: 'Upper & Lower' },
                            { ok: pCrit.num, lbl: 'Number' },
                            { ok: pCrit.sym, lbl: 'Special Symbol' },
                          ].map((r, i) => (
                            <div key={i} className={`lp-str-rule ${r.ok ? 'ok' : ''}`}>
                              {r.ok ? <CheckCircle2 size={10} /> : <XCircle size={10} />} {r.lbl}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`lp-field ${focusedField === 'confirm' ? 'focused' : ''}`} style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <label className="lp-lbl" style={{ marginBottom: 0 }}>Confirm Password</label>
                        {form.confirmPassword && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: pMatch ? '#22C55E' : '#EF4444', display: 'flex', alignItems: 'center', gap: 3 }}>
                            {pMatch ? <><CheckCircle2 size={10} /> Match</> : <><XCircle size={10} /> Mismatch</>}
                          </span>
                        )}
                      </div>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Lock size={14} /></span>
                        <input id="reg-confirm" className="lp-inp" type={showConf ? 'text' : 'password'}
                          placeholder="Re-enter password"
                          value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                          onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField('')}
                          style={{ paddingRight: 40 }} autoComplete="new-password" required />
                        <button type="button" className="lp-eye" onClick={() => setShowConf(!showConf)}>
                          {showConf ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label className="lp-chk-lbl" style={{ fontSize: 12, color: '#64748B' }}>
                        <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
                        <span>I agree to the{' '}
                          <button className="lp-tlink" onClick={e => { e.preventDefault(); setShowTerms(true); }}>Terms of Service</button>
                          {' '}&amp; Privacy Policy
                        </span>
                      </label>
                    </div>

                    <button type="submit" className="lp-submit" disabled={loading || !pMatch || !agreeTerms} id="register-submit-btn">
                      {loading
                        ? <><Loader size={15} className="spin" /> Creating Account...</>
                        : <>Create {form.role} Account <ArrowRight size={15} /></>}
                    </button>
                  </form>
                </div>
              )}

              {/* ── FORGOT ── */}
              {tab === 'forgot' && (
                <div className="fade-up">
                  <div className="lp-title">Reset Password 🔑</div>
                  <div className="lp-sub">Enter your email to receive a secure reset link</div>

                  {forgotSent ? (
                    <div className="lp-success">
                      <div className="lp-success-ico"><CheckCircle2 size={22} color="#fff" /></div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', marginBottom: 5, fontFamily: '-apple-system, "SF Pro Display", "Outfit", sans-serif' }}>Reset Link Sent!</div>
                      <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.6 }}>
                        We dispatched a secure link to{' '}
                        <strong style={{ color: '#1E293B' }}>{forgotEmail}</strong>. Check your inbox.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleForgot}>
                      <div className={`lp-field ${focusedField === 'forgot-email' ? 'focused' : ''}`}>
                        <label className="lp-lbl">Account Email</label>
                        <div className="lp-input-wrap">
                          <span className="lp-input-icon"><Mail size={14} /></span>
                          <input id="forgot-email" className="lp-inp" type="email" placeholder="your.email@mediflow.lk"
                            value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                            onFocus={() => setFocusedField('forgot-email')} onBlur={() => setFocusedField('')} required />
                        </div>
                      </div>
                      <button type="submit" className="lp-submit" disabled={loading} id="forgot-submit-btn">
                        {loading ? <><Loader size={15} className="spin" /> Sending...</> : 'Send Reset Instructions'}
                      </button>
                    </form>
                  )}
                  <button className="lp-ghost" onClick={() => { setTab('login'); setForgotSent(false); setError(''); }}>
                    ← Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TERMS MODAL ── */}
      {showTerms && (
        <div className="lp-overlay" onClick={() => setShowTerms(false)}>
          <div className="lp-modal" onClick={e => e.stopPropagation()}>
            <div className="lp-modal-head">
              <div className="lp-modal-title">Terms of Service &amp; Privacy</div>
              <button className="lp-modal-close" onClick={() => setShowTerms(false)}>✕</button>
            </div>
            <div className="lp-modal-body">
              <p style={{ marginBottom: 12 }}><strong>1. Healthcare AI Disclaimer:</strong> MediFlow AI provides recommendation assistance for doctor channeling and clinical decision support. All final medical decisions remain under the authority of certified medical professionals.</p>
              <p style={{ marginBottom: 12 }}><strong>2. Data Security:</strong> Patient data and e-prescriptions are encrypted using industry-standard protocols in compliance with medical data privacy guidelines.</p>
              <p><strong>3. Role-Based Access:</strong> Your login credentials grant access only to your authorized portal. Unauthorized access is prohibited.</p>
            </div>
            <div className="lp-modal-foot">
              <button className="lp-submit" onClick={() => { setAgreeTerms(true); setShowTerms(false); }}>
                <CheckCircle2 size={15} /> I Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GOOGLE ACCOUNT PICKER MODAL ── */}
      {showGoogleModal && (
        <div className="lp-overlay" onClick={() => setShowGoogleModal(false)}>
          <div className="lp-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="lp-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <GoogleIcon size={22} />
                <div className="lp-modal-title">Sign in with Google</div>
              </div>
              <button className="lp-modal-close" onClick={() => setShowGoogleModal(false)}>✕</button>
            </div>
            <div className="lp-modal-body">
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                  Connect Live Google OAuth (accounts.google.com)
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8, lineHeight: 1.4 }}>
                  Enter your Google Cloud OAuth Client ID to launch the live Google popup directly:
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                    className="lp-inp"
                    style={{ padding: '7px 10px', fontSize: 12, flex: 1 }}
                    value={inputClientId}
                    onChange={e => setInputClientId(e.target.value)}
                  />
                  <button
                    type="button"
                    className="lp-submit"
                    style={{ width: 'auto', padding: '7px 12px', fontSize: 11.5, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      if (!inputClientId.trim()) {
                        setError('Please enter a Google Client ID');
                        return;
                      }
                      localStorage.setItem('mediflow_google_client_id', inputClientId.trim());
                      setGoogleClientId(inputClientId.trim());
                      setShowGoogleModal(false);
                      triggerRealGooglePopup(inputClientId.trim(), googleTargetRole);
                    }}
                  >
                    Open Live Popup
                  </button>
                </div>
              </div>

              <div className="lp-divider" style={{ margin: '10px 0' }}>
                <span>or quick sign-in</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#334155' }}>
                  Choose account to continue to <strong>MediFlow AI</strong>
                </span>
                <span className="gmodal-role-tag">
                  Role: {googleTargetRole}
                </span>
              </div>

              <div className="gmodal-list">
                <button
                  type="button"
                  className="gmodal-item"
                  onClick={() => executeGoogleAuth('dilshan.pasindu@gmail.com', 'Dilshan Pasindu', googleTargetRole)}
                  id="gmodal-acc-1"
                >
                  <div className="gmodal-avatar" style={{ background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)' }}>DP</div>
                  <div className="gmodal-info">
                    <div className="gmodal-name">Dilshan Pasindu</div>
                    <div className="gmodal-email">dilshan.pasindu@gmail.com</div>
                  </div>
                </button>

                <button
                  type="button"
                  className="gmodal-item"
                  onClick={() => executeGoogleAuth('nimal.perera@gmail.com', 'Dr. Nimal Perera', googleTargetRole)}
                  id="gmodal-acc-2"
                >
                  <div className="gmodal-avatar" style={{ background: 'linear-gradient(135deg, #059669, #34D399)' }}>NP</div>
                  <div className="gmodal-info">
                    <div className="gmodal-name">Dr. Nimal Perera</div>
                    <div className="gmodal-email">nimal.perera@gmail.com</div>
                  </div>
                </button>

                {!showCustomGoogleInput ? (
                  <button
                    type="button"
                    className="gmodal-item"
                    onClick={() => setShowCustomGoogleInput(true)}
                    id="gmodal-acc-custom-toggle"
                    style={{ borderStyle: 'dashed', background: '#F8FAFC' }}
                  >
                    <div className="gmodal-avatar" style={{ background: '#94A3B8' }}>
                      <Plus size={16} />
                    </div>
                    <div className="gmodal-info">
                      <div className="gmodal-name">Use another Google account</div>
                      <div className="gmodal-email">Enter a custom email address</div>
                    </div>
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      executeGoogleAuth(customGoogleEmail, customGoogleName, googleTargetRole);
                    }}
                    style={{ background: '#F8FAFC', padding: 12, borderRadius: 12, border: '1px solid #CBD5E1' }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Enter Google Account Info</div>
                    <input
                      type="text"
                      placeholder="Your Full Name (e.g. Dilshan Pasindu)"
                      className="lp-inp"
                      style={{ paddingLeft: 12, marginBottom: 8 }}
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Google Email (e.g. name@gmail.com)"
                      className="lp-inp"
                      style={{ paddingLeft: 12, marginBottom: 10 }}
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      required
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="lp-ghost"
                        style={{ flex: 1, padding: 8 }}
                        onClick={() => setShowCustomGoogleInput(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="lp-submit"
                        style={{ flex: 2, padding: 8 }}
                        id="gmodal-custom-submit"
                      >
                        Continue with Google
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.5, marginTop: 10 }}>
                To continue, Google will securely share your name, email address, and profile picture with MediFlow AI in compliance with medical data privacy guidelines.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
