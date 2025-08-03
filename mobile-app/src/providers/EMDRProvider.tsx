import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EMDRSession {
  id: number;
  currentScript: number;
  selectedTherapist: 'maria' | 'alistair' | null;
  targetMemory?: string;
  negativeBeliefs?: string;
  positiveBeliefs?: string;
  vocRating?: number;
  sudsRating?: number;
}

interface EMDRContextType {
  currentSession: EMDRSession | null;
  selectedTherapist: 'maria' | 'alistair' | null;
  setSelectedTherapist: (therapist: 'maria' | 'alistair') => void;
  createSession: () => Promise<void>;
  updateSession: (updates: Partial<EMDRSession>) => Promise<void>;
  getCurrentScript: () => number;
  advanceScript: () => Promise<void>;
}

const EMDRContext = createContext<EMDRContextType | undefined>(undefined);

export const useEMDR = () => {
  const context = useContext(EMDRContext);
  if (!context) {
    throw new Error('useEMDR must be used within an EMDRProvider');
  }
  return context;
};

export const EMDRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<EMDRSession | null>(null);
  const [selectedTherapist, setSelectedTherapistState] = useState<'maria' | 'alistair' | null>(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('emdrSession');
      const therapistData = await AsyncStorage.getItem('selectedTherapist');
      
      if (sessionData) {
        setCurrentSession(JSON.parse(sessionData));
      }
      
      if (therapistData) {
        setSelectedTherapistState(therapistData as 'maria' | 'alistair');
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const setSelectedTherapist = async (therapist: 'maria' | 'alistair') => {
    try {
      await AsyncStorage.setItem('selectedTherapist', therapist);
      setSelectedTherapistState(therapist);
    } catch (error) {
      console.error('Error storing therapist selection:', error);
    }
  };

  const createSession = async () => {
    try {
      const newSession: EMDRSession = {
        id: Date.now(),
        currentScript: 1,
        selectedTherapist: selectedTherapist
      };
      
      await AsyncStorage.setItem('emdrSession', JSON.stringify(newSession));
      setCurrentSession(newSession);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const updateSession = async (updates: Partial<EMDRSession>) => {
    if (!currentSession) return;
    
    try {
      const updatedSession = { ...currentSession, ...updates };
      await AsyncStorage.setItem('emdrSession', JSON.stringify(updatedSession));
      setCurrentSession(updatedSession);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const getCurrentScript = () => {
    return currentSession?.currentScript || 1;
  };

  const advanceScript = async () => {
    if (!currentSession) return;
    
    const nextScript = currentSession.currentScript + 1;
    await updateSession({ currentScript: nextScript });
  };

  return (
    <EMDRContext.Provider value={{
      currentSession,
      selectedTherapist,
      setSelectedTherapist,
      createSession,
      updateSession,
      getCurrentScript,
      advanceScript
    }}>
      {children}
    </EMDRContext.Provider>
  );
};