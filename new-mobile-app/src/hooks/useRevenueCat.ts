import { useState, useEffect, useCallback } from 'react';
import RevenueCatService from '../services/RevenueCat';
import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

interface SubscriptionStatus {
  isActive: boolean;
  expirationDate?: Date;
  productIdentifier?: string;
}

export function useRevenueCat() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ isActive: false });
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const updateSubscriptionStatus = useCallback((customerInfo: CustomerInfo) => {
    const activeEntitlements = Object.values(customerInfo.entitlements.active);
    
    if (activeEntitlements.length > 0) {
      const entitlement = activeEntitlements[0];
      setSubscriptionStatus({
        isActive: true,
        expirationDate: entitlement.expirationDate ? new Date(entitlement.expirationDate) : undefined,
        productIdentifier: entitlement.productIdentifier,
      });
    } else {
      setSubscriptionStatus({ isActive: false });
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      setLoading(true);
      const customerInfo = await RevenueCatService.getCustomerInfo();
      setCustomerInfo(customerInfo);
      updateSubscriptionStatus(customerInfo);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
      setSubscriptionStatus({ isActive: false });
    } finally {
      setLoading(false);
    }
  }, [updateSubscriptionStatus]);

  const setUserId = useCallback(async (userId: string) => {
    try {
      await RevenueCatService.configure(userId);
      await refreshStatus();
    } catch (error) {
      console.error('Error setting RevenueCat user:', error);
    }
  }, [refreshStatus]);

  const purchaseMonthlySubscription = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const monthlyPackage = await RevenueCatService.getMonthlySubscriptionPackage();
      if (!monthlyPackage) {
        console.error('Monthly subscription package not found');
        return false;
      }

      const result = await RevenueCatService.purchasePackage(monthlyPackage);
      
      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        updateSubscriptionStatus(result.customerInfo);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateSubscriptionStatus]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const customerInfo = await RevenueCatService.restorePurchases();
      setCustomerInfo(customerInfo);
      updateSubscriptionStatus(customerInfo);
      return true;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [updateSubscriptionStatus]);

  useEffect(() => {
    // Initialize RevenueCat on mount
    const initialize = async () => {
      try {
        await RevenueCatService.configure();
        await refreshStatus();
      } catch (error) {
        console.error('Error initializing RevenueCat:', error);
        setLoading(false);
      }
    };

    initialize();
  }, [refreshStatus]);

  return {
    subscriptionStatus,
    loading,
    customerInfo,
    setUserId,
    purchaseMonthlySubscription,
    restorePurchases,
    refreshStatus,
  };
}