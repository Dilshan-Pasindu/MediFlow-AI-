import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Filter, ChevronDown, SlidersHorizontal, MapPin, Clock, ArrowRight, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useDoctors, useSpecialties } from '../hooks';

const SPECIALTY_ICONS = {
  'Cardiology': '❤️', 'Neurology': '🧠', 'Dermatology': '🩹', 'Gastroenterology': '🫁',
  'Orthopedics': '🦴', 'Pediatrics': '👶', 'Psychiatry': '💭', 'General Medicine': '🩺',
  'Gynecology': '🌸', 'Ophthalmology': '👁️', 'ENT': '👂', 'Oncology': '🔬',
};

export default function FindDoctorPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('rating');

  const { data: specialties = [] } = useSpecialties();
  const { data: doctors = [], isLoading: loading } = useDoctors(activeSpecialty || undefined, searchTerm || undefined);

  const sortedDoctors = [...doctors].sort((a, b) => {
    if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
    if (sortBy === 'experience') return (b.experienceYears || 0) - (a.experienceYears || 0);
    if (sortBy === 'fee_asc') return (a.consultationFee || 0) - (b.consultationFee || 0);
    if (sortBy === 'fee_desc') return (b.consultationFee || 0) - (a.consultationFee || 0);
    return 0;
  });

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Find a Doctor"
          subtitle="Search and book appointments with top medical specialists"
          actions={
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/symptom-check')} id="ai-check-from-search-btn">
              🧠 AI Symptom Check
            </button>
          }
        />
        <div className="page-body fade-in">

          {/* Search + Filter Row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <Search className="search-icon" size={16} />
              <input
                id="doctor-search-input"
                type="text"
                className="search-input"
                placeholder="Search by doctor name, specialty..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  id="clear-search-btn"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <select
                className="form-select"
                style={{ height: 44, paddingRight: 32 }}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                id="doctor-sort-select"
              >
                <option value="rating">Sort: Top Rated</option>
                <option value="experience">Sort: Most Experienced</option>
                <option value="fee_asc">Sort: Fee ↑</option>
                <option value="fee_desc">Sort: Fee ↓</option>
              </select>
            </div>
          </div>

          {/* Specialty Pills */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="section-title">Browse by Specialty</div>
              {activeSpecialty && (
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveSpecialty(null)} id="clear-specialty-btn">
                  <X size={13} /> Clear Filter
                </button>
              )}
            </div>
            <div className="filter-bar">
              <button
                className={`filter-pill ${activeSpecialty === null ? 'active' : ''}`}
                onClick={() => setActiveSpecialty(null)}
                id="specialty-all"
              >
                🩺 All Specialties
              </button>
              {specialties.map(spec => (
                <button
                  key={spec.id}
                  className={`filter-pill ${activeSpecialty === spec.id ? 'active' : ''}`}
                  onClick={() => setActiveSpecialty(spec.id)}
                  id={`specialty-${spec.id}`}
                >
                  {SPECIALTY_ICONS[spec.name] || '🏥'} {spec.name}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="section-title">
              {loading ? 'Loading doctors...' : `${sortedDoctors.length} ${sortedDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found`}
              {activeSpecialty && (() => {
                const sp = specialties.find((s: any) => s.id === activeSpecialty);
                return sp ? <span className="badge badge-blue" style={{ marginLeft: 8 }}>{sp.name}</span> : null;
              })()}
            </div>
          </div>

          {/* Doctor Grid */}
          {loading ? (
            <div className="doctor-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card" style={{ padding: 20, height: 240 }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 'var(--r-lg)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 16, marginBottom: 8, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 12, width: '60%', borderRadius: 4 }} />
                    </div>
                  </div>
                  <div className="skeleton" style={{ height: 12, marginBottom: 8, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 12, width: '80%', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : sortedDoctors.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No doctors found</div>
              <div className="empty-sub">Try adjusting your search or filter criteria</div>
              <button className="btn btn-primary" onClick={() => { setSearchTerm(''); setActiveSpecialty(null); }} id="clear-all-filters-btn">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="doctor-grid stagger">
              {sortedDoctors.map(doc => (
                <div
                  key={doc.id}
                  className="doctor-card fade-in"
                  onClick={() => navigate(`/doctors/${doc.id}/book`)}
                  id={`doctor-card-${doc.id}`}
                >
                  <div className="doctor-card-top-bar" />
                  <div className="doctor-header">
                    <div className="doc-avatar">
                      {doc.fullName ? doc.fullName.replace('Dr.', '').trim().split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'DR'}
                    </div>
                    <div>
                      <div className="doc-name">{doc.fullName}</div>
                      <div className="doc-spec">{doc.specialties?.map((s: any) => s.name).join(', ') || 'General Medicine'}</div>
                      <div className="doc-quals">{doc.qualifications}</div>
                    </div>
                  </div>

                  <div className="doc-hospital" style={{ marginBottom: 12 }}>
                    🏥 {doc.experienceYears} years experience
                  </div>

                  <div className="doc-meta">
                    <div className="doc-meta-item">
                      <Star size={13} className="star" fill="currentColor" />
                      <strong>{doc.averageRating?.toFixed(1) || '—'}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>({doc.reviewCount || 0})</span>
                    </div>
                    <div className="doc-meta-item">
                      <span className={`avail-dot ${!doc.isActive ? 'busy' : ''}`} />
                      {doc.isActive ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 1 }}>Consultation Fee</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Rs. {doc.consultationFee?.toLocaleString()}</div>
                    </div>
                    <button className="btn btn-primary btn-sm" id={`book-btn-${doc.id}`}>
                      Book Now <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
