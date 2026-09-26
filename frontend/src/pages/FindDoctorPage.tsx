import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, Filter, ChevronDown, SlidersHorizontal, MapPin, Clock, ArrowRight, X, Info, User,
  Heart, Droplets, Brain, Microscope, Bone, Activity, Bandage, Eye, Ear, Wind,
  Waves, Stethoscope, Scale, Ribbon, Shield, Syringe, Baby, Pill,
  Building2, Sparkles,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useDoctors, useSpecialties } from '../hooks';
import { DoctorProfileModal } from '../components/DoctorProfileModal';
import type { DoctorDetail } from '../types/doctor';

const SPECIALTY_ICON_MAP: Record<string, { Icon: React.ElementType; color: string; bg: string }> = {
  'Cardiology':           { Icon: Heart,        color: '#EF4444', bg: 'rgba(239,68,68,0.1)'     },
  'Vascular Surgery':     { Icon: Droplets,     color: '#EF4444', bg: 'rgba(239,68,68,0.1)'     },
  'Neurology':            { Icon: Brain,        color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)'    },
  'Neurosurgery':         { Icon: Microscope,   color: '#7C3AED', bg: 'rgba(124,58,237,0.1)'    },
  'Orthopedics':          { Icon: Bone,         color: '#D97706', bg: 'rgba(217,119,6,0.1)'     },
  'Physiatry':            { Icon: Activity,     color: '#10B981', bg: 'rgba(16,185,129,0.1)'    },
  'Dermatology':          { Icon: Bandage,      color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'    },
  'Ophthalmology':        { Icon: Eye,          color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)'    },
  'ENT':                  { Icon: Ear,          color: '#6366F1', bg: 'rgba(99,102,241,0.1)'    },
  'Gastroenterology':     { Icon: Wind,         color: '#059669', bg: 'rgba(5,150,105,0.1)'     },
  'Nephrology':           { Icon: Waves,        color: '#0284C7', bg: 'rgba(2,132,199,0.1)'     },
  'Pulmonology':          { Icon: Wind,         color: '#06B6D4', bg: 'rgba(6,182,212,0.1)'     },
  'Endocrinology':        { Icon: Scale,        color: '#D97706', bg: 'rgba(217,119,6,0.1)'     },
  'Oncology':             { Icon: Ribbon,       color: '#EC4899', bg: 'rgba(236,72,153,0.1)'    },
  'Allergy & Immunology': { Icon: Shield,       color: '#2563EB', bg: 'rgba(37,99,235,0.1)'     },
  'Hematology':           { Icon: Droplets,     color: '#DC2626', bg: 'rgba(220,38,38,0.1)'     },
  'Pediatrics':           { Icon: Baby,         color: '#F97316', bg: 'rgba(249,115,22,0.1)'    },
  'General Medicine':     { Icon: Stethoscope,  color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'    },
};

function SpecialtyIcon({ name, size = 13 }: { name: string; size?: number }) {
  const entry = SPECIALTY_ICON_MAP[name];
  if (!entry) return <Stethoscope size={size} style={{ color: '#6B7280' }} />;
  const { Icon, color } = entry;
  return <Icon size={size} style={{ color }} />;
}


export default function FindDoctorPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/symptom-check')} id="ai-check-from-search-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> AI Symptom Check
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
                maxLength={100}
                onChange={e => e.target.value.length <= 100 && setSearchTerm(e.target.value)}
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <Stethoscope size={12} />
                All Specialties
              </button>
              {specialties.map(spec => (
                <button
                  key={spec.id}
                  className={`filter-pill ${activeSpecialty === spec.id ? 'active' : ''}`}
                  onClick={() => setActiveSpecialty(spec.id)}
                  id={`specialty-${spec.id}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <SpecialtyIcon name={spec.name} size={12} />
                  {spec.name}
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
              <div className="empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={36} style={{ color: 'var(--text-muted)' }} />
              </div>
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
                  id={`doctor-card-${doc.id}`}
                >
                  <div className="doctor-card-top-bar" />
                  <div className="doctor-header" style={{ cursor: 'pointer' }} onClick={() => { setSelectedDoctor(doc); setIsModalOpen(true); }}>
                    {doc.profilePhoto ? (
                      <img
                        src={doc.profilePhoto}
                        alt={doc.fullName}
                        className="doc-avatar"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="doc-avatar">
                        {doc.fullName ? doc.fullName.replace('Dr.', '').trim().split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'DR'}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="doc-name">{doc.fullName}</div>
                      <div className="doc-spec">
                        {doc.specialties?.map((s: any) => s.name).join(', ') || 'General Medicine'}
                        {doc.subSpecialty && <span style={{ fontSize: 11, opacity: 0.85 }}> • {doc.subSpecialty}</span>}
                      </div>
                      <div className="doc-quals">{doc.qualifications}</div>
                    </div>
                  </div>

                  <div className="doc-hospital" style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Building2 size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    {doc.hospitalClinic || `${doc.experienceYears} years clinical experience`}
                  </div>

                  <div className="doc-meta">
                    <div className="doc-meta-item">
                      <Star size={13} className="star" fill="currentColor" />
                      <strong>{doc.averageRating ? doc.averageRating.toFixed(1) : '5.0'}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>({doc.reviewCount || doc.reviews?.length || 0})</span>
                    </div>
                    <div className="doc-meta-item">
                      <span className={`avail-dot ${!doc.isActive ? 'busy' : ''}`} />
                      {doc.isActive ? 'Available' : 'Unavailable'}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 11, padding: '2px 8px', color: 'var(--primary)', marginLeft: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoctor(doc);
                        setIsModalOpen(true);
                      }}
                      id={`view-profile-btn-${doc.id}`}
                    >
                      <Info size={12} style={{ marginRight: 4 }} /> View Profile
                    </button>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 1 }}>Consultation Fee</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Rs. {doc.consultationFee?.toLocaleString()}</div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      id={`book-btn-${doc.id}`}
                      onClick={() => navigate(`/doctors/${doc.id}/book`)}
                    >
                      Book Now <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pre-Booking Doctor Profile Modal */}
          <DoctorProfileModal
            doctor={selectedDoctor}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            showBookButton={true}
          />
        </div>
      </div>
    </div>
  );
}
