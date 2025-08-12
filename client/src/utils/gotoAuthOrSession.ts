import { supabase } from '../lib/supabase';

// Cache auth state to avoid duplicate calls
let cachedUser: any = null;
let lastAuthCheck = 0;
const CACHE_DURATION = 5000; // 5 seconds

export async function gotoAuthOrSession() {
  const now = Date.now();
  
  // Use cached user if recent
  if (cachedUser && (now - lastAuthCheck) < CACHE_DURATION) {
    window.location.href = cachedUser ? '/emdr-session' : '/auth';
    return;
  }
  
  // Get fresh auth state
  const { data } = await supabase.auth.getUser();
  cachedUser = data?.user;
  lastAuthCheck = now;
  
  window.location.href = cachedUser ? '/emdr-session' : '/auth';
}