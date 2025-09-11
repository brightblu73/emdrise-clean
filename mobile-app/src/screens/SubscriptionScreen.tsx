import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { SubscriptionManager } from '../components/SubscriptionManager';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.checkIcon}>
      <Text style={styles.checkText}>✓</Text>
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

export const SubscriptionScreen: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for subscription status check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscriptionSuccess = () => {
    Alert.alert(
      'Welcome to EMDRise Premium!',
      'You now have full access to all EMDR therapy features.',
      [
        {
          text: 'Continue to Assessment',
          onPress: () => navigation.navigate('Assessment' as never),
        }
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authMessage}>Please sign in to subscribe.</Text>
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login' as never)}
            data-testid="sign-in-button"
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (user.subscriptionStatus === 'active') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>You're Already Subscribed!</Text>
            <Text style={styles.successMessage}>
              Thank you for being an EMDRise Premium member. Continue your healing journey.
            </Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => navigation.navigate('Assessment' as never)}
              data-testid="continue-sessions-button"
            >
              <Text style={styles.continueButtonText}>Continue to Sessions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isLoading) {
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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>🧠</Text>
          </View>
          <Text style={styles.heroTitle}>Upgrade to Premium</Text>
          <Text style={styles.heroSubtitle}>
            Continue your healing journey with full access to professional EMDR therapy
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Text style={styles.featuresHeaderIcon}>🛡️</Text>
            <Text style={styles.featuresHeaderTitle}>What's Included</Text>
          </View>
          
          <FeatureItem
            title="Complete 8-Phase EMDR Protocol"
            description="Full professional therapy protocol with all phases"
          />
          
          <FeatureItem
            title="Therapist Audio Guidance"
            description="Expert therapist guidance throughout every session"
          />
          
          <FeatureItem
            title="Professional Bilateral Stimulation"
            description="Advanced bilateral stimulation tools and techniques"
          />
          
          <FeatureItem
            title="Progress Tracking & History"
            description="Comprehensive session tracking and progress monitoring"
          />
          
          <FeatureItem
            title="Resource Creation Tools"
            description="Safe place, wise figure, and protective figure development"
          />
          
          <FeatureItem
            title="Unlimited Sessions"
            description="Process as many targets as you need at your own pace"
          />
        </View>

        {/* Professional Message */}
        <View style={styles.professionalCard}>
          <View style={styles.professionalHeader}>
            <View style={styles.professionalIcon}>
              <Text style={styles.professionalIconText}>🧠</Text>
            </View>
            <View style={styles.professionalContent}>
              <Text style={styles.professionalTitle}>Professional EMDR Support</Text>
              <Text style={styles.professionalMessage}>
                "Your commitment to healing is already evident in starting this journey. EMDR has helped countless individuals process trauma and find emotional freedom. Our platform provides expert guidance through each step with professional care and expertise."
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Card */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>EMDRise Premium</Text>
            <Text style={styles.subscriptionPrice}>
              £9.99<Text style={styles.subscriptionPeriod}>/month</Text>
            </Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionBadgeText}>
                {user?.subscriptionStatus === 'trial' ? 'Upgrade from Trial' : 'New Subscription'}
              </Text>
            </View>
          </View>

          <SubscriptionManager onSubscriptionChange={handleSubscriptionSuccess} />

          <View style={styles.subscriptionFooter}>
            <Text style={styles.subscriptionFooterText}>
              ✓ Cancel anytime • ✓ Secure payment • ✓ 30-day money-back guarantee
            </Text>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityCard}>
          <Text style={styles.securityIcon}>🛡️</Text>
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted. We use secure payment processing and never store your card details.
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          data-testid="back-button"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: EMDRiseSpacing.xl,
  },
  authMessage: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  signInButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing.xl,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
  },
  signInButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    marginTop: EMDRiseSpacing.md,
  },
  scrollContainer: {
    flex: 1,
    padding: EMDRiseSpacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    padding: EMDRiseSpacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: EMDRiseColors.primaryGreen,
    borderRadius: EMDRiseBorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  successIconText: {
    fontSize: 40,
    color: EMDRiseColors.text.white,
    fontWeight: EMDRiseTypography.weights.bold,
  },
  successTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.xl,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.base,
  },
  continueButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing.xl,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
  },
  continueButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  heroIcon: {
    width: 80,
    height: 80,
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  heroIconText: {
    fontSize: 40,
    color: EMDRiseColors.text.white,
  },
  heroTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h1,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: EMDRiseTypography.sizes.body.large,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.large,
  },
  featuresCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  featuresHeaderIcon: {
    fontSize: 24,
    marginRight: EMDRiseSpacing.sm,
  },
  featuresHeaderTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: EMDRiseSpacing.md,
  },
  checkIcon: {
    width: 20,
    height: 20,
    backgroundColor: EMDRiseColors.primaryGreen,
    borderRadius: EMDRiseBorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: EMDRiseSpacing.md,
    marginTop: 2,
  },
  checkText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.tiny,
    fontWeight: EMDRiseTypography.weights.bold,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  featureDescription: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  professionalCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  professionalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  professionalIcon: {
    width: 64,
    height: 64,
    backgroundColor: EMDRiseColors.primaryGreen,
    borderRadius: EMDRiseBorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: EMDRiseSpacing.md,
  },
  professionalIconText: {
    fontSize: 32,
    color: EMDRiseColors.text.white,
  },
  professionalContent: {
    flex: 1,
  },
  professionalTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  professionalMessage: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    fontStyle: 'italic',
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  subscriptionCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  subscriptionHeader: {
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  subscriptionTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  subscriptionPrice: {
    fontSize: EMDRiseTypography.sizes.heading.h1,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.sm,
  },
  subscriptionPeriod: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
  },
  subscriptionBadge: {
    backgroundColor: EMDRiseColors.secondaryBlue,
    paddingHorizontal: EMDRiseSpacing.md,
    paddingVertical: EMDRiseSpacing.xs,
    borderRadius: EMDRiseBorderRadius.full,
  },
  subscriptionBadgeText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.white,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  subscriptionFooter: {
    marginTop: EMDRiseSpacing.lg,
    alignItems: 'center',
  },
  subscriptionFooterText: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    color: EMDRiseColors.text.muted,
    textAlign: 'center',
  },
  securityCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.md,
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  securityIcon: {
    fontSize: 32,
    marginBottom: EMDRiseSpacing.sm,
  },
  securityText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  backButton: {
    paddingVertical: EMDRiseSpacing.lg,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.primaryBlue,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
});

export default SubscriptionScreen;