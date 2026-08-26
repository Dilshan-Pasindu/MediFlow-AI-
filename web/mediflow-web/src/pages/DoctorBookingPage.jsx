import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar as CalendarIcon, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { doctors } from '../data/mockData';

export default function DoctorBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === parseInt(id));

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!doctor) return <div>Doctor not found</div>;

  const handleBook = () => {
    // In a real app, this would call the API to create an appointment
    setShowConfirmModal(true);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title="Book Appointment"
          actions={
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>
          }
        />
        
        <div className="page-body fade-in">
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            
            {/* Doctor Info Card */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <div className="doc-avatar" style={{ width: 80, height: 80, fontSize: 24, borderRadius: 20 }}>
                    {doctor.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>{doctor.name}</div>
                        <div style={{ fontSize: 14, color: '#0369A1', fontWeight: 600, marginBottom: 8 }}>{doctor.specialty}</div>
                        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>{doctor.qualifications}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
                          <MapPin size={14} /> {doctor.hospital}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#0F172A', justifyContent: 'flex-end', marginBottom: 4 }}>
                          <Star size={16} className="star" fill="currentColor" /> {doctor.rating}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>{doctor.reviewCount} reviews</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Consultation Fee</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Rs. {doctor.fee.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="divider"></div>
                
                <div className="section-title" style={{ marginBottom: 8 }}>About Doctor</div>
                <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>
                  {doctor.about}
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="card">
              <div className="card-body">
                <div className="section-title" style={{ marginBottom: 16 }}>Select Date & Time</div>
                
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarIcon size={16} /> Available Days
                  </div>
                  <div className="day-grid">
                    {doctor.availability.map((avail, i) => (
                      <button
                        key={i}
                        className={`day-btn ${selectedDay === avail.day ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDay(avail.day);
                          setSelectedSlot(null);
                        }}
                      >
                        {avail.day}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDay && (
                  <div className="fade-in">
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={16} /> Available Slots for {selectedDay}
                    </div>
                    <div className="slot-grid">
                      {doctor.availability.find(a => a.day === selectedDay)?.slots.map((slot, i) => (
                        <button
                          key={i}
                          className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="divider"></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: '#64748B' }}>
                    {selectedDay && selectedSlot ? (
                      <span>Selected: <strong>{selectedDay} at {selectedSlot}</strong></span>
                    ) : (
                      'Please select a day and time slot'
                    )}
                  </div>
                  <button 
                    className="btn btn-primary btn-lg" 
                    disabled={!selectedDay || !selectedSlot}
                    onClick={handleBook}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Confirm Appointment</div>
              <button className="close-btn" onClick={() => setShowConfirmModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#059669' }}>
                  <ShieldCheck size={32} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Ready to book your appointment</div>
                <div style={{ fontSize: 14, color: '#64748B' }}>Please review the details below before proceeding to payment.</div>
              </div>
              
              <div style={{ background: '#F8FAFC', border: '1px solid #E8EDF2', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Doctor</div>
                    <div className="detail-value">{doctor.name}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Specialty</div>
                    <div className="detail-value">{doctor.specialty}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Date & Time</div>
                    <div className="detail-value">{selectedDay} at {selectedSlot}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Total Fee</div>
                    <div className="detail-value" style={{ color: '#0369A1' }}>Rs. {doctor.fee.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="info-banner blue">
                <div>The receptionist will verify your payment and confirm the appointment. You will receive an SMS notification once confirmed.</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => navigate('/appointments')}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
