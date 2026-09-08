import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetDoctors, apiGetSpecialties } from '../services/api';

export default function FindDoctorPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpecialties();
    loadDoctors();
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [activeSpecialty, searchTerm]);

  async function loadSpecialties() {
    try {
      const data = await apiGetSpecialties();
      setSpecialties(data || []);
    } catch (err) {
      console.error('Failed to load specialties:', err);
    }
  }

  async function loadDoctors() {
    setLoading(true);
    try {
      const data = await apiGetDoctors(activeSpecialty, searchTerm || undefined);
      setDoctors(data || []);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Find a Doctor"
          subtitle="Search and book appointments with top medical specialists"
        />
        <div className="page-body fade-in">
          
          {/* Search Bar */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <Search className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by doctor name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Specialties Filter */}
          <div style={{ marginBottom: 32 }}>
            <div className="section-title" style={{ marginBottom: 16 }}>Specialties</div>
            <div className="filter-bar">
              <button 
                className={`filter-pill ${activeSpecialty === null ? 'active' : ''}`}
                onClick={() => setActiveSpecialty(null)}
              >
                All Specialties
              </button>
              {specialties.map(spec => (
                <button 
                  key={spec.id}
                  className={`filter-pill ${activeSpecialty === spec.id ? 'active' : ''}`}
                  onClick={() => setActiveSpecialty(spec.id)}
                >
                  {spec.name}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Grid */}
          <div className="section-title" style={{ marginBottom: 16 }}>
            {loading ? 'Loading...' : `${doctors.length} ${doctors.length === 1 ? 'Doctor' : 'Doctors'} Found`}
          </div>

          {!loading && doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No doctors found</div>
              <div className="empty-sub">Try adjusting your search criteria</div>
            </div>
          ) : (
            <div className="doctor-grid">
              {doctors.map(doc => (
                <div key={doc.id} className="doctor-card" onClick={() => navigate(`/doctors/${doc.id}/book`)}>
                  <div className="doctor-header">
                    <div className="doc-avatar">
                      {doc.fullName.split(' ').filter(n => n.startsWith('Dr.') === false).map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="doc-name">{doc.fullName}</div>
                      <div className="doc-spec">{doc.specialties?.map(s => s.name).join(', ') || 'General'}</div>
                      <div className="doc-quals">{doc.qualifications}</div>
                    </div>
                  </div>
                  
                  <div className="doc-hospital" style={{ fontSize: 12, color: '#475569', marginTop: 8 }}>
                    🏥 {doc.experienceYears} years experience
                  </div>
                  
                  <div className="doc-meta">
                    <div className="doc-meta-item">
                      <Star size={13} className="star" fill="currentColor" />
                      <strong>{doc.averageRating || '—'}</strong> ({doc.reviewCount || 0})
                    </div>
                    <div className="doc-meta-item" style={{ marginLeft: 'auto' }}>
                      <span className={`avail-dot ${!doc.isActive ? 'busy' : ''}`}></span>
                      {doc.isActive ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 13, color: '#64748B' }}>Consultation Fee</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Rs. {doc.consultationFee?.toLocaleString()}</div>
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
