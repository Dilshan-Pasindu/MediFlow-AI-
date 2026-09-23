import React, { useEffect, useState, useCallback } from 'react';
import { Stethoscope, Radio, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import { apiGetCurrentConsultation } from '../services/api';
import { consultationHubService } from '../services/consultationHubService';
import type { CurrentConsultationResponse, ConsultationEventPayload } from '../types/consultation';

interface NowConsultingCardProps {
  doctorId?: number;
  doctorName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function NowConsultingCard({
  doctorId,
  doctorName,
  className = '',
  style = {},
}: NowConsultingCardProps) {
  const [consultation, setConsultation] = useState<CurrentConsultationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const fetchCurrentConsultation = useCallback(async () => {
    try {
      const data = await apiGetCurrentConsultation(doctorId);
      setConsultation(data);
    } catch (err) {
      console.warn('Failed to fetch current consultation status:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Load: Request the current consultation state from the API (database source of truth)
    fetchCurrentConsultation();

    // 2. Establish / reuse SignalR connection
    consultationHubService
      .startConnection()
      .then(() => {
        if (isMounted) {
          setIsConnected(true);
          if (doctorId) {
            consultationHubService.joinDoctorQueue(doctorId);
          }
        }
      })
      .catch((err) => {
        console.warn('SignalR initialization note:', err);
      });

    // 3. Listen for ConsultationStarted
    const unsubStarted = consultationHubService.onConsultationStarted((payload: ConsultationEventPayload) => {
      if (!isMounted) return;
      if (doctorId && payload.doctorId !== doctorId) return;

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

    // 4. Listen for ConsultationEnded
    const unsubEnded = consultationHubService.onConsultationEnded((payload: ConsultationEventPayload) => {
      if (!isMounted) return;
      if (doctorId && payload.doctorId !== doctorId) return;

      setConsultation((prev) => {
        if (!prev || !prev.hasActiveConsultation) return prev;
        // If matches the ending appointment or doctor, set inactive
        if (prev.appointmentId === payload.appointmentId || prev.doctorId === payload.doctorId) {
          return {
            hasActiveConsultation: false,
            doctorId: payload.doctorId,
            message: 'No appointment is currently being consulted.',
          };
        }
        return prev;
      });
    });

    // 5. Handle SignalR Reconnection: Sync with database state
    const unsubReconnected = consultationHubService.onReconnected(() => {
      if (isMounted) {
        setIsConnected(true);
        fetchCurrentConsultation();
      }
    });

    return () => {
      isMounted = false;
      unsubStarted();
      unsubEnded();
      unsubReconnected();
      if (doctorId) {
        consultationHubService.leaveDoctorQueue(doctorId);
      }
    };
  }, [doctorId, fetchCurrentConsultation]);

  const hasActive = consultation?.hasActiveConsultation === true;

  if (loading) {
    return (
      <div
        className={`card ${className}`}
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--r-xl)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 6, borderRadius: 4 }} />
            <div className="skeleton" style={{ width: '65%', height: 12, borderRadius: 4 }} />
          </div>
        </div>
      </div>
    );
  }

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
      {/* Top accent bar */}
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
          {/* Left badge & status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                boxShadow: hasActive ? '0 0 0 4px rgba(239, 68, 68, 0.12)' : 'none',
              }}
            >
              {hasActive ? <Stethoscope size={22} className="spin-subtle" /> : <Radio size={20} />}
            </div>

            <div>
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

              {hasActive ? (
                <div style={{ marginTop: 6 }}>
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
                    {consultation?.doctorName && (
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        • {consultation.doctorName.startsWith('Dr.') ? consultation.doctorName : `Dr. ${consultation.doctorName}`}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    No appointment is currently being consulted.
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {doctorName
                      ? `${doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`} is not in an active consultation session right now.`
                      : 'When your doctor calls an appointment number, it will appear here in real time.'}
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
