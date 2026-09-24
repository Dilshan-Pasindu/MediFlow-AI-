import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5224/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Supabase JWT or Fallback Bearer Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.auth.getSession();
        token = data?.session?.access_token || null;
      } catch {
        // fallback to storage
      }
    }
    if (!token) {
      token = localStorage.getItem('mediflow_token');
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 and Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; title?: string }>) => {
    if (error.response?.status === 401) {
      if (isSupabaseConfigured()) {
        try {
          await supabase.auth.signOut();
        } catch {
          // ignore
        }
      }
      localStorage.removeItem('mediflow_token');
      localStorage.removeItem('mediflow_user');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/home')) {
        window.location.href = '/login';
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

