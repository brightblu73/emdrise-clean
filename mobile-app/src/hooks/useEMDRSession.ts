import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface SessionData {
  id?: string;
  currentScript: number | string;
  therapist: 'maria' | 'alistair';
  startedAt: string;
  progress: Record<string, any>;
  pausedFromScript?: number | string;
  pausedAt?: string;
}

export function useEMDRSession(therapist: 'maria' | 'alistair') {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeSession();
  }, [therapist]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      
      // Try to load local session first
      const localSession = await loadLocalSession();
      if (localSession) {
        setSessionData(localSession);
        setLoading(false);
        return;
      }

      // Try to get current session from server
      try {
        const serverSession = await apiService.getCurrentSession();
        if (serverSession) {
          setSessionData(serverSession);
          await saveLocalSession(serverSession);
        } else {
          // Create new session
          await createNewSession();
        }
      } catch (apiError) {
        // Fallback to local session
        await createNewSession();
      }
    } catch (error) {
      setError('Failed to initialize session');
      console.error('Session initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalSession = async (): Promise<SessionData | null> => {
    try {
      const saved = await AsyncStorage.getItem('currentEMDRSession');
      if (saved) {
        const data = JSON.parse(saved);
        // Ensure therapist matches
        if (data.therapist === therapist) {
          return data;
        }
      }
    } catch (error) {
      console.log('No local session found');
    }
    return null;
  };

  const saveLocalSession = async (data: SessionData) => {
    try {
      await AsyncStorage.setItem('currentEMDRSession', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save local session');
    }
  };

  const createNewSession = async () => {
    // Check for paused session
    const pausedSession = await AsyncStorage.getItem('pausedEMDRSession');
    let currentScript: number | string = 1;
    
    if (pausedSession) {
      try {
        const parsed = JSON.parse(pausedSession);
        if (parsed.therapist === therapist) {
          // Resume from Script 5a if paused from Script 5
          currentScript = "5a";
          await AsyncStorage.removeItem('pausedEMDRSession');
        }
      } catch (error) {
        console.log('Error parsing paused session:', error);
      }
    }

    const newSession: SessionData = {
      currentScript,
      therapist,
      startedAt: new Date().toISOString(),
      progress: {}
    };

    try {
      // Try to create on server
      const serverSession = await apiService.createSession(newSession);
      newSession.id = serverSession.id;
    } catch (error) {
      // Continue with local session if server fails
      console.log('Server session creation failed, using local session');
    }

    setSessionData(newSession);
    await saveLocalSession(newSession);
  };

  const updateSession = async (updates: Partial<SessionData>) => {
    if (!sessionData) return;

    const updatedSession = { ...sessionData, ...updates };
    setSessionData(updatedSession);
    
    // Save locally
    await saveLocalSession(updatedSession);
    
    // Try to sync with server
    if (updatedSession.id) {
      try {
        await apiService.updateSession(updatedSession.id, updates);
      } catch (error) {
        console.log('Failed to sync with server, continuing with local session');
      }
    }
  };

  const advanceScript = async () => {
    if (!sessionData) return;
    
    let nextScript: number | string;
    
    // Handle Script 5a completion - return to Script 5
    if (sessionData.currentScript === "5a") {
      nextScript = 5;
    } 
    // Handle normal progression
    else {
      const current = typeof sessionData.currentScript === 'string' ? 
        parseInt(sessionData.currentScript) : sessionData.currentScript;
      if (current >= 10) return;
      nextScript = current + 1;
    }
    
    await updateSession({ currentScript: nextScript });
  };

  const goBackScript = async (targetScript?: number | string) => {
    if (!sessionData) return;
    
    let prevScript: number | string;
    
    if (targetScript !== undefined) {
      prevScript = targetScript;
    } else {
      const current = typeof sessionData.currentScript === 'string' ? 
        parseInt(sessionData.currentScript) : sessionData.currentScript;
      if (current <= 1) return;
      prevScript = current - 1;
    }
    
    await updateSession({ currentScript: prevScript });
  };

  const completeSession = async () => {
    if (!sessionData) return;
    
    const completedSession = {
      ...sessionData,
      completedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    await updateSession(completedSession);
    await AsyncStorage.removeItem('currentEMDRSession');
  };

  const saveNotes = async (notes: string) => {
    if (!sessionData) return;
    
    try {
      // Save locally
      const noteData = {
        script: sessionData.currentScript,
        notes,
        timestamp: new Date().toISOString()
      };
      
      const existingNotes = await AsyncStorage.getItem('emdrNotes') || '[]';
      const allNotes = JSON.parse(existingNotes);
      allNotes.push(noteData);
      await AsyncStorage.setItem('emdrNotes', JSON.stringify(allNotes));
      
      // Try to sync with server
      if (sessionData.id) {
        try {
          await apiService.saveSessionNotes(sessionData.id, notes);
        } catch (error) {
          console.log('Failed to sync notes with server');
        }
      }
    } catch (error) {
      throw new Error('Failed to save notes');
    }
  };

  // Pause session function - saves current state and jumps to Script 9
  const pauseSession = async () => {
    if (!sessionData) return;
    
    // Save current session state as paused
    const pausedSession = {
      ...sessionData,
      pausedAt: new Date().toISOString(),
      pausedFromScript: sessionData.currentScript,
    };
    await AsyncStorage.setItem('pausedEMDRSession', JSON.stringify(pausedSession));
    
    // Jump to Script 9 for safe closure
    await updateSession({ currentScript: 9 });
  };

  return {
    sessionData,
    loading,
    error,
    updateSession,
    advanceScript,
    goBackScript,
    completeSession,
    pauseSession,
    saveNotes
  };
}