import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { supabase } from '../lib/supabase';
import { setupOAuthListener } from '../lib/authCallbacks';

type Ctx = {
  user: any; session: any; loading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
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
      
      // Log access token when authentication state changes to SIGNED_IN
      if (event === 'SIGNED_IN' && s?.access_token) {
        console.log("Supabase access token:", s.access_token);
      }
    });

    // Set up OAuth deep link listener for Apple Sign In
    const oauthSubscription = setupOAuthListener((session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('OAuth session established via deep link');
      }
    });
    
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
      oauthSubscription?.remove();
    };
  }, []);

  // Debug logging for mobile
  useEffect(() => {
    if (session?.user) {
      console.log("Session debug log:");
      console.log("- Session data:", session);
      console.log("- Access token present:", !!session?.access_token);
      console.log("- User ID:", session?.user?.id);
      console.log("- User email:", session?.user?.email);
    } else if (!loading) {
      console.log("Session debug log:");
      console.log("- Session data:", null);
      console.log("- Access token present:", false);
      console.log("- User ID:", null);
      console.log("- User email:", null);
    }
  }, [session, loading]);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return { error };
  };

  const signInWithApple = async () => {
    setLoading(true);
    try {
      // Use Supabase's OAuth for Apple Sign In with proper mobile redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'emdr://auth-callback',
          // Additional Apple-specific options
          scopes: 'email name'
        }
      });

      if (error) {
        console.error('Apple sign in error:', error);
        setLoading(false);
        return { error };
      }

      // For OAuth, we don't immediately get the session
      // The user will be redirected to Apple's auth, then back to our app
      console.log('Apple sign in initiated:', data);
      
      // Open the OAuth URL in system browser
      if (data?.url) {
        await Linking.openURL(data.url);
      }
      
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      console.error('Apple sign in failed:', error);
      return { error: new Error('Apple Sign In failed. Please try again.') };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('selectedTherapist');
    setLoading(false);
  };

  return (
    <AuthCtx.Provider value={{ 
      user, 
      session, 
      loading,
      isAuthenticated: !!user,
      signInWithEmail, 
      signInWithApple,
      signUp,
      signOut 
    }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('useAuth must be used within <AuthProvider>');
  return v;
}