import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Send, ArrowRight, CheckCircle, AlertCircle, Loader, ChevronRight, Star, Clock, MapPin } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetRankedDoctors, apiGetSpecialties } from '../services/api';

// Mock AI recommendation (will be replaced by real AI API call)
async function mockAIRecommendation(symptoms) {
  await new Promise(r => setTimeout(r, 2200));
  const lower = symptoms.toLowerCase();
  if (lower.includes('stomach') || lower.includes('gastric') || lower.includes('acid') || lower.includes('bloat')) {
    return { specialty: 'Gastroenterology', confidence: 91, alt: 'General Medicine', altConf: 64, reason: 'Your symptoms (stomach pain, bloating, acid reflux) are commonly evaluated by gastroenterologists. A specialist can perform targeted diagnostic tests.' };
  }
  if (lower.includes('chest') || lower.includes('heart') || lower.includes('palpitation')) {
    return { specialty: 'Cardiology', confidence: 88, alt: 'General Medicine', altConf: 72, reason: 'Chest pain and palpitations warrant cardiac evaluation. A cardiologist can perform an ECG and relevant tests.' };
  }
  if (lower.includes('skin') || lower.includes('rash') || lower.includes('itch') || lower.includes('acne')) {
    return { specialty: 'Dermatology', confidence: 94, alt: 'General Medicine', altConf: 45, reason: 'Skin symptoms are best assessed by a dermatologist who specializes in skin, hair, and nail conditions.' };
  }
  if (lower.includes('head') || lower.includes('migrain') || lower.includes('neuro') || lower.includes('dizzy')) {
    return { specialty: 'Neurology', confidence: 86, alt: 'General Medicine', altConf: 68, reason: 'Neurological symptoms require specialist evaluation. A neurologist can investigate causes of headaches and dizziness.' };
  }
  return { specialty: 'General Medicine', confidence: 85, alt: 'Internal Medicine', altConf: 60, reason: 'Based on your symptoms, a general medicine consultation is recommended as a starting point for comprehensive evaluation.' };
}

export default function SymptomAIPage() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('');
  const [step, setStep] = useState('input'); // input | analyzing | result
  const [recommendation, setRecommendation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    apiGetSpecialties().then(s => setSpecialties(s || [])).catch(() => {});
  }, []);

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setStep('analyzing');
    try {
      const rec = await mockAIRecommendation(symptoms);
      setRecommendation(rec);

      // Try to get ranked doctors for the specialty
      const matchedSpec = specialties.find(s => s.name.toLowerCase().includes(rec.specialty.toLowerCase()));
      if (matchedSpec) {
        const ranked = await apiGetRankedDoctors(matchedSpec.id).catch(() => []);
        setDoctors(ranked || []);
      }
      setStep('result');
    } catch (err) {
      setStep('input');
    }
  }

  function resetForm() {
    setStep('input');
    setSymptoms('');
    setSeverity(5);
    setDuration('');
    setRecommendation(null);
    setDoctors([]);
  }

  const severityLabel = (v) => {
    if (v <= 3) return { label: 'Mild', color: '#059669' };
    if (v <= 6) return { label: 'Moderate', color: '#B45309' };
    return { label: 'Severe', color: '#DC2626' };
  };
  const sev = severityLabel(severity);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar title="AI Symptom Check" subtitle="Get AI-powered specialist and doctor recommendations" />
        <div className="page-body">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 40, height: 40, background: 'var(--gradient-primary)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>AI Specialist Recommendation</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Powered by MediFlow AI — Specialist & Doctor Recommendation Agent</div>
                </div>
              </div>
            </div>
          </div>

          <div className="ai-disclaimer" style={{ marginBottom: 24 }}>
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span><strong>Medical Disclaimer:</strong> This AI provides specialty and doctor recommendations only — not a medical diagnosis. Always consult a qualified healthcare professional for medical decisions.</span>
          </div>

          {/* INPUT STEP */}
          {step === 'input' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }} className="fade-in">
              {/* Main Input */}
              <div>
                <div className="ai-panel" style={{ marginBottom: 20 }}>
                  <div className="ai-badge"><Sparkles size={10} /> 🩺 Specialist & Doctor Recommendation Agent</div>
                  <div className="ai-panel-title">Describe Your Symptoms</div>
                  <div className="ai-panel-sub">Describe what you're experiencing in natural language. The AI will analyze and recommend the right specialist.</div>

                  <form onSubmit={handleAnalyze} id="symptom-form">
                    <div className="ai-input-wrap" style={{ marginBottom: 14 }}>
                      <textarea
                        className="ai-input"
                        id="symptom-input"
                        placeholder="e.g. I have been experiencing stomach pain, bloating, and acid reflux for the past 3 days. The pain is worse after eating..."
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Symptom Duration</div>
                        <input
                          type="text"
                          id="symptom-duration"
                          placeholder="e.g. 3 days, 1 week"
                          value={duration}
                          onChange={e => setDuration(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 'var(--r-md)', fontSize: 13.5, color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Severity: <span style={{ color: sev.color }}>{sev.label} ({severity}/10)</span>
                        </div>
                        <input
                          type="range"
                          id="symptom-severity"
                          min={1} max={10}
                          value={severity}
                          onChange={e => setSeverity(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#0EA5E9', height: 5, marginTop: 8 }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="ai-submit-btn" id="symptom-submit-btn" style={{ width: '100%', justifyContent: 'center', gap: 8, height: 46, fontSize: 15 }}>
                      <Brain size={16} /> Analyze with AI <Send size={14} />
                    </button>
                  </form>
                </div>

                {/* Example symptoms */}
                <div className="card">
                  <div className="card-body">
                    <div className="section-title" style={{ marginBottom: 12 }}>Quick Examples</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {[
                        'Stomach pain, bloating, acid reflux',
                        'Chest pain and palpitations',
                        'Skin rash and itching',
                        'Severe headache and dizziness',
                        'Shortness of breath',
                        'Joint pain and swelling',
                      ].map(ex => (
                        <button
                          key={ex}
                          className="filter-pill"
                          id={`example-${ex.slice(0,15).replace(/\s+/g,'-')}`}
                          onClick={() => setSymptoms(ex)}
                          style={{ fontSize: 12.5 }}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <div className="card-body">
                    <div className="section-title" style={{ marginBottom: 16 }}>How it works</div>
                    {[
                      { step: '01', title: 'Describe Symptoms', desc: 'Enter your symptoms in plain language', icon: '✍️' },
                      { step: '02', title: 'AI Analysis', desc: 'Specialist & Doctor AI Agent analyzes your input', icon: '🧠' },
                      { step: '03', title: 'Specialty Match', desc: 'Get matched to the right medical specialty', icon: '🎯' },
                      { step: '04', title: 'Doctor Ranking', desc: 'See top-ranked doctors by rating & availability', icon: '🏆' },
                      { step: '05', title: 'Book Appointment', desc: 'Book directly with your chosen specialist', icon: '📅' },
                    ].map(({ step: s, title, desc, icon }) => (
                      <div key={s} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--med-blue-50)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                          {icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ background: 'var(--med-teal-50)', borderColor: 'var(--med-teal-100)' }}>
                  <div className="card-body">
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <CheckCircle size={16} color="var(--med-teal)" />
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--med-teal)' }}>AI Safety Guarantee</div>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      This agent provides specialty recommendations only. It never replaces professional clinical judgment. All final medical decisions remain with qualified doctors.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYZING STEP */}
          {step === 'analyzing' && (
            <div className="scale-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 80, height: 80,
                background: 'var(--gradient-primary)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 0 0 16px rgba(3,105,161,0.1), 0 0 0 32px rgba(3,105,161,0.05)',
                animation: 'pulse-ring 1.5s ease infinite',
              }}>
                <Brain size={32} color="white" />
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Analyzing Your Symptoms</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>
                The AI Specialist Agent is analyzing your symptoms, identifying the most suitable medical specialty, and ranking doctors for you...
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400, margin: '0 auto' }}>
                {[
                  { label: 'Parsing symptom keywords...', delay: 0 },
                  { label: 'Mapping to medical specialties...', delay: 400 },
                  { label: 'Calculating specialty confidence...', delay: 800 },
                  { label: 'Ranking available doctors...', delay: 1200 },
                ].map(({ label, delay }) => (
                  <div key={label} className="ai-processing fade-in" style={{ animationDelay: `${delay}ms` }}>
                    <div className="ai-pulse-dot" />
                    <span style={{ fontSize: 13 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESULT STEP */}
          {step === 'result' && recommendation && (
            <div className="fade-in">

              {/* Result Header */}
              <div className="ai-result-card" style={{ marginBottom: 24 }}>
                <div className="ai-result-header">
                  <div style={{ width: 44, height: 44, background: 'var(--gradient-primary)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle size={22} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 3 }}>AI Analysis Complete</div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800 }}>Recommended Specialty</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={resetForm} id="symptom-reset-btn">
                    New Check
                  </button>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    {/* Primary */}
                    <div style={{ background: 'var(--med-blue-50)', borderRadius: 'var(--r-lg)', padding: '16px 18px', border: '1.5px solid var(--med-blue-200)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--med-blue)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>🥇 Primary Recommendation</div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{recommendation.specialty}</div>
                      <div className="confidence-bar-wrap">
                        <div className="confidence-bar-track">
                          <div className="confidence-bar-fill" style={{ width: `${recommendation.confidence}%` }} />
                        </div>
                        <div className="confidence-label">{recommendation.confidence}% confidence</div>
                      </div>
                    </div>
                    {/* Alternate */}
                    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: '16px 18px', border: '1.5px solid var(--border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>🥈 Alternative</div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-secondary)', marginBottom: 8 }}>{recommendation.alt}</div>
                      <div className="confidence-bar-wrap">
                        <div className="confidence-bar-track">
                          <div className="confidence-bar-fill" style={{ width: `${recommendation.altConf}%`, background: '#94A3B8' }} />
                        </div>
                        <div className="confidence-label">{recommendation.altConf}% confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div style={{ background: 'var(--med-teal-50)', borderRadius: 'var(--r-md)', padding: '14px 16px', border: '1px solid var(--med-teal-100)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--med-teal)', marginBottom: 5 }}>💡 Why {recommendation.specialty}?</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{recommendation.reason}</div>
                  </div>
                </div>
              </div>

              {/* Ranked Doctors */}
              <div className="section-title" style={{ marginBottom: 16 }}>
                Recommended Doctors — {recommendation.specialty}
                <span className="badge badge-blue" style={{ marginLeft: 10 }}>AI Ranked</span>
              </div>

              {doctors.length > 0 ? (
                <div className="doctor-grid">
                  {doctors.slice(0, 6).map((doc, idx) => (
                    <div key={doc.id} className="doctor-card" id={`ranked-doctor-${doc.id}`}>
                      <div className="doctor-card-top-bar" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: idx === 0 ? '#B45309' : 'var(--text-muted)', background: idx === 0 ? '#FFFBEB' : 'var(--surface-3)', padding: '2px 8px', borderRadius: 'var(--r-full)' }}>
                          #{idx + 1} Ranked
                        </span>
                      </div>
                      <div className="doctor-header">
                        <div className="doc-avatar">
                          {doc.fullName.replace('Dr.', '').trim().split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="doc-name">{doc.fullName}</div>
                          <div className="doc-spec">{doc.specialties?.map(s => s.name).join(', ')}</div>
                          <div className="doc-quals">{doc.qualifications}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 12 }}>🏥 {doc.experienceYears} years experience</div>
                      <div className="doc-meta">
                        <div className="doc-meta-item"><Star size={13} className="star" fill="currentColor" /><strong>{doc.averageRating || '—'}</strong> ({doc.reviewCount || 0} reviews)</div>
                        <div className="doc-meta-item"><span className={`avail-dot ${!doc.isActive ? 'busy' : ''}`} />{doc.isActive ? 'Available' : 'Unavailable'}</div>
                      </div>
                      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Rs. {doc.consultationFee?.toLocaleString()}</div>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/doctors/${doc.id}/book`)} id={`book-ranked-doctor-${doc.id}`}>
                          Book <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>🩺</div>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>No doctors found for this specialty</div>
                      <div style={{ fontSize: 13, marginBottom: 16 }}>Try searching manually for a doctor</div>
                      <button className="btn btn-primary" onClick={() => navigate('/find-doctor')} id="fallback-find-doctor-btn">
                        Search All Doctors <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="ai-disclaimer" style={{ marginTop: 24 }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>⚠️ This is a specialty and doctor recommendation, not a medical diagnosis. Please consult the selected doctor for professional medical advice.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
