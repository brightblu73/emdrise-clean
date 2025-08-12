import { supabase } from '../lib/supabase';
export async function gotoAuthOrSession() {
  const { data } = await supabase.auth.getUser();
  window.location.href = data?.user ? '/emdr-session' : '/auth';
}