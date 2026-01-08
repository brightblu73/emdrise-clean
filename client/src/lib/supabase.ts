import { createClient } from '@supabase/supabase-js';

// Environment variables - check import.meta.env first, fallback to hardcoded values
// Replit secrets swap the names, so we check both directions
const envUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/['"]/g, '') || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/['"]/g, '') || '';

// Replit secrets workaround - they swap URL and anon key
const swappedUrl = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/['"]/g, '') || '';
const swappedKey = import.meta.env.VITE_SUPABASE_URL?.replace(/['"]/g, '') || '';

// Determine which set to use based on which one looks like a valid URL
const isValidUrl = (url: string) => url.startsWith('https://') && url.includes('supabase.co');

let supabaseUrl = envUrl;
let supabaseAnonKey = envKey;

if (isValidUrl(swappedUrl) && !isValidUrl(envUrl)) {
  supabaseUrl = swappedUrl;
  supabaseAnonKey = swappedKey;
}

// Fallback to hardcoded values if environment variables not available
const fallbackUrl = 'https://jxhjghgectlpgrpwpkfd.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aGpnaGdlY3RscGdycHdwa2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTczMjEsImV4cCI6MjA2OTc5MzMyMX0.jW7dx-xlp3qgEUs9rsKFLr5GpX22Qd_RKstSTLAWoNo';

// Use available configuration
const finalUrl = supabaseUrl || fallbackUrl;
const finalKey = supabaseAnonKey || fallbackKey;

// Clean up URL (remove trailing slash if present)
const cleanUrl = finalUrl.replace(/\/$/, '');

if (!cleanUrl.startsWith('https://')) {
  throw new Error(`Invalid Supabase URL format: ${cleanUrl}. Should start with https://`);
}

export const supabase = createClient(cleanUrl, finalKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
