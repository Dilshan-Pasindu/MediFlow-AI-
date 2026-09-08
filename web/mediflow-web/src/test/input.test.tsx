import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../components/ui/input';

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;
    
    await user.type(input, 'Hello MediFlow');
    expect(input.value).toBe('Hello MediFlow');
  });

  it('disables input when disabled prop is passed', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });
});
