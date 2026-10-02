import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function getApiBaseUrl(): string {
  let url = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!url) {
    return 'http://localhost:5224/api';
  }
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
}

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 60-second timeout accommodates free-tier container cold starts (e.g. Render spin-up)
  timeout: 60000,
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

