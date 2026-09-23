import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Stethoscope, Radio, Clock, ChevronDown, UserCheck } from 'lucide-react';
import { apiGetCurrentConsultation } from '../services/api';
import { consultationHubService } from '../services/consultationHubService';
import { useDoctors } from '../hooks';
import type { CurrentConsultationResponse, ConsultationEventPayload } from '../types/consultation';
import type { DoctorDetail } from '../types/doctor';

interface NowConsultingCardProps {
  doctorId?: number;
  doctorName?: string;
  doctors?: DoctorDetail[];
  className?: string;
  style?: React.CSSProperties;
}

export default function NowConsultingCard({
  doctorId,
  doctorName,
  doctors: propDoctors,
  className = '',
  style = {},
}: NowConsultingCardProps) {
  // Fetch available doctors from API hook
  const { data: fetchedDoctors = [], isLoading: loadingDoctors } = useDoctors();
  const availableDoctors = propDoctors && propDoctors.length > 0 ? propDoctors : fetchedDoctors;

  const [selectedDoctorId, setSelectedDoctorId] = useState<number | undefined>(doctorId);
  const [consultation, setConsultation] = useState<CurrentConsultationResponse | null>(null);
  const [loadingConsultation, setLoadingConsultation] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Keep a ref to the current selected doctor ID to prevent stale closures in SignalR callbacks
  const selectedDoctorIdRef = useRef<number | undefined>(selectedDoctorId);
  selectedDoctorIdRef.current = selectedDoctorId;

  // Track the SignalR group currently joined
  const joinedDoctorGroupRef = useRef<number | null>(null);

  // Sync prop changes if doctorId prop is updated from outside
  useEffect(() => {
    if (doctorId !== undefined) {
      setSelectedDoctorId(doctorId);
    }
  }, [doctorId]);

  // Fetch consultation state for a specific doctor
  const fetchConsultationForDoctor = useCallback(async (docId: number) => {
    setLoadingConsultation(true);
    try {
      const data = await apiGetCurrentConsultation(docId);
      // Ensure the response matches the currently selected doctor
      if (selectedDoctorIdRef.current === docId) {
        setConsultation(data);
      }
    } catch (err) {
      console.warn('Failed to fetch current consultation status:', err);
      if (selectedDoctorIdRef.current === docId) {
        setConsultation({
          hasActiveConsultation: false,
          doctorId: docId,
          message: 'No appointment is currently being consulted.',
        });
      }
    } finally {
      if (selectedDoctorIdRef.current === docId) {
        setLoadingConsultation(false);
      }
    }
  }, []);

  // When selectedDoctorId changes, fetch their consultation & adjust SignalR groups
  useEffect(() => {
    if (!selectedDoctorId) {
      setConsultation(null);
      setLoadingConsultation(false);
      if (joinedDoctorGroupRef.current) {
        consultationHubService.leaveDoctorQueue(joinedDoctorGroupRef.current);
        joinedDoctorGroupRef.current = null;
      }
      return;
    }

    // 1. Fetch current consultation for the newly selected doctor
    fetchConsultationForDoctor(selectedDoctorId);

    // 2. Switch SignalR doctor queue group
    if (joinedDoctorGroupRef.current && joinedDoctorGroupRef.current !== selectedDoctorId) {
      consultationHubService.leaveDoctorQueue(joinedDoctorGroupRef.current);
      joinedDoctorGroupRef.current = null;
    }

    consultationHubService.joinDoctorQueue(selectedDoctorId);
    joinedDoctorGroupRef.current = selectedDoctorId;
  }, [selectedDoctorId, fetchConsultationForDoctor]);

  // Manage SignalR lifecycle and event subscriptions
  useEffect(() => {
    let isMounted = true;

    // Establish / reuse SignalR connection
    consultationHubService
      .startConnection()
      .then(() => {
        if (isMounted) {
          setIsConnected(true);
          if (selectedDoctorIdRef.current) {
            consultationHubService.joinDoctorQueue(selectedDoctorIdRef.current);
            joinedDoctorGroupRef.current = selectedDoctorIdRef.current;
          }
        }
      })
      .catch((err) => {
        console.warn('SignalR initialization note:', err);
      });

    // Listen for ConsultationStarted
    const unsubStarted = consultationHubService.onConsultationStarted((payload: ConsultationEventPayload) => {
      if (!isMounted) return;
      // STRICT FILTER: Patient must not receive or display updates belonging to another doctor
      if (!selectedDoctorIdRef.current || payload.doctorId !== selectedDoctorIdRef.current) {
        return;
      }

      setConsultation({
        hasActiveConsultation: true,
        appointmentId: payload.appointmentId,
        appointmentNumber: payload.appointmentNumber,
        doctorId: payload.doctorId,
        doctorName: payload.doctorName,
        patientName: payload.patientName,
        status: payload.status,
        startedAt: payload.startedAt,
      });
    });

    // Listen for ConsultationEnded
    const unsubEnded = consultationHubService.onConsultationEnded((payload: ConsultationEventPayload) => {
      if (!isMounted) return;
      // STRICT FILTER: Patient must not receive or display updates belonging to another doctor
      if (!selectedDoctorIdRef.current || payload.doctorId !== selectedDoctorIdRef.current) {
        return;
      }

      setConsultation({
        hasActiveConsultation: false,
        doctorId: payload.doctorId,
        doctorName: payload.doctorName,
        message: 'No appointment is currently being consulted.',
      });
    });

    // Reconnection handling: Re-join active doctor queue and re-sync database state
    const unsubReconnected = consultationHubService.onReconnected(() => {
      if (isMounted) {
        setIsConnected(true);
        if (selectedDoctorIdRef.current) {
          consultationHubService.joinDoctorQueue(selectedDoctorIdRef.current);
          fetchConsultationForDoctor(selectedDoctorIdRef.current);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubStarted();
      unsubEnded();
      unsubReconnected();
      if (joinedDoctorGroupRef.current) {
        consultationHubService.leaveDoctorQueue(joinedDoctorGroupRef.current);
        joinedDoctorGroupRef.current = null;
      }
    };
  }, [fetchConsultationForDoctor]);

  const hasActive = consultation?.hasActiveConsultation === true;

  // Resolve doctor display name
  const selectedDoc = availableDoctors.find((d) => d.id === selectedDoctorId);
  const rawDoctorName = selectedDoc?.fullName || consultation?.doctorName || doctorName || '';
  const formattedDoctorName = rawDoctorName
    ? rawDoctorName.startsWith('Dr.')
      ? rawDoctorName
      : `Dr. ${rawDoctorName}`
    : '';

  return (
    <div
      id="now-consulting-banner"
      className={`card ${className}`}
      style={{
        borderRadius: 'var(--r-xl)',
        position: 'relative',
        overflow: 'hidden',
        border: hasActive ? '2px solid #EF4444' : '1px solid var(--border)',
        background: hasActive
          ? 'linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 55%, #FFF1F2 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
        boxShadow: hasActive
          ? '0 10px 30px -4px rgba(239, 68, 68, 0.16), 0 2px 6px rgba(0, 0, 0, 0.04)'
          : 'var(--shadow-sm)',
        transition: 'all 0.3s ease-in-out',
        ...style,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          height: 3,
          width: '100%',
          background: hasActive
            ? 'linear-gradient(90deg, #DC2626 0%, #EF4444 50%, #F87171 100%)'
            : 'var(--border)',
        }}
      />

      <div style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          {/* Main Content Area */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
            {/* Status Icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: hasActive ? '#FEE2E2' : 'var(--surface-2)',
                border: hasActive ? '2px solid #FCA5A5' : '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: hasActive ? '#DC2626' : 'var(--text-muted)',
                flexShrink: 0,
                marginTop: 2,
                boxShadow: hasActive ? '0 0 0 4px rgba(239, 68, 68, 0.12)' : 'none',
              }}
            >
              {hasActive ? <Stethoscope size={22} className="spin-subtle" /> : <Radio size={20} />}
            </div>

            <div style={{ flex: 1 }}>
              {/* Header Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: 0.6,
                    textTransform: 'uppercase',
                    color: hasActive ? '#B91C1C' : 'var(--text-secondary)',
                    background: hasActive ? '#FEE2E2' : 'var(--surface-3)',
                    padding: '3px 10px',
                    borderRadius: 99,
                    border: hasActive ? '1px solid #FECACA' : '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: hasActive ? '#DC2626' : 'var(--text-muted)',
                      display: 'inline-block',
                      boxShadow: hasActive ? '0 0 8px #DC2626' : 'none',
                    }}
                  />
                  {hasActive ? 'NOW CONSULTING' : 'CONSULTATION STATUS'}
                </span>

                {isConnected && (
                  <span
                    title="Real-time SignalR active"
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: '#059669',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                    Live
                  </span>
                )}
              </div>

              {/* Doctor Selector Dropdown */}
              <div style={{ marginTop: 12, marginBottom: 12 }}>
                <label
                  htmlFor="now-consulting-doctor-select"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                    letterSpacing: 0.2,
                  }}
                >
                  <UserCheck size={14} color="#059669" />
                  Select Doctor:
                </label>
                <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: 340 }}>
                  <select
                    id="now-consulting-doctor-select"
                    value={selectedDoctorId ?? ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setSelectedDoctorId(val);
                    }}
                    style={{
                      width: '100%',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      background: '#FFFFFF',
                      color: 'var(--text-primary)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      padding: '9px 36px 9px 14px',
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#059669';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <option value="">-- Select a Doctor --</option>
                    {availableDoctors.map((doc) => {
                      const dName = doc.fullName.startsWith('Dr.') ? doc.fullName : `Dr. ${doc.fullName}`;
                      const spec = doc.specialties?.[0]?.name ? ` • ${doc.specialties[0].name}` : '';
                      return (
                        <option key={doc.id} value={doc.id}>
                          {dName}{spec}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Consultation Details or Inactive Status */}
              {!selectedDoctorId ? (
                /* State 1: No doctor selected yet */
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Please select a doctor to view their live consultation status.
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Choose a consulting physician from the dropdown above to monitor their live appointment queue in real time.
                  </div>
                </div>
              ) : loadingConsultation ? (
                /* State 2: Loading consultation status */
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="skeleton" style={{ width: 180, height: 18, borderRadius: 4 }} />
                </div>
              ) : hasActive ? (
                /* State 3: Active Consultation for selected doctor */
                <div style={{ marginTop: 4 }}>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#B91C1C',
                      letterSpacing: 0.5,
                      marginBottom: 4,
                    }}
                  >
                    Currently Consulting:
                  </div>
                  <div
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 20,
                      fontWeight: 900,
                      color: '#1E293B',
                      letterSpacing: -0.3,
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 8,
                    }}
                  >
                    <span>Appointment No:</span>
                    <span
                      style={{
                        color: '#DC2626',
                        background: '#FEF2F2',
                        padding: '2px 10px',
                        borderRadius: 'var(--r-md)',
                        border: '1.5px solid #FCA5A5',
                        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.1)',
                      }}
                      id="now-consulting-appointment-number"
                    >
                      {consultation?.appointmentNumber || `#${consultation?.appointmentId}`}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: '#475569', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>The doctor is currently consulting this appointment.</span>
                    {formattedDoctorName && (
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        • {formattedDoctorName}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* State 4: Selected doctor has no active consultation */
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    No appointment is currently being consulted.
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {formattedDoctorName
                      ? `${formattedDoctorName} is not in an active consultation session right now.`
                      : 'When this doctor calls an appointment number, it will appear here in real time.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right badge / Time */}
          {hasActive && consultation?.startedAt && (
            <div
              style={{
                textAlign: 'right',
                display: 'none',
                flexShrink: 0,
              }}
              className="consult-timer-block"
            >
              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <Clock size={12} /> Started
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                {new Date(consultation.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
