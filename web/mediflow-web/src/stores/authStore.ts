import { create } from 'zustand';
import type { User, AuthResponse } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  setUser: (user: User) => void;
  logout: () => void;
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

    setUser: (user: User) => {
      localStorage.setItem('mediflow_user', JSON.stringify(user));
      set({ user });
    },

    logout: () => {
      localStorage.removeItem('mediflow_token');
      localStorage.removeItem('mediflow_user');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
