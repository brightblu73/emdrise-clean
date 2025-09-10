import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EMDRSession {
  id: string;
  currentScript: number | string;
  status: 'active' | 'paused' | 'completed';
  selectedTherapist: 'maria' | 'alistair' | null;
  startedAt: string;
  pausedAt?: string;
  pausedFromScript?: number;
  sessionNotes?: string;
  sudsRating?: number;
  vocRating?: number;
}

interface EMDRContextType {
  currentSession: EMDRSession | null;
  selectedTherapist: 'maria' | 'alistair' | null;
  setSelectedTherapist: (therapist: 'maria' | 'alistair') => void;
  createSession: () => Promise<EMDRSession>;
  updateSession: (updates: Partial<EMDRSession>) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  completeSession: () => Promise<void>;
  loading: boolean;
}

const EMDRContext = createContext<EMDRContextType | undefined>(undefined);

export function EMDRProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<EMDRSession | null>(null);
  const [selectedTherapist, setSelectedTherapistState] = useState<'maria' | 'alistair' | null>(null);
  const [loading, setLoading] = useState(true);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      setLoading(true);
      
      // Load selected therapist
      const savedTherapist = await AsyncStorage.getItem('selectedTherapist');
      if (savedTherapist) {
        setSelectedTherapistState(savedTherapist as 'maria' | 'alistair');
      }

      // Load current session
      const savedSession = await AsyncStorage.getItem('currentEMDRSession');
      if (savedSession) {
        setCurrentSession(JSON.parse(savedSession));
      }

      // Check for paused session
      const pausedSession = await AsyncStorage.getItem('pausedEMDRSession');
      if (pausedSession) {
        const parsed = JSON.parse(pausedSession);
        setCurrentSession(parsed);
      }
    } catch (error) {
      console.error('Error loading persisted EMDR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setSelectedTherapist = async (therapist: 'maria' | 'alistair') => {
    try {
      setSelectedTherapistState(therapist);
      await AsyncStorage.setItem('selectedTherapist', therapist);
    } catch (error) {
      console.error('Error saving therapist selection:', error);
    }
  };

  const createSession = async (): Promise<EMDRSession> => {
    try {
      // Check for existing paused session first
      const pausedSession = await AsyncStorage.getItem('pausedEMDRSession');
      if (pausedSession) {
        const parsed = JSON.parse(pausedSession);
        setCurrentSession(parsed);
        return parsed;
      }

      // Create new session
      const newSession: EMDRSession = {
        id: Date.now().toString(),
        currentScript: 1,
        status: 'active',
        selectedTherapist: selectedTherapist,
        startedAt: new Date().toISOString(),
      };

      setCurrentSession(newSession);
      await AsyncStorage.setItem('currentEMDRSession', JSON.stringify(newSession));
      
      return newSession;
    } catch (error) {
      console.error('Error creating EMDR session:', error);
      throw error;
    }
  };

  const updateSession = async (updates: Partial<EMDRSession>) => {
    if (!currentSession) return;

    try {
      const updatedSession = { ...currentSession, ...updates };
      setCurrentSession(updatedSession);
      await AsyncStorage.setItem('currentEMDRSession', JSON.stringify(updatedSession));
    } catch (error) {
      console.error('Error updating EMDR session:', error);
    }
  };

  const pauseSession = async () => {
    if (!currentSession) return;

    try {
      const pausedSession = {
        ...currentSession,
        status: 'paused' as const,
        pausedAt: new Date().toISOString(),
        pausedFromScript: typeof currentSession.currentScript === 'number' ? currentSession.currentScript : 5,
      };

      setCurrentSession(pausedSession);
      await AsyncStorage.setItem('pausedEMDRSession', JSON.stringify(pausedSession));
      await AsyncStorage.setItem('emdrPauseFlag', 'true');
      await AsyncStorage.removeItem('currentEMDRSession');
    } catch (error) {
      console.error('Error pausing EMDR session:', error);
    }
  };

  const resumeSession = async () => {
    if (!currentSession) return;

    try {
      const resumedSession = {
        ...currentSession,
        status: 'active' as const,
        currentScript: '5a', // Resume with Script 5a
      };

      setCurrentSession(resumedSession);
      await AsyncStorage.setItem('currentEMDRSession', JSON.stringify(resumedSession));
      await AsyncStorage.removeItem('pausedEMDRSession');
      await AsyncStorage.removeItem('emdrPauseFlag');
    } catch (error) {
      console.error('Error resuming EMDR session:', error);
    }
  };

  const completeSession = async () => {
    if (!currentSession) return;

    try {
      const completedSession = {
        ...currentSession,
        status: 'completed' as const,
      };

      setCurrentSession(null);
      await AsyncStorage.removeItem('currentEMDRSession');
      await AsyncStorage.removeItem('pausedEMDRSession');
      await AsyncStorage.removeItem('emdrPauseFlag');
    } catch (error) {
      console.error('Error completing EMDR session:', error);
    }
  };

  const value = {
    currentSession,
    selectedTherapist,
    setSelectedTherapist,
    createSession,
    updateSession,
    pauseSession,
    resumeSession,
    completeSession,
    loading,
  };

  return <EMDRContext.Provider value={value}>{children}</EMDRContext.Provider>;
}

export function useEMDR() {
  const context = useContext(EMDRContext);
  if (context === undefined) {
    throw new Error('useEMDR must be used within an EMDRProvider');
  }
  return context;
}