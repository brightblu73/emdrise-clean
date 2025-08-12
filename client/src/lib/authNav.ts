import { supabase } from './supabaseClient';

export async function gotoAuthOrSession() {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      window.location.href = '/auth';
    } else {
      // always land on the player route; flag that we came from a CTA
      window.location.href = '/emdr-session?from=home';
    }
  } catch (e) {
    console.error('gotoAuthOrSession failed', e);
    window.location.href = '/auth';
  }
}