import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Button Component', () => {
  it('renders button with label', () => {
    render(<Button>Book Appointment</Button>);
    expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Cancel Booking</Button>);
    const button = screen.getByRole('button', { name: /cancel booking/i });
    expect(button.className).toContain('bg-red-600');
  });

  it('can be disabled', () => {
    render(<Button disabled>Processing...</Button>);
    expect(screen.getByRole('button', { name: /processing/i })).toBeDisabled();
  });
});
