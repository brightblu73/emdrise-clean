import { supabase } from '../lib/supabase';

/**
 * Fully sign out the current user.
 * - Calls Supabase signOut (clears tokens + stops refresh)
 * - Clears any app-local cache
 */
export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error('Supabase signOut error', e);
  }
  try {
    localStorage.removeItem('emdriseSession');
    sessionStorage.removeItem('emdriseSession');
  } catch {}
}

/**
 * Install a global listener so SIGNED_OUT in one tab updates others.
 * Optionally redirect caller decides route after resolve.
 */
export function installAuthListener(onSignOut?: () => void) {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      onSignOut?.();
    }
  });
  return () => data.subscription.unsubscribe();
}