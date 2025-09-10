import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        // Store session in AsyncStorage for persistence
        if (initialSession) {
          await AsyncStorage.setItem('supabase_session', JSON.stringify(initialSession));
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      // Store session changes in AsyncStorage
      if (currentSession) {
        await AsyncStorage.setItem('supabase_session', JSON.stringify(currentSession));
        console.log('User signed in:', currentSession.user?.email);
      } else {
        await AsyncStorage.removeItem('supabase_session');
        await AsyncStorage.removeItem('selectedTherapist');
        console.log('User signed out');
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { error };
  };

  const signInWithApple = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'com.emdrise.app://auth-callback'
        }
      });
      setLoading(false);
      return { error };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('selectedTherapist');
    await AsyncStorage.removeItem('pausedEMDRSession');
    await AsyncStorage.removeItem('emdrPauseFlag');
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signInWithEmail,
    signInWithApple,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}