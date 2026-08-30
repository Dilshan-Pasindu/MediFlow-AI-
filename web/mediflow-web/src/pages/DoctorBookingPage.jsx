import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Calendar as CalendarIcon, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetDoctor, apiBookAppointment } from '../services/api';

const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function generateSlots(startTime, endTime) {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let h = sh, m = sm;
  while (h < eh || (h === eh && m < em)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += 30;
    if (m >= 60) { m = 0; h++; }
  }
  return slots;
}

export default function DoctorBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDoctor();
  }, [id]);

  async function loadDoctor() {
    try {
      const data = await apiGetDoctor(id);
      setDoctor(data);
    } catch (err) {
      console.error('Failed to load doctor:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook() {
    setBooking(true);
    setError('');
    try {
      // Find next occurrence of the selected day
      const today = new Date();
      const targetDay = dayLabels.indexOf(selectedDay);
      let daysUntil = targetDay - today.getDay();
      if (daysUntil <= 0) daysUntil += 7;
      const bookDate = new Date(today);
      bookDate.setDate(today.getDate() + daysUntil);

      const [hour, minute] = selectedSlot.split(':').map(Number);
      bookDate.setHours(hour, minute, 0, 0);

      await apiBookAppointment(doctor.id, bookDate.toISOString());
      navigate('/appointments');
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  }

  if (loading) return <div className="app-shell"><Sidebar /><div className="main-content"><TopBar title="Loading..." /><div className="page-body" style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>Loading doctor...</div></div></div>;
  if (!doctor) return <div className="app-shell"><Sidebar /><div className="main-content"><TopBar title="Not Found" /><div className="page-body"><div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">Doctor not found</div></div></div></div></div>;

  const availDays = [...new Set(doctor.availability?.map(a => dayLabels[a.dayOfWeek]) || [])];
  const slotsForDay = selectedDay 
    ? doctor.availability
        ?.filter(a => dayLabels[a.dayOfWeek] === selectedDay)
        .flatMap(a => generateSlots(a.startTime, a.endTime)) || []
    : [];

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
                  <div className="doc-avatar" style={{ width: 80, height: 80, fontSize: 20, borderRadius: 20 }}>
                    {doctor.fullName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>{doctor.fullName}</div>
                        <div style={{ fontSize: 14, color: '#0369A1', fontWeight: 600, marginBottom: 8 }}>{doctor.specialties?.map(s => s.name).join(', ')}</div>
                        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>{doctor.qualifications}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#0F172A', justifyContent: 'flex-end', marginBottom: 4 }}>
                          <Star size={16} className="star" fill="currentColor" /> {doctor.averageRating || '—'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>{doctor.reviewCount || 0} reviews</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Consultation Fee</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>Rs. {doctor.consultationFee?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="divider"></div>
                <div className="section-title" style={{ marginBottom: 8 }}>About</div>
                <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>{doctor.bio}</div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="card">
              <div className="card-body">
                <div className="section-title" style={{ marginBottom: 16 }}>Select Date & Time</div>
                
                {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>{error}</div>}
                
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarIcon size={16} /> Available Days
                  </div>
                  <div className="day-grid">
                    {availDays.map((day, i) => (
                      <button
                        key={i}
                        className={`day-btn ${selectedDay === day ? 'selected' : ''}`}
                        onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDay && slotsForDay.length > 0 && (
                  <div className="fade-in">
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={16} /> Available Slots for {selectedDay}
                    </div>
                    <div className="slot-grid">
                      {slotsForDay.map((slot, i) => (
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
                    {selectedDay && selectedSlot 
                      ? <span>Selected: <strong>{selectedDay} at {selectedSlot}</strong></span>
                      : 'Please select a day and time slot'}
                  </div>
                  <button 
                    className="btn btn-primary btn-lg" 
                    disabled={!selectedDay || !selectedSlot || booking}
                    onClick={() => setShowConfirmModal(true)}
                  >
                    {booking ? 'Booking...' : 'Confirm Booking'}
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
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Book your appointment?</div>
              </div>
              
              <div style={{ background: '#F8FAFC', border: '1px solid #E8EDF2', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Doctor</div>
                    <div className="detail-value">{doctor.fullName}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Date & Time</div>
                    <div className="detail-value">{selectedDay} at {selectedSlot}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Specialty</div>
                    <div className="detail-value">{doctor.specialties?.map(s => s.name).join(', ')}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Fee</div>
                    <div className="detail-value" style={{ color: '#0369A1' }}>Rs. {doctor.consultationFee?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleBook} disabled={booking}>
                {booking ? 'Booking...' : 'Confirm & Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
