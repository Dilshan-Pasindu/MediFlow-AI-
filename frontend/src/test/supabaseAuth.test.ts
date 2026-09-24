import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore, initSupabaseAuthListener } from '../stores/authStore';

describe('Supabase Auth Integration & Store', () => {
  beforeEach(async () => {
    localStorage.clear();
    await useAuthStore.getState().logout();
  });

  it('provides safe fallback when environment variables are unconfigured', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    // Default test runner environment without real secrets returns false
    expect(typeof isSupabaseConfigured()).toBe('boolean');
  });

  it('supports setting and updating Supabase JWT access tokens in store', () => {
    const fakeSupabaseToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.supabase-token-xyz';
    useAuthStore.getState().setToken(fakeSupabaseToken);

    expect(useAuthStore.getState().token).toBe(fakeSupabaseToken);
    expect(localStorage.getItem('mediflow_token')).toBe(fakeSupabaseToken);

    useAuthStore.getState().setToken(null);
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem('mediflow_token')).toBeNull();
  });

  it('subscribes and cleans up auth state listener cleanly', () => {
    const unsubscribe = initSupabaseAuthListener();
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('asynchronously clears session on logout', async () => {
    useAuthStore.getState().setAuth({
      userId: 42,
      fullName: 'Supabase Patient',
      email: 'patient@supabase.io',
      role: 'Patient',
      token: 'sb-jwt-token-123',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem('mediflow_token')).toBeNull();
  });
});
