import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@shared/schema";

interface EMDRSessionState {
  currentSession: Session | null;
  isLoading: boolean;
  canAdvance: boolean;
  scriptInfo: {
    title: string;
    description: string;
    videoUrl?: string;
    isLoop: boolean;
  };
}

export function useEMDRSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  // Use localStorage-based session for web version - but prioritize paused sessions
  const [currentSession, setCurrentSession] = useState(() => {
    try {
      // Check for paused session first (higher priority)
      const pausedSession = localStorage.getItem('pausedEMDRSession');
      if (pausedSession) {
        console.log('Paused session detected on initialization, will be handled by startSession');
        return null; // Let startSession handle the resumption
      }
      
      const stored = localStorage.getItem('emdrSession');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate session has required fields and fix corrupted state
        if (parsed && (parsed.currentScript === null || parsed.currentScript === undefined)) {
          console.log('Corrupted session detected with null currentScript, resetting to script 1');
          parsed.currentScript = 1;
        }
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error parsing stored session:', error);
      // Clear corrupted data
      localStorage.removeItem('emdrSession');
      localStorage.removeItem('pausedEMDRSession');
      return null;
    }
  });
  
  const isLoading = false;
  
  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('emdrSession', JSON.stringify(currentSession));
    }
  }, [currentSession]);

  // Frontend-only session start
  const startSessionMutation = {
    mutate: () => {
      // Simple and reliable: Check for pause flag first
      const pauseFlag = localStorage.getItem('emdrPauseFlag');
      const pausedSession = localStorage.getItem('pausedEMDRSession');
      
      if (pauseFlag === 'true' || pausedSession) {
        console.log('Pause flag detected, resuming at Script 5a');
        // Clear pause indicators
        localStorage.removeItem('emdrPauseFlag');
        localStorage.removeItem('pausedEMDRSession');
        localStorage.removeItem('emdrSession'); // Clear any existing session
        
        // Always resume at Script 5a for paused sessions
        const resumeSession = {
          id: Date.now(),
          currentScript: '5a',
          status: 'active',
          isActive: true,
          createdAt: new Date().toISOString(),
          resumedAt: new Date().toISOString(),
        };
        setCurrentSession(resumeSession);
        console.log('Frontend session resumed at Script 5a:', resumeSession);
        return;
      }
      
      // No pause detected, start new session at Script 1
      const newSession = {
        id: Date.now(),
        currentScript: 1,
        status: 'active',
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      setCurrentSession(newSession);
      console.log('Frontend session started:', newSession);
    },
    isPending: false,
  };

  // Frontend-only script advancement
  const advanceScriptMutation = {
    mutate: ({ sessionId, forceNext = false }: { sessionId: number; forceNext?: boolean }) => {
      if (currentSession) {
        let nextScript;
        
        // Handle Script 5a completion - return to Script 5
        if (currentSession.currentScript === "5a") {
          nextScript = 5;
        } 
        // Handle normal progression
        else {
          const current = typeof currentSession.currentScript === 'string' ? 
            parseInt(currentSession.currentScript) : currentSession.currentScript;
          nextScript = Math.min(current + 1, 10); // Max 10 scripts
        }
        
        const updatedSession = {
          ...currentSession,
          currentScript: nextScript,
        };
        setCurrentSession(updatedSession);
        setIsVideoCompleted(false);
        console.log('Frontend session advanced to script:', nextScript);
      }
    },
    isPending: false,
  };

  // Frontend-only progress save
  const saveProgressMutation = {
    mutate: ({ sessionId, scriptNumber, userInput, notes }: { sessionId: number; scriptNumber: number; userInput?: any; notes?: string; }) => {
      console.log('Frontend progress saved:', { scriptNumber, userInput, notes });
    },
    isPending: false,
  };

  // Frontend-only previous script navigation
  const backToPreviousScriptMutation = {
    mutate: ({ sessionId, targetScript }: { sessionId: number; targetScript: number }) => {
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          currentScript: targetScript,
        };
        setCurrentSession(updatedSession);
        setIsVideoCompleted(false);
        console.log('Frontend session went back to script:', targetScript);
      }
    },
    isPending: false,
  };

  // Frontend-only session update
  const updateSessionMutation = {
    mutate: ({ sessionId, updates }: { sessionId: number; updates: any; }) => {
      if (currentSession) {
        const updatedSession = { ...currentSession, ...updates };
        setCurrentSession(updatedSession);
        console.log('Frontend session updated:', updates);
      }
    },
    isPending: false,
  };

  // Get script information based on current script number - Updated per amendments
  const getScriptInfo = (scriptNumber: number) => {
    // Get selected therapist from localStorage for video URL
    const selectedTherapist = localStorage.getItem('selectedTherapist');
    const therapistPrefix = selectedTherapist === 'female' ? 'maria' : 'alistair';
    
    const scriptMap: Record<string | number, { title: string; description: string; videoUrl?: string; isLoop: boolean; needsSetup?: boolean; hasBLS?: boolean; canPause?: boolean }> = {
      1: {
        title: "Welcome and Introduction to EMDR",
        description: "Introduction to EMDR therapy and what to expect",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script1-welcome.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script1-welcome.mp4',
        isLoop: false,
      },
      2: {
        title: "Setting up your Calm Place",
        description: "Set up your safe, calm place for grounding during and after reprocessing",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script2-calmplace.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script2-calmplace.mp4',
        isLoop: false,
      },
      3: {
        title: "Setting up the Target Memory",
        description: "Identifying the target memory to be reprocessed",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script3-target.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script3-target.mp4',
        isLoop: false,
      },
      4: {
        title: "Desensitisation and Reprocessing",
        description: "Preparing for bilateral stimulation and reprocessing",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script4-reprocessing.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script4-reprocessing.mp4',
        isLoop: false,
        needsSetup: true,
        hasBLS: true,
      },
      5: {
        title: "Reprocessing Continued",
        description: "Bilateral stimulation processing cycles with therapist guidance",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script5-reprocessing-continued.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script5-reprocessing-continued.mp4',
        isLoop: true,
        hasBLS: true,
        needsSetup: false,  // Always show BLS, don't wait for setup
        canPause: true, // Can pause to Script 9 for safe closure
      },
      "5a": {
        title: "Continue Reprocessing After an Incomplete Session",
        description: "Resume reprocessing from where you left off in your previous session",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script5a-continue-reprocessing.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script5a-continue-reprocessing.mp4',
        isLoop: true,
        hasBLS: true,
        needsSetup: false,
      },
      6: {
        title: "Installation of Positive Belief",
        description: "Strengthening positive beliefs and new neural pathways",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script6-installation.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script6-installation.mp4',
        isLoop: false,
        needsSetup: true,
      },
      7: {
        title: "Installation of Positive Belief Continued",
        description: "Continued positive belief installation and reinforcement",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script7-installation-continued.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script7-installation-continued.mp4',
        isLoop: true,
        needsSetup: true,
      },
      8: {
        title: "Body Scan",
        description: "Scanning for remaining disturbance in the body for reprocessing",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script8-body-scan.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script8-body-scan.mp4',
        isLoop: false,
      },
      9: {
        title: "Calm Place",
        description: "Return to your calm place for grounding",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script9-calm-place.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script9-calm-place.mp4',
        isLoop: false,
      },
      10: {
        title: "Aftercare",
        description: "Session completion instructions",
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script10-aftercare.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script10-aftercare.mp4',
        isLoop: false,
      },
    };

    return scriptMap[scriptNumber] || {
      title: "Unknown Script",
      description: "Script information not available",
      isLoop: false,
    };
  };

  // Frontend-only current script update
  const updateCurrentScriptMutation = {
    mutate: ({ sessionId, scriptNumber }: { sessionId: number; scriptNumber: number }) => {
      if (currentSession) {
        const updatedSession = { ...currentSession, currentScript: scriptNumber };
        setCurrentSession(updatedSession);
        setIsVideoCompleted(false);
        console.log('Frontend script updated to:', scriptNumber);
      }
    },
    isPending: false,
  };

  const sessionState: EMDRSessionState = {
    currentSession: currentSession ?? null,
    isLoading,
    canAdvance: (currentSession ? (
      currentSession.currentScript === 1 || 
      currentSession.currentScript === 2 || 
      currentSession.currentScript === 3 || // target memory setup
      currentSession.currentScript === 4 || // desensitisation setup
      currentSession.currentScript === 5 || // reprocessing continued
      currentSession.currentScript === 6 || // installation
      currentSession.currentScript === 7 || // installation continued
      currentSession.currentScript === 8 || // body scan
      currentSession.currentScript === 9 || // closure
      isVideoCompleted
    ) : false) && !advanceScriptMutation.isPending,
    scriptInfo: currentSession ? getScriptInfo(currentSession.currentScript) : {
      title: "Ready to Begin",
      description: "Start your EMDR therapy session",
      isLoop: false,
    },
  };

  // Pause session function - saves current state and jumps to Script 9
  const pauseSession = () => {
    if (currentSession) {
      // Save current session state as paused - use a persistent flag
      const pausedSession = {
        ...currentSession,
        pausedAt: new Date().toISOString(),
        pausedFromScript: currentSession.currentScript,
        isPaused: true, // Clear flag that persists through closure
      };
      localStorage.setItem('pausedEMDRSession', JSON.stringify(pausedSession));
      localStorage.setItem('emdrPauseFlag', 'true'); // Simple flag that survives closure
      console.log('Session paused - saved to localStorage:', pausedSession);
      console.log('Paused session should be detectable from homepage now');
      
      // Jump to Script 9 for safe closure
      const updatedSession = {
        ...currentSession,
        currentScript: 9,
      };
      setCurrentSession(updatedSession);
      setIsVideoCompleted(false);
      console.log('Session paused at script:', pausedSession.pausedFromScript, 'jumping to Script 9');
    }
  };

  return {
    ...sessionState,
    isVideoCompleted,
    setIsVideoCompleted,
    startSession: startSessionMutation.mutate,
    updateCurrentScript: updateCurrentScriptMutation,
    advanceScript: (forceNext: boolean = false) => {
      if (currentSession && !advanceScriptMutation.isPending) {
        console.log("Advancing script from", currentSession.currentScript, "to next script");
        advanceScriptMutation.mutate({ sessionId: currentSession.id, forceNext });
      } else if (advanceScriptMutation.isPending) {
        console.log("Script advancement already in progress, ignoring duplicate request");
      }
    },
    backToPreviousScript: (targetScript: number) => {
      if (currentSession && !backToPreviousScriptMutation.isPending) {
        backToPreviousScriptMutation.mutate({ sessionId: currentSession.id, targetScript });
      }
    },
    pauseSession, // New pause functionality
    saveProgress: saveProgressMutation.mutate,
    updateSession: updateSessionMutation.mutate,

    isStartingSession: startSessionMutation.isPending,
    isAdvancing: advanceScriptMutation.isPending,
    isGoingBack: backToPreviousScriptMutation.isPending,
    isSavingProgress: saveProgressMutation.isPending,
  };
}