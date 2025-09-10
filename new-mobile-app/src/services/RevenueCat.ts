import Purchases, { 
  PurchasesOffering, 
  PurchasesPackage, 
  CustomerInfo,
  PURCHASES_ERROR_CODE 
} from 'react-native-purchases';

class RevenueCatService {
  private static instance: RevenueCatService;
  private isConfigured = false;

  static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  async configure(userId?: string) {
    if (this.isConfigured) return;

    try {
      // Use the API key from the IAP configuration document
      await Purchases.configure({
        apiKey: 'appl_xewZcRiyLfkBnmDYaTktVHghPKz',
        appUserID: userId,
      });

      if (userId) {
        await this.setUserId(userId);
      }

      this.isConfigured = true;
      console.log('RevenueCat configured successfully');
    } catch (error) {
      console.error('Error configuring RevenueCat:', error);
      throw error;
    }
  }

  async setUserId(userId: string) {
    try {
      await Purchases.logIn(userId);
      console.log('RevenueCat user set:', userId);
    } catch (error) {
      console.error('Error setting RevenueCat user:', error);
    }
  }

  async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();
      return Object.values(offerings.all);
    } catch (error) {
      console.error('Error getting offerings:', error);
      return [];
    }
  }

  async purchasePackage(purchasePackage: PurchasesPackage): Promise<{ success: boolean; customerInfo?: CustomerInfo }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(purchasePackage);
      return { success: true, customerInfo };
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return { success: false };
      }
      
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error getting customer info:', error);
      throw error;
    }
  }

  async isSubscriptionActive(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      
      // Check if user has active entitlements
      const activeEntitlements = Object.keys(customerInfo.entitlements.active);
      return activeEntitlements.length > 0;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  async getMonthlySubscriptionPackage(): Promise<PurchasesPackage | null> {
    try {
      const offerings = await this.getOfferings();
      
      for (const offering of offerings) {
        // Look for the monthly subscription package
        const monthlyPackage = offering.availablePackages.find(
          pkg => pkg.identifier === 'com.emdrise.monthly'
        );
        
        if (monthlyPackage) {
          return monthlyPackage;
        }
      }
      
      // If not found by identifier, try to find monthly package by type
      for (const offering of offerings) {
        const monthlyPackage = offering.monthly;
        if (monthlyPackage) {
          return monthlyPackage;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting monthly subscription package:', error);
      return null;
    }
  }
}

export default RevenueCatService.getInstance();