import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DoctorProfileModal } from '../components/DoctorProfileModal';
import type { DoctorDetail } from '../types/doctor';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../hooks', () => ({
  useDoctor: () => ({ data: undefined, isLoading: false }),
  useDoctorReviews: () => ({ data: [], isLoading: false }),
}));

const sampleDoctor: DoctorDetail = {
  id: 101,
  userId: 201,
  fullName: 'Dr. Aruni Wickramasinghe',
  qualifications: 'MBBS, MD (Cardiology), FRCP',
  bio: 'Senior Consultant Interventional Cardiologist with over 15 years of clinical practice.',
  consultationFee: 3500,
  experienceYears: 15,
  averageRating: 4.9,
  reviewCount: 142,
  isActive: true,
  specialties: [{ id: 1, name: 'Cardiology' }],
  subSpecialty: 'Interventional Cardiology & Coronary Angioplasty',
  hospitalClinic: 'National Hospital of Sri Lanka',
  languages: 'English, Sinhala',
  location: 'Colombo, Sri Lanka',
  mbbsUniversity: 'Faculty of Medicine, University of Colombo',
  phdUniversity: 'Royal College of Physicians, London (UK)',
  otherQualifications: 'Fellowship in Interventional Cardiology (Singapore)',
  certifications: 'Board Certified Specialist in Cardiology (SLMC & GMC)',
  age: 44,
  registrationNumber: 'SLMC-MD-18492',
  reviews: [
    {
      id: 1,
      appointmentId: 501,
      patientName: 'Kavinda Perera',
      rating: 5,
      review: 'Exceptional physician. Explained my cardiac condition with clarity.',
      createdAt: '2026-09-15T10:00:00Z',
    },
    {
      id: 2,
      appointmentId: 502,
      patientName: 'Dilini Silva',
      rating: 5,
      review: 'Very attentive and thorough diagnostic checkup.',
      createdAt: '2026-09-18T14:30:00Z',
    },
  ],
};

describe('DoctorProfileModal Component', () => {
  it('renders all complete doctor credentials, education, and SLMC registration', () => {
    render(
      <MemoryRouter>
        <DoctorProfileModal
          doctor={sampleDoctor}
          isOpen={true}
          onClose={vi.fn()}
          showBookButton={true}
        />
      </MemoryRouter>
    );

    // Full name and qualifications
    expect(screen.getByText('Dr. Aruni Wickramasinghe')).toBeInTheDocument();
    expect(screen.getByText('MBBS, MD (Cardiology), FRCP')).toBeInTheDocument();

    // Specialty & SubSpecialty
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Interventional Cardiology & Coronary Angioplasty')).toBeInTheDocument();

    // SLMC Reg
    expect(screen.getByText(/SLMC #SLMC-MD-18492/i)).toBeInTheDocument();

    // Education & Degrees
    expect(screen.getByText(/Faculty of Medicine, University of Colombo/i)).toBeInTheDocument();
    expect(screen.getByText(/Royal College of Physicians, London \(UK\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Fellowship in Interventional Cardiology \(Singapore\)/i)).toBeInTheDocument();

    // Affiliation & Fee
    expect(screen.getAllByText('National Hospital of Sri Lanka')[0]).toBeInTheDocument();

    // Schedule & Fee tab
    fireEvent.click(screen.getByRole('button', { name: /Schedule & Fee/i }));
    expect(screen.getByText(/LKR 3,500/i)).toBeInTheDocument();

    // Patient Reviews tab
    fireEvent.click(screen.getByRole('button', { name: /Patient Reviews/i }));
    expect(screen.getByText('Kavinda Perera')).toBeInTheDocument();
    expect(screen.getByText(/"Exceptional physician\. Explained my cardiac condition with clarity\."/i)).toBeInTheDocument();
    expect(screen.getByText('Dilini Silva')).toBeInTheDocument();
  });

  it('triggers navigation to booking page when Book Consultation Now button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <DoctorProfileModal
          doctor={sampleDoctor}
          isOpen={true}
          onClose={handleClose}
          showBookButton={true}
        />
      </MemoryRouter>
    );

    const bookBtn = screen.getByRole('button', { name: /book consultation now/i });
    fireEvent.click(bookBtn);

    expect(handleClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/doctors/101/book');
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <MemoryRouter>
        <DoctorProfileModal
          doctor={sampleDoctor}
          isOpen={false}
          onClose={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('gracefully handles appointment-style doctor object with doctorName and specialtyName', () => {
    const partialDoctor = {
      doctorId: 88,
      doctorName: 'Dr. Samantha Fernando',
      specialtyName: 'Dermatology',
      doctorBio: 'Expert in dermatological conditions.',
      fee: 2800,
    };

    render(
      <MemoryRouter>
        <DoctorProfileModal
          doctor={partialDoctor}
          isOpen={true}
          onClose={vi.fn()}
          showBookButton={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Dr. Samantha Fernando')).toBeInTheDocument();
    expect(screen.getByText('Dermatology')).toBeInTheDocument();
    expect(screen.getByText('Expert in dermatological conditions.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Schedule & Fee/i }));
    expect(screen.getByText(/LKR 2,800/i)).toBeInTheDocument();
  });
});
