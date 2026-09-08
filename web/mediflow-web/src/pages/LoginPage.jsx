import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse, Eye, EyeOff, ArrowRight, Loader,
  CheckCircle2, XCircle, ShieldCheck, Mail, Lock,
  User, Phone
} from 'lucide-react';
import { apiLogin, apiRegister } from '../services/api';

const DEMO_PERSONAS = [
  { role: 'Patient',       label: 'Patient',      email: 'dilshan@gmail.com',            password: 'Test@123',   icon: '👤', color: '#0EA5E9' },
  { role: 'Doctor',        label: 'Doctor',        email: 'nimal.perera@mediflow.lk',     password: 'Doctor@123', icon: '🩺', color: '#10B981' },
  { role: 'Receptionist',  label: 'Receptionist',  email: 'receptionist@mediflow.lk',     password: 'Staff@123',  icon: '👩‍💼', color: '#8B5CF6' },
  { role: 'Pharmacist',    label: 'Pharmacist',    email: 'pharmacist@mediflow.lk',       password: 'Staff@123',  icon: '💊', color: '#F59E0B' },
  { role: 'PharmacyOwner', label: 'Owner',         email: 'owner@mediflow.lk',            password: 'Staff@123',  icon: '🏥', color: '#EF4444' },
  { role: 'Supplier',      label: 'Supplier',      email: 'supplier@mediflow.lk',         password: 'Staff@123',  icon: '🚚', color: '#06B6D4' },
  { role: 'Administrator', label: 'Admin',         email: 'admin@mediflow.lk',            password: 'Admin@123',  icon: '🛡️', color: '#64748B' },
];

const FEATURES = [
  { icon: '🩺', text: 'Find & book certified specialists instantly' },
  { icon: '📅', text: 'Manage appointments in real-time' },
  { icon: '💊', text: 'Secure digital e-prescription management' },
  { icon: '🧠', text: 'AI-powered clinical decision support' },
];

function getRoleHome(role) {
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

/* ── Static ECG — draws once then gently pulses ── */
function EcgCanvas() {
  return (
    <svg viewBox="0 0 800 56" style={{ width: '100%', height: 56, display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ecgG2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(14,165,233,0)" />
          <stop offset="15%"  stopColor="#0EA5E9" stopOpacity="0.7" />
          <stop offset="45%"  stopColor="#14B8A6" stopOpacity="0.9" />
          <stop offset="75%"  stopColor="#0EA5E9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgba(20,184,166,0)" />
        </linearGradient>
        <filter id="ecgGlow2">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Grid baseline */}
      <line x1="0" y1="28" x2="800" y2="28" stroke="rgba(14,165,233,0.08)" strokeWidth="1" strokeDasharray="4 6" />
      {/* Main ECG — draws once, then steady glow */}
      <path
        d="M0,28 L70,28 L90,28 L105,7 L120,49 L135,7 L150,49 L165,28 L220,28 L260,28 L275,17 L290,39 L305,28 L390,28 L415,28 L430,4 L445,52 L460,4 L475,52 L490,28 L560,28 L590,28 L605,13 L620,43 L635,28 L720,28 L800,28"
        fill="none"
        stroke="url(#ecgG2)"
        strokeWidth="2.2"
        strokeLinecap="round"
        filter="url(#ecgGlow2)"
        className="ecg-main-line"
      />
    </svg>
  );
}

/* ── Soft background orb ── */
function Orb({ size, x, y, color, delay, dur }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      background: `radial-gradient(circle at 35% 35%, ${color}28 0%, ${color}06 60%, transparent 100%)`,
      animation: `orbFloat ${dur}s ease-in-out ${delay}s infinite`,
    }} />
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab]               = useState('login');
  const [selectedPersona, setSelected] = useState('Patient');
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTerms, setShowTerms]   = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [form, setForm] = useState({
    name: '', email: 'dilshan@gmail.com', password: 'Test@123',
    confirmPassword: '', phone: '', role: 'Patient'
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

  const pLabel = { 0: 'Weak', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' }[pScore];
  const pClass = { 0: 'pw-weak', 1: 'pw-weak', 2: 'pw-fair', 3: 'pw-good', 4: 'pw-strong' }[pScore];
  const pMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

  const persona = DEMO_PERSONAS.find(p => p.role === selectedPersona) || DEMO_PERSONAS[0];

  const applyPersona = (p) => {
    setSelected(p.role);
    setForm(f => ({ ...f, email: p.email, password: p.password }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const d = await apiLogin(form.email, form.password); navigate(getRoleHome(d.role)); }
    catch (err) { setError(err.message || 'Login failed. Please verify credentials.'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (pScore < 2) { setError('Please choose a stronger password.'); return; }
    if (!agreeTerms) { setError('You must agree to the Terms of Service.'); return; }
    setLoading(true);
    try { await apiRegister(form.name, form.email, form.password, form.phone, form.role); navigate('/dashboard'); }
    catch (err) { setError(err.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail) { setError('Please enter your email.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setForgotSent(true); }, 800);
  };

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(10px,-18px) scale(1.05); }
          70%     { transform: translate(-8px,12px) scale(0.96); }
        }
        @keyframes ecgDraw {
          0%   { stroke-dashoffset: 1800; opacity: 0; }
          5%   { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes ecgIdle {
          0%,100% { opacity: 0.85; }
          50%     { opacity: 1; }
        }
        .ecg-main-line {
          stroke-dasharray: 1800;
          stroke-dashoffset: 1800;
          animation: ecgDraw 2.6s cubic-bezier(0.4,0,0.2,1) forwards, ecgIdle 3s ease 2.7s infinite;
        }
        @keyframes heartPulse {
          0%,100% { transform: scale(1); }
          15%     { transform: scale(1.2); }
          30%     { transform: scale(1); }
          45%     { transform: scale(1.12); }
          60%     { transform: scale(1); }
        }
        @keyframes ringPulse {
          0%   { box-shadow: 0 0 0 0 rgba(14,165,233,0.45); }
          70%  { box-shadow: 0 0 0 14px rgba(14,165,233,0); }
          100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(14px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes spin {
          from { transform:rotate(0deg); } to { transform:rotate(360deg); }
        }
        @keyframes dotBlink {
          0%,100% { opacity:0.35; } 50% { opacity:1; }
        }
        @keyframes cardEntrance {
          from { opacity:0; transform: translateX(24px); }
          to   { opacity:1; transform: translateX(0); }
        }

        /* ── Root ── */
        .lp-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 540px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          /* Lighter, softer blue-teal gradient */
          background:
            radial-gradient(ellipse 70% 60% at 8% 15%,  rgba(14,165,233,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 55% 65% at 90% 85%,  rgba(13,148,136,0.16) 0%, transparent 65%),
            radial-gradient(ellipse 40% 50% at 45% 45%, rgba(56,189,248,0.08) 0%, transparent 70%),
            linear-gradient(150deg, #0C1E2E 0%, #0E2238 30%, #0B2532 65%, #0A1D2A 100%);
        }

        /* subtle grid */
        .lp-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none; z-index: 0;
        }

        /* ── LEFT ── */
        .lp-left {
          padding: 44px 52px 44px 52px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        /* Brand */
        .lp-brand-row { display: flex; align-items: center; gap: 14px; }
        .lp-brand-logo {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #0369A1 0%, #0D9488 100%);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          animation: ringPulse 2.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        .lp-brand-logo svg { animation: heartPulse 2.8s ease-in-out infinite; }
        .lp-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 25px; font-weight: 900;
          color: #fff; letter-spacing: -0.4px;
        }
        .lp-brand-tag {
          font-size: 10.5px; font-weight: 700;
          color: #38BDF8; letter-spacing: 1.2px;
          text-transform: uppercase; margin-top: 2px;
        }

        /* Hero */
        .lp-hero-center {
          flex: 1;
          display: flex; flex-direction: column; justify-content: center;
          padding: 16px 0;
        }
        .lp-headline {
          font-family: 'Outfit', sans-serif;
          font-size: 46px; font-weight: 900;
          color: #fff; line-height: 1.1;
          letter-spacing: -1.5px; margin-bottom: 16px;
        }
        /* Static gradient — NO animation */
        .lp-headline-accent {
          display: block;
          background: linear-gradient(90deg, #38BDF8 0%, #34D399 55%, #0EA5E9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-subtext {
          font-size: 15px; color: rgba(255,255,255,0.52);
          line-height: 1.75; max-width: 390px;
          margin-bottom: 28px;
        }

        /* ECG strip */
        .lp-ecg-wrap { margin-bottom: 28px; }
        .lp-ecg-bar {
          font-size: 10px; font-weight: 700; letter-spacing: 1.4px;
          text-transform: uppercase; color: rgba(14,165,233,0.55);
          display: flex; align-items: center; gap: 7px;
          margin-bottom: 7px;
        }
        .lp-ecg-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #34D399;
          display: inline-block;
          animation: dotBlink 1.6s ease infinite;
        }

        /* Features */
        .lp-features { display: flex; flex-direction: column; gap: 11px; margin-bottom: 32px; }
        .lp-feat-item {
          display: flex; align-items: center; gap: 13px;
          font-size: 14px; color: rgba(255,255,255,0.65);
        }
        .lp-feat-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          transition: all 0.28s ease;
        }
        .lp-feat-item:hover .lp-feat-icon-wrap {
          background: rgba(14,165,233,0.18);
          border-color: rgba(14,165,233,0.38);
          transform: scale(1.08);
        }

        /* Trust */
        .lp-trust {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; color: rgba(255,255,255,0.32);
        }
        .lp-quote {
          font-size: 13px; font-style: italic;
          color: rgba(255,255,255,0.28);
          border-left: 2px solid rgba(14,165,233,0.3);
          padding-left: 14px; margin-bottom: 16px;
          max-width: 320px;
        }

        /* ── RIGHT PANEL ── */
        .lp-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 40px 32px 20px;
          position: relative;
          z-index: 2;
        }

        /* ── CARD — lighter glass tone, blends with background ── */
        .lp-card {
          width: 100%;
          max-width: 470px;
          /* Lighter glass: more white opacity than bg but still translucent */
          background: rgba(255,255,255,0.13);
          backdrop-filter: blur(28px) saturate(1.6) brightness(1.18);
          -webkit-backdrop-filter: blur(28px) saturate(1.6) brightness(1.18);
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow:
            0 0 0 1px rgba(14,165,233,0.15),
            0 8px 32px rgba(0,0,0,0.28),
            0 32px 80px rgba(0,0,0,0.30),
            0 1px 0 rgba(255,255,255,0.18) inset;
          overflow: hidden;
          position: relative;
          animation: cardEntrance 0.45s cubic-bezier(0.34,1.2,0.64,1);
        }
        /* Top teal accent bar */
        .lp-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #0369A1, #0EA5E9 40%, #14B8A6 70%, #0D9488);
          z-index: 10;
        }

        .lp-card-header { padding: 28px 32px 0; }
        .lp-card-body {
          padding: 0 32px 32px;
          max-height: 70vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #E2E8F0 transparent;
        }
        .lp-card-body::-webkit-scrollbar { width: 4px; }
        .lp-card-body::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 99px; }

        /* Card logo */
        .lp-card-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .lp-card-logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #0369A1, #0D9488);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-card-logo-name {
          font-family: 'Outfit', sans-serif;
          font-size: 17px; font-weight: 800; color: rgba(255,255,255,0.95);
        }

        /* Tabs */
        .lp-tabs {
          display: flex;
          background: rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 4px; gap: 4px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .lp-tab {
          flex: 1; padding: 10px 8px;
          border: none; border-radius: 9px;
          font-size: 13.5px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.22s ease;
          background: transparent;
          color: rgba(255,255,255,0.45);
        }
        .lp-tab.active {
          background: linear-gradient(135deg, #0369A1, #0D9488);
          color: #fff;
          box-shadow: 0 2px 10px rgba(3,105,161,0.45);
        }

        /* Error */
        .lp-error {
          background: rgba(239,68,68,0.18);
          border: 1.5px solid rgba(239,68,68,0.35);
          border-radius: 11px;
          padding: 10px 14px;
          font-size: 13px; color: #FCA5A5;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
          animation: fadeUp 0.2s ease;
        }

        /* Titles */
        .lp-title {
          font-family: 'Outfit', sans-serif;
          font-size: 24px; font-weight: 800;
          color: rgba(255,255,255,0.95); letter-spacing: -0.4px; margin-bottom: 4px;
        }
        .lp-sub {
          font-size: 13px; color: rgba(255,255,255,0.5);
          margin-bottom: 20px; line-height: 1.5;
        }

        /* Persona accent */
        .lp-persona-accent { height: 3px; border-radius: 99px; margin-bottom: 14px; transition: background 0.5s ease; }

        /* Demo switcher */
        .lp-demo-lbl {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; color: rgba(255,255,255,0.38);
          margin-bottom: 8px;
        }
        .lp-dot { width:6px; height:6px; border-radius:50%; background:#34D399; animation: dotBlink 1.6s infinite; display:inline-block; }
        .lp-persona-wrap {
          display: flex; flex-wrap: wrap; gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 10px;
          margin-bottom: 20px;
        }
        .lp-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 99px;
          font-size: 12px; font-weight: 600;
          border: 1.5px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
          white-space: nowrap;
        }
        .lp-pill:hover { border-color: rgba(56,189,248,0.5); color: #38BDF8; background: rgba(56,189,248,0.1); transform: translateY(-1px); }
        .lp-pill.active {
          background: linear-gradient(135deg, #0369A1, #0D9488);
          color: #fff; border-color: transparent;
          box-shadow: 0 3px 10px rgba(3,105,161,0.4);
          transform: scale(1.06) translateY(-1px);
        }

        /* Fields */
        .lp-field { margin-bottom: 14px; }
        .lp-lbl { display:block; font-size:12px; font-weight:600; color:rgba(255,255,255,0.6); margin-bottom:6px; letter-spacing:0.2px; }
        .lp-input-wrap { position:relative; }
        .lp-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3); display:flex; align-items:center; pointer-events:none; }
        .lp-inp {
          width: 100%;
          padding: 12px 14px 12px 40px;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          font-size: 14px; color: rgba(255,255,255,0.92);
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          box-sizing: border-box; outline: none;
        }
        .lp-inp::placeholder { color: rgba(255,255,255,0.22); }
        .lp-inp:focus {
          border-color: rgba(14,165,233,0.65);
          background: rgba(14,165,233,0.1);
          box-shadow: 0 0 0 3px rgba(14,165,233,0.14);
        }
        .lp-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3); background:none; border:none; cursor:pointer; display:flex; align-items:center; transition:color 0.2s; padding:2px; }
        .lp-eye:hover { color: rgba(255,255,255,0.75); }

        /* Check row */
        .lp-chk-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .lp-chk-lbl { display:flex; align-items:center; gap:8px; font-size:12.5px; color:rgba(255,255,255,0.55); cursor:pointer; }
        .lp-chk-lbl input { accent-color:#38BDF8; width:14px; height:14px; cursor:pointer; }
        .lp-forgot { font-size:12.5px; color:#38BDF8; font-weight:600; background:none; border:none; cursor:pointer; padding:0; transition:color 0.2s; }
        .lp-forgot:hover { color:#34D399; }

        /* Submit */
        .lp-submit {
          width: 100%; padding: 14px;
          border: none; border-radius: 13px;
          font-size: 15px; font-weight: 700;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #0369A1 0%, #0D9488 100%);
          box-shadow: 0 4px 18px rgba(3,105,161,0.4), 0 1px 0 rgba(255,255,255,0.15) inset;
          transition: all 0.22s ease;
          position: relative; overflow: hidden;
          letter-spacing: 0.2px;
        }
        .lp-submit::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.14),transparent); opacity:0; transition:opacity 0.2s; }
        .lp-submit:hover::after { opacity:1; }
        .lp-submit:hover { transform:translateY(-2px); box-shadow: 0 8px 26px rgba(3,105,161,0.55), 0 1px 0 rgba(255,255,255,0.15) inset; }
        .lp-submit:active { transform:translateY(0); }
        .lp-submit:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

        /* Ghost */
        .lp-ghost {
          width:100%; padding:12px;
          border:1.5px solid rgba(255,255,255,0.15); border-radius:13px;
          font-size:13px; font-weight:600; color:rgba(255,255,255,0.5);
          background:transparent; cursor:pointer; font-family:'Inter',sans-serif;
          transition:all 0.2s ease; margin-top:10px;
        }
        .lp-ghost:hover { border-color:rgba(56,189,248,0.45); color:#38BDF8; background:rgba(56,189,248,0.07); }

        /* 2-col */
        .lp-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

        /* Role cards */
        .lp-role-lbl { font-size:11px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:rgba(255,255,255,0.38); display:block; margin-bottom:8px; }
        .lp-role-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:16px; }
        .lp-role-card {
          border:1.5px solid rgba(255,255,255,0.12); border-radius:12px; padding:12px 6px; text-align:center;
          cursor:pointer; background:rgba(255,255,255,0.07); transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .lp-role-card:hover { border-color:rgba(14,165,233,0.5); background:rgba(14,165,233,0.1); }
        .lp-role-card.active { border-color:rgba(14,165,233,0.7); background:rgba(14,165,233,0.15); box-shadow:0 0 0 3px rgba(14,165,233,0.14); transform:scale(1.05); }
        .lp-role-ico { font-size:20px; margin-bottom:4px; }
        .lp-role-name { font-size:11.5px; font-weight:700; color:rgba(255,255,255,0.85); }
        .lp-role-desc { font-size:9.5px; color:rgba(255,255,255,0.38); margin-top:2px; }

        /* Strength */
        .lp-str-wrap { margin-bottom:12px; }
        .lp-str-track { display:flex; gap:4px; height:5px; margin-bottom:5px; }
        .lp-str-seg { flex:1; border-radius:99px; background:rgba(255,255,255,0.12); transition:background 0.3s; }
        .pw-weak   { background:#EF4444; }
        .pw-fair   { background:#F59E0B; }
        .pw-good   { background:#38BDF8; }
        .pw-strong { background:#34D399; }
        .lp-str-lbl-row { display:flex; justify-content:space-between; font-size:11px; color:rgba(255,255,255,0.38); }
        .lp-str-rules { display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:6px; }
        .lp-str-rule { display:flex; align-items:center; gap:5px; font-size:11px; color:rgba(255,255,255,0.38); }
        .lp-str-rule.ok { color:#34D399; }

        /* Terms */
        .lp-tlink { color:#38BDF8; font-weight:600; text-decoration:underline; cursor:pointer; background:none; border:none; font-size:inherit; font-family:inherit; padding:0; }

        /* Success */
        .lp-success { background:rgba(16,185,129,0.14); border:1.5px solid rgba(52,211,153,0.35); border-radius:16px; padding:26px 20px; text-align:center; animation:fadeUp 0.3s ease; }
        .lp-success-ico { width:52px; height:52px; background:linear-gradient(135deg,#10B981,#059669); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; box-shadow:0 4px 18px rgba(16,185,129,0.4); }

        /* Modal */
        .lp-overlay { position:fixed; inset:0; background:rgba(2,11,24,0.7); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:9999; animation:fadeIn 0.2s ease; }
        .lp-modal { background:rgba(15,35,55,0.96); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.14); border-radius:22px; max-width:480px; width:calc(100% - 40px); box-shadow:0 24px 80px rgba(0,0,0,0.55); animation:fadeUp 0.25s ease; overflow:hidden; }
        .lp-modal-head { padding:22px 28px 18px; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between; }
        .lp-modal-title { font-size:18px; font-weight:800; color:rgba(255,255,255,0.95); font-family:'Outfit',sans-serif; }
        .lp-modal-close { width:32px; height:32px; border-radius:8px; border:none; background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.55); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:16px; transition:all 0.2s; }
        .lp-modal-close:hover { background:rgba(255,255,255,0.14); color:#fff; }
        .lp-modal-body { padding:22px 28px; font-size:13.5px; color:rgba(255,255,255,0.6); line-height:1.7; }
        .lp-modal-body strong { color:rgba(255,255,255,0.9); }
        .lp-modal-foot { padding:16px 28px 24px; }

        .spin { animation:spin 1s linear infinite; }
        .fade-up { animation:fadeUp 0.28s ease; }

        @media (max-width:860px) {
          .lp-root { grid-template-columns:1fr; }
          .lp-left { display:none; }
          .lp-right { padding:24px 16px; }
          .lp-card { max-width:100%; }
        }
      `}</style>

      <div className="lp-root">
        {/* Soft background orbs */}
        <Orb size="340px" x={-4}  y={-8}  color="#0369A1" delay={0}   dur={10} />
        <Orb size="260px" x={68}  y={58}  color="#0D9488" delay={2}   dur={12} />
        <Orb size="180px" x={28}  y={52}  color="#38BDF8" delay={1}   dur={9}  />
        <Orb size="120px" x={82}  y={8}   color="#7C3AED" delay={3}   dur={8}  />
        <Orb size="90px"  x={14}  y={78}  color="#10B981" delay={0.5} dur={11} />

        {/* ═══════ LEFT ═══════ */}
        <div className="lp-left">
          {/* Brand */}
          <div className="lp-brand-row">
            <div className="lp-brand-logo">
              <HeartPulse size={23} color="#fff" />
            </div>
            <div>
              <div className="lp-brand-name">MediFlow AI</div>
              <div className="lp-brand-tag">Health Portal</div>
            </div>
          </div>

          {/* Hero */}
          <div className="lp-hero-center">
            <div className="lp-headline">
              Smart Healthcare<br />
              <span className="lp-headline-accent">At Your Fingertips</span>
            </div>
            <div className="lp-subtext">
              Connect with certified specialists, manage appointments, and receive digital prescriptions — all in one secure AI-powered platform.
            </div>

            {/* ECG strip — draws once, then idles */}
            <div className="lp-ecg-wrap">
              <div className="lp-ecg-bar">
                <span className="lp-ecg-dot" />
                Live System Status — All 4 AI Agents Operational
              </div>
              <EcgCanvas />
            </div>

            {/* Feature bullets */}
            <div className="lp-features">
              {FEATURES.map((f, i) => (
                <div className="lp-feat-item" key={i}>
                  <div className="lp-feat-icon-wrap">{f.icon}</div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div>
            <div className="lp-quote">"Healthcare excellence powered by technology"</div>
            <div className="lp-trust">
              <ShieldCheck size={14} color="#34D399" />
              <span>Protected by 256-bit JWT &amp; Role-Based Access Control</span>
            </div>
          </div>
        </div>

        {/* ═══════ RIGHT — Visible white card ═══════ */}
        <div className="lp-right">
          <div className="lp-card">
            <div className="lp-card-header">
              <div className="lp-card-logo-row">
                <div className="lp-card-logo-icon">
                  <HeartPulse size={19} color="#fff" />
                </div>
                <div className="lp-card-logo-name">MediFlow AI</div>
              </div>

              <div className="lp-tabs">
                <button className={`lp-tab ${tab === 'login' ? 'active' : ''}`}
                  onClick={() => { setTab('login'); setError(''); }}>Sign In</button>
                <button className={`lp-tab ${tab === 'register' ? 'active' : ''}`}
                  onClick={() => { setTab('register'); setError(''); }}>Register</button>
              </div>
            </div>

            <div className="lp-card-body">
              {error && (
                <div className="lp-error">
                  <XCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* ── LOGIN ── */}
              {tab === 'login' && (
                <div className="fade-up">
                  <div className="lp-title">Welcome back 👋</div>
                  <div className="lp-sub">Sign in to access your MediFlow AI portal</div>

                  <div className="lp-persona-accent" style={{ background: persona.color }} />

                  <div className="lp-demo-lbl">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="lp-dot" /> Quick Demo — Pick a Role
                    </span>
                    <span style={{ textTransform: 'none', letterSpacing: 0, color: '#0369A1' }}>7 Portals</span>
                  </div>
                  <div className="lp-persona-wrap">
                    {DEMO_PERSONAS.map(p => (
                      <button key={p.role} type="button"
                        className={`lp-pill ${selectedPersona === p.role ? 'active' : ''}`}
                        onClick={() => applyPersona(p)} title={p.role}>
                        <span>{p.icon}</span><span>{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleLogin}>
                    <div className="lp-field">
                      <label className="lp-lbl">Email Address</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Mail size={15} /></span>
                        <input className="lp-inp" type="email" placeholder="name@mediflow.lk"
                          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                      </div>
                    </div>

                    <div className="lp-field">
                      <label className="lp-lbl">Password</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Lock size={15} /></span>
                        <input className="lp-inp" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                          style={{ paddingRight: 42 }} required />
                        <button type="button" className="lp-eye" onClick={() => setShowPass(!showPass)}>
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
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

                    <button type="submit" className="lp-submit" disabled={loading}>
                      {loading
                        ? <><Loader size={16} className="spin" /> Authenticating...</>
                        : <>{persona.icon} Sign in as {selectedPersona} <ArrowRight size={16} /></>}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <ShieldCheck size={12} color="#34D399" />
                    Protected by 256-bit JWT &amp; Supabase PostgreSQL
                  </div>
                </div>
              )}

              {/* ── REGISTER ── */}
              {tab === 'register' && (
                <div className="fade-up">
                  <div className="lp-title">Create Account ✨</div>
                  <div className="lp-sub">Register to access channeling &amp; prescriptions</div>

                  <label className="lp-role-lbl">Select Account Type</label>
                  <div className="lp-role-grid">
                    {[
                      { role: 'Patient',    icon: '👤', name: 'Patient',    desc: 'Book & Prescriptions' },
                      { role: 'Doctor',     icon: '🩺', name: 'Doctor',     desc: 'Consultations & CDS' },
                      { role: 'Pharmacist', icon: '💊', name: 'Pharmacist', desc: 'Dispensing & Orders' },
                    ].map(r => (
                      <div key={r.role}
                        className={`lp-role-card ${form.role === r.role ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, role: r.role })}>
                        <div className="lp-role-ico">{r.icon}</div>
                        <div className="lp-role-name">{r.name}</div>
                        <div className="lp-role-desc">{r.desc}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleRegister}>
                    <div className="lp-field">
                      <label className="lp-lbl">Full Name</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><User size={15} /></span>
                        <input className="lp-inp" type="text" placeholder="Dilshan Pasindu"
                          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                      </div>
                    </div>

                    <div className="lp-grid2">
                      <div className="lp-field">
                        <label className="lp-lbl">Email</label>
                        <div className="lp-input-wrap">
                          <span className="lp-input-icon"><Mail size={15} /></span>
                          <input className="lp-inp" type="email" placeholder="you@email.com"
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                      </div>
                      <div className="lp-field">
                        <label className="lp-lbl">Phone</label>
                        <div className="lp-input-wrap">
                          <span className="lp-input-icon"><Phone size={15} /></span>
                          <input className="lp-inp" type="tel" placeholder="+94 77 123 4567"
                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                        </div>
                      </div>
                    </div>

                    <div className="lp-field" style={{ marginBottom: 8 }}>
                      <label className="lp-lbl">Create Password</label>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Lock size={15} /></span>
                        <input className="lp-inp" type={showPass ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, number"
                          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                          style={{ paddingRight: 42 }} required />
                        <button type="button" className="lp-eye" onClick={() => setShowPass(!showPass)}>
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {form.password && (
                      <div className="lp-str-wrap">
                        <div className="lp-str-track">
                          {[1, 2, 3, 4].map(n => (
                            <div key={n} className={`lp-str-seg ${pScore >= n ? pClass : ''}`} />
                          ))}
                        </div>
                        <div className="lp-str-lbl-row">
                          <span>Strength</span>
                          <span className={pClass}>{pLabel}</span>
                        </div>
                        <div className="lp-str-rules">
                          {[
                            { ok: pCrit.len, lbl: '8+ Characters' },
                            { ok: pCrit.up && pCrit.lo, lbl: 'Upper & Lower' },
                            { ok: pCrit.num, lbl: 'Number' },
                            { ok: pCrit.sym, lbl: 'Special Symbol' },
                          ].map((r, i) => (
                            <div key={i} className={`lp-str-rule ${r.ok ? 'ok' : ''}`}>
                              {r.ok ? <CheckCircle2 size={11} /> : <XCircle size={11} />} {r.lbl}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="lp-field" style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="lp-lbl" style={{ marginBottom: 0 }}>Confirm Password</label>
                        {form.confirmPassword && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: pMatch ? '#10B981' : '#EF4444' }}>
                            {pMatch ? '✓ Match' : '✗ Mismatch'}
                          </span>
                        )}
                      </div>
                      <div className="lp-input-wrap">
                        <span className="lp-input-icon"><Lock size={15} /></span>
                        <input className="lp-inp" type={showConf ? 'text' : 'password'} placeholder="Re-enter password"
                          value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                          style={{ paddingRight: 42 }} required />
                        <button type="button" className="lp-eye" onClick={() => setShowConf(!showConf)}>
                          {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label className="lp-chk-lbl" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
                        <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
                        <span>I agree to the{' '}
                          <button className="lp-tlink" onClick={e => { e.preventDefault(); setShowTerms(true); }}>
                            Terms of Service
                          </button>
                          {' '}&amp; Privacy Policy
                        </span>
                      </label>
                    </div>

                    <button type="submit" className="lp-submit" disabled={loading || !pMatch || !agreeTerms}>
                      {loading
                        ? <><Loader size={16} className="spin" /> Creating Account...</>
                        : <>Create {form.role} Account <ArrowRight size={16} /></>}
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
                      <div className="lp-success-ico"><CheckCircle2 size={26} color="#fff" /></div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#34D399', marginBottom: 6, fontFamily: 'Outfit,sans-serif' }}>Reset Link Sent!</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                        We dispatched a secure link to <strong style={{color:'rgba(255,255,255,0.9)'}}>{forgotEmail}</strong>. Check your inbox.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleForgot}>
                      <div className="lp-field">
                        <label className="lp-lbl">Account Email</label>
                        <div className="lp-input-wrap">
                          <span className="lp-input-icon"><Mail size={15} /></span>
                          <input className="lp-inp" type="email" placeholder="your.email@mediflow.lk"
                            value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                        </div>
                      </div>
                      <button type="submit" className="lp-submit" disabled={loading}>
                        {loading ? <><Loader size={16} className="spin" /> Sending...</> : 'Send Reset Instructions'}
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
              <p style={{ marginBottom: 14 }}><strong>1. Healthcare AI Disclaimer:</strong> MediFlow AI provides recommendation assistance for doctor channeling and clinical decision support. All final medical decisions remain under the authority of certified medical professionals.</p>
              <p style={{ marginBottom: 14 }}><strong>2. Data Security:</strong> Patient data and e-prescriptions are encrypted using industry-standard protocols in compliance with medical data privacy guidelines.</p>
              <p><strong>3. Role-Based Access:</strong> Your login credentials grant access only to your authorized portal.</p>
            </div>
            <div className="lp-modal-foot">
              <button className="lp-submit" onClick={() => { setAgreeTerms(true); setShowTerms(false); }}>
                <CheckCircle2 size={16} /> I Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
