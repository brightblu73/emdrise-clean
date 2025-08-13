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

// Decide where to land after logout (dev vs prod)
export function getPostLogoutUrl(): string {
  try {
    // Vite-style env detection
    // In dev, avoid Replit root screen by using an internal SPA route
    // Production keeps '/'.
    // @ts-ignore
    const isDev = import.meta && import.meta.env && import.meta.env.DEV;
    return isDev ? '/' : '/';
  } catch {
    return '/';
  }
}

export function redirectAfterLogout() {
  const url = getPostLogoutUrl();
  try {
    // Stop any media before leaving
    document.querySelectorAll('video').forEach(v => v.pause());
    document.querySelectorAll('audio').forEach(a => a.pause());
  } catch {}
  window.location.assign(url);
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