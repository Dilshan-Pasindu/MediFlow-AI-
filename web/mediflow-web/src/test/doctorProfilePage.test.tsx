import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import type { DoctorDetail } from '../types/doctor';

const mockMutateDoctorProfile = vi.fn().mockResolvedValue({ message: 'Profile updated successfully.' });

const mockDoctorProfile: DoctorDetail = {
  id: 1,
  userId: 2,
  fullName: 'Dr. Nimal Perera',
  email: 'nimal.perera@mediflow.lk',
  phoneNumber: '+94771000001',
  qualifications: 'MBBS, MD (Cardiology), FCCP',
  bio: 'Senior Consultant Cardiologist',
  consultationFee: 3500,
  experienceYears: 15,
  averageRating: 5.0,
  reviewCount: 3,
  isActive: true,
  specialties: [{ id: 1, name: 'Cardiology' }],
  subSpecialty: 'Interventional Cardiology',
  hospitalClinic: 'National Hospital of Sri Lanka, Colombo',
  languages: 'English, Sinhala',
  location: 'Colombo 07',
  mbbsUniversity: 'Faculty of Medicine, University of Colombo',
  phdUniversity: 'Royal College of Physicians (UK)',
  otherQualifications: 'Fellow of the American College of Cardiology',
  certifications: 'Board Certified in Interventional Cardiology',
  age: 52,
  registrationNumber: 'SLMC-11024',
  reviews: [],
};

const mockUserState = {
  user: {
    userId: 2,
    fullName: 'Dr. Nimal Perera',
    email: 'nimal.perera@mediflow.lk',
    role: 'Doctor' as const,
  },
  token: 'mock-token',
  isAuthenticated: true,
  setAuth: vi.fn(),
  setUser: vi.fn(),
  logout: vi.fn(),
};

vi.mock('../services/api', () => ({
  getUser: () => mockUserState.user,
}));

vi.mock('../stores/authStore', () => ({
  useAuthStore: Object.assign(
    (selector?: any) => (selector ? selector(mockUserState) : mockUserState),
    {
      getState: () => mockUserState,
      setState: vi.fn(),
      subscribe: vi.fn(),
    }
  ),
}));

vi.mock('../hooks', () => ({
  useProfile: () => ({
    data: null,
    isLoading: false,
  }),
  useUpdateProfile: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useMyDoctorProfile: () => ({
    data: mockDoctorProfile,
    isLoading: false,
    refetch: vi.fn(),
  }),
  useUpdateMyDoctorProfile: () => ({
    mutateAsync: mockMutateDoctorProfile,
    isPending: false,
  }),
}));

describe('Doctor Profile Page Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders doctor credentials and allows updating consultation fee and hospital', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Clinical Practice & Affiliations')).toBeInTheDocument();
    expect(screen.getByText('Practice Details, Fees & Clinical Bio')).toBeInTheDocument();
    expect(screen.getByText('SLMC #SLMC-11024')).toBeInTheDocument();

    const feeInput = screen.getByLabelText(/Consultation Fee/i) as HTMLInputElement;
    expect(feeInput).toBeInTheDocument();
    expect(feeInput.value).toBe('3500');

    fireEvent.change(feeInput, { target: { value: '4500' } });

    const saveButton = screen.getByRole('button', { name: /Save Profile Changes/i });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutateDoctorProfile).toHaveBeenCalledTimes(1);
      expect(mockMutateDoctorProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          consultationFee: 4500,
          fullName: 'Dr. Nimal Perera',
        })
      );
    });
  });

  it('validates required doctor full name field', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = screen.getByRole('button', { name: /Save Profile Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
      expect(mockMutateDoctorProfile).not.toHaveBeenCalled();
    });
  });
});
