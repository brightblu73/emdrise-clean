import { Purchases, type PurchasesConfiguration, type CustomerInfo, type PurchasesOffering, type LogInResult } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI, PaywallPresentationConfiguration } from '@revenuecat/purchases-capacitor-ui';

// RevenueCat configuration
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY || 'appl_xewZcRiyLfkBnmDYaTktVHghPKz';

// Entitlement identifiers
export const ENTITLEMENTS = {
  PREMIUM: 'premium_access',
  TRIAL: 'trial_access',
  FULL_ACCESS: 'EMDRise Monthly Plan'
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

   async initialize(userId?: string): Promise<boolean> {
     if (this.initialized) return true;

     try {
       if (!REVENUECAT_API_KEY) {
         const errorMsg = 'RevenueCat API key is not set. Please add VITE_REVENUECAT_PUBLIC_SDK_KEY to your .env file.';
         console.error('🔥 RevenueCat Init Error:', errorMsg);
         this.initialized = false;
         return false;
       }

      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        ...(userId && { appUserID: userId })
      });

      this.initialized = true;
      console.log('RevenueCat initialized successfully');
       console.log('✅ RevenueCat initialized successfully');
       return true;
     } catch (error) {
       console.error('❌ Failed to initialize RevenueCat:', error);
       this.initialized = false;
       return false;
     }
   }

   async setUserId(userId: string): Promise<boolean> {
     if (!this.initialized) {
       const success = await this.initialize(userId);
       return success;
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
      console.log("customerInfoRevenueCat: ", customerInfo);
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

  async hasFullAccess(): Promise<boolean> {
    return this.checkEntitlementAccess(ENTITLEMENTS.FULL_ACCESS);
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
       // const result = await Purchases.purchasePackage({ aPackage: monthlyPackage });

       // console.log('Purchase successful:', result);
       // return { success: true, customerInfo: result.customerInfo };
       this.handlePresentPaywall();
       return { success: false, error: 'Purchase cancelled by user' };
     } catch (error: any) {
       console.error('Purchase failed:', error);

       // Handle user cancellation
       if (error.userCancelled) {
         return { success: false, error: 'Purchase cancelled by user' };
       }

       return { success: false, error: error.message || 'Purchase failed' };
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

   async openPaywall(): Promise<void> {
     if (!this.initialized) {
       const success = await this.initialize();
       if (!success) {
         throw new Error('RevenueCat is not configured. Please check your API key.');
       }
     }

     try {
       const offerings = await this.getOfferings();
       const currentOffering = offerings?.current;

       if (!currentOffering || currentOffering.availablePackages.length === 0) {
         throw new Error('No subscription packages available');
       }

       // Use the first available package for native purchase
       const packageToPurchase = currentOffering.availablePackages[0];

       // For native apps (iOS/Android), use direct purchase which shows native paywall
       const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToPurchase });
       console.log('Purchase successful:', customerInfo);
       
       // You can emit an event or refresh user entitlements here
     } catch (error: any) {
       if (error.message === 'User cancelled') {
         console.log('User cancelled the purchase');
       } else {
         console.error('Failed to open paywall:', error);
         throw error;
       }
     }
   }

   async handlePresentPaywall() {
    try {
      // Check if already purchased
      const { customerInfo } = await Purchases.getCustomerInfo();
      const premiumEntitlement = customerInfo.entitlements.active['premium_access'];
      
      if (premiumEntitlement) {
        // toast({
        //   title: 'Already Subscribed',
        //   description: 'You already have premium access!',
        // });
        return;
      }

      // Use RevenueCat UI paywall
      console.log('Opening paywall...');
      const offerings = await this.getOfferings();
      console.log('Offerings:', offerings);
      
       const result = await RevenueCatUI.presentPaywall({ offering: offerings?.current, presentationConfiguration: PaywallPresentationConfiguration.FULL_SCREEN });
      
      if (result) {
        console.log('Paywall dismissed, checking purchase status...');
        // Verify the purchase was successful
        const { customerInfo: updatedInfo } = await Purchases.getCustomerInfo();
        const updatedEntitlement = updatedInfo.entitlements.active['premium_access'];
        
        if (updatedEntitlement) {
          // toast({
          //   title: 'Success!',
          //   description: 'You now have premium access',
          // });
        }
      }
    } catch (error: any) {
      console.error('Paywall failed:', error);
      if (error.message === 'User cancelled') {
        console.log('User cancelled the purchase');
      } else {
        // toast({
        //   title: 'Purchase Failed',
        //   description: error.message || 'Unable to complete purchase. Please try again.',
        //   variant: 'destructive',
        // });
      }
    } finally {
      // setPurchasing(null);
    }
  };
 }

 export const revenueCatService = RevenueCatService.getInstance();
 export default revenueCatService;