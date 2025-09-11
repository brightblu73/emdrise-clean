import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { useEMDR } from '../providers/EMDRProvider';
import { useRevenueCat } from '../hooks/useRevenueCat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';
// Using View with backgroundColor instead of LinearGradient for compatibility
// import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// BLS Visual Component
const VisualBLS = ({ isActive }: { isActive: boolean }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      const animation = () => {
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isActive) animation();
        });
      };
      animation();
    } else {
      animatedValue.setValue(0);
    }
  }, [isActive, animatedValue]);

  const leftTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 30],
  });

  const rightTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, -30],
  });

  return (
    <View style={styles.blsContainer}>
      <Animated.View style={[styles.blsDot, { transform: [{ translateX: leftTranslate }] }]} />
      <Animated.View style={[styles.blsDot, { transform: [{ translateX: rightTranslate }] }]} />
    </View>
  );
};

// EMDRise Logo Component
const Logo = ({ variant = 'hero' }: { variant?: 'hero' | 'header' }) => (
  <View style={[styles.logoContainer, variant === 'header' && styles.logoHeader]}>
    <Text style={[styles.logoText, variant === 'header' && styles.logoTextHeader]}>EMDRise</Text>
    <Text style={[styles.logoTagline, variant === 'header' && styles.logoTaglineHeader]}>
      {variant === 'header' ? 'Healing Together' : 'Professional EMDR Therapy'}
    </Text>
  </View>
);

// Therapist Selection Component with Professional Portraits
const TherapistCard = ({ 
  therapist, 
  isSelected, 
  onSelect 
}: {
  therapist: 'maria' | 'alistair';
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <TouchableOpacity
    style={[styles.therapistCard, isSelected && styles.therapistCardSelected]}
    onPress={onSelect}
    data-testid={`therapist-card-${therapist}`}
  >
    <View style={styles.therapistImageContainer}>
      <View style={[styles.therapistImagePlaceholder, isSelected && styles.therapistImageSelected]}>
        <Text style={styles.therapistImageText}>
          {therapist === 'maria' ? '👩‍⚕️' : '👨‍⚕️'}
        </Text>
      </View>
    </View>
    <Text style={[styles.therapistName, isSelected && styles.therapistNameSelected]}>
      {therapist === 'maria' ? 'Maria' : 'Alistair'}
    </Text>
    <Text style={[styles.therapistDescription, isSelected && styles.therapistDescriptionSelected]}>
      Professional EMDR Therapist
    </Text>
    {isSelected && (
      <View style={styles.selectedIndicator}>
        <Text style={styles.selectedText}>✓</Text>
      </View>
    )}
  </TouchableOpacity>
);

// BLS Testing Section
const BLSTestingSection = () => {
  const [isVisualBLSActive, setIsVisualBLSActive] = useState(false);
  const [isAudioBLSActive, setIsAudioBLSActive] = useState(false);

  const startVisualBLS = () => {
    setIsAudioBLSActive(false);
    setIsVisualBLSActive(true);
    setTimeout(() => setIsVisualBLSActive(false), 10000);
  };

  const startAudioBLS = () => {
    setIsVisualBLSActive(false);
    setIsAudioBLSActive(!isAudioBLSActive);
  };

  const startTappingBLS = () => {
    setIsVisualBLSActive(false);
    setIsAudioBLSActive(false);
    Alert.alert(
      "Tapping Instructions",
      "Cross your arms over your chest and tap alternately, or tap your thighs with both hands alternately.",
      [{ text: "Got it", style: "default" }]
    );
  };

  return (
    <View style={styles.blsTestingSection}>
      <Text style={styles.blsTestingTitle}>Try Bilateral Stimulation (BLS)</Text>
      <Text style={styles.blsTestingSubtitle}>
        Test the different BLS methods to see which feels right for you
      </Text>
      
      <View style={styles.blsOptionsContainer}>
        <TouchableOpacity 
          style={[styles.blsOption, isVisualBLSActive && styles.blsOptionActive]}
          onPress={startVisualBLS}
          data-testid="bls-visual-button"
        >
          <Text style={styles.blsOptionIcon}>👁️</Text>
          <Text style={styles.blsOptionTitle}>Visual</Text>
          <Text style={styles.blsOptionDescription}>Follow the moving dot with your eyes</Text>
          {isVisualBLSActive && <VisualBLS isActive={true} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.blsOption, isAudioBLSActive && styles.blsOptionActive]}
          onPress={startAudioBLS}
          data-testid="bls-audio-button"
        >
          <Text style={styles.blsOptionIcon}>🎵</Text>
          <Text style={styles.blsOptionTitle}>Audio</Text>
          <Text style={styles.blsOptionDescription}>Listen to alternating sounds</Text>
          {isAudioBLSActive && (
            <Text style={styles.blsActiveIndicator}>🔊 Playing...</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.blsOption}
          onPress={startTappingBLS}
          data-testid="bls-tapping-button"
        >
          <Text style={styles.blsOptionIcon}>👐</Text>
          <Text style={styles.blsOptionTitle}>Tapping</Text>
          <Text style={styles.blsOptionDescription}>Self-administered tapping patterns</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// EMDR Journey Timeline Component (matching web version exactly)
const EMDRJourneyTimeline = () => (
  <View style={styles.timelineContainer}>
    <Text style={styles.timelineTitle}>Your EMDR Journey</Text>
    
    <View style={styles.timelinePhases}>
      {[
        { title: "Preparation", icon: "⚙️", tooltip: "Try your preferred BLS method." },
        { title: "Calm Place", icon: "☁️", tooltip: "Create a mental safe space to return to when needed." },
        { title: "Target Memory", icon: "🎯", tooltip: "Identify the image, belief, and emotions that represent the memory." },
        { title: "Reprocessing", icon: "🔄", tooltip: "Process the memory using BLS while observing what comes up." },
        { title: "Installation", icon: "🔗", tooltip: "Strengthen the positive belief using BLS." },
        { title: "Body Scan", icon: "📊", tooltip: "Check your body for any lingering tension or discomfort." },
        { title: "Closure", icon: "🔒", tooltip: "Return to a calm state before finishing the session." },
        { title: "Aftercare", icon: "💙", tooltip: "Reflect and take gentle steps to look after yourself post-session." }
      ].map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.timelinePhase}
          onPress={() => Alert.alert(item.title, item.tooltip)}
        >
          <View style={styles.phaseIcon}>
            <Text style={styles.phaseIconText}>{item.icon}</Text>
          </View>
          <Text style={styles.phaseTitle}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Endorsement Carousel Component (matching web version exactly)
const EndorsementCarousel = () => (
  <View style={styles.endorsementContainer}>
    <Text style={styles.endorsementTitle}>Leading Organisations That Endorse EMDR</Text>
    <Text style={styles.endorsementSubtitle}>Swipe to see all endorsements →</Text>
    
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.endorsementScroll}>
      {[
        {
          name: 'NICE (National Institute for Health and Care Excellence)',
          summary: 'Recommends EMDR for PTSD in adults and children.'
        },
        {
          name: 'WHO (World Health Organization)',
          summary: 'Recommends EMDR in guidelines for conditions related to stress.'
        },
        {
          name: 'APA (American Psychological Association)',
          summary: 'Conditionally recommends EMDR as an effective PTSD treatment.'
        },
        {
          name: 'VA (US Department of Veterans Affairs)',
          summary: 'Strongly recommends EMDR for veterans with PTSD.'
        },
        {
          name: 'NHS (National Health Service)',
          summary: 'Lists EMDR as an effective trauma-focused therapy for PTSD.'
        },
        {
          name: 'ISTSS (International Society for Traumatic Stress Studies)',
          summary: 'Guidelines recommend EMDR as a first-line treatment for PTSD.'
        }
      ].map((org, index) => (
        <View key={index} style={styles.endorsementCard}>
          <Text style={styles.endorsementName}>{org.name}</Text>
          <Text style={styles.endorsementSummary}>{org.summary}</Text>
          <Text style={styles.endorsementFooter}>Guidelines Available Online</Text>
        </View>
      ))}
    </ScrollView>
    
    <Text style={styles.endorsementDisclaimer}>
      The organisations listed above have endorsed EMDR as a treatment for PTSD. Their inclusion here reflects support for the EMDR method itself, not this specific app.
    </Text>
  </View>
);

// Login Modal Component
const LoginModal = ({ 
  isVisible, 
  onClose, 
  onLogin 
}: { 
  isVisible: boolean; 
  onClose: () => void; 
  onLogin: (email: string, password: string) => Promise<void>; 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
      onClose();
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sign In to EMDRise</Text>
          
          <TextInput
            style={styles.modalInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            data-testid="login-email-input"
          />
          
          <TextInput
            style={styles.modalInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            data-testid="login-password-input"
          />
          
          <TouchableOpacity 
            style={styles.modalButton} 
            onPress={handleLogin}
            disabled={isLoading}
            data-testid="login-submit-button"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.modalButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main HomeScreen Component
export default function HomeScreen() {
  const { isAuthenticated, user, loading, signInWithEmail } = useAuth();
  const { selectedTherapist, setSelectedTherapist } = useEMDR();
  const { subscriptionStatus, loading: subscriptionLoading, setUserId } = useRevenueCat();
  const navigation = useNavigation();
  
  const [localSelectedTherapist, setLocalSelectedTherapist] = useState<'maria' | 'alistair' | null>(null);
  const [showTrialMessage, setShowTrialMessage] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
        if (saved && (saved === 'maria' || saved === 'alistair')) {
          setLocalSelectedTherapist(saved);
          setSelectedTherapist(saved);
        }
      } catch (error) {
        console.error('Error loading therapist:', error);
      }
    };
    loadTherapist();
  }, [setSelectedTherapist]);

  const handleTherapistSelect = async (therapist: 'maria' | 'alistair') => {
    try {
      await AsyncStorage.setItem('selectedTherapist', therapist);
      setLocalSelectedTherapist(therapist);
      setSelectedTherapist(therapist);
    } catch (error) {
      console.error('Error saving therapist:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result.error) {
      throw new Error(result.error.message);
    }
  };

  const handleStartTrial = () => {
    if (!localSelectedTherapist) {
      Alert.alert('Select Therapist', 'Please select a therapist before starting your EMDR journey.');
      return;
    }
    
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!subscriptionStatus.isActive) {
      navigation.navigate('Subscription');
      return;
    }
    
    navigation.navigate('EMDRSession');
  };

  const handleContinueJourney = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!subscriptionStatus.isActive) {
      navigation.navigate('Subscription');
      return;
    }
    
    navigation.navigate('EMDRSession');
  };

  const handleNavigateToResources = () => {
    navigation.navigate('Resources');
  };

  const handleNavigateToProgress = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    navigation.navigate('Progress');
  };

  if (loading || subscriptionLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={EMDRiseColors.primaryBlue} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={EMDRiseColors.primaryBlue} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={EMDRiseColors.primaryBlue} />
      
      {/* Header */}
      <View style={styles.header}>
        <Logo variant="header" />
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleNavigateToResources}
            data-testid="resources-button"
          >
            <Text style={styles.headerButtonText}>Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleNavigateToProgress}
            data-testid="progress-button"
          >
            <Text style={styles.headerButtonText}>Progress</Text>
          </TouchableOpacity>
          {!isAuthenticated && (
            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={() => setIsLoginModalOpen(true)}
              data-testid="sign-in-button"
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Logo variant="hero" />
            <Text style={styles.heroTitle}>Professional EMDR Therapy</Text>
            <Text style={styles.heroSubtitle}>In Your Own Space</Text>
            <Text style={styles.heroDescription}>
              Led by a therapist-designed video guide. Walking with you step by step offering structure, support, and connection when you need it most.
            </Text>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {isAuthenticated ? (
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleContinueJourney}
                  data-testid="continue-journey-button"
                >
                  <Text style={styles.primaryButtonText}>Continue Your Journey</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleStartTrial}
                  data-testid="start-trial-button"
                >
                  <Text style={styles.primaryButtonText}>Start Your 7-Day Free Trial</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Therapist Selection */}
            <View style={styles.therapistSection}>
              <Text style={styles.therapistSectionTitle}>Choose Your EMDR Therapist</Text>
              <View style={styles.therapistCards}>
                <TherapistCard
                  therapist="maria"
                  isSelected={localSelectedTherapist === 'maria'}
                  onSelect={() => handleTherapistSelect('maria')}
                />
                <TherapistCard
                  therapist="alistair"
                  isSelected={localSelectedTherapist === 'alistair'}
                  onSelect={() => handleTherapistSelect('alistair')}
                />
              </View>
            </View>
          </View>
        </View>

        {/* BLS Testing Section */}
        <BLSTestingSection />

        {/* EMDR Journey Timeline */}
        <EMDRJourneyTimeline />

        {/* Endorsement Carousel */}
        <View style={styles.endorsementSection}>
          <EndorsementCarousel />
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCTA}>
          <Text style={styles.bottomCTATitle}>Ready to Start Your Healing Journey?</Text>
          <TouchableOpacity 
            style={styles.bottomCTAButton}
            onPress={handleStartTrial}
            data-testid="bottom-cta-button"
          >
            <Text style={styles.bottomCTAButtonText}>
              {isAuthenticated ? 'Continue EMDR Session' : 'Start Your 7-Day Free Trial'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Login Modal */}
      <LoginModal
        isVisible={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
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
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  loadingText: {
    marginTop: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.md,
    backgroundColor: EMDRiseColors.primaryBlue,
    ...EMDRiseShadows.small,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EMDRiseSpacing.sm,
  },
  headerButton: {
    paddingHorizontal: EMDRiseSpacing.md,
    paddingVertical: EMDRiseSpacing.sm,
  },
  headerButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  signInButton: {
    backgroundColor: EMDRiseColors.text.white,
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.sm,
    borderRadius: EMDRiseBorderRadius.md,
  },
  signInText: {
    color: EMDRiseColors.primaryBlue,
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoHeader: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: EMDRiseTypography.sizes.heading.h1,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.white,
  },
  logoTextHeader: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
  },
  logoTagline: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.white,
    marginTop: EMDRiseSpacing.xs,
  },
  logoTaglineHeader: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    color: EMDRiseColors.text.white,
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing['4xl'],
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h1,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.white,
    textAlign: 'center',
    marginTop: EMDRiseSpacing.lg,
  },
  heroSubtitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.secondaryGreen,
    textAlign: 'center',
    marginTop: EMDRiseSpacing.sm,
  },
  heroDescription: {
    fontSize: EMDRiseTypography.sizes.body.large,
    color: EMDRiseColors.text.white,
    textAlign: 'center',
    marginTop: EMDRiseSpacing.lg,
    lineHeight: EMDRiseTypography.lineHeights.relaxed * EMDRiseTypography.sizes.body.large,
    opacity: 0.9,
  },
  actionContainer: {
    marginTop: EMDRiseSpacing['2xl'],
    width: '100%',
  },
  primaryButton: {
    backgroundColor: EMDRiseColors.text.white,
    paddingVertical: EMDRiseSpacing.lg,
    paddingHorizontal: EMDRiseSpacing.xl,
    borderRadius: EMDRiseBorderRadius.xl,
    alignItems: 'center',
    ...EMDRiseShadows.medium,
  },
  primaryButtonText: {
    color: EMDRiseColors.primaryBlue,
    fontSize: EMDRiseTypography.sizes.body.large,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  therapistSection: {
    marginTop: EMDRiseSpacing['3xl'],
    width: '100%',
  },
  therapistSectionTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.white,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  therapistCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: EMDRiseSpacing.md,
  },
  therapistCard: {
    flex: 1,
    backgroundColor: EMDRiseColors.text.white,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    alignItems: 'center',
    ...EMDRiseShadows.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  therapistCardSelected: {
    borderColor: EMDRiseColors.secondaryGreen,
    backgroundColor: EMDRiseColors.safeSpace,
  },
  therapistImageContainer: {
    marginBottom: EMDRiseSpacing.md,
  },
  therapistImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: EMDRiseBorderRadius.full,
    backgroundColor: EMDRiseColors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  therapistImageSelected: {
    backgroundColor: EMDRiseColors.primaryGreen,
  },
  therapistImageText: {
    fontSize: 24,
  },
  therapistName: {
    fontSize: EMDRiseTypography.sizes.body.large,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  therapistNameSelected: {
    color: EMDRiseColors.primaryGreen,
  },
  therapistDescription: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },
  therapistDescriptionSelected: {
    color: EMDRiseColors.primaryGreen,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: EMDRiseColors.primaryGreen,
    borderRadius: EMDRiseBorderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.bold,
  },
  blsTestingSection: {
    padding: EMDRiseSpacing['2xl'],
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  blsTestingTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.md,
  },
  blsTestingSubtitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing['2xl'],
  },
  blsOptionsContainer: {
    gap: EMDRiseSpacing.lg,
  },
  blsOption: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: EMDRiseColors.border,
    ...EMDRiseShadows.small,
  },
  blsOptionActive: {
    borderColor: EMDRiseColors.primaryGreen,
    backgroundColor: EMDRiseColors.safeSpace,
  },
  blsOptionIcon: {
    fontSize: 32,
    marginBottom: EMDRiseSpacing.sm,
  },
  blsOptionTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  blsOptionDescription: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },
  blsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    marginTop: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.xl,
  },
  blsDot: {
    width: 12,
    height: 12,
    borderRadius: EMDRiseBorderRadius.full,
    backgroundColor: EMDRiseColors.primaryBlue,
  },
  blsActiveIndicator: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.primaryGreen,
    marginTop: EMDRiseSpacing.sm,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  timelineContainer: {
    padding: EMDRiseSpacing['2xl'],
    backgroundColor: EMDRiseColors.safeSpace,
  },
  timelineTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  timelinePhases: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: EMDRiseSpacing.lg,
  },
  timelinePhase: {
    alignItems: 'center',
    width: (width - EMDRiseSpacing['2xl'] * 2 - EMDRiseSpacing.lg * 3) / 4,
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    ...EMDRiseShadows.small,
  },
  phaseIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.full,
    marginBottom: EMDRiseSpacing.sm,
  },
  phaseIconText: {
    fontSize: 18,
  },
  phaseTitle: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    textAlign: 'center',
  },
  endorsementSection: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing['4xl'],
  },
  endorsementContainer: {
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  endorsementTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.white,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.sm,
  },
  endorsementSubtitle: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.white,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.xl,
    opacity: 0.9,
  },
  endorsementScroll: {
    marginBottom: EMDRiseSpacing.lg,
  },
  endorsementCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginRight: EMDRiseSpacing.md,
    width: width * 0.8,
    minHeight: 160,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    ...EMDRiseShadows.medium,
  },
  endorsementName: {
    fontSize: EMDRiseTypography.sizes.body.large,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.sm,
  },
  endorsementSummary: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.lineHeights.relaxed * EMDRiseTypography.sizes.body.small,
    flex: 1,
  },
  endorsementFooter: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.primaryGreen,
    fontWeight: EMDRiseTypography.weights.medium,
    marginTop: EMDRiseSpacing.sm,
  },
  endorsementDisclaimer: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    color: EMDRiseColors.text.white,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.tiny,
  },
  bottomCTA: {
    padding: EMDRiseSpacing['2xl'],
    backgroundColor: EMDRiseColors.therapeuticBg,
    alignItems: 'center',
  },
  bottomCTATitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  bottomCTAButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing.lg,
    paddingHorizontal: EMDRiseSpacing.xl,
    borderRadius: EMDRiseBorderRadius.xl,
    ...EMDRiseShadows.medium,
  },
  bottomCTAButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.large,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['2xl'],
    width: width * 0.9,
    maxWidth: 400,
    ...EMDRiseShadows.large,
  },
  modalTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  modalInput: {
    backgroundColor: EMDRiseColors.muted,
    borderRadius: EMDRiseBorderRadius.md,
    padding: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
  },
  modalButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.md,
    alignItems: 'center',
    marginTop: EMDRiseSpacing.md,
  },
  modalButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  modalCancelButton: {
    paddingVertical: EMDRiseSpacing.md,
    alignItems: 'center',
    marginTop: EMDRiseSpacing.sm,
  },
  modalCancelText: {
    color: EMDRiseColors.text.secondary,
    fontSize: EMDRiseTypography.sizes.body.base,
  },
});