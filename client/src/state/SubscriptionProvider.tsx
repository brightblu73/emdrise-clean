import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { revenueCatService } from '@/lib/revenuecat';
import { useAuth } from './AuthProvider';

type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled';

type SubscriptionContextType = {
  hasActiveSubscription: boolean;
  subscriptionStatus: SubscriptionStatus;
  isLoading: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  refreshSubscriptionStatus: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('expired');
  const [isLoading, setIsLoading] = useState(false);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setHasActiveSubscription(false);
      setSubscriptionStatus('expired');
      return;
    }

    setIsLoading(true);
    try {
      // Initialize RevenueCat with the user's Supabase ID
      await revenueCatService.initialize(user.id);

      // Check if user has active subscription
      const hasFullAccess = await revenueCatService.hasFullAccess();
      const entitlements = await revenueCatService.getEntitlements();

      setHasActiveSubscription(hasFullAccess);
      setSubscriptionStatus(entitlements.subscriptionStatus);

      console.log('Subscription status checked:', {
        hasActiveSubscription: hasFullAccess,
        subscriptionStatus: entitlements.subscriptionStatus
      });
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      setHasActiveSubscription(false);
      setSubscriptionStatus('expired');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    await checkSubscriptionStatus();
  };

  // Check subscription status when user changes
  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const value: SubscriptionContextType = {
    hasActiveSubscription,
    subscriptionStatus,
    isLoading,
    checkSubscriptionStatus,
    refreshSubscriptionStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
