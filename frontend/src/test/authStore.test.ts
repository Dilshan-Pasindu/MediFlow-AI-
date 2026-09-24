import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import type { AuthResponse } from '../types/auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets authentication on login and saves to localStorage', () => {
    const mockAuth: AuthResponse = {
      userId: 1,
      fullName: 'Dilshan Pasindu',
      email: 'dilshan@mediflow.lk',
      role: 'Patient',
      token: 'jwt-test-token-123',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    useAuthStore.getState().setAuth(mockAuth);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('jwt-test-token-123');
    expect(state.user?.fullName).toBe('Dilshan Pasindu');
    expect(state.user?.role).toBe('Patient');

    expect(localStorage.getItem('mediflow_token')).toBe('jwt-test-token-123');
  });

  it('clears state and localStorage on logout', () => {
    const mockAuth: AuthResponse = {
      userId: 2,
      fullName: 'Dr. Nimal Perera',
      email: 'nimal@mediflow.lk',
      role: 'Doctor',
      token: 'jwt-doctor-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    useAuthStore.getState().setAuth(mockAuth);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(localStorage.getItem('mediflow_token')).toBeNull();
  });
});
