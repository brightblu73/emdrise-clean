import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { RevenueCatService, getSubscriptionStatus, SubscriptionStatus } from '../services/RevenueCat';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

interface SubscriptionManagerProps {
  onSubscriptionChange?: (isActive: boolean) => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  onSubscriptionChange,
}) => {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ isActive: false });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    initializeSubscriptions();
  }, []);

  const initializeSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Get current offerings
      const currentOffering = await RevenueCatService.getOfferings();
      setOffering(currentOffering);

      // Check current subscription status
      const status = await getSubscriptionStatus();
      setSubscriptionStatus(status);
      onSubscriptionChange?.(status.isActive);

      console.log('Subscription initialization complete:', {
        hasOffering: !!currentOffering,
        isActive: status.isActive,
        packages: currentOffering?.availablePackages?.length || 0,
      });
    } catch (error) {
      console.error('Failed to initialize subscriptions:', error);
      Alert.alert('Error', 'Failed to load subscription information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      setPurchasing(true);
      const customerInfo = await RevenueCatService.purchasePackage(pkg);
      
      if (customerInfo) {
        const newStatus = await getSubscriptionStatus();
        setSubscriptionStatus(newStatus);
        onSubscriptionChange?.(newStatus.isActive);
        
        Alert.alert(
          'Success!',
          'Your subscription is now active. Enjoy your EMDR therapy sessions!',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      // Handle user cancellation gracefully
      if (error.code === 'PURCHASE_CANCELLED') {
        // User cancelled, no need to show error
        return;
      }
      
      Alert.alert(
        'Purchase Failed',
        error.message || 'Unable to complete purchase. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      const customerInfo = await RevenueCatService.restorePurchases();
      
      if (customerInfo) {
        const newStatus = await getSubscriptionStatus();
        setSubscriptionStatus(newStatus);
        onSubscriptionChange?.(newStatus.isActive);
        
        if (newStatus.isActive) {
          Alert.alert('Success!', 'Your subscription has been restored.');
        } else {
          Alert.alert('No Subscription', 'No active subscription found to restore.');
        }
      }
    } catch (error) {
      console.error('Restore failed:', error);
      Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading subscription information...</Text>
      </View>
    );
  }

  if (subscriptionStatus.isActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>✅ Subscription Active</Text>
        <Text style={styles.detailText}>
          Your EMDR therapy access is active.
        </Text>
        {subscriptionStatus.expirationDate && (
          <Text style={styles.expirationText}>
            Expires: {subscriptionStatus.expirationDate.toLocaleDateString()}
          </Text>
        )}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!offering || !offering.availablePackages.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No subscription options available.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeSubscriptions}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>Start your EMDR therapy journey today</Text>
      
      {offering.availablePackages.map((pkg) => (
        <TouchableOpacity
          key={pkg.identifier}
          style={styles.packageButton}
          onPress={() => handlePurchase(pkg)}
          disabled={purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.packageTitle}>{pkg.product.title}</Text>
              <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
              <Text style={styles.packageDescription}>
                {pkg.product.description}
              </Text>
              {pkg.product.introPrice && (
                <Text style={styles.trialText}>
                  Includes {pkg.product.introPrice.periodNumberOfUnits}{' '}
                  {pkg.product.introPrice.periodUnit} free trial
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
        <Text style={styles.restoreButtonText}>Restore Purchases</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#4CAF50',
  },
  detailText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  expirationText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#888',
  },
  packageButton: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  trialText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
    opacity: 0.95,
  },
  restoreButton: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
});