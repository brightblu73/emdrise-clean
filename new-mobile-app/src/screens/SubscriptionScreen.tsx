import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRevenueCat } from '../hooks/useRevenueCat';
import { EMDRiseColors, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseTypography, EMDRiseStyles } from '../constants/branding';

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const { 
    subscriptionStatus, 
    loading, 
    purchaseMonthlySubscription, 
    restorePurchases 
  } = useRevenueCat();
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Navigate back if user already has active subscription
  useEffect(() => {
    if (subscriptionStatus.isActive) {
      navigation.goBack();
    }
  }, [subscriptionStatus.isActive, navigation]);

  const handlePurchaseSubscription = async () => {
    try {
      setIsPurchasing(true);
      const success = await purchaseMonthlySubscription();
      
      if (success) {
        Alert.alert(
          'Subscription Activated!',
          'Your EMDRise subscription is now active. You can access all EMDR therapy features.',
          [
            {
              text: 'Start EMDR Journey',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Purchase Cancelled',
          'Your subscription was not activated. You can try again anytime.'
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(
        'Purchase Failed',
        'Unable to process your subscription. Please check your payment method and try again.'
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      const success = await restorePurchases();
      
      if (success && subscriptionStatus.isActive) {
        Alert.alert(
          'Purchases Restored!',
          'Your subscription has been restored successfully.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No active subscriptions were found to restore.'
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again or contact support.'
      );
    } finally {
      setIsRestoring(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={EMDRiseColors.primaryBlue} />
          <Text style={styles.loadingText}>Loading subscription details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.logoText}>EMDRise</Text>
          <Text style={styles.title}>Unlock Professional EMDR Therapy</Text>
          <Text style={styles.subtitle}>
            Get unlimited access to expert-guided EMDR sessions
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <Text style={styles.planName}>EMDRise Premium</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>£12.99</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.trialText}>7-day free trial • Cancel anytime</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Complete 10-phase EMDR protocol</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Professional therapist video guidance</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Multiple bilateral stimulation options</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Session pause and resume functionality</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Guided memory processing and calm place setup</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Therapeutic aftercare and grounding resources</Text>
            </View>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity 
            style={[styles.subscribeButton, (isPurchasing || isRestoring) && styles.disabledButton]}
            onPress={handlePurchaseSubscription}
            disabled={isPurchasing || isRestoring}
          >
            {isPurchasing ? (
              <View style={styles.buttonLoading}>
                <ActivityIndicator size="small" color={EMDRiseColors.white} />
                <Text style={styles.subscribeButtonText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.subscribeButtonText}>Start 7-Day Free Trial</Text>
            )}
          </TouchableOpacity>

          {/* Restore Purchases */}
          <TouchableOpacity 
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={isPurchasing || isRestoring}
          >
            {isRestoring ? (
              <View style={styles.buttonLoading}>
                <ActivityIndicator size="small" color={EMDRiseColors.primaryBlue} />
                <Text style={styles.restoreButtonText}>Restoring...</Text>
              </View>
            ) : (
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Trial Information */}
        <View style={styles.trialInfo}>
          <Text style={styles.trialTitle}>About Your Free Trial</Text>
          <Text style={styles.trialDescription}>
            • Your 7-day free trial starts immediately after subscription{'\n'}
            • You can cancel anytime during the trial period{'\n'}
            • No charges until your trial ends{'\n'}
            • Full access to all EMDR therapy features{'\n'}
            • Subscription auto-renews at £12.99/month unless cancelled
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </Text>
          <Text style={styles.footerSubtext}>
            EMDRise is not a substitute for professional mental health care.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: EMDRiseSpacing.md,
  },
  loadingText: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[600],
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  header: {
    paddingTop: EMDRiseSpacing.md,
    paddingBottom: EMDRiseSpacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.primaryBlue,
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  logoText: {
    fontSize: EMDRiseTypography.fontSize['3xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.sm,
  },
  title: {
    fontSize: EMDRiseTypography.fontSize['2xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.gray[800],
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.sm,
  },
  subtitle: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  pricingCard: {
    backgroundColor: EMDRiseColors.white,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.xl,
    shadowColor: EMDRiseColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
    paddingBottom: EMDRiseSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: EMDRiseColors.gray[200],
  },
  planName: {
    fontSize: EMDRiseTypography.fontSize.xl,
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.gray[800],
    marginBottom: EMDRiseSpacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: EMDRiseSpacing.xs,
  },
  price: {
    fontSize: EMDRiseTypography.fontSize['4xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.primaryBlue,
  },
  pricePeriod: {
    fontSize: EMDRiseTypography.fontSize.lg,
    color: EMDRiseColors.gray[600],
    marginLeft: EMDRiseSpacing.xs,
  },
  trialText: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[500],
  },
  featuresContainer: {
    marginBottom: EMDRiseSpacing.xl,
    gap: EMDRiseSpacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: EMDRiseSpacing.sm,
  },
  featureIcon: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.primaryGreen,
    fontWeight: EMDRiseTypography.fontWeight.bold,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[700],
    lineHeight: 22,
  },
  subscribeButton: {
    ...EMDRiseStyles.primaryButton,
    marginBottom: EMDRiseSpacing.md,
  },
  subscribeButtonText: {
    ...EMDRiseStyles.primaryButtonText,
  },
  restoreButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  restoreButtonText: {
    color: EMDRiseColors.primaryBlue,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.medium,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: EMDRiseColors.gray[400],
    borderColor: EMDRiseColors.gray[400],
  },
  buttonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: EMDRiseSpacing.sm,
  },
  trialInfo: {
    backgroundColor: EMDRiseColors.primaryBlue + '10',
    borderRadius: EMDRiseBorderRadius.md,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.xl,
  },
  trialTitle: {
    fontSize: EMDRiseTypography.fontSize.lg,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.sm,
  },
  trialDescription: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.primaryBlue,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: EMDRiseColors.gray[200],
  },
  footerText: {
    fontSize: EMDRiseTypography.fontSize.xs,
    color: EMDRiseColors.gray[500],
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: EMDRiseSpacing.xs,
  },
  footerSubtext: {
    fontSize: EMDRiseTypography.fontSize.xs,
    color: EMDRiseColors.gray[400],
    textAlign: 'center',
    fontStyle: 'italic',
  },
});