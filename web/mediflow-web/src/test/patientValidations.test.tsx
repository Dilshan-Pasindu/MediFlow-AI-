import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DoctorBookingPage from '../pages/DoctorBookingPage';
import ProfilePage from '../pages/ProfilePage';
import SymptomAIPage from '../pages/SymptomAIPage';

// ─── Hoisted Mocks ────────────────────────────────────────────────────────────
const {
  mockDoctor,
  mockProfile,
  mockMutateBook,
  mockMutateProfile,
  mockSubmitSymptoms,
} = vi.hoisted(() => ({
  mockDoctor: {
    id: 10,
    userId: 20,
    fullName: 'Dr. Sarah Connor',
    qualifications: 'MBBS, MD',
    bio: 'Experienced cardiologist with 12 years of practice.',
    consultationFee: 3500,
    experienceYears: 12,
    averageRating: 4.8,
    reviewCount: 42,
    isActive: true,
    specialties: [{ id: 1, name: 'Cardiology' }],
  },
  mockProfile: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+94 77 123 4567',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    address: '42 Main St, Colombo',
    dateOfBirth: '1990-01-15',
    gender: 'Male',
  },
  mockMutateBook: vi.fn(),
  mockMutateProfile: vi.fn(),
  mockSubmitSymptoms: vi.fn(),
}));

vi.mock('../services/api', () => ({
  getUser: vi.fn().mockReturnValue({
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'Patient',
  }),
  apiSubmitSymptoms: (...args: any[]) => mockSubmitSymptoms(...args),
  apiGetRankedDoctors: vi.fn().mockResolvedValue([]),
}));

vi.mock('../hooks', () => ({
  useDoctor: () => ({ data: mockDoctor, isLoading: false }),
  useBookAppointment: () => ({
    mutate: mockMutateBook,
    isPending: false,
    isError: false,
  }),
  useProfile: () => ({ data: mockProfile, isLoading: false }),
  useUpdateProfile: () => ({
    mutate: mockMutateProfile,
    isPending: false,
    isError: false,
  }),
  useSpecialties: () => ({
    data: [{ id: 1, name: 'Cardiology' }],
    isLoading: false,
  }),
}));

describe('Patient Portal Validations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDoctor.isActive = true;
  });

  describe('DoctorBookingPage Validations', () => {
    it('requires a time slot before submission and shows validation error', async () => {
      render(
        <MemoryRouter initialEntries={['/doctors/10/book']}>
          <Routes>
            <Route path="/doctors/:id/book" element={<DoctorBookingPage />} />
          </Routes>
        </MemoryRouter>
      );

      const confirmBtn = screen.getByRole('button', { name: /confirm booking/i });
      fireEvent.click(confirmBtn);

      expect(mockMutateBook).not.toHaveBeenCalled();
      expect(
        await screen.findByText(/please select an available consultation time slot/i)
      ).toBeInTheDocument();
    });

    it('enforces notes length limit of 500 characters', async () => {
      render(
        <MemoryRouter initialEntries={['/doctors/10/book']}>
          <Routes>
            <Route path="/doctors/:id/book" element={<DoctorBookingPage />} />
          </Routes>
        </MemoryRouter>
      );

      const notesTextarea = screen.getByPlaceholderText(/any specific symptoms/i);
      const longText = 'A'.repeat(550);
      fireEvent.change(notesTextarea, { target: { value: longText } });

      // Input should not accept more than 500 characters
      expect(screen.getByText('0 / 500')).toBeInTheDocument();
      
      const validText = 'A'.repeat(250);
      fireEvent.change(notesTextarea, { target: { value: validText } });
      expect(screen.getByText('250 / 500')).toBeInTheDocument();
    });

    it('disables booking when doctor is inactive', async () => {
      mockDoctor.isActive = false;

      render(
        <MemoryRouter initialEntries={['/doctors/10/book']}>
          <Routes>
            <Route path="/doctors/:id/book" element={<DoctorBookingPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(
        screen.getByText(/doctor unavailable for booking/i)
      ).toBeInTheDocument();

      const confirmBtn = screen.getByRole('button', { name: /confirm booking/i });
      expect(confirmBtn).toBeDisabled();
    });
  });

  describe('ProfilePage Validations', () => {
    it('validates that Full Name is required and not empty', async () => {
      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: '   ' } });
      fireEvent.blur(nameInput);

      expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    });

    it('validates invalid phone number format', async () => {
      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      const phoneInput = screen.getByLabelText(/phone number/i);
      fireEvent.change(phoneInput, { target: { value: 'invalid-phone-abc' } });
      fireEvent.blur(phoneInput);

      expect(
        await screen.findByText(/enter a valid phone number/i)
      ).toBeInTheDocument();
    });

    it('validates that Date of Birth cannot be in the future', async () => {
      render(
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      );

      const dobInput = screen.getByLabelText(/date of birth/i);
      fireEvent.change(dobInput, { target: { value: '2099-12-31' } });
      fireEvent.blur(dobInput);

      expect(
        await screen.findByText(/date of birth cannot be in the future/i)
      ).toBeInTheDocument();
    });
  });

  describe('SymptomAIPage Validations', () => {
    it('disables Analyze button when symptoms input has fewer than 10 characters', async () => {
      render(
        <MemoryRouter>
          <SymptomAIPage />
        </MemoryRouter>
      );

      const textarea = screen.getByPlaceholderText(/e\.g\. I have been experiencing/i);
      const submitBtn = screen.getByRole('button', { name: /analyze with ai/i });

      // Initially empty -> disabled
      expect(submitBtn).toBeDisabled();

      // Less than 10 characters -> disabled
      fireEvent.change(textarea, { target: { value: 'Chest pain' } }); // exactly 10 chars
      expect(submitBtn).not.toBeDisabled();

      fireEvent.change(textarea, { target: { value: 'Short' } });
      expect(submitBtn).toBeDisabled();
      expect(screen.getByText('5 / 1000')).toBeInTheDocument();
    });
  });
});
