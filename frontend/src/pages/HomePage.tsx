import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Calendar, ArrowRight, HeartPulse,
  Stethoscope, Brain, Pill, Activity, Users, Star,
  Clock, CheckCircle2, Shield, Zap, ChevronRight,
  Phone, Mail, Globe, MessageCircle, Camera, Link2,
  PlayCircle, Award, TrendingUp, Lock, Menu, X
} from 'lucide-react';
import heroDoctors from '../assets/hero-doctors.jpg';

// ─── Data ────────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: 'Search Doctor',
    desc: 'Find the right specialist using AI-powered matching based on your symptoms.',
    color: '#2A7DE1',
    bg: 'linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%)',
    step: '01',
  },
  {
    icon: Calendar,
    title: 'Select Time',
    desc: 'Pick a convenient appointment slot from real-time doctor availability.',
    color: '#7C3AED',
    bg: 'linear-gradient(135deg, #F3EEFF 0%, #EDE9FE 100%)',
    step: '02',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    desc: 'Confirm your appointment securely and receive instant digital confirmation.',
    color: '#059669',
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    step: '03',
  },
];

const FEATURES = [
  {
    icon: Stethoscope,
    title: 'Smart Doctor Matching',
    desc: 'AI finds the best specialist instantly based on your condition & history.',
    color: '#2A7DE1',
    bg: '#EBF4FF',
  },
  {
    icon: Brain,
    title: 'AI Clinical Support',
    desc: 'Evidence-based clinical decision support for accurate diagnoses.',
    color: '#7C3AED',
    bg: '#F3EEFF',
  },
  {
    icon: Pill,
    title: 'Digital Prescriptions',
    desc: 'Secure e-prescriptions synced directly with your pharmacy.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    desc: 'Track appointments, health metrics & prescription status live.',
    color: '#D97706',
    bg: '#FFFBEB',
  },
];

const WHY_CHOOSE = [
  { icon: CheckCircle2, label: '1500+ Certified Doctors', color: '#22C55E' },
  { icon: Zap,          label: 'Instant Confirmations',    color: '#22C55E' },
  { icon: CheckCircle2, label: 'Easy Cancellations',       color: '#22C55E' },
  { icon: Clock,        label: '24/7 Customer Support',    color: '#22C55E' },
  { icon: Shield,       label: 'HIPAA Compliant',          color: '#22C55E' },
  { icon: Award,        label: 'ISO 27001 Certified',      color: '#22C55E' },
];

const STATS = [
  { icon: Users,       value: '50K+',  label: 'Active Patients',     color: '#2A7DE1' },
  { icon: Stethoscope, value: '1500+', label: 'Certified Doctors',   color: '#059669' },
  { icon: Star,        value: '4.9★',  label: 'Average Rating',      color: '#D97706' },
  { icon: TrendingUp,  value: '99.8%', label: 'Uptime Guaranteed',   color: '#7C3AED' },
];

const TESTIMONIALS = [
  {
    name: 'Dilshan Pasindu',
    role: 'Patient',
    avatar: 'D',
    color: '#2A7DE1',
    text: 'MediFlow changed how I manage my health. Booking appointments is effortless, and the AI symptom checker is incredibly accurate.',
    stars: 5,
  },
  {
    name: 'Dr. Nimal Perera',
    role: 'Specialist Doctor',
    avatar: 'N',
    color: '#059669',
    text: 'The clinical decision support system helps me deliver better care. The e-prescription workflow is seamless and saves enormous time.',
    stars: 5,
  },
  {
    name: 'Thumula Jayasekara',
    role: 'Pharmacy Owner',
    avatar: 'T',
    color: '#D97706',
    text: 'Inventory management and AI-powered restocking has reduced our wastage by 40%. Absolutely brilliant platform.',
    stars: 5,
  },
];

const SPECIALTIES = [
  { name: 'Cardiology',    icon: '❤️', color: '#EF4444', bg: '#FEF2F2' },
  { name: 'Neurology',     icon: '🧠', color: '#7C3AED', bg: '#F3EEFF' },
  { name: 'Orthopedics',   icon: '🦴', color: '#D97706', bg: '#FFFBEB' },
  { name: 'Pediatrics',    icon: '👶', color: '#2A7DE1', bg: '#EBF4FF' },
  { name: 'Dermatology',   icon: '🌿', color: '#059669', bg: '#ECFDF5' },
  { name: 'Ophthalmology', icon: '👁️', color: '#0891B2', bg: '#ECFEFF' },
  { name: 'Dental',        icon: '🦷', color: '#6366F1', bg: '#EEF2FF' },
  { name: 'Psychiatry',    icon: '💬', color: '#EC4899', bg: '#FDF2F8' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let start = 0;
          const duration = 1800;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count}{suffix}</div>;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    navigate(`/login?redirect=find-doctor&q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#FFFFFF', overflowX: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(42,125,225,0.35)',
            }}>
              <HeartPulse size={20} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MediFlow<span style={{ fontWeight: 400, WebkitTextFillColor: 'rgba(100,116,139,0.9)' }}> AI</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {['Features', 'How It Works', 'Specialties', 'Testimonials'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#2A7DE1')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                boxShadow: '0 4px 14px rgba(42,125,225,0.35)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(42,125,225,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(42,125,225,0.35)'; }}
            >
              Register / Login
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              {mobileMenuOpen ? <X size={24} color="#1E293B" /> : <Menu size={24} color="#1E293B" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '16px 24px 24px' }}>
            {['Features', 'How It Works', 'Specialties', 'Testimonials'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', padding: '12px 0', fontSize: 15, fontWeight: 500, color: '#475569', textDecoration: 'none', borderBottom: '1px solid #F1F5F9' }}
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0F7FF 0%, #E8F4FD 40%, #EEF9F6 100%)',
        display: 'flex', alignItems: 'center',
        paddingTop: 68, position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(42,125,225,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,209,197,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

          {/* Left — Text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 100,
              background: 'linear-gradient(135deg, rgba(42,125,225,0.1), rgba(79,209,197,0.12))',
              border: '1px solid rgba(42,125,225,0.2)',
              marginBottom: 24,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#2A7DE1', letterSpacing: '0.04em' }}>🇱🇰 Sri Lanka's #1 AI Healthcare Platform</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, lineHeight: 1.1, color: '#1E293B', marginBottom: 8, fontFamily: 'Outfit, Inter, sans-serif' }}>
              Smart Healthcare
            </h1>
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24,
              background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: 'Outfit, Inter, sans-serif',
            }}>
              At Your Fingertips
            </h1>

            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#475569', marginBottom: 36, maxWidth: 500 }}>
              Connect with certified specialists, manage appointments, and receive digital prescriptions — all in one secure AI-powered platform.
            </p>

            {/* Search Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(42,125,225,0.15)', border: '1px solid rgba(42,125,225,0.12)',
              marginBottom: 28,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', flex: 1, borderRight: '1px solid #F1F5F9' }}>
                <Search size={17} color="#94A3B8" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search Doctor or Specialty…"
                  style={{ border: 'none', outline: 'none', fontSize: 14, color: '#1E293B', background: 'transparent', padding: '15px 0', width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderRight: '1px solid #F1F5F9' }}>
                <MapPin size={15} color="#94A3B8" />
                <select style={{ border: 'none', outline: 'none', fontSize: 13, color: '#64748B', background: 'transparent', padding: '15px 0', cursor: 'pointer' }}>
                  <option>All Locations</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                style={{
                  padding: '13px 22px', background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)',
                  border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 14,
                  display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Search size={15} />
                Search Now
              </button>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
                  background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)', border: 'none',
                  borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(42,125,225,0.35)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(42,125,225,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(42,125,225,0.35)'; }}
              >
                Book Appointment <ArrowRight size={15} />
              </button>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
                  background: '#fff', border: '1.5px solid rgba(42,125,225,0.25)',
                  borderRadius: 10, color: '#2A7DE1', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2A7DE1'; e.currentTarget.style.background = '#EBF4FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,125,225,0.25)'; e.currentTarget.style.background = '#fff'; }}
              >
                <PlayCircle size={16} />
                Watch Demo
              </button>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
              {[['50K+', 'Patients'], ['1500+', 'Doctors'], ['4.9★', 'Rating']].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero image */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              borderRadius: 24, overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(42,125,225,0.20)',
              border: '3px solid rgba(255,255,255,0.8)',
              transform: 'perspective(1000px) rotateY(-3deg)',
              transition: 'transform 0.4s ease',
              maxWidth: 520, width: '100%',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(1000px) rotateY(0deg)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(1000px) rotateY(-3deg)'; }}
            >
              <img src={heroDoctors} alt="MediFlow AI Doctors" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>

            {/* Floating card 1 */}
            <div style={{
              position: 'absolute', top: 28, left: -20,
              background: '#fff', borderRadius: 14, padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 10,
              animation: 'float 3s ease-in-out infinite',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>Appointment Confirmed</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Dr. Perera · Tomorrow 9:00 AM</div>
              </div>
            </div>

            {/* Floating card 2 */}
            <div style={{
              position: 'absolute', bottom: 36, right: -20,
              background: '#fff', borderRadius: 14, padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 10,
              animation: 'float 3s ease-in-out infinite 1.5s',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EBF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} color="#2A7DE1" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>AI Diagnosis Ready</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>98.2% confidence score</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialty Quick Links ───────────────────────────────────────────── */}
      <section id="specialties" style={{ background: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2A7DE1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Browse By Specialty</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#1E293B', margin: '8px 0 0', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Find The Right Specialist
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
            {SPECIALTIES.map(spec => (
              <button
                key={spec.name}
                onClick={() => navigate('/login')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  padding: '20px 12px', borderRadius: 16, border: `1.5px solid ${spec.bg}`,
                  background: spec.bg, cursor: 'pointer', transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${spec.color}28`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: 28 }}>{spec.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: spec.color }}>{spec.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: 'linear-gradient(135deg, #F8FAFF 0%, #F0F7FF 100%)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2A7DE1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Simple Process</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#1E293B', margin: '8px 0 12px', fontFamily: 'Outfit, Inter, sans-serif' }}>
              How It Works
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>
              Get started in minutes with our streamlined 3-step healthcare journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} style={{ position: 'relative' }}>
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 48, right: -14, width: 28, height: 2,
                    background: `linear-gradient(90deg, ${step.color}, transparent)`,
                    zIndex: 1, display: 'none',
                  }} className="step-connector" />
                )}

                <div style={{
                  background: '#fff', borderRadius: 20, padding: '32px 28px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)',
                  transition: 'all 0.3s', height: '100%',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${step.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 14, background: step.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 12px ${step.color}30`,
                    }}>
                      <step.icon size={26} color={step.color} strokeWidth={1.8} />
                    </div>
                    <span style={{
                      fontSize: 42, fontWeight: 900, color: 'rgba(0,0,0,0.04)',
                      fontFamily: 'Outfit, Inter, sans-serif', lineHeight: 1,
                    }}>
                      {step.step}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1E293B', marginBottom: 10 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: '#64748B' }}>{step.desc}</p>

                  <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: step.color, fontSize: 13, fontWeight: 600 }}>
                    <span>Learn more</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features + Why Choose ──────────────────────────────────────────── */}
      <section id="features" style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 0.7fr', gap: 36, alignItems: 'start' }}>

          {/* Features Grid */}
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2A7DE1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Platform Features</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#1E293B', margin: '8px 0 36px', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Everything You Need,<br />Nothing You Don't
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {FEATURES.map(f => (
                <div key={f.title}
                  style={{
                    background: '#FAFBFF', borderRadius: 16, padding: '24px 20px',
                    border: '1.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '44'; e.currentTarget.style.background = f.bg; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.background = '#FAFBFF'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, border: `1.5px solid ${f.color}22` }}>
                    <f.icon size={22} color={f.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Panel */}
          <div style={{
            background: 'linear-gradient(145deg, #1A3E6E 0%, #0B2E4A 100%)',
            borderRadius: 24, padding: '40px 32px',
            boxShadow: '0 24px 60px rgba(10,46,74,0.35)', color: '#fff',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, fontFamily: 'Outfit, Inter, sans-serif' }}>Why Choose MediFlow?</div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', marginBottom: 28, lineHeight: 1.6 }}>
              Join thousands of patients and healthcare providers who trust MediFlow AI for smarter, faster healthcare.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {WHY_CHOOSE.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={14} color="#22C55E" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.88)' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Stats inside panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[['50K+', 'Patients Served'], ['1500+', 'Certified Doctors']].map(([v, l]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#4FD1C5' }}>{v}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', marginTop: 20, padding: '13px 0',
                background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)', border: 'none',
                borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Get Started Free <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1A3E6E 0%, #0B2E4A 100%)',
        padding: '56px 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
          {STATS.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: 'Outfit, Inter, sans-serif', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section id="testimonials" style={{ background: 'linear-gradient(135deg, #F8FAFF 0%, #F0F7FF 100%)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2A7DE1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>What People Say</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#1E293B', margin: '8px 0', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Trusted By Thousands
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name}
                style={{
                  background: '#fff', borderRadius: 20, padding: '28px 24px',
                  border: `2px solid ${activeTestimonial === i ? t.color + '33' : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: activeTestimonial === i ? `0 12px 40px ${t.color}18` : '0 4px 16px rgba(0,0,0,0.06)',
                  transition: 'all 0.35s', cursor: 'pointer', transform: activeTestimonial === i ? 'translateY(-4px)' : 'translateY(0)',
                }}
                onClick={() => setActiveTestimonial(i)}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#475569', marginBottom: 20, fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                style={{
                  width: activeTestimonial === i ? 24 : 8, height: 8, borderRadius: 100,
                  background: activeTestimonial === i ? '#2A7DE1' : '#E2E8F0',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)',
        padding: '72px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 14 }}>
            Start Today — It's Free
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', marginBottom: 16, fontFamily: 'Outfit, Inter, sans-serif', lineHeight: 1.2 }}>
            Your Health Journey<br />Starts Here
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', marginBottom: 36, lineHeight: 1.7 }}>
            Join 50,000+ patients already using MediFlow AI for smarter, faster, and safer healthcare in Sri Lanka.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 32px', background: '#fff', border: 'none', borderRadius: 12,
                color: '#2A7DE1', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
            >
              Create Free Account <ArrowRight size={16} />
            </button>
            <button
              style={{
                padding: '14px 32px', background: 'transparent', border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#0B1A2E', padding: '60px 24px 28px', color: 'rgba(255,255,255,0.6)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartPulse size={18} color="#fff" />
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>MediFlow AI</span>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
                Sri Lanka's leading AI-powered healthcare platform connecting patients with certified specialists.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[Globe, MessageCircle, Camera, Link2].map((Icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(42,125,225,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)'; }}
                  >
                    <Icon size={16} color="rgba(255,255,255,0.7)" />
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { heading: 'Platform', links: ['Find a Doctor', 'Appointments', 'Prescriptions', 'AI Symptom Check'] },
              { heading: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
              { heading: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact'] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>{col.heading}</div>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4FD1C5'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Contact strip */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {[[Phone, '+94 11 234 5678'], [Mail, 'support@mediflow.lk']].map(([Icon, text]) => (
              <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={14} color="#4FD1C5" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{text as string}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 24 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              © 2026 MediFlow AI. All rights reserved. Made with ❤️ in Sri Lanka.
            </div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <Lock size={12} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>HIPAA Compliant · SSL Secured · ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Global CSS ────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
