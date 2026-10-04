import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Calendar, ArrowRight,
  Stethoscope, Brain, Pill, Activity, Star,
  Clock, CheckCircle2, Shield, Zap, ChevronRight,
  Phone, Mail, Globe, MessageCircle, Camera, Link2,
  Award, Lock, Menu, X,
  Heart, Bone, Baby, Sparkles, Eye, Smile, MessageSquare,
  BadgeCheck,
} from 'lucide-react';
import heroDoctors from '../assets/hero-doctors.jpg';
import { MediFlowLogo } from '../components/MediFlowLogo';

const HOW_IT_WORKS = [
  { icon: Search, title: 'Search Doctor', desc: 'AI matches you with the best specialist instantly, based on your symptoms, location, and medical history.', color: '#2A7DE1', bg: 'linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%)', step: '01', tag: 'AI-Powered' },
  { icon: Calendar, title: 'Book Instantly', desc: 'Pick a convenient slot from real-time availability. No phone calls, no waiting — confirmed in seconds.', color: '#7C3AED', bg: 'linear-gradient(135deg, #F3EEFF 0%, #EDE9FE 100%)', step: '02', tag: 'Real-time' },
  { icon: Shield, title: 'Visit & Heal', desc: 'Attend your appointment, receive digital prescriptions, and track your health all in one secure platform.', color: '#059669', bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', step: '03', tag: 'Secure' },
];

const FEATURES = [
  { icon: Stethoscope, title: 'Smart Doctor Matching', desc: 'AI finds the best specialist instantly based on your condition & history.', color: '#2A7DE1', bg: '#EBF4FF', stat: '98% accuracy' },
  { icon: Brain, title: 'AI Clinical Support', desc: 'Evidence-based clinical decision support for accurate diagnoses.', color: '#7C3AED', bg: '#F3EEFF', stat: '3× faster' },
  { icon: Pill, title: 'Digital Prescriptions', desc: 'Secure e-prescriptions synced directly with your pharmacy.', color: '#059669', bg: '#ECFDF5', stat: 'Zero paper' },
  { icon: Activity, title: 'Real-time Monitoring', desc: 'Track appointments, health metrics & prescription status live.', color: '#D97706', bg: '#FFFBEB', stat: '24/7 live' },
];

const STATS = [
  { icon: Clock, value: '24/7', label: 'AI Health Assistance', color: '#4FD1C5', bg: 'rgba(79,209,197,0.15)' },
  { icon: Stethoscope, value: '30+', label: 'Medical Specialties', color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
  { icon: Zap, value: 'Instant', label: 'Booking Confirmation', color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
  { icon: Lock, value: '100%', label: 'Digital & Secure', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
];

const TESTIMONIALS = [
  { name: 'Dilshan Pasindu', role: 'Patient · Colombo', avatar: 'D', color: '#2A7DE1', text: 'MediFlow changed how I manage my health. Booking appointments is effortless, and the AI symptom checker is incredibly accurate. I found the right specialist in under 2 minutes.', stars: 5 },
  { name: 'Dr. Nimal Perera', role: 'Specialist Doctor · Kandy', avatar: 'N', color: '#059669', text: 'The clinical decision support system helps me deliver better care. The e-prescription workflow is seamless and saves enormous time — my patients love the digital experience.', stars: 5 },
  { name: 'Thumula Jayasekara', role: 'Pharmacy Owner · Galle', avatar: 'T', color: '#D97706', text: 'Inventory management and AI-powered restocking has reduced our wastage by 40%. The platform pays for itself every single month. Absolutely brilliant.', stars: 5 },
];

const SPECIALTIES = [
  { name: 'Cardiology', icon: Heart, color: '#EF4444', bg: '#FEF2F2', docs: '142 Doctors' },
  { name: 'Neurology', icon: Brain, color: '#7C3AED', bg: '#F3EEFF', docs: '89 Doctors' },
  { name: 'Orthopedics', icon: Bone, color: '#D97706', bg: '#FFFBEB', docs: '76 Doctors' },
  { name: 'Pediatrics', icon: Baby, color: '#2A7DE1', bg: '#EBF4FF', docs: '115 Doctors' },
  { name: 'Dermatology', icon: Sparkles, color: '#059669', bg: '#ECFDF5', docs: '63 Doctors' },
  { name: 'Ophthalmology', icon: Eye, color: '#0891B2', bg: '#ECFEFF', docs: '44 Doctors' },
  { name: 'Dental', icon: Smile, color: '#6366F1', bg: '#EEF2FF', docs: '98 Doctors' },
  { name: 'Psychiatry', icon: MessageSquare, color: '#EC4899', bg: '#FDF2F8', docs: '57 Doctors' },
];

const TRUST_LOGOS = ['Ministry of Health SL', 'ISO 27001', 'HIPAA Certified', 'WHO Partner', 'SSL Secured', 'SLMA Approved', 'Data Protected', 'PCI DSS'];

function SectionBadge({ text }: { text: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#2A7DE1', letterSpacing: '0.08em', textTransform: 'uppercase' as const, background: '#EBF4FF', border: '1px solid #BFDBFE', padding: '4px 12px', borderRadius: 999, marginBottom: 12 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2A7DE1', display: 'inline-block' }} />
      {text}
    </span>
  );
}

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
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => navigate(`/login?redirect=find-doctor&q=${encodeURIComponent(searchQuery)}`);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#FFFFFF', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none', transition: 'all 0.3s ease', boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.08)' : 'none' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <MediFlowLogo variant="horizontal" height={36} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {['Features', 'How It Works', 'Specialties', 'Testimonials'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#2A7DE1')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>{link}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/login')} style={{ padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(42,125,225,0.35)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(42,125,225,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(42,125,225,0.35)'; }}>Register / Login</button>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              {mobileMenuOpen ? <X size={24} color="#1E293B" /> : <Menu size={24} color="#1E293B" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '16px 24px 24px' }}>
            {['Features', 'How It Works', 'Specialties', 'Testimonials'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: 15, fontWeight: 500, color: '#475569', textDecoration: 'none', borderBottom: '1px solid #F1F5F9' }}>{link}</a>
            ))}
            <button onClick={() => navigate('/login')} style={{ marginTop: 16, width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)', color: '#fff', fontSize: 15, fontWeight: 700 }}>Register / Login</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EDF5FF 0%, #E6F4FD 35%, #ECF9F6 70%, #F0EDFF 100%)', display: 'flex', alignItems: 'center', paddingTop: 68, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(42,125,225,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,209,197,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px 72px', width: '100%' }} className="hero-grid">

          {/* Left */}
          <div className="hero-left" style={{ position: 'relative', zIndex: 1, marginTop: -40 }}>
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.08, color: '#1E293B', marginBottom: 8, fontFamily: 'Outfit, Inter, sans-serif' }}>Smart Healthcare</h1>
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 28, background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Outfit, Inter, sans-serif' }}>At Your Fingertips</h1>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: '#475569', marginBottom: 36, maxWidth: 500 }}>Connect with certified specialists, manage appointments, and receive digital prescriptions — all in one secure AI-powered platform built for Sri Lanka.</p>

            <div className="hero-search" style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 48px rgba(42,125,225,0.18)', border: '1.5px solid rgba(42,125,225,0.14)', marginBottom: 28 }}>
              <div className="hero-search-input" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', flex: 1, borderRight: '1px solid #F1F5F9' }}>
                <Search size={17} color="#94A3B8" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search Doctor or Specialty…" style={{ border: 'none', outline: 'none', fontSize: 14, color: '#1E293B', background: 'transparent', padding: '16px 0', width: '100%' }} />
              </div>
              <div className="hero-search-location" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: '1px solid #F1F5F9' }}>
                <MapPin size={15} color="#94A3B8" />
                <select style={{ border: 'none', outline: 'none', fontSize: 13, color: '#64748B', background: 'transparent', padding: '16px 0', cursor: 'pointer' }}>
                  <option>All Locations</option><option>Colombo</option><option>Kandy</option><option>Galle</option>
                </select>
              </div>
              <button onClick={handleSearch} className="hero-search-btn" style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #2A7DE1 0%, #4FD1C5 100%)', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', justifyContent: 'center', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <Search size={15} /> Search Now
              </button>
            </div>

            <div className="hero-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(42,125,225,0.35)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(42,125,225,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(42,125,225,0.35)'; }}>
                Book Appointment <ArrowRight size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[['🏥', 'HIPAA Compliant'], ['🔒', 'SSL Secured'], ['🤖', 'AI Safety Checks']].map(([icon, label]) => (
                <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                  <span>{icon as string}</span> {label as string}
                </div>
              ))}
            </div>
          </div>

          {/* Right — image + floating cards */}
          <div className="hero-image-col" style={{ position: 'relative' }}>
            <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 100px rgba(42,125,225,0.22)', border: '3px solid rgba(255,255,255,0.9)', transform: 'perspective(1200px) rotateY(-4deg)', transition: 'transform 0.5s ease', maxWidth: 520, width: '100%', margin: '0 auto' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(1200px) rotateY(0deg)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'perspective(1200px) rotateY(-4deg)'; }}>
              <img src={heroDoctors} alt="MediFlow AI Doctors" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <div style={{ background: 'linear-gradient(135deg, #1A3E6E 0%, #0B2E4A 100%)', padding: '16px 0', overflow: 'hidden' }}>
        <div className="marquee-track">
          {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 40px', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <BadgeCheck size={14} color="#4FD1C5" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em' }}>{logo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SPECIALTIES */}
      <section id="specialties" style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionBadge text="Browse By Specialty" />
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, color: '#1E293B', margin: '4px 0 12px', fontFamily: 'Outfit, Inter, sans-serif' }}>Find The Right Specialist</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 440, margin: '0 auto' }}>Browse across 30+ specialties and connect with verified doctors in Sri Lanka.</p>
          </div>
          <div className="specialties-grid">
            {SPECIALTIES.map(spec => {
              const SpecIcon = spec.icon;
              return (
                <button key={spec.name} onClick={() => navigate('/login')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 16px 20px', borderRadius: 20, border: `1.5px solid ${spec.color}18`, background: spec.bg, cursor: 'pointer', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${spec.color}28`; e.currentTarget.style.borderColor = spec.color + '44'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = spec.color + '18'; }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.9)', boxShadow: `0 4px 12px ${spec.color}20` }}><SpecIcon size={26} color={spec.color} /></span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{spec.name}</span>
                  <span style={{ fontSize: 11, color: spec.color, fontWeight: 600, background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: 999 }}>{spec.docs}</span>
                </button>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button onClick={() => navigate('/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'transparent', border: '1.5px solid rgba(42,125,225,0.3)', borderRadius: 12, color: '#2A7DE1', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = '#EBF4FF'; e.currentTarget.style.borderColor = '#2A7DE1'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(42,125,225,0.3)'; }}>
              View All 30+ Specialties <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: 'linear-gradient(160deg, #F0F7FF 0%, #EAF4FE 50%, #EEF9F6 100%)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionBadge text="Simple Process" />
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, color: '#1E293B', margin: '4px 0 14px', fontFamily: 'Outfit, Inter, sans-serif' }}>From Search to Healed in 3 Steps</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 500, margin: '0 auto' }}>Get started in minutes with our streamlined AI-powered healthcare journey.</p>
          </div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} style={{ position: 'relative' }}>
                <div style={{ background: '#fff', borderRadius: 24, padding: '36px 32px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)', transition: 'all 0.3s', height: '100%', position: 'relative', overflow: 'hidden' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 24px 60px ${step.color}20`; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; }}>
                  <div style={{ position: 'absolute', top: -8, right: 16, fontSize: 96, fontWeight: 900, color: step.color, opacity: 0.05, fontFamily: 'Outfit, sans-serif', lineHeight: 1, userSelect: 'none' }}>{step.step}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 18px ${step.color}30`, flexShrink: 0 }}><step.icon size={26} color={step.color} strokeWidth={1.8} /></div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: step.bg, color: step.color, padding: '3px 10px', borderRadius: 999, border: `1px solid ${step.color}22` }}>{step.tag}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: step.color, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 10, opacity: 0.7 }}>Step {step.step}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>{step.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#64748B' }}>{step.desc}</p>
                  <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6, color: step.color, fontSize: 13, fontWeight: 700 }}>
                    <span>Learn more</span><ChevronRight size={14} />
                  </div>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="step-arrow" style={{ position: 'absolute', top: '50%', right: -20, transform: 'translateY(-50%)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                    <ChevronRight size={18} color="#94A3B8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionBadge text="Platform Features" />
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, color: '#1E293B', margin: '4px 0 14px', fontFamily: 'Outfit, Inter, sans-serif' }}>Everything You Need,<br />Nothing You Don't</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>MediFlow AI brings hospital-grade features right to your fingertips — simple, secure, and intelligent.</p>
          </div>
          <div className="features-4-grid">
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#FAFBFF', borderRadius: 20, padding: '32px 28px', border: '1.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }} onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '44'; e.currentTarget.style.background = f.bg; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${f.color}18`; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.background = '#FAFBFF'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: f.bg, opacity: 0.6, pointerEvents: 'none' }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: `1.5px solid ${f.color}22`, boxShadow: `0 4px 14px ${f.color}20` }}><f.icon size={24} color={f.color} strokeWidth={1.8} /></div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.65, marginBottom: 20 }}>{f.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: f.bg, border: `1px solid ${f.color}22`, padding: '4px 12px', borderRadius: 999 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>{f.stat}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, padding: '40px 48px', borderRadius: 24, background: 'linear-gradient(145deg, #1A3E6E 0%, #0B2E4A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, boxShadow: '0 24px 60px rgba(10,46,74,0.3)' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: 12 }}>Why Choose MediFlow AI?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {['Verified Doctors', 'Instant Confirmations', 'HIPAA Compliant', '24/7 Support', 'ISO 27001', 'Easy Cancellations'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7 }}><CheckCircle2 size={15} color="#4FD1C5" /><span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{item}</span></div>
                ))}
              </div>
            </div>
            <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #2A7DE1, #4FD1C5)', border: 'none', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(42,125,225,0.4)', flexShrink: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'linear-gradient(135deg, #1A3E6E 0%, #0B2E4A 100%)', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,209,197,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(79,209,197,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Platform Impact</div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, Inter, sans-serif' }}>Transforming Healthcare in Sri Lanka</h2>
          </div>
          <div className="stats-grid">
            {STATS.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '32px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `1px solid ${stat.color}30` }}><stat.icon size={26} color={stat.color} /></div>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', fontFamily: 'Outfit, Inter, sans-serif', lineHeight: 1, marginBottom: 8 }}>{stat.value}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ background: 'linear-gradient(160deg, #F8FAFF 0%, #F0F7FF 100%)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="testimonials-layout">
            <div style={{ position: 'sticky', top: 100, alignSelf: 'flex-start' }}>
              <SectionBadge text="What People Say" />
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, color: '#1E293B', margin: '8px 0 16px', fontFamily: 'Outfit, Inter, sans-serif', lineHeight: 1.2 }}>Loved By<br />Our Community</h2>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, maxWidth: 300, marginBottom: 32 }}>From patients to doctors to pharmacy owners — MediFlow AI is transforming healthcare across Sri Lanka.</p>
              <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', maxWidth: 260 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#EBF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={24} color="#2A7DE1" /></div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: 'Outfit, sans-serif', margin: '12px 0 6px' }}>Patient-First Care</div>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, lineHeight: 1.6 }}>Built with doctors, pharmacists and patients across Sri Lanka.</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 28 }}>
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: activeTestimonial === i ? 28 : 8, height: 8, borderRadius: 100, background: activeTestimonial === i ? '#2A7DE1' : '#E2E8F0', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} onClick={() => setActiveTestimonial(i)} style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', border: `2px solid ${activeTestimonial === i ? t.color + '44' : 'rgba(0,0,0,0.06)'}`, boxShadow: activeTestimonial === i ? `0 20px 60px ${t.color}18` : '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.4s', cursor: 'pointer', transform: activeTestimonial === i ? 'translateX(6px)' : 'translateX(0)', position: 'relative', overflow: 'hidden' }}>
                  {activeTestimonial === i && <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: `linear-gradient(180deg, ${t.color}, ${t.color}44)` }} />}
                  <div style={{ fontSize: 48, color: t.color, opacity: 0.15, fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 8, fontWeight: 900 }}>"</div>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>{Array.from({ length: t.stars }).map((_, si) => <Star key={si} size={14} fill="#F59E0B" color="#F59E0B" />)}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: '#475569', marginBottom: 24, fontStyle: 'italic' }}>&ldquo;{t.text}&rdquo;</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{t.avatar}</div>
                    <div><div style={{ fontSize: 14.5, fontWeight: 700, color: '#1E293B' }}>{t.name}</div><div style={{ fontSize: 12.5, color: '#94A3B8', marginTop: 2 }}>{t.role}</div></div>
                    {activeTestimonial === i && <div style={{ marginLeft: 'auto', background: t.color + '15', color: t.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>Featured</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #2A7DE1 0%, #1565C0 50%, #4FD1C5 100%)', padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -60, width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '6px 18px', marginBottom: 24, fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            <Sparkles size={13} /> Start Today — It's Free
          </div>
          <h2 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, color: '#fff', marginBottom: 20, fontFamily: 'Outfit, Inter, sans-serif', lineHeight: 1.15 }}>Your Health Journey<br />Starts Here</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', marginBottom: 44, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 44px' }}>Join 50,000+ patients already using MediFlow AI for smarter, faster, and safer healthcare in Sri Lanka.</p>
          <div className="cta-btn-row" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '16px 36px', background: '#fff', border: 'none', borderRadius: 14, color: '#2A7DE1', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 12px 32px rgba(0,0,0,0.18)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 48px rgba(0,0,0,0.24)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18)'; }}>
              Create Free Account <ArrowRight size={16} />
            </button>
            <button style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}>
              Learn More
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
            {['No credit card required', 'Free forever plan', 'Cancel anytime'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}><CheckCircle2 size={14} color="rgba(255,255,255,0.7)" /> {t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0B1A2E', padding: '72px 24px 32px', color: 'rgba(255,255,255,0.6)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="footer-grid">
            <div>
              <div style={{ background: '#ffffff', borderRadius: 8, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', marginBottom: 18 }}><MediFlowLogo variant="horizontal" height={28} /></div>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, maxWidth: 260, marginBottom: 24, color: 'rgba(255,255,255,0.5)' }}>Sri Lanka's leading AI-powered healthcare platform connecting patients with certified specialists.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[Globe, MessageCircle, Camera, Link2].map((Icon, i) => (
                  <div key={i} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(42,125,225,0.3)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)'; }}>
                    <Icon size={16} color="rgba(255,255,255,0.7)" />
                  </div>
                ))}
              </div>
            </div>
            {[
              { heading: 'Platform', links: ['Find a Doctor', 'Appointments', 'Prescriptions', 'AI Symptom Check'] },
              { heading: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
              { heading: 'Support', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact'] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 18 }}>{col.heading}</div>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 12, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#4FD1C5'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>{link}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }}>
            {[[Phone, '+94 11 234 5678'], [Mail, 'support@mediflow.lk']].map(([Icon, text]) => (
              <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={14} color="#4FD1C5" /><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{text as string}</span></div>
            ))}
          </div>
          <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              © 2026 MediFlow AI. All rights reserved. Made with <Heart size={12} color="#EF4444" fill="#EF4444" style={{ margin: '0 3px' }} /> in Sri Lanka.
            </div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <Lock size={12} color="rgba(255,255,255,0.25)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>HIPAA Compliant · SSL Secured · ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes hfloat1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes hfloat2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .marquee-track { display:flex; white-space:nowrap; animation:marquee 22s linear infinite; width:max-content; }
        @media(max-width:900px){ .desktop-nav{display:none!important} .mobile-menu-btn{display:flex!important} }
        .hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
        .hero-image-col { display:flex; justify-content:center; }
        @media(max-width:960px){
          .hero-grid{grid-template-columns:1fr!important;gap:40px!important;text-align:center}
          .hero-left{margin-top:24px!important}
          .hero-image-col{order:-1}
          .hero-float-card{display:none!important}
          .hero-actions{justify-content:center!important}
          .hero-search{flex-direction:column!important}
          .hero-search-input{border-right:none!important;border-bottom:1px solid #F1F5F9!important}
          .hero-search-location{border-right:none!important;border-bottom:1px solid #F1F5F9!important}
          .hero-search-btn{border-radius:0 0 14px 14px!important;padding:14px!important}
        }
        .specialties-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        @media(max-width:600px){.specialties-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important}}
        .how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
        @media(max-width:768px){.how-grid{grid-template-columns:1fr!important;gap:20px!important}.step-arrow{display:none!important}}
        .features-4-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        @media(max-width:1100px){.features-4-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){.features-4-grid{grid-template-columns:1fr!important}}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
        @media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr)!important}}
        .testimonials-layout{display:grid;grid-template-columns:320px 1fr;gap:56px;align-items:start}
        @media(max-width:900px){.testimonials-layout{grid-template-columns:1fr!important;gap:32px!important}}
        .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px}
        @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;gap:36px!important}}
        @media(max-width:500px){.footer-grid{grid-template-columns:1fr!important;gap:28px!important}.footer-bottom{flex-direction:column!important;text-align:center!important}}
        @media(max-width:500px){.cta-btn-row{flex-direction:column!important;align-items:stretch!important}.cta-btn-row button{width:100%!important;justify-content:center!important}}
        *{box-sizing:border-box} html{scroll-behavior:smooth}
      `}</style>
    </div>
  );
}
