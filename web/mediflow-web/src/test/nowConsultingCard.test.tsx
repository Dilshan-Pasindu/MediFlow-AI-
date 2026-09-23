import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import NowConsultingCard from '../components/NowConsultingCard';
import * as api from '../services/api';
import { consultationHubService } from '../services/consultationHubService';
import type { ConsultationEventPayload, CurrentConsultationResponse } from '../types/consultation';

// Mock dependencies
vi.mock('../services/api', () => ({
  apiGetCurrentConsultation: vi.fn(),
}));

const { mockDoctors } = vi.hoisted(() => ({
  mockDoctors: [
    { id: 10, fullName: 'Dr. Sarah Connor', specialties: [{ id: 1, name: 'Cardiology' }] },
    { id: 15, fullName: 'Dr. Leonard McCoy', specialties: [{ id: 2, name: 'General Medicine' }] },
    { id: 20, fullName: 'Dr. Strange', specialties: [{ id: 3, name: 'Surgery' }] },
    { id: 25, fullName: 'Dr. Silva', specialties: [{ id: 4, name: 'General Practice' }] },
    { id: 30, fullName: 'Dr. Perera', specialties: [{ id: 5, name: 'Dermatology' }] },
  ],
}));

vi.mock('../hooks', () => ({
  useDoctors: vi.fn().mockReturnValue({
    data: mockDoctors,
    isLoading: false,
  }),
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

describe('NowConsultingCard Component with Doctor Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    startedCallbacks = [];
    endedCallbacks = [];
    reconnectedCallbacks = [];
  });

  it('renders initial state prompting patient to select a doctor', async () => {
    render(<NowConsultingCard />);

    expect(screen.getByLabelText(/select doctor/i)).toBeInTheDocument();
    expect(screen.getByText(/please select a doctor to view their live consultation status/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTitle('Real-time SignalR active')).toBeInTheDocument();
    });
    expect(api.apiGetCurrentConsultation).not.toHaveBeenCalled();
  });

  it('fetches and displays consultation when patient selects Dr. Silva', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: true,
      appointmentId: 201,
      appointmentNumber: 'A023',
      doctorId: 25,
      doctorName: 'Dr. Silva',
      status: 'InConsultation',
      startedAt: new Date().toISOString(),
    } as CurrentConsultationResponse);

    render(<NowConsultingCard />);

    const select = screen.getByLabelText(/select doctor/i);
    fireEvent.change(select, { target: { value: '25' } });

    await waitFor(() => {
      expect(api.apiGetCurrentConsultation).toHaveBeenCalledWith(25);
    });

    await waitFor(() => {
      expect(screen.getByText('A023')).toBeInTheDocument();
    });

    expect(screen.getByText(/NOW CONSULTING/i)).toBeInTheDocument();
    expect(screen.getByText(/Currently Consulting:/i)).toBeInTheDocument();
    expect(consultationHubService.joinDoctorQueue).toHaveBeenCalledWith(25);
  });

  it('automatically updates appointment number when Dr. Silva starts consulting A024', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: true,
      appointmentId: 201,
      appointmentNumber: 'A023',
      doctorId: 25,
      doctorName: 'Dr. Silva',
      status: 'InConsultation',
      startedAt: new Date().toISOString(),
    } as CurrentConsultationResponse);

    render(<NowConsultingCard doctorId={25} />);

    await waitFor(() => {
      expect(screen.getByText('A023')).toBeInTheDocument();
    });

    // Dr. Silva moves to the next appointment A024
    act(() => {
      startedCallbacks.forEach((cb) =>
        cb({
          appointmentId: 202,
          appointmentNumber: 'A024',
          doctorId: 25,
          doctorName: 'Dr. Silva',
          status: 'InConsultation',
          startedAt: new Date().toISOString(),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('A024')).toBeInTheDocument();
    });
    expect(screen.queryByText('A023')).not.toBeInTheDocument();
  });

  it('switches consultation state immediately when changing doctor to Dr. Perera and isolates events', async () => {
    // Initial: Dr. Silva has A023
    vi.mocked(api.apiGetCurrentConsultation).mockImplementation(async (docId) => {
      if (docId === 25) {
        return {
          hasActiveConsultation: true,
          appointmentId: 201,
          appointmentNumber: 'A023',
          doctorId: 25,
          doctorName: 'Dr. Silva',
          status: 'InConsultation',
        };
      }
      if (docId === 30) {
        return {
          hasActiveConsultation: true,
          appointmentId: 301,
          appointmentNumber: 'B011',
          doctorId: 30,
          doctorName: 'Dr. Perera',
          status: 'InConsultation',
        };
      }
      return { hasActiveConsultation: false };
    });

    render(<NowConsultingCard doctorId={25} />);

    await waitFor(() => {
      expect(screen.getByText('A023')).toBeInTheDocument();
    });

    // Patient changes selector to Dr. Perera (id: 30)
    const select = screen.getByLabelText(/select doctor/i);
    fireEvent.change(select, { target: { value: '30' } });

    await waitFor(() => {
      expect(screen.getByText('B011')).toBeInTheDocument();
    });

    // Verify queue management: left Dr. Silva (25), joined Dr. Perera (30)
    expect(consultationHubService.leaveDoctorQueue).toHaveBeenCalledWith(25);
    expect(consultationHubService.joinDoctorQueue).toHaveBeenCalledWith(30);

    // Event arrives for the PREVIOUS doctor (Dr. Silva, id: 25)
    act(() => {
      startedCallbacks.forEach((cb) =>
        cb({
          appointmentId: 299,
          appointmentNumber: 'A999',
          doctorId: 25,
          doctorName: 'Dr. Silva',
          status: 'InConsultation',
        })
      );
    });

    // Patient must NOT receive or display Dr. Silva's update; B011 remains displayed!
    expect(screen.getByText('B011')).toBeInTheDocument();
    expect(screen.queryByText('A999')).not.toBeInTheDocument();
  });

  it('displays inactive message when selected doctor has no active consultation', async () => {
    vi.mocked(api.apiGetCurrentConsultation).mockResolvedValue({
      hasActiveConsultation: false,
      doctorId: 25,
      doctorName: 'Dr. Silva',
      message: 'No appointment is currently being consulted.',
    } as CurrentConsultationResponse);

    render(<NowConsultingCard doctorId={25} />);

    await waitFor(() => {
      expect(screen.getByText(/no appointment is currently being consulted/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Dr\. Silva is not in an active consultation session right now/i)).toBeInTheDocument();

    // Subsequently, Dr. Silva starts a consultation
    act(() => {
      startedCallbacks.forEach((cb) =>
        cb({
          appointmentId: 201,
          appointmentNumber: 'A023',
          doctorId: 25,
          doctorName: 'Dr. Silva',
          status: 'InConsultation',
          startedAt: new Date().toISOString(),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('A023')).toBeInTheDocument();
    });
  });

  it('re-fetches selected doctor consultation state when SignalR reconnects', async () => {
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
      expect(api.apiGetCurrentConsultation).toHaveBeenLastCalledWith(25);
    });
  });
});
