import { createClient } from '@supabase/supabase-js';

// Environment variables are swapped - fixing the assignment
const supabaseUrl = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/['"]/g, '') || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_URL?.replace(/['"]/g, '') || '';

// Clean up URL (remove trailing slash if present)
const cleanUrl = supabaseUrl.replace(/\/$/, '');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

if (!cleanUrl.startsWith('https://')) {
  throw new Error(`Invalid Supabase URL format: ${cleanUrl}. Should start with https://`);
}

export const supabase = createClient(cleanUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});