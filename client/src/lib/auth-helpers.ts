import { supabase } from '@/lib/supabaseClient'

export async function gotoAuthOrSession() {
  try {
    // Ensure Supabase has hydrated the session
    const { data: sessData } = await supabase.auth.getSession();
    // Then read the current user
    const { data: userData, error } = await supabase.auth.getUser();
    if (error) console.warn('getUser error:', error);

    const user =
      userData?.user ?? sessData?.session?.user ?? null;

    // Route based on actual auth state
    window.location.href = user ? '/emdr-session' : '/auth';
  } catch (e) {
    console.warn('gotoAuthOrSession failed, sending to /auth', e);
    window.location.href = '/auth';
  }
}