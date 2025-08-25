import Purchases, { PurchasesOffering, CustomerInfo, PurchasesPackage, LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys
const REVENUECAT_IOS_API_KEY = 'appl_xewZcRiyLfkBnmDYaTktVHghPKz';
// Android API key will be added when needed for Android development
const REVENUECAT_ANDROID_API_KEY = '';

export class RevenueCatService {
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Enable debug logs in development
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Configure RevenueCat
      const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;
      
      if (!apiKey) {
        throw new Error(`RevenueCat API key not found for ${Platform.OS}`);
      }

      await Purchases.configure({ apiKey });
      this.initialized = true;
      
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  static async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      await this.initialize();
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  }

  static async purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  static async restorePurchases(): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Restore purchases failed:', error);
      return null;
    }
  }

  static async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      await this.initialize();
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  static async isSubscriptionActive(entitlementId: string = 'pro'): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      const entitlement = customerInfo.entitlements.active[entitlementId];
      return entitlement !== undefined;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  static async setUserId(userId: string): Promise<void> {
    try {
      await this.initialize();
      await Purchases.logIn(userId);
      console.log('User ID set for RevenueCat:', userId);
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }

  static async logOut(): Promise<void> {
    try {
      await this.initialize();
      await Purchases.logOut();
      console.log('RevenueCat user logged out');
    } catch (error) {
      console.error('Failed to log out RevenueCat user:', error);
    }
  }
}

// Subscription status interface
export interface SubscriptionStatus {
  isActive: boolean;
  productIdentifier?: string;
  expirationDate?: Date;
  originalPurchaseDate?: Date;
}

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const customerInfo = await RevenueCatService.getCustomerInfo();
    if (!customerInfo) {
      return { isActive: false };
    }

    const proEntitlement = customerInfo.entitlements.active['pro'];
    if (proEntitlement) {
      return {
        isActive: true,
        productIdentifier: proEntitlement.productIdentifier,
        expirationDate: proEntitlement.expirationDate ? new Date(proEntitlement.expirationDate) : undefined,
        originalPurchaseDate: proEntitlement.originalPurchaseDate ? new Date(proEntitlement.originalPurchaseDate) : undefined,
      };
    }

    return { isActive: false };
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return { isActive: false };
  }
};