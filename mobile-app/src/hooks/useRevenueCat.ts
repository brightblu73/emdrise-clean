import { useState, useEffect } from 'react';
import { RevenueCatService, getSubscriptionStatus, SubscriptionStatus } from '../services/RevenueCat';

export const useRevenueCat = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ isActive: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (err) {
      console.error('Error checking subscription status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const setUserId = async (userId: string) => {
    try {
      await RevenueCatService.setUserId(userId);
      // Refresh subscription status after setting user ID
      await checkSubscriptionStatus();
    } catch (err) {
      console.error('Error setting user ID:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const logOut = async () => {
    try {
      await RevenueCatService.logOut();
      setSubscriptionStatus({ isActive: false });
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  return {
    subscriptionStatus,
    loading,
    error,
    checkSubscriptionStatus,
    setUserId,
    logOut,
    isSubscribed: subscriptionStatus.isActive,
  };
};