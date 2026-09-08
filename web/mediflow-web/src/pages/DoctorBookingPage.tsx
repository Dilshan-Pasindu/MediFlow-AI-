import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, CreditCard, CheckCircle, Loader, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { apiGetDoctor, apiGetDoctorAvailability, apiBookAppointment } from '../services/api';

function generateTimeSlots(): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = [];
  for (let h = 9; h <= 17; h++) {
    slots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: Math.random() > 0.4 });
    if (h < 17) slots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: Math.random() > 0.4 });
  }
  return slots;
}

function getDaysInWeek(date: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DoctorBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return d;
  });
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookError, setBookError] = useState('');

  const timeSlots = generateTimeSlots();
  const weekDays = getDaysInWeek(weekStart);

  useEffect(() => { loadDoctor(); }, [id]);

  async function loadDoctor() {
    try { setDoctor(await apiGetDoctor(id || '')); }
    catch { navigate('/find-doctor'); }
    finally { setLoading(false); }
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime) { setBookError('Please select a time slot.'); return; }
    setBooking(true); setBookError('');
    try {
      const dt = new Date(selectedDate);
      const [h, m] = selectedTime.split(':');
      dt.setHours(Number(h), Number(m), 0, 0);
      await apiBookAppointment(id || '', dt.toISOString(), notes);
      setBooked(true);
    } catch (err: any) {
      setBookError(err?.message || 'Booking failed. Please try again.');
    } finally { setBooking(false); }
  }

  function prevWeek() { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }
  function nextWeek() { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }

  if (loading) return (
    <div className="app-shell"><Sidebar />
      <div className="main-content"><TopBar title="Book Appointment" />
        <div className="page-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Loader size={28} className="spin" style={{ color: 'var(--med-blue)' }} />
        </div>
      </div>
    </div>
  );

  if (booked) return (
    <div className="app-shell"><Sidebar />
      <div className="main-content"><TopBar title="Booking Confirmed" />
        <div className="page-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <div className="card scale-in" style={{ maxWidth: 480, width: '100%', textAlign: 'center', padding: 40 }}>
            <div style={{ width: 72, height: 72, background: 'var(--gradient-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(3,105,161,0.3)' }}>
              <CheckCircle size={32} color="white" />
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Appointment Booked! 🎉</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.7 }}>
              Your appointment with <strong>{doctor?.fullName}</strong> on <strong>{selectedDate.toDateString()}</strong> at <strong>{selectedTime}</strong> has been requested.
            </div>
            <div style={{ fontSize: 13, color: '#B45309', background: '#FFFBEB', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 24, border: '1px solid #FDE68A' }}>
              ⏳ Next step: Complete your payment to get a confirmed appointment number.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/appointments')} id="view-bookings-btn">View My Appointments</button>
              <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} id="go-to-dashboard-btn">Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar
          title={doctor?.fullName || 'Book Appointment'}
          subtitle="Select a date and time for your consultation"
          actions={<button className="btn btn-ghost btn-sm" onClick={() => navigate('/find-doctor')} id="back-to-find-doctor-btn"><ArrowLeft size={14} /> Back</button>}
        />
        <div className="page-body fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

            {/* Doctor Profile & Booking Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Doctor Info */}
              <div className="card">
                <div style={{ background: 'var(--gradient-hero)', padding: '24px 28px', color: 'white', borderRadius: 'var(--r-lg) var(--r-lg) 0 0' }}>
                  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>
                      {doctor?.fullName ? doctor.fullName.replace('Dr.', '').trim().split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'DR'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800 }}>{doctor?.fullName}</div>
                      <div style={{ fontSize: 14, opacity: 0.85, marginTop: 2 }}>{doctor?.specialties?.map((s: any) => s.name).join(', ')}</div>
                      <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>{doctor?.qualifications}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                          <Star size={13} fill="gold" color="gold" /> <strong>{doctor?.averageRating?.toFixed(1) || '—'}</strong> ({doctor?.reviewCount || 0} reviews)
                        </div>
                        <div style={{ fontSize: 13, opacity: 0.85 }}>🏥 {doctor?.experienceYears} yrs exp</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>Consultation Fee</div>
                      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900 }}>Rs. {doctor?.consultationFee?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                {doctor?.bio && (
                  <div className="card-body" style={{ borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{doctor.bio}</div>
                  </div>
                )}
              </div>

              {/* Calendar */}
              <div className="card">
                <div className="card-header">
                  <div className="section-title" style={{ fontSize: 15 }}><Calendar size={16} style={{ marginRight: 6, color: 'var(--med-blue)' }} />Select Date</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={prevWeek} id="prev-week-btn"><ChevronLeft size={15} /></button>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={nextWeek} id="next-week-btn"><ChevronRight size={15} /></button>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                    {weekDays.map((day, idx) => {
                      const isPast = day < new Date(new Date().setHours(0,0,0,0));
                      const isSelected = day.toDateString() === selectedDate.toDateString();
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <button
                          key={idx}
                          onClick={() => !isPast && setSelectedDate(day)}
                          id={`date-btn-${day.toISOString().slice(0,10)}`}
                          disabled={isPast}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '10px 4px', borderRadius: 'var(--r-md)', border: '1.5px solid',
                            borderColor: isSelected ? 'transparent' : isToday ? 'var(--med-blue)' : 'var(--border)',
                            background: isSelected ? 'var(--gradient-primary)' : isToday ? 'var(--med-blue-50)' : 'var(--surface)',
                            color: isSelected ? 'white' : isPast ? 'var(--text-xmuted)' : 'var(--text-primary)',
                            cursor: isPast ? 'not-allowed' : 'pointer',
                            transition: 'var(--transition-spring)',
                            transform: isSelected ? 'scale(1.05)' : 'none',
                            boxShadow: isSelected ? '0 4px 12px rgba(3,105,161,0.25)' : 'none',
                          }}
                        >
                          <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7 }}>
                            {day.toLocaleDateString('en', { weekday: 'narrow' })}
                          </div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{day.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="card">
                <div className="card-header">
                  <div className="section-title" style={{ fontSize: 15 }}>
                    <Clock size={16} style={{ marginRight: 6, color: 'var(--med-blue)' }} />
                    Available Times — {selectedDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {timeSlots.map(({ time, available }) => (
                      <button
                        key={time}
                        onClick={() => available && setSelectedTime(time)}
                        id={`time-slot-${time}`}
                        disabled={!available}
                        style={{
                          padding: '10px 8px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700,
                          border: '1.5px solid',
                          borderColor: selectedTime === time ? 'transparent' : available ? 'var(--border-strong)' : 'var(--border)',
                          background: selectedTime === time ? 'var(--gradient-primary)' : available ? 'var(--surface)' : 'var(--surface-3)',
                          color: selectedTime === time ? 'white' : available ? 'var(--text-primary)' : 'var(--text-xmuted)',
                          cursor: available ? 'pointer' : 'not-allowed',
                          transition: 'var(--transition-spring)',
                          transform: selectedTime === time ? 'scale(1.04)' : 'none',
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'var(--gradient-primary)', borderRadius: 2 }} /> Selected</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 2 }} /> Available</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'var(--surface-3)', borderRadius: 2 }} /> Booked</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div>
              <div className="card" style={{ position: 'sticky', top: 80 }}>
                <div className="card-header">
                  <div className="section-title" style={{ fontSize: 15 }}>Booking Summary</div>
                </div>
                <div className="card-body">
                  <form onSubmit={handleBook} id="booking-form">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Doctor</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doctor?.fullName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Date</span>
                        <span style={{ fontWeight: 600 }}>{selectedDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Time</span>
                        <span style={{ fontWeight: 600, color: selectedTime ? 'var(--text-primary)' : 'var(--text-muted)' }}>{selectedTime || '— Select a slot'}</span>
                      </div>
                      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                        <span style={{ fontWeight: 700 }}>Consultation Fee</span>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--med-blue)' }}>Rs. {doctor?.consultationFee?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Notes for Doctor <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                      <textarea
                        className="form-textarea"
                        id="booking-notes"
                        placeholder="Any specific concerns or information for the doctor..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {bookError && <div className="form-error"><AlertCircle size={14} />{bookError}</div>}

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%' }}
                      disabled={booking || !selectedTime}
                      id="confirm-booking-btn"
                    >
                      {booking ? <><Loader size={16} className="spin" /> Booking...</> : <>Confirm Booking</>}
                    </button>

                    <div className="ai-disclaimer" style={{ marginTop: 14 }}>
                      <AlertCircle size={12} style={{ flexShrink: 0 }} />
                      <span>Payment will be required after booking to confirm your appointment.</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
