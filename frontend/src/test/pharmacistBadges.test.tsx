import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrescriptionStatusBadge } from '../components/pharmacist/PrescriptionStatusBadge';
import { OrderStatusBadge } from '../components/pharmacist/OrderStatusBadge';
import { PharmacistStatCard } from '../components/pharmacist/PharmacistStatCard';
import { OrderPriceSummary } from '../components/pharmacist/OrderPriceSummary';

describe('Pharmacist Portal UI Components', () => {
  describe('PrescriptionStatusBadge', () => {
    it('renders fulfilled status with green styling', () => {
      render(<PrescriptionStatusBadge status="Fulfilled" />);
      const badge = screen.getByText('Fulfilled');
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain('bg-green-100');
    });

    it('renders cancelled status with red styling', () => {
      render(<PrescriptionStatusBadge status="Cancelled" />);
      const badge = screen.getByText('Cancelled');
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain('bg-red-100');
    });

    it('renders pending status with yellow styling', () => {
      render(<PrescriptionStatusBadge status="Pending" />);
      const badge = screen.getByText('Pending');
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain('bg-yellow-100');
    });
  });

  describe('OrderStatusBadge', () => {
    it('renders dispensed status correctly', () => {
      render(<OrderStatusBadge status="Dispensed" />);
      const badge = screen.getByText('Dispensed');
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain('bg-emerald-100');
    });

    it('renders preparing status with amber styling', () => {
      render(<OrderStatusBadge status="Preparing" />);
      const badge = screen.getByText('Preparing');
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain('bg-amber-100');
    });

    it('renders ready status with blue styling', () => {
      render(<OrderStatusBadge status="Ready" />);
      const badge = screen.getByText('Ready');
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain('bg-blue-100');
    });
  });

  describe('PharmacistStatCard', () => {
    it('renders metric label, value, and custom icon', () => {
      render(<PharmacistStatCard label="Pending Orders" value={14} icon="📦" />);
      expect(screen.getByText('Pending Orders')).toBeInTheDocument();
      expect(screen.getByText('14')).toBeInTheDocument();
      expect(screen.getByText('📦')).toBeInTheDocument();
    });
  });

  describe('OrderPriceSummary', () => {
    it('renders formatted price and paid indicator when paid', () => {
      render(<OrderPriceSummary totalAmount={4500} isPaid={true} />);
      expect(screen.getByText(/Total:/i)).toBeInTheDocument();
      expect(screen.getByText(/LKR 4,500\.00/i)).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
    });

    it('renders formatted price without paid pill when unpaid', () => {
      render(<OrderPriceSummary totalAmount={1250.5} isPaid={false} />);
      expect(screen.getByText(/LKR 1,250\.50/i)).toBeInTheDocument();
      expect(screen.queryByText('Paid')).not.toBeInTheDocument();
    });
  });
});
