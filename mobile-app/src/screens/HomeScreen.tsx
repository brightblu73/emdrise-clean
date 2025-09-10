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
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// EMDRise Logo Component
const Logo = ({ variant = 'hero' }: { variant?: 'hero' | 'header' }) => (
  <View style={[styles.logoContainer, variant === 'header' && styles.logoHeader]}>
    <Text style={[styles.logoText, variant === 'header' && styles.logoTextHeader]}>EMDRise</Text>
    <Text style={[styles.logoTagline, variant === 'header' && styles.logoTaglineHeader]}>Professional EMDR Therapy</Text>
  </View>
);

// Therapist Selection Component
const TherapistCard = ({ therapist, isSelected, onSelect }: {
  therapist: 'maria' | 'alistair';
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <TouchableOpacity
    style={[styles.therapistCard, isSelected && styles.therapistCardSelected]}
    onPress={onSelect}
  >
    <View style={styles.therapistImageContainer}>
      <View style={styles.placeholderImage}>
        <Text style={styles.placeholderText}>
          {therapist === 'maria' ? 'M' : 'A'}
        </Text>
      </View>
    </View>
    <Text style={styles.therapistName}>
      {therapist === 'maria' ? 'Maria' : 'Alistair'}
    </Text>
    {isSelected && (
      <View style={styles.selectedIndicator}>
        <Text style={styles.selectedText}>✓</Text>
      </View>
    )}
  </TouchableOpacity>
);

// EMDR Journey Timeline Component
const EMDRJourneyTimeline = () => (
  <View style={styles.timelineContainer}>
    <Text style={styles.timelineTitle}>Your EMDR Journey</Text>
    
    <View style={styles.timelinePhases}>
      {[
        { title: "Preparation", description: "Try your preferred BLS method." },
        { title: "Calm Place", description: "Create a mental safe space to return to when needed." },
        { title: "Target Memory", description: "Identify the image, belief, and emotions that represent the memory." },
        { title: "Reprocessing", description: "Process the memory using BLS while observing what comes up." },
        { title: "Installation", description: "Strengthen the positive belief using BLS." },
        { title: "Body Scan", description: "Check your body for any lingering tension or discomfort." },
        { title: "Closure", description: "Return to a calm state before finishing the session." },
        { title: "Aftercare", description: "Reflect and take gentle steps to look after yourself post-session." }
      ].map((item, index) => (
        <View key={index} style={styles.timelinePhase}>
          <View style={styles.phaseIcon}>
            <Text style={styles.phaseIconText}>⚡</Text>
          </View>
          <View style={styles.phaseContent}>
            <Text style={styles.phaseTitle}>{item.title}</Text>
            <Text style={styles.phaseDescription}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

// Endorsement Carousel Component
const EndorsementCarousel = () => (
  <View style={styles.endorsementContainer}>
    <View style={styles.endorsementContent}>
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
  </View>
);

export default function HomeScreen() {
  const { isAuthenticated, user, loading } = useAuth();
  const { selectedTherapist, setSelectedTherapist } = useEMDR();
  const navigation = useNavigation();
  
  const [localSelectedTherapist, setLocalSelectedTherapist] = useState<'maria' | 'alistair' | null>(null);
  const [showTrialMessage, setShowTrialMessage] = useState(false);

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
      await AsyncStorage.setItem('selectedTherapist', therapist);
      setLocalSelectedTherapist(therapist);
      setSelectedTherapist(therapist);
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
    
    navigation.navigate('EMDRSession');
  };

  const handleContinueJourney = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    
    navigation.navigate('EMDRSession');
  };

  if (loading) {
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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            {/* Logo and Title */}
            <Logo variant="hero" />
            <Text style={styles.heroTitle}>Professional EMDR Therapy</Text>
            <Text style={styles.heroSubtitle}>In Your Own Space</Text>
            <Text style={styles.heroDescription}>
              Led by a therapist-designed video guide. Walking with you step by step offering structure, support, and connection when you need it most.
            </Text>

            {/* Action Buttons */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : isAuthenticated ? (
              <View style={styles.actionContainer}>
                {showTrialMessage && (
                  <View style={styles.trialMessage}>
                    <Text style={styles.trialMessageText}>🎉 Trial Started Successfully!</Text>
                    <Text style={styles.trialMessageSubtext}>Your 7-day free trial is now active. Start your EMDR journey below.</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.primaryButton} onPress={handleContinueJourney}>
                  <Text style={styles.primaryButtonText}>Choose Therapist & Continue Your Journey</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleStartTrial}>
                  <Text style={styles.primaryButtonText}>Start Your 7-Day Free Trial</Text>
                </TouchableOpacity>
                <Text style={styles.trialInfo}>✓ 7-day free trial • £9.99/month after trial • ✓ Cancel anytime</Text>
                
                <Text style={styles.loginPrompt}>Already signed up? Log in and continue your journey after selecting your therapist.</Text>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleStartTrial}>
                  <Text style={styles.secondaryButtonText}>Choose Therapist & Continue</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Therapist Selection Card */}
          <View style={styles.therapistSelectionCard}>
            <Text style={styles.therapistSelectionTitle}>Choose Your Therapist</Text>
            <Text style={styles.therapistSelectionSubtitle}>
              Select your preferred therapist to guide your EMDR journey
            </Text>
            
            <View style={styles.therapistGrid}>
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
            
            {!localSelectedTherapist && (
              <Text style={styles.therapistSelectionNote}>Please select a therapist to continue</Text>
            )}
          </View>
        </View>

        {/* EMDR Journey Timeline */}
        <EMDRJourneyTimeline />

        {/* Endorsements */}
        <EndorsementCarousel />

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingSectionTitle}>Start Your Healing Journey Today</Text>
          <Text style={styles.pricingSectionSubtitle}>
            Experience professional EMDR therapy with expert therapeutic guidance
          </Text>
          
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>EMDRise Premium</Text>
            <View style={styles.pricingAmount}>
              <Text style={styles.pricingPrice}>£9.99</Text>
              <Text style={styles.pricingPeriod}>/month</Text>
            </View>
            <Text style={styles.pricingTrial}>7-day free trial • Cancel anytime</Text>
            
            <View style={styles.featuresList}>
              {[
                "Complete eight phase EMDR protocol",
                "Professional EMDR therapist led video guidance", 
                "Multiple bilateral stimulation options",
                "Guided memory processing and calm place visualization",
                "Therapeutic grounding resources and aftercare support"
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.pricingButton} onPress={handleStartTrial}>
              <Text style={styles.pricingButtonText}>Start Your 7-Day Free Trial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} EMDRise. All rights reserved.
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
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  scrollContainer: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    backgroundColor: '#1e40af',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    marginTop: 8,
  },
  heroDescription: {
    fontSize: 16,
    color: '#dbeafe',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
    marginHorizontal: 10,
  },
  
  // Logo
  logoContainer: {
    alignItems: 'center',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoTextHeader: {
    fontSize: 24,
    marginRight: 8,
  },
  logoTagline: {
    fontSize: 14,
    color: '#dbeafe',
    marginTop: 4,
  },
  logoTaglineHeader: {
    fontSize: 12,
    marginTop: 0,
  },
  
  // Action Buttons
  actionContainer: {
    width: '100%',
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  trialInfo: {
    fontSize: 12,
    color: '#dbeafe',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginPrompt: {
    fontSize: 14,
    color: '#dbeafe',
    textAlign: 'center',
    marginBottom: 8,
  },
  trialMessage: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  trialMessageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    textAlign: 'center',
  },
  trialMessageSubtext: {
    fontSize: 14,
    color: '#15803d',
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Therapist Selection
  therapistSelectionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
  },
  therapistSelectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  therapistSelectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  therapistGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  therapistCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    width: width * 0.35,
  },
  therapistCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#10b981' + '20',
  },
  therapistImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64748b',
  },
  therapistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  selectedIndicator: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  selectedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  therapistSelectionNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  
  // Timeline
  timelineContainer: {
    backgroundColor: '#1e40af',
    padding: 24,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  timelinePhases: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timelinePhase: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  phaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  phaseIconText: {
    fontSize: 16,
    color: '#ffffff',
  },
  phaseContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  phaseTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 4,
  },
  phaseDescription: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
  
  // Endorsements
  endorsementContainer: {
    backgroundColor: '#1e40af',
    padding: 24,
  },
  endorsementContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 24,
  },
  endorsementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  endorsementSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  endorsementScroll: {
    paddingLeft: 10,
  },
  endorsementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: width * 0.85,
    height: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
  },
  endorsementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  endorsementSummary: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  endorsementFooter: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
    marginTop: 12,
  },
  endorsementDisclaimer: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
  
  // Pricing
  pricingSection: {
    backgroundColor: '#1e40af',
    padding: 24,
  },
  pricingSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  pricingSectionSubtitle: {
    fontSize: 16,
    color: '#dbeafe',
    textAlign: 'center',
    marginBottom: 24,
  },
  pricingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  pricingAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  pricingPeriod: {
    fontSize: 16,
    color: '#64748b',
  },
  pricingTrial: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureCheck: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  pricingButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  pricingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // Footer
  footer: {
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#1e40af' + '33',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#1e40af' + 'CC',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
});