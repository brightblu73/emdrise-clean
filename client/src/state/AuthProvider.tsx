import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type Ctx = {
  user: any; session: any; loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};
const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      
      // Log access token when authentication state changes to SIGNED_IN
      if (event === 'SIGNED_IN' && s?.access_token) {
        console.log("Supabase access token:", s.access_token);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Temporary debugging useEffect to log session data
  useEffect(() => {
    const logSessionData = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log("Session debug log:");
        console.log("- Session data:", data.session);
        console.log("- Access token present:", !!data.session?.access_token);
        console.log("- User ID:", data.session?.user?.id);
        console.log("- User email:", data.session?.user?.email);
        if (error) {
          console.log("- Session error:", error);
        }
      } catch (err) {
        console.log("Session debug error:", err);
      }
    };

    logSessionData();
  }, [session]); // Re-run when session changes

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('selectedTherapist');
    setLoading(false);
  };

  return <AuthCtx.Provider value={{ user, session, loading, signInWithEmail, signOut }}>{children}</AuthCtx.Provider>;
}
export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('useAuth must be used within <AuthProvider>');
  return v;
}