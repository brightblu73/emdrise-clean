import { useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "./use-toast";

interface SessionState {
  currentPhase: number;
  sessionId?: number;
  targetId?: number;
  isActive: boolean;
}

export function useSession() {
  const { toast } = useToast();
  const [sessionState, setSessionState] = useState<SessionState>({
    currentPhase: 1,
    isActive: false,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/sessions", data);
      return response.json();
    },
    onSuccess: (session) => {
      setSessionState(prev => ({
        ...prev,
        sessionId: session.id,
        isActive: true,
      }));
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create session",
        variant: "destructive",
      });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/sessions/${sessionId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update session",
        variant: "destructive",
      });
    },
  });

  const startSession = useCallback((phase: number = 1, targetId?: number) => {
    // Use localStorage-based session instead of server calls for web version
    const newSession = {
      sessionId: Date.now(), // Simple ID generation
      phase,
      targetId,
      status: 'incomplete' as const,
      isActive: true,
      currentPhase: phase,
    };
    setSessionState(prev => ({
      ...prev,
      ...newSession,
    }));
    console.log('Frontend session started:', newSession);
  }, []);

  const updateSession = useCallback((updates: any) => {
    if (sessionState.sessionId) {
      // Update frontend session state only
      setSessionState(prev => ({
        ...prev,
        ...updates,
      }));
      console.log('Frontend session updated:', updates);
    }
  }, [sessionState.sessionId]);

  const completeSession = useCallback(() => {
    if (sessionState.sessionId) {
      // Complete frontend session only
      setSessionState(prev => ({
        ...prev,
        status: 'complete' as const,
        completedAt: new Date().toISOString(),
        isActive: false,
      }));
      console.log('Frontend session completed');
    }
  }, [sessionState.sessionId]);

  const nextPhase = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      currentPhase: Math.min(prev.currentPhase + 1, 8),
    }));
  }, []);

  const setTargetId = useCallback((targetId: number) => {
    setSessionState(prev => ({
      ...prev,
      targetId,
    }));
  }, []);

  return {
    sessionState,
    startSession,
    updateSession,
    completeSession,
    nextPhase,
    setTargetId,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
  };
}
