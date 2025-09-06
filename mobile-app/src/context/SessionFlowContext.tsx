import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

type SessionStart = '1' | '5a';

type SessionFlowState = {
  sessionActive: boolean;
  sessionStartedAt: SessionStart | null;
  reprocessingStarted: boolean;
  beginNewSession: (startAt: SessionStart) => void;
  markEnteredScript: (scriptKey: string) => void;
  resetSession: () => void;
  eligibleForDashboardOnScript10: () => boolean;
};

const SessionFlowContext = createContext<SessionFlowState | undefined>(undefined);

export const SessionFlowProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<SessionStart | null>(null);
  const [reprocessingStarted, setReprocessingStarted] = useState(false);

  const beginNewSession = useCallback((startAt: SessionStart) => {
    setSessionActive(true);
    setSessionStartedAt(startAt);
    setReprocessingStarted(startAt === '5a');
  }, []);

  const markEnteredScript = useCallback((scriptKey: string) => {
    if (scriptKey === '5' || scriptKey === '5a') setReprocessingStarted(true);
  }, []);

  const eligibleForDashboardOnScript10 = useCallback(() => sessionActive && reprocessingStarted, [sessionActive, reprocessingStarted]);

  const resetSession = useCallback(() => { setSessionActive(false); setSessionStartedAt(null); setReprocessingStarted(false); }, []);

  const value = useMemo(() => ({ sessionActive, sessionStartedAt, reprocessingStarted, beginNewSession, markEnteredScript, resetSession, eligibleForDashboardOnScript10 }), [sessionActive, sessionStartedAt, reprocessingStarted, beginNewSession, markEnteredScript, resetSession, eligibleForDashboardOnScript10]);

  return <SessionFlowContext.Provider value={value}>{children}</SessionFlowContext.Provider>;
};

export const useSessionFlow = () => {
  const ctx = useContext(SessionFlowContext);
  if (!ctx) throw new Error('useSessionFlow must be used within SessionFlowProvider');
  return ctx;
};