import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { specialties, doctors } from '../data/mockData';

export default function FindDoctorPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState(null);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = activeSpecialty ? doc.specialtyId === activeSpecialty : true;
    return matchesSearch && matchesSpecialty;
  });

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
                placeholder="Search by doctor name or specialty..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-ghost" style={{ padding: '0 20px' }}>
              <Filter size={16} /> Filters
            </button>
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
                  {spec.icon} {spec.name}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Grid */}
          <div className="section-title" style={{ marginBottom: 16 }}>
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No doctors found</div>
              <div className="empty-sub">Try adjusting your search criteria</div>
            </div>
          ) : (
            <div className="doctor-grid">
              {filteredDoctors.map(doc => (
                <div key={doc.id} className="doctor-card" onClick={() => navigate(`/doctors/${doc.id}/book`)}>
                  <div className="doctor-header">
                    <div className="doc-avatar">{doc.avatar}</div>
                    <div>
                      <div className="doc-name">{doc.name}</div>
                      <div className="doc-spec">{doc.specialty}</div>
                      <div className="doc-quals">{doc.qualifications}</div>
                    </div>
                  </div>
                  
                  <div className="doc-hospital">
                    <MapPin size={13} /> {doc.hospital}
                  </div>
                  
                  <div className="doc-meta">
                    <div className="doc-meta-item">
                      <Star size={13} className="star" fill="currentColor" />
                      <strong>{doc.rating}</strong> ({doc.reviewCount})
                    </div>
                    <div className="doc-meta-item" style={{ marginLeft: 'auto' }}>
                      <span className={`avail-dot ${!doc.isAvailable ? 'busy' : ''}`}></span>
                      {doc.isAvailable ? 'Available Today' : 'Next available tomorrow'}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 13, color: '#64748B' }}>Consultation Fee</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Rs. {doc.fee.toLocaleString()}</div>
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
