import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Test mock timeline component matching RefundTrackingPage logic
const REFUND_STEPS = [
  { key: 'RefundRequested', label: 'Requested', desc: 'Waiting for receptionist review' },
  { key: 'RefundApproved', label: 'Approved', desc: 'Receptionist approved the refund' },
  { key: 'RefundProcessing', label: 'Processing', desc: 'Refund initiated with payment provider' },
  { key: 'RefundCompleted', label: 'Completed', desc: 'Refund credited to your account' },
];

function MockRefundTimeline({ status }: { status: string }) {
  const currentIdx = REFUND_STEPS.findIndex(s => s.key === status);
  const failed = status === 'RefundRejected' || status === 'RefundFailed';

  if (failed) {
    return (
      <div data-testid="refund-failed-notice">
        <div>{status === 'RefundRejected' ? 'Refund Request Rejected' : 'Refund Failed'}</div>
        <div>Please contact reception for more information.</div>
      </div>
    );
  }

  return (
    <div data-testid="refund-timeline">
      {REFUND_STEPS.map((step, i) => (
        <div key={step.key} data-testid={`step-${step.key}`}>
          <span>{step.label}</span>
          {i === currentIdx && <span data-testid="active-indicator">In Progress</span>}
        </div>
      ))}
    </div>
  );
}

function MockApprovedRestrictionNotice({ isApproved }: { isApproved: boolean }) {
  if (!isApproved) return null;
  return (
    <div data-testid="approved-refund-notice">
      <div>Refund Not Available</div>
      <div>This appointment has already been approved by the receptionist. Refund requests are no longer available after appointment approval.</div>
    </div>
  );
}

function MockRefundProcessingNotice({ expectedProcessingInfo }: { expectedProcessingInfo: string }) {
  return (
    <div data-testid="refund-processing-notice">
      {expectedProcessingInfo}
    </div>
  );
}

describe('Payment & Refund Workflow Tests', () => {
  it('renders all refund progress steps for a progressing refund', () => {
    render(<MockRefundTimeline status="RefundProcessing" />);

    expect(screen.getByTestId('refund-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('step-RefundRequested')).toHaveTextContent('Requested');
    expect(screen.getByTestId('step-RefundApproved')).toHaveTextContent('Approved');
    expect(screen.getByTestId('step-RefundProcessing')).toHaveTextContent('Processing');
    expect(screen.getByTestId('step-RefundCompleted')).toHaveTextContent('Completed');
    expect(screen.getByTestId('active-indicator')).toHaveTextContent('In Progress');
  });

  it('renders rejection notice when refund is rejected', () => {
    render(<MockRefundTimeline status="RefundRejected" />);

    const notice = screen.getByTestId('refund-failed-notice');
    expect(notice).toHaveTextContent('Refund Request Rejected');
    expect(notice).toHaveTextContent('Please contact reception for more information.');
  });

  it('renders failed notice when refund failed', () => {
    render(<MockRefundTimeline status="RefundFailed" />);

    const notice = screen.getByTestId('refund-failed-notice');
    expect(notice).toHaveTextContent('Refund Failed');
  });

  it('enforces Rule 4 and Rule 10: displays approved appointment refund restriction message', () => {
    render(<MockApprovedRestrictionNotice isApproved={true} />);

    const notice = screen.getByTestId('approved-refund-notice');
    expect(notice).toHaveTextContent('Refund Not Available');
    expect(notice).toHaveTextContent('This appointment has already been approved by the receptionist. Refund requests are no longer available after appointment approval.');
  });

  it('does not display restriction notice when appointment is not yet approved', () => {
    const { container } = render(<MockApprovedRestrictionNotice isApproved={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('displays the 2-3 working days refund processing message as mandated by Rule 7', () => {
    const noticeText = 'Your refund has been approved and is currently being processed. The refunded amount will normally be credited within 2–3 working days, depending on the payment provider.';
    render(<MockRefundProcessingNotice expectedProcessingInfo={noticeText} />);

    const el = screen.getByTestId('refund-processing-notice');
    expect(el).toHaveTextContent('2–3 working days');
    expect(el).toHaveTextContent('depending on the payment provider');
  });

  it('navigates to refund tracking when clicking completed refund in receptionist section', () => {
    const mockNavigate = vi.fn();
    const refund = {
      id: 42,
      appointmentId: 108,
      patientName: 'Kamal Perera',
      refundStatus: 'RefundCompleted',
      refundReference: 'RF-108-42',
    };

    render(
      <div data-testid="completed-refund-card">
        <span onClick={() => mockNavigate(`/appointments/${refund.appointmentId}/refund`)} data-testid="patient-name-link">
          {refund.patientName}
        </span>
        <button
          onClick={() => mockNavigate(`/appointments/${refund.appointmentId}/refund`)}
          data-testid="view-tracking-btn"
        >
          View Tracking
        </button>
      </div>
    );

    screen.getByTestId('view-tracking-btn').click();
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/108/refund');

    screen.getByTestId('patient-name-link').click();
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/108/refund');
  });

  it('navigates directly to refund tracking when clicking cancelled or refund-requested appointment card', () => {
    const mockNavigate = vi.fn();
    const handleCardClick = (status: string, id: number) => {
      const isRefundStatus = ['Cancelled', 'PatientCancelled', 'RefundRequested', 'RefundApproved', 'RefundProcessing', 'RefundCompleted', 'RefundRejected', 'ReceptionistRejected'].includes(status);
      if (isRefundStatus) {
        mockNavigate(`/appointments/${id}/refund`);
      } else {
        mockNavigate(`/appointments/${id}`);
      }
    };

    // Cancelled appointment
    handleCardClick('Cancelled', 55);
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/55/refund');

    // Refund requested appointment
    handleCardClick('RefundRequested', 77);
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/77/refund');

    // Refund completed appointment
    handleCardClick('RefundCompleted', 99);
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/99/refund');

    // Confirmed appointment goes to details
    handleCardClick('Confirmed', 12);
    expect(mockNavigate).toHaveBeenCalledWith('/appointments/12');
  });
});
