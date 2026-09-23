import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, CheckCircle, Loader, AlertCircle, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useDoctor, useBookAppointment } from '../hooks';

interface TimeSlot {
  time: string;
  available: boolean;
  isPast: boolean;
}

function generateTimeSlots(selectedDate: Date, doctorId?: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();
  const isToday = selectedDate.toDateString() === now.toDateString();
  const minAllowedTime = now.getTime() + 15 * 60 * 1000; // 15-minute lead time buffer

  for (let h = 9; h <= 17; h++) {
    const times = [`${h.toString().padStart(2, '0')}:00`];
    if (h < 17) times.push(`${h.toString().padStart(2, '0')}:30`);

    for (const time of times) {
      const [slotH, slotM] = time.split(':').map(Number);
      const slotDate = new Date(selectedDate);
      slotDate.setHours(slotH, slotM, 0, 0);

      const isPast = isToday && slotDate.getTime() <= minAllowedTime;

      // Deterministic availability based on doctor ID, date, and hour
      const seed = Math.abs((selectedDate.getDate() * 17 + selectedDate.getMonth() * 31 + (doctorId || 1) * 7 + slotH * 3 + (slotM === 30 ? 1 : 0)) % 10);
      const isAvailable = !isPast && seed > 2;

      slots.push({
        time,
        available: isAvailable,
        isPast,
      });
    }
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
  const { data: doctor, isLoading: loading } = useDoctor(id);
  const bookAppointment = useBookAppointment();

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxBookingDate = useMemo(() => {
    const d = new Date(todayStart);
    d.setDate(d.getDate() + 60); // 60 days max booking window
    return d;
  }, [todayStart]);

  const [selectedDate, setSelectedDate] = useState<Date>(todayStart);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [booked, setBooked] = useState(false);
  const [bookError, setBookError] = useState('');

  const timeSlots = useMemo(
    () => generateTimeSlots(selectedDate, doctor?.id),
    [selectedDate, doctor?.id]
  );

  const weekDays = useMemo(() => getDaysInWeek(weekStart), [weekStart]);

  // If the currently selected time becomes invalid on a date switch, reset it
  function handleDateSelect(day: Date) {
    setSelectedDate(day);
    setBookError('');
    if (selectedTime) {
      const updatedSlots = generateTimeSlots(day, doctor?.id);
      const slot = updatedSlots.find(s => s.time === selectedTime);
      if (!slot || !slot.available) {
        setSelectedTime(null);
      }
    }
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    setBookError('');
  }

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    if (value.length <= 500) {
      setNotes(value);
      if (bookError.includes('Notes')) {
        setBookError('');
      }
    }
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();

    if (!doctor) {
      setBookError('Doctor information is still loading. Please wait a moment.');
      return;
    }

    if (doctor.isActive === false) {
      setBookError('This doctor is currently not accepting new appointments.');
      return;
    }

    if (!selectedTime) {
      setBookError('Please select an available consultation time slot.');
      return;
    }

    const [h, m] = selectedTime.split(':').map(Number);
    const dt = new Date(selectedDate);
    dt.setHours(h, m, 0, 0);

    if (dt.getTime() <= Date.now()) {
      setBookError('The selected time slot has already passed. Please select an upcoming slot.');
      return;
    }

    if (notes.length > 500) {
      setBookError('Notes cannot exceed 500 characters.');
      return;
    }

    setBookError('');

    bookAppointment.mutate(
      {
        doctorId: Number(id) || doctor.id,
        dateTime: dt.toISOString(),
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => setBooked(true),
        onError: (err: Error) => {
          setBookError(err?.message || 'Booking failed. Please check your selection and try again.');
        },
      }
    );
  }

  function prevWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    if (d.getTime() + 7 * 86400000 >= todayStart.getTime()) {
      setWeekStart(d);
    }
  }

  function nextWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    if (d.getTime() <= maxBookingDate.getTime()) {
      setWeekStart(d);
    }
  }

  const isDoctorInactive = doctor && doctor.isActive === false;

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <TopBar title="Book Appointment" />
          <div className="page-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <Loader size={28} className="spin" style={{ color: 'var(--med-blue)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (booked) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <TopBar title="Booking Confirmed" />
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
  }

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

              {/* Inactive Doctor Warning */}
              {isDoctorInactive && (
                <div style={{ padding: '14px 18px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 'var(--r-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#991B1B' }}>Doctor Unavailable for Booking</div>
                    <div style={{ fontSize: 13, color: '#B91C1C' }}>Dr. {doctor?.fullName} is currently not accepting new appointments. Please choose another specialist.</div>
                  </div>
                </div>
              )}

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
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={prevWeek} id="prev-week-btn" disabled={weekStart <= todayStart}><ChevronLeft size={15} /></button>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={nextWeek} id="next-week-btn" disabled={weekStart >= maxBookingDate}><ChevronRight size={15} /></button>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                    {weekDays.map((day, idx) => {
                      const isPast = day < todayStart;
                      const isTooFar = day > maxBookingDate;
                      const isDisabled = isPast || isTooFar || isDoctorInactive;
                      const isSelected = day.toDateString() === selectedDate.toDateString();
                      const isToday = day.toDateString() === new Date().toDateString();

                      return (
                        <button
                          key={idx}
                          onClick={() => !isDisabled && handleDateSelect(day)}
                          id={`date-btn-${day.toISOString().slice(0,10)}`}
                          disabled={isDisabled}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '10px 4px', borderRadius: 'var(--r-md)', border: '1.5px solid',
                            borderColor: isSelected ? 'transparent' : isToday ? 'var(--med-blue)' : 'var(--border)',
                            background: isSelected ? 'var(--gradient-primary)' : isToday ? 'var(--med-blue-50)' : 'var(--surface)',
                            color: isSelected ? 'white' : isDisabled ? 'var(--text-xmuted)' : 'var(--text-primary)',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            opacity: isDisabled ? 0.45 : 1,
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
                    {timeSlots.map(({ time, available, isPast }) => {
                      const isSelected = selectedTime === time;
                      const isDisabled = !available || isDoctorInactive;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => !isDisabled && handleTimeSelect(time)}
                          id={`time-slot-${time}`}
                          disabled={isDisabled}
                          title={isPast ? 'Slot has passed for today' : !available ? 'Slot is fully booked' : 'Click to select slot'}
                          style={{
                            padding: '10px 8px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700,
                            border: '1.5px solid',
                            borderColor: isSelected ? 'transparent' : available ? 'var(--border-strong)' : 'var(--border)',
                            background: isSelected ? 'var(--gradient-primary)' : available ? 'var(--surface)' : 'var(--surface-3)',
                            color: isSelected ? 'white' : available ? 'var(--text-primary)' : 'var(--text-xmuted)',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            opacity: isPast ? 0.35 : available ? 1 : 0.6,
                            transition: 'var(--transition-spring)',
                            transform: isSelected ? 'scale(1.04)' : 'none',
                          }}
                        >
                          {time} {isPast ? '(Past)' : ''}
                        </button>
                      );
                    })}
                  </div>

                  {timeSlots.every(s => !s.available) && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--r-md)', fontSize: 13, color: '#B45309' }}>
                      ⚠️ No consultation slots are available for this date. Please select another day.
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'var(--gradient-primary)', borderRadius: 2 }} /> Selected</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 2 }} /> Available</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, background: 'var(--surface-3)', borderRadius: 2 }} /> Booked / Past</div>
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
                        <span style={{ fontWeight: 600, color: selectedTime ? 'var(--text-primary)' : 'var(--danger)' }}>
                          {selectedTime || '— Select a slot'}
                        </span>
                      </div>
                      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                        <span style={{ fontWeight: 700 }}>Consultation Fee</span>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--med-blue)' }}>Rs. {doctor?.consultationFee?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label className="form-label" style={{ marginBottom: 0 }}>
                          Notes for Doctor <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
                        </label>
                        <span style={{ fontSize: 11, color: notes.length >= 480 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: notes.length >= 480 ? 700 : 400 }}>
                          {notes.length} / 500
                        </span>
                      </div>
                      <textarea
                        className="form-textarea"
                        id="booking-notes"
                        placeholder="Any specific symptoms, medical history, or questions for the doctor..."
                        value={notes}
                        onChange={handleNotesChange}
                        maxLength={500}
                        rows={3}
                        disabled={isDoctorInactive}
                      />
                    </div>

                    {bookError && (
                      <div className="form-error" style={{ marginBottom: 14 }}>
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span>{bookError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%' }}
                      disabled={bookAppointment.isPending || !selectedTime || isDoctorInactive}
                      id="confirm-booking-btn"
                    >
                      {bookAppointment.isPending ? <><Loader size={16} className="spin" /> Booking...</> : <>Confirm Booking</>}
                    </button>

                    <div className="ai-disclaimer" style={{ marginTop: 14 }}>
                      <AlertCircle size={12} style={{ flexShrink: 0 }} />
                      <span>Payment will be required after booking to confirm your queue number.</span>
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
