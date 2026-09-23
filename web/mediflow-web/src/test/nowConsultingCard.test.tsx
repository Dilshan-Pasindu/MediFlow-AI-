import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import NowConsultingCard from '../components/NowConsultingCard';
import * as api from '../services/api';
import { consultationHubService } from '../services/consultationHubService';
import type { ConsultationEventPayload, CurrentConsultationResponse } from '../types/consultation';

// Mock dependencies
vi.mock('../services/api', () => ({
  apiGetCurrentConsultation: vi.fn(),
}));

let startedCallbacks: Array<(data: ConsultationEventPayload) => void> = [];
let endedCallbacks: Array<(data: ConsultationEventPayload) => void> = [];
let reconnectedCallbacks: Array<() => void> = [];

vi.mock('../services/consultationHubService', () => ({
  consultationHubService: {
    startConnection: vi.fn().mockResolvedValue(undefined),
    joinDoctorQueue: vi.fn().mockResolvedValue(undefined),
    leaveDoctorQueue: vi.fn().mockResolvedValue(undefined),
    getConnectionState: vi.fn().mockReturnValue('Connected'),
    onConsultationStarted: vi.fn((cb) => {
      startedCallbacks.push(cb);
      return () => {
        const idx = startedCallbacks.indexOf(cb);
        if (idx !== -1) startedCallbacks.splice(idx, 1);
      };
    }),
    onConsultationEnded: vi.fn((cb) => {
      endedCallbacks.push(cb);
      return () => {
        const idx = endedCallbacks.indexOf(cb);
        if (idx !== -1) endedCallbacks.splice(idx, 1);
      };
    }),
    onReconnected: vi.fn((cb) => {
      reconnectedCallbacks.push(cb);
      return () => {
        const idx = reconnectedCallbacks.indexOf(cb);
        if (idx !== -1) reconnectedCallbacks.splice(idx, 1);
      };
    }),
  },
}));

describe('NowConsultingCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    startedCallbacks = [];
    endedCallbacks = [];
    reconnectedCallbacks = [];
  });

  it('renders inactive state when no consultation is active', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: false,
      message: 'No appointment is currently being consulted.',
    } as CurrentConsultationResponse);

    render(<NowConsultingCard doctorId={10} doctorName="Dr. Sarah Connor" />);

    await waitFor(() => {
      expect(screen.getByText(/no appointment is currently being consulted/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Dr\. Sarah Connor/i)).toBeInTheDocument();
  });

  it('renders active consultation details on initial load', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: true,
      appointmentId: 101,
      appointmentNumber: 'APT-0042',
      patientName: 'Jane Doe',
      doctorName: 'Dr. Gregory House',
      doctorId: 10,
      status: 'InConsultation',
      startedAt: new Date().toISOString(),
    } as CurrentConsultationResponse);

    render(<NowConsultingCard doctorId={10} />);

    await waitFor(() => {
      expect(screen.getByText('APT-0042')).toBeInTheDocument();
    });

    expect(screen.getByText(/NOW CONSULTING/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Gregory House/i)).toBeInTheDocument();
  });

  it('updates dynamically when SignalR ConsultationStarted event fires', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: false,
    } as CurrentConsultationResponse);

    render(<NowConsultingCard doctorId={15} />);

    await waitFor(() => {
      expect(screen.getByText(/no appointment is currently being consulted/i)).toBeInTheDocument();
    });

    // Simulate real-time SignalR event
    act(() => {
      startedCallbacks.forEach((cb) =>
        cb({
          appointmentId: 205,
          appointmentNumber: 'A023',
          doctorId: 15,
          doctorName: 'Dr. Leonard McCoy',
          patientName: 'Spock',
          status: 'InConsultation',
          startedAt: new Date().toISOString(),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('A023')).toBeInTheDocument();
    });

    expect(screen.getByText(/NOW CONSULTING/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Leonard McCoy/i)).toBeInTheDocument();
  });

  it('switches to inactive state when SignalR ConsultationEnded event fires', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: true,
      appointmentId: 301,
      appointmentNumber: 'A099',
      patientName: 'Clark Kent',
      doctorName: 'Dr. Strange',
      doctorId: 20,
      status: 'InConsultation',
      startedAt: new Date().toISOString(),
    } as CurrentConsultationResponse);

    render(<NowConsultingCard doctorId={20} />);

    await waitFor(() => {
      expect(screen.getByText('A099')).toBeInTheDocument();
    });

    // Simulate real-time ConsultationEnded event
    act(() => {
      endedCallbacks.forEach((cb) =>
        cb({
          appointmentId: 301,
          appointmentNumber: 'A099',
          doctorId: 20,
          doctorName: 'Dr. Strange',
          status: 'Completed',
          endedAt: new Date().toISOString(),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/no appointment is currently being consulted/i)).toBeInTheDocument();
    });
  });

  it('re-fetches state when SignalR reconnects', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: false,
    } as CurrentConsultationResponse);

    render(<NowConsultingCard doctorId={25} />);

    await waitFor(() => {
      expect(api.apiGetCurrentConsultation).toHaveBeenCalledTimes(1);
    });

    // Simulate SignalR reconnection
    await act(async () => {
      reconnectedCallbacks.forEach((cb) => cb());
    });

    await waitFor(() => {
      expect(api.apiGetCurrentConsultation).toHaveBeenCalledTimes(2);
    });
  });
});
