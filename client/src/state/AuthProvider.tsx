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
    
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();
    
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      
      // Auth state changed successfully
    });
    
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Session state management
  useEffect(() => {
    if (session?.user) {
      console.log("User authenticated successfully");
    } else if (!loading) {
      console.log("No active session");
    }
  }, [session, loading]);

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