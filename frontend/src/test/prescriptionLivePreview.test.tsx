import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrescriptionLivePreviewCard } from '../components/doctor/PrescriptionLivePreviewCard';
import type { AutoFilledPrescriptionDraft } from '../types/consultation';

describe('PrescriptionLivePreviewCard', () => {
  it('renders co-pilot placeholder when draft is empty', () => {
    const emptyDraft: AutoFilledPrescriptionDraft = {
      diagnosis: '',
      items: [],
      labOrders: [],
    };

    render(<PrescriptionLivePreviewCard draft={emptyDraft} />);
    expect(screen.getByText(/e-prescription auto-fill co-pilot/i)).toBeInTheDocument();
    expect(screen.getByText(/approve ai-recommended medications/i)).toBeInTheDocument();
  });

  it('renders active preview card when diagnosis is populated', () => {
    const draftWithDiagnosis: AutoFilledPrescriptionDraft = {
      diagnosis: 'Type 2 Diabetes Mellitus with Essential Hypertension',
      items: [],
      labOrders: [],
    };

    render(<PrescriptionLivePreviewCard draft={draftWithDiagnosis} />);
    expect(screen.getByText(/e-prescription auto-filled draft/i)).toBeInTheDocument();
    expect(screen.getByText(/type 2 diabetes mellitus with essential hypertension/i)).toBeInTheDocument();
  });

  it('renders approved medication items with dosage and instructions', () => {
    const draftWithMeds: AutoFilledPrescriptionDraft = {
      diagnosis: 'Bacterial Pharyngitis',
      items: [
        {
          medicineName: 'Amoxicillin 500mg',
          dosage: '500mg',
          frequency: 'TDS (Three times daily)',
          duration: '7 Days',
          instructions: 'Take after meals',
        },
        {
          medicineName: 'Paracetamol 500mg',
          dosage: '500mg',
          frequency: 'PRN (As needed)',
          duration: '3 Days',
          instructions: 'For fever and throat pain',
        },
      ],
      labOrders: [],
    };

    render(<PrescriptionLivePreviewCard draft={draftWithMeds} />);
    expect(screen.getByText(/amoxicillin 500mg/i)).toBeInTheDocument();
    expect(screen.getByText('TDS (Three times daily)')).toBeInTheDocument();
    expect(screen.getByText(/take after meals/i)).toBeInTheDocument();

    expect(screen.getByText(/paracetamol 500mg/i)).toBeInTheDocument();
    expect(screen.getByText('PRN (As needed)')).toBeInTheDocument();
  });

  it('renders approved laboratory investigation orders', () => {
    const draftWithLabs: AutoFilledPrescriptionDraft = {
      diagnosis: 'Suspected Microcytic Anemia',
      items: [],
      labOrders: [
        {
          testName: 'Full Blood Count (FBC)',
          urgency: 'Routine',
          indication: 'Evaluate hemoglobin and MCV levels',
        },
        {
          testName: 'Serum Ferritin',
          urgency: 'Urgent',
          indication: 'Confirm iron deficiency status',
        },
      ],
    };

    render(<PrescriptionLivePreviewCard draft={draftWithLabs} />);
    expect(screen.getByText(/full blood count \(fbc\)/i)).toBeInTheDocument();
    expect(screen.getByText(/serum ferritin/i)).toBeInTheDocument();
    expect(screen.getByText(/urgent/i)).toBeInTheDocument();
  });

  it('calls onNavigateToDraft when the action button is clicked', () => {
    const onNavigateMock = vi.fn();
    const draft: AutoFilledPrescriptionDraft = {
      diagnosis: 'Acute Sinusitis',
      items: [
        {
          medicineName: 'Augmentin 625mg',
          dosage: '625mg',
          frequency: 'BD',
          duration: '5 Days',
        },
      ],
      labOrders: [],
    };

    render(<PrescriptionLivePreviewCard draft={draft} onNavigateToDraft={onNavigateMock} />);
    const button = screen.getByRole('button', { name: /review prescription summary/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onNavigateMock).toHaveBeenCalledTimes(1);
  });
});
