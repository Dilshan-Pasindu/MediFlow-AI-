import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Returns true if real Supabase credentials have been configured in environment variables.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('https://')
  );
};

// Safe fallback config to ensure client instantiation never throws even in offline test runner environments
const effectiveUrl = isSupabaseConfigured()
  ? supabaseUrl
  : 'https://placeholder-project.supabase.co';

const effectiveKey = isSupabaseConfigured()
  ? supabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

/**
 * Global Supabase Client instance for web authentication, session persistence, and token issuance.
 */
export const supabase: SupabaseClient = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
