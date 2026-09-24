import { create } from 'zustand';
import type { User, AuthResponse } from '../types/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mediflow_token');
};

const getInitialUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('mediflow_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getInitialToken();
  const initialUser = getInitialUser();

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken && !!initialUser,

    setAuth: (data: AuthResponse) => {
      const user: User = {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('mediflow_token', data.token);
      localStorage.setItem('mediflow_user', JSON.stringify(user));
      set({ user, token: data.token, isAuthenticated: true });
    },

    setUser: (user: User | null) => {
      if (user) {
        localStorage.setItem('mediflow_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('mediflow_user');
      }
      set({ user, isAuthenticated: !!user });
    },

    setToken: (token: string | null) => {
      if (token) {
        localStorage.setItem('mediflow_token', token);
      } else {
        localStorage.removeItem('mediflow_token');
      }
      set({ token });
    },

    logout: async () => {
      if (isSupabaseConfigured()) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.warn('Supabase signOut error:', err);
        }
      }
      localStorage.removeItem('mediflow_token');
      localStorage.removeItem('mediflow_user');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});

/**
 * Initializes the Supabase Auth listener to automatically synchronize refreshed JWT tokens
 * and session state changes with the application's authStore.
 */
export const initSupabaseAuthListener = () => {
  if (!isSupabaseConfigured()) return () => {};

  const { data: authSubscription } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('mediflow_token');
      localStorage.removeItem('mediflow_user');
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    } else if (session?.access_token) {
      localStorage.setItem('mediflow_token', session.access_token);
      useAuthStore.getState().setToken(session.access_token);
    }
  });

  return () => {
    authSubscription.subscription.unsubscribe();
  };
};

