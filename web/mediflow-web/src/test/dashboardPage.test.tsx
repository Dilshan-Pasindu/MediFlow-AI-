import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

vi.mock('../services/api', () => ({
  getUser: vi.fn().mockReturnValue({
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'Patient',
  }),
}));

vi.mock('../hooks', () => ({
  useMyAppointments: () => ({
    data: [
      { id: 1, status: 'Confirmed', appointmentDateTime: '2026-10-01T10:00:00Z', doctorName: 'Dr. Smith', fee: 2500 },
      { id: 2, status: 'Completed', appointmentDateTime: '2026-09-01T10:00:00Z', doctorName: 'Dr. Jane', fee: 3000 },
    ],
    isLoading: false,
  }),
  useMyPrescriptions: () => ({
    data: [
      { id: 101, appointmentNumber: 'APP-101', status: 'Active' },
      { id: 102, appointmentNumber: 'APP-102', status: 'Active' },
    ],
    isLoading: false,
  }),
}));

vi.mock('../components/Sidebar', () => ({
  default: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

vi.mock('../components/TopBar', () => ({
  default: () => <div data-testid="mock-topbar">TopBar</div>,
}));

vi.mock('../components/NowConsultingCard', () => ({
  default: () => <div data-testid="mock-now-consulting">NowConsulting</div>,
}));

describe('DashboardPage Stat Cards', () => {
  it('does not display Health Score and displays the 3 active stat cards', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Health Score should NOT exist
    expect(screen.queryByText(/Health Score/i)).toBeNull();
    expect(screen.queryByText(/excellent/i)).toBeNull();

    // 3 active cards must exist
    const upcomingCard = document.getElementById('stat-card-upcoming');
    const completedCard = document.getElementById('stat-card-completed');
    const rxCard = document.getElementById('stat-card-prescriptions');

    expect(upcomingCard).toBeInTheDocument();
    expect(completedCard).toBeInTheDocument();
    expect(rxCard).toBeInTheDocument();

    expect(upcomingCard).toHaveTextContent('Upcoming');
    expect(completedCard).toHaveTextContent('Completed');
    expect(rxCard).toHaveTextContent('Prescriptions');
  });

  it('clicking Upcoming stat card navigates to /appointments?tab=upcoming', () => {
    let testLocation: any;
    function LocationChecker() {
      const location = window.location;
      return <div data-testid="location-check">{location.pathname + location.search}</div>;
    }

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<div data-testid="appointments-target">Appointments Route</div>} />
        </Routes>
      </MemoryRouter>
    );

    const upcomingCard = document.getElementById('stat-card-upcoming');
    expect(upcomingCard).not.toBeNull();
    fireEvent.click(upcomingCard!);

    expect(screen.getByTestId('appointments-target')).toBeInTheDocument();
  });

  it('clicking Completed stat card navigates to /appointments?tab=past', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<div data-testid="appointments-target">Appointments Route</div>} />
        </Routes>
      </MemoryRouter>
    );

    const completedCard = document.getElementById('stat-card-completed');
    expect(completedCard).not.toBeNull();
    fireEvent.click(completedCard!);

    expect(screen.getByTestId('appointments-target')).toBeInTheDocument();
  });

  it('clicking Prescriptions stat card navigates to /prescriptions', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prescriptions" element={<div data-testid="prescriptions-target">Prescriptions Route</div>} />
        </Routes>
      </MemoryRouter>
    );

    const rxCard = document.getElementById('stat-card-prescriptions');
    expect(rxCard).not.toBeNull();
    fireEvent.click(rxCard!);

    expect(screen.getByTestId('prescriptions-target')).toBeInTheDocument();
  });
});
