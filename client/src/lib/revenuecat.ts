import { Purchases, type CustomerInfo, type PurchasesOffering } from '@revenuecat/purchases-capacitor';

// RevenueCat configuration
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY || 'appl_xewZcRiyLfkBnmDYaTktVHghPKz';

// Entitlement identifiers
export const ENTITLEMENTS = {
  PREMIUM: 'premium_access',
  TRIAL: 'trial_access'
} as const;

class RevenueCatService {
  private static instance: RevenueCatService;
  private initialized = false;

  private constructor() {}

  static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      if (!REVENUECAT_API_KEY) {
        console.warn('RevenueCat API key not found. Subscription features will be disabled.');
        return;
      }

      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        ...(userId && { appUserID: userId })
      });

      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
    }
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize(userId);
      return;
    }

    try {
      await Purchases.logIn({ appUserID: userId });
      console.log('RevenueCat user ID set:', userId);
    } catch (error) {
      console.error('Failed to set RevenueCat user ID:', error);
    }
  }

  async getEntitlements(): Promise<{
    hasActiveSubscription: boolean;
    isInTrial: boolean;
    expirationDate: Date | null;
    subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  }> {
    if (!this.initialized) {
      return {
        hasActiveSubscription: false,
        isInTrial: false,
        expirationDate: null,
        subscriptionStatus: 'expired'
      };
    }

    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      const premiumEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
      const trialEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.TRIAL];

      const hasActiveSubscription = !!premiumEntitlement;
      const isInTrial = !!trialEntitlement && !premiumEntitlement;
      
      let expirationDate: Date | null = null;
      let subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled' = 'expired';

      if (premiumEntitlement) {
        expirationDate = premiumEntitlement.expirationDate ? new Date(premiumEntitlement.expirationDate) : null;
        subscriptionStatus = 'active';
      } else if (trialEntitlement) {
        expirationDate = trialEntitlement.expirationDate ? new Date(trialEntitlement.expirationDate) : null;
        subscriptionStatus = 'trial';
      }

      return {
        hasActiveSubscription,
        isInTrial,
        expirationDate,
        subscriptionStatus
      };
    } catch (error) {
      console.error('Failed to get RevenueCat entitlements:', error);
      return {
        hasActiveSubscription: false,
        isInTrial: false,
        expirationDate: null,
        subscriptionStatus: 'expired'
      };
    }
  }

  async checkEntitlementAccess(entitlementId: string): Promise<boolean> {
    if (!this.initialized) return false;

    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      return !!customerInfo.entitlements.active[entitlementId];
    } catch (error) {
      console.error('Failed to check entitlement access:', error);
      return false;
    }
  }

  async restorePurchases(): Promise<void> {
    if (!this.initialized) return;

    try {
      await Purchases.restorePurchases();
      console.log('Purchases restored successfully');
    } catch (error) {
      console.error('Failed to restore purchases:', error);
    }
  }

  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current || null;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  }

async purchaseSubscription(): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
    try {
      // Get current offerings
      const offering = await this.getOfferings();
      if (!offering) {
        return { success: false, error: 'No subscription offerings available' };
      }

      // Get the monthly package
      const monthlyPackage = offering.availablePackages.find(pkg =>
        pkg.identifier === 'monthly' || pkg.identifier === '$rc_monthly'
      );
      if (!monthlyPackage) {
        return { success: false, error: 'Monthly subscription package not found' };
      }

      // Make the purchase
      const result = await Purchases.purchasePackage({ aPackage: monthlyPackage });

      console.log('Purchase successful:', result);
      return { success: true, customerInfo: result.customerInfo };
    } catch (error: any) {
      console.error('Purchase failed:', error);

      // Handle user cancellation
      if (error.userCancelled) {
        return { success: false, error: 'Purchase cancelled by user' };
      }

      return { success: false, error: error.message || 'Purchase failed' };
    }
  }



  async purchasePackage(packageId: string) {
    if (!this.initialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      const offerings = await this.getOfferings();
      const currentOffering = offerings?.current;
      
      if (!currentOffering) {
        throw new Error('No current offering available');
      }

      const packageToPurchase = currentOffering.availablePackages.find((pkg: any) => pkg.identifier === packageId);
      
      if (!packageToPurchase) {
        throw new Error(`Package ${packageId} not found`);
      }

      const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToPurchase });
      console.log('Purchase successful:', customerInfo);
      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (!this.initialized) return;

    try {
      await Purchases.logOut();
      console.log('RevenueCat user logged out');
    } catch (error) {
      console.error('Failed to logout from RevenueCat:', error);
    }
  }
}

export const revenueCatService = RevenueCatService.getInstance();
export default revenueCatService;