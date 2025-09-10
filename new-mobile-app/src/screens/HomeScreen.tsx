import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { useEMDR } from '../providers/EMDRProvider';
import { useRevenueCat } from '../hooks/useRevenueCat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';

const { width } = Dimensions.get('window');

// Therapist images will be handled as base64 or remote URLs for now
// In production, these would be actual imported assets
const TherapistCard = ({ 
  name, 
  image, 
  selected, 
  onSelect 
}: { 
  name: string; 
  image: string; 
  selected: boolean; 
  onSelect: () => void; 
}) => (
  <TouchableOpacity
    style={[
      styles.therapistCard,
      selected && styles.therapistCardSelected
    ]}
    onPress={onSelect}
  >
    <View style={styles.therapistImageContainer}>
      <Image source={{ uri: image }} style={styles.therapistImage} />
    </View>
    <Text style={styles.therapistName}>{name}</Text>
    {selected && (
      <View style={styles.selectedIndicator}>
        <Text style={styles.selectedText}>✓</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { isAuthenticated, user, loading } = useAuth();
  const { selectedTherapist, setSelectedTherapist } = useEMDR();
  const { subscriptionStatus, loading: subscriptionLoading, setUserId } = useRevenueCat();
  const navigation = useNavigation();
  
  const [localSelectedTherapist, setLocalSelectedTherapist] = useState<'maria' | 'alistair' | null>(null);
  const [showTrialMessage, setShowTrialMessage] = useState(false);

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  // Set RevenueCat user ID when user is authenticated
  useEffect(() => {
    const setupRevenueCat = async () => {
      if (isAuthenticated && user?.id) {
        await setUserId(user.id);
      }
    };
    setupRevenueCat();
  }, [isAuthenticated, user?.id, setUserId]);

  // Load saved therapist selection
  useEffect(() => {
    const loadTherapist = async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedTherapist');
        if (saved) {
          setLocalSelectedTherapist(saved as 'maria' | 'alistair');
        }
      } catch (error) {
        console.error('Error loading therapist:', error);
      }
    };
    loadTherapist();
  }, []);

  const handleTherapistSelect = async (therapist: 'maria' | 'alistair') => {
    try {
      setLocalSelectedTherapist(therapist);
      setSelectedTherapist(therapist);
      await AsyncStorage.setItem('selectedTherapist', therapist);
    } catch (error) {
      console.error('Error saving therapist:', error);
    }
  };

  const handleStartTrial = () => {
    if (!localSelectedTherapist) {
      Alert.alert('Select Therapist', 'Please select a therapist before starting your EMDR journey.');
      return;
    }
    
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    // Check subscription status before allowing access
    if (!subscriptionStatus.isActive) {
      navigation.navigate('Subscription');
      return;
    }
    
    navigation.navigate('EMDRSession');
  };

  const handleContinueJourney = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    // Check subscription status before allowing access
    if (!subscriptionStatus.isActive) {
      navigation.navigate('Subscription');
      return;
    }
    
    navigation.navigate('EMDRSession');
  };

  if (loading || subscriptionLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>EMDRise</Text>
        {isAuthenticated && (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => Alert.alert('Profile', 'Profile settings coming soon')}
          >
            <Text style={styles.profileText}>{user?.email?.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Professional EMDR Therapy</Text>
          <Text style={styles.heroSubtitle}>In Your Own Space</Text>
          <Text style={styles.heroDescription}>
            Led by a therapist-designed video guide. Walking with you step by step offering structure, support, and connection when you need it most.
          </Text>
        </View>

        {/* Therapist Selection */}
        <View style={styles.therapistSection}>
          <Text style={styles.sectionTitle}>Choose Your Therapist</Text>
          <Text style={styles.sectionDescription}>
            Select your preferred therapist to guide your EMDR journey
          </Text>
          
          <View style={styles.therapistGrid}>
            <TherapistCard
              name="Maria"
              image="https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=Maria"
              selected={localSelectedTherapist === 'maria'}
              onSelect={() => handleTherapistSelect('maria')}
            />
            <TherapistCard
              name="Alistair"
              image="https://via.placeholder.com/150x150/50C878/FFFFFF?text=Alistair"
              selected={localSelectedTherapist === 'alistair'}
              onSelect={() => handleTherapistSelect('alistair')}
            />
          </View>

          {!localSelectedTherapist && (
            <Text style={styles.selectionNote}>Please select a therapist to continue</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {isAuthenticated ? (
            <View style={styles.actionButtons}>
              {showTrialMessage && (
                <View style={styles.successMessage}>
                  <Text style={styles.successText}>🎉 Trial Started Successfully!</Text>
                  <Text style={styles.successSubtext}>Your 7-day free trial is now active. Start your EMDR journey below.</Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.primaryButton, !localSelectedTherapist && styles.disabledButton]}
                onPress={handleContinueJourney}
                disabled={!localSelectedTherapist}
              >
                <Text style={styles.primaryButtonText}>Continue Your Journey</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, !localSelectedTherapist && styles.disabledButton]}
                onPress={handleStartTrial}
                disabled={!localSelectedTherapist}
              >
                <Text style={styles.primaryButtonText}>Start Your 7-Day Free Trial</Text>
              </TouchableOpacity>
              <Text style={styles.trialText}>
                ✓ 7-day free trial • £12.99/month after trial • ✓ Cancel anytime
              </Text>
              
              <Text style={styles.loginPrompt}>
                Already signed up? Log in and continue your journey after selecting your therapist.
              </Text>
              <TouchableOpacity
                style={[styles.secondaryButton, !localSelectedTherapist && styles.disabledButton]}
                onPress={handleStartTrial}
                disabled={!localSelectedTherapist}
              >
                <Text style={styles.secondaryButtonText}>Choose Therapist & Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You Get</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Complete EMDR protocol with professional guidance</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Multiple bilateral stimulation options</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Guided memory processing and calm place visualization</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Session pause and resume functionality</Text>
            </View>
          </View>
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
  },
  loadingText: {
    fontSize: EMDRiseTypography.fontSize.lg,
    color: EMDRiseColors.primaryBlue,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.md,
    backgroundColor: EMDRiseColors.white,
    ...EMDRiseShadows.sm,
  },
  logoText: {
    fontSize: EMDRiseTypography.fontSize['2xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.primaryBlue,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: EMDRiseColors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: EMDRiseColors.white,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.primaryBlue,
  },
  heroTitle: {
    fontSize: EMDRiseTypography.fontSize['3xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.white,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.sm,
  },
  heroSubtitle: {
    fontSize: EMDRiseTypography.fontSize.xl,
    color: EMDRiseColors.secondaryGreen,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  heroDescription: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  therapistSection: {
    padding: EMDRiseSpacing.lg,
  },
  sectionTitle: {
    fontSize: EMDRiseTypography.fontSize['2xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.primaryBlue,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.sm,
  },
  sectionDescription: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[600],
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  therapistGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: EMDRiseSpacing.md,
  },
  therapistCard: {
    alignItems: 'center',
    padding: EMDRiseSpacing.md,
    borderRadius: EMDRiseBorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: EMDRiseColors.white,
    ...EMDRiseShadows.sm,
    width: width * 0.4,
  },
  therapistCardSelected: {
    borderColor: EMDRiseColors.primaryGreen,
    backgroundColor: EMDRiseColors.primaryGreen + '10',
  },
  therapistImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: EMDRiseSpacing.sm,
  },
  therapistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  therapistName: {
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.gray[800],
  },
  selectedIndicator: {
    position: 'absolute',
    top: EMDRiseSpacing.sm,
    right: EMDRiseSpacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: EMDRiseColors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: EMDRiseColors.white,
    fontSize: 14,
    fontWeight: EMDRiseTypography.fontWeight.bold,
  },
  selectionNote: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[500],
    textAlign: 'center',
    marginTop: EMDRiseSpacing.sm,
  },
  actionSection: {
    padding: EMDRiseSpacing.lg,
  },
  actionButtons: {
    gap: EMDRiseSpacing.md,
  },
  successMessage: {
    padding: EMDRiseSpacing.md,
    backgroundColor: EMDRiseColors.primaryGreen + '20',
    borderRadius: EMDRiseBorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: EMDRiseColors.primaryGreen,
    marginBottom: EMDRiseSpacing.md,
  },
  successText: {
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.primaryGreen,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.primaryGreen,
    textAlign: 'center',
    marginTop: EMDRiseSpacing.xs,
  },
  primaryButton: {
    ...EMDRiseStyles.primaryButton,
    backgroundColor: EMDRiseColors.primaryBlue,
  },
  primaryButtonText: {
    ...EMDRiseStyles.primaryButtonText,
  },
  secondaryButton: {
    backgroundColor: EMDRiseColors.white,
    borderWidth: 2,
    borderColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  secondaryButtonText: {
    color: EMDRiseColors.primaryBlue,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: EMDRiseColors.gray[300],
    borderColor: EMDRiseColors.gray[300],
  },
  trialText: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[600],
    textAlign: 'center',
    marginTop: EMDRiseSpacing.xs,
  },
  loginPrompt: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[600],
    textAlign: 'center',
    marginTop: EMDRiseSpacing.md,
    marginBottom: EMDRiseSpacing.sm,
  },
  featuresSection: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
    marginTop: EMDRiseSpacing.md,
  },
  featureList: {
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
});