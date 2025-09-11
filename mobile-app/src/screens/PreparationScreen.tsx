import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';

const BLSOptionCard = ({ 
  type, 
  icon, 
  title, 
  description, 
  isSelected, 
  onSelect 
}: { 
  type: string;
  icon: string;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <TouchableOpacity
    style={[styles.blsOptionCard, isSelected && styles.blsOptionCardSelected]}
    onPress={onSelect}
    data-testid={`bls-option-${type}`}
  >
    <Text style={styles.blsOptionIcon}>{icon}</Text>
    <Text style={[styles.blsOptionTitle, isSelected && styles.blsOptionTitleSelected]}>{title}</Text>
    <Text style={[styles.blsOptionDescription, isSelected && styles.blsOptionDescriptionSelected]}>
      {description}
    </Text>
    {isSelected && (
      <View style={styles.selectedIndicator}>
        <Text style={styles.selectedText}>✓</Text>
      </View>
    )}
  </TouchableOpacity>
);

const BLSModal = ({ 
  isVisible, 
  type, 
  onClose 
}: { 
  isVisible: boolean; 
  type: 'visual' | 'auditory' | 'tapping'; 
  onClose: () => void; 
}) => {
  const getModalContent = () => {
    switch (type) {
      case 'visual':
        return {
          title: 'Visual BLS - Eye Movements',
          description: 'Follow the moving dot with your eyes while keeping your head still. The bilateral movement helps process traumatic memories.',
          instructions: [
            'Keep your head still and relaxed',
            'Follow the dot with your eyes only',
            'If you feel dizzy, take a break',
            'Focus on the movement, not the memory initially'
          ]
        };
      case 'auditory':
        return {
          title: 'Auditory BLS - Sound Stimulation',
          description: 'Listen to alternating sounds that move from left to right ear. This bilateral auditory stimulation aids in memory processing.',
          instructions: [
            'Use headphones for best results',
            'Adjust volume to comfortable level',
            'Focus on the alternating sounds',
            'Let your mind process naturally'
          ]
        };
      case 'tapping':
        return {
          title: 'Tactile BLS - Butterfly Tapping',
          description: 'Use self-administered tapping patterns to create bilateral stimulation through touch.',
          instructions: [
            'Cross arms over chest (butterfly hug)',
            'Tap alternately with each hand',
            'Find a comfortable rhythm',
            'You can also tap on your thighs alternately'
          ]
        };
      default:
        return { title: '', description: '', instructions: [] };
    }
  };

  const content = getModalContent();

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{content.title}</Text>
          <Text style={styles.modalDescription}>{content.description}</Text>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {content.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionItem}>• {instruction}</Text>
            ))}
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButtonSecondary} 
              onPress={onClose}
              data-testid="bls-modal-close"
            >
              <Text style={styles.modalButtonSecondaryText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButtonPrimary} 
              onPress={() => {
                Alert.alert('BLS Selected', `${content.title} has been set as your preferred method.`);
                onClose();
              }}
              data-testid="bls-modal-confirm"
            >
              <Text style={styles.modalButtonPrimaryText}>Use This Method</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProgressHeader = ({ phase, totalPhases, progress }: { phase: number; totalPhases: number; progress: number }) => (
  <View style={styles.progressHeader}>
    <View style={styles.progressTitleContainer}>
      <Text style={styles.progressTitle}>Phase {phase}: Preparation</Text>
      <View style={styles.phaseIndicatorContainer}>
        <View style={styles.phaseIndicator}>
          <Text style={styles.phaseIndicatorText}>{phase}</Text>
        </View>
        <Text style={styles.phaseText}>Phase {phase} of {totalPhases}</Text>
      </View>
    </View>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  </View>
);

export default function PreparationScreen() {
  const { isAuthenticated, user } = useAuth();
  const navigation = useNavigation();
  
  const [safePlace, setSafePlace] = useState('');
  const [hasEstablishedSafePlace, setHasEstablishedSafePlace] = useState(false);
  const [preferredBLS, setPreferredBLS] = useState<string | null>(null);
  const [showBLSModal, setShowBLSModal] = useState(false);
  const [selectedBLSType, setSelectedBLSType] = useState<'visual' | 'auditory' | 'tapping' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferred BLS method from storage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferred = await AsyncStorage.getItem('preferredBLS');
        if (preferred) {
          setPreferredBLS(preferred);
        }
      } catch (error) {
        console.error('Error loading BLS preference:', error);
      }
    };
    loadPreferences();
  }, []);

  const handleBLSSelection = async (type: 'visual' | 'auditory' | 'tapping') => {
    try {
      await AsyncStorage.setItem('preferredBLS', type);
      setPreferredBLS(type);
      setSelectedBLSType(type);
      setShowBLSModal(true);
    } catch (error) {
      console.error('Error saving BLS preference:', error);
    }
  };

  const handleEstablishSafePlace = () => {
    if (!safePlace.trim()) {
      Alert.alert('Safe Place Required', 'Please describe your safe place in detail before continuing.');
      return;
    }
    setHasEstablishedSafePlace(true);
    Alert.alert(
      'Safe Place Established',
      'Your safe place has been created. You can return to this mental sanctuary anytime during processing.',
      [{ text: 'Continue', style: 'default' }]
    );
  };

  const handleContinueToAssessment = async () => {
    if (!hasEstablishedSafePlace) {
      Alert.alert('Preparation Incomplete', 'Please establish your safe place before continuing to assessment.');
      return;
    }

    setIsLoading(true);
    try {
      // Save safe place to storage
      await AsyncStorage.setItem('safePlace', safePlace);
      navigation.navigate('Assessment' as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to save preparation data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showBLSGuide = () => {
    Alert.alert(
      'Which BLS Method Should I Use?',
      'Visual: Best for most people, uses eye movements\n\nAuditory: Good if you prefer sound, uses alternating tones\n\nTapping: Self-administered, good for those who like tactile feedback\n\nTry each method and see which feels most comfortable for you.',
      [{ text: 'Got it', style: 'default' }]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authMessage}>Please sign in to access EMDR therapy.</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <ProgressHeader phase={2} totalPhases={8} progress={25} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Guidance Section */}
        <View style={styles.guidanceCard}>
          <Text style={styles.guidanceTitle}>Preparation Guidance</Text>
          <Text style={styles.guidanceText}>
            Welcome to your EMDR preparation phase. We'll establish the foundation for your healing journey 
            by learning about EMDR theory and creating your safe place.
          </Text>
        </View>

        {/* EMDR Theory */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitleIcon}>🧠</Text>
            <Text style={styles.cardTitle}>Understanding EMDR Theory</Text>
          </View>
          
          <Text style={styles.therapistQuote}>
            "The eye movements we use in EMDR seem to unlock the nervous system and allow your brain to process the experience. 
            That may be what is happening in REM, or dream, sleep: The eye movements may be involved in processing the unconscious material."
          </Text>
          
          <Text style={styles.therapistQuote}>
            "The important thing to remember is that it is your own brain that will be doing the healing and that you are the one in control. 
            Often, when something traumatic happens, it seems to get locked in the nervous system with the original picture, sounds, thoughts, feelings, and so on."
          </Text>

          <View style={styles.principlesContainer}>
            <Text style={styles.principlesTitle}>Key EMDR Principles:</Text>
            <Text style={styles.principleItem}>• Your brain has natural healing capabilities</Text>
            <Text style={styles.principleItem}>• You remain in control throughout the process</Text>
            <Text style={styles.principleItem}>• Traumatic memories can become "unstuck" and processed</Text>
            <Text style={styles.principleItem}>• Bilateral stimulation helps integrate separated memory networks</Text>
          </View>
        </View>

        {/* Safe Place Creation */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitleIcon}>🛡️</Text>
            <Text style={styles.cardTitle}>Create Your Safe Place</Text>
          </View>
          
          <Text style={styles.therapistQuote}>
            "Your safe place is a mental sanctuary where you can find calm and stability. 
            This can be a real place you've been to, or an imaginary location that feels peaceful and secure to you."
          </Text>

          <Text style={styles.label}>Describe your safe place in detail</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what you see, hear, smell, and feel in your safe place. Include as many sensory details as possible..."
            value={safePlace}
            onChangeText={setSafePlace}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            data-testid="safe-place-input"
          />

          <View style={styles.guidelinesContainer}>
            <Text style={styles.guidelinesTitle}>Safe Place Guidelines:</Text>
            <Text style={styles.guidelineItem}>• Choose a place where you feel completely safe and calm</Text>
            <Text style={styles.guidelineItem}>• Include all your senses: what you see, hear, smell, feel</Text>
            <Text style={styles.guidelineItem}>• This place should be yours alone</Text>
            <Text style={styles.guidelineItem}>• You can return here anytime during processing</Text>
          </View>

          <TouchableOpacity 
            style={[styles.establishButton, (!safePlace.trim() || hasEstablishedSafePlace) && styles.disabledButton]}
            onPress={handleEstablishSafePlace}
            disabled={!safePlace.trim() || hasEstablishedSafePlace}
            data-testid="establish-safe-place-button"
          >
            <Text style={[styles.establishButtonText, (!safePlace.trim() || hasEstablishedSafePlace) && styles.disabledButtonText]}>
              {hasEstablishedSafePlace ? 'Safe Place Established ✓' : 'Establish My Safe Place'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BLS Testing */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitleIcon}>👁️</Text>
            <Text style={styles.cardTitle}>Testing Eye Movements</Text>
          </View>
          
          <Text style={styles.therapistQuote}>
            "Before we begin processing, let's test different types of bilateral stimulation to find what works best for you. 
            We'll try different directions and speeds."
          </Text>

          <TouchableOpacity onPress={showBLSGuide} style={styles.blsGuideButton}>
            <Text style={styles.blsGuideButtonText}>Which one should I use?</Text>
          </TouchableOpacity>

          <View style={styles.blsOptionsContainer}>
            <BLSOptionCard
              type="visual"
              icon="👁️"
              title="Visual"
              description="Follow moving dots with your eyes"
              isSelected={preferredBLS === 'visual'}
              onSelect={() => handleBLSSelection('visual')}
            />
            
            <BLSOptionCard
              type="auditory"
              icon="🎵"
              title="Auditory"
              description="Listen to alternating sounds"
              isSelected={preferredBLS === 'auditory'}
              onSelect={() => handleBLSSelection('auditory')}
            />
            
            <BLSOptionCard
              type="tapping"
              icon="👐"
              title="Tapping"
              description="Self-administered tapping patterns"
              isSelected={preferredBLS === 'tapping'}
              onSelect={() => handleBLSSelection('tapping')}
            />
          </View>

          {preferredBLS && (
            <Text style={styles.preferredMethodText}>
              Your preferred method is: <Text style={styles.preferredMethodBold}>{preferredBLS}</Text>
            </Text>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            data-testid="back-button"
          >
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.continueButton, (!hasEstablishedSafePlace || isLoading) && styles.disabledButton]}
            onPress={handleContinueToAssessment}
            disabled={!hasEstablishedSafePlace || isLoading}
            data-testid="continue-button"
          >
            {isLoading ? (
              <ActivityIndicator color={EMDRiseColors.text.white} />
            ) : (
              <Text style={styles.continueButtonText}>Continue to Assessment →</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BLS Modal */}
      {selectedBLSType && (
        <BLSModal
          isVisible={showBLSModal}
          type={selectedBLSType}
          onClose={() => {
            setShowBLSModal(false);
            setSelectedBLSType(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

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
  progressHeader: {
    backgroundColor: EMDRiseColors.card,
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  progressTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.md,
  },
  progressTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
  },
  phaseIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EMDRiseSpacing.sm,
  },
  phaseIndicator: {
    width: 32,
    height: 32,
    borderRadius: EMDRiseBorderRadius.full,
    backgroundColor: EMDRiseColors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseIndicatorText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.bold,
  },
  phaseText: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    color: EMDRiseColors.text.secondary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: EMDRiseColors.muted,
    borderRadius: EMDRiseBorderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: EMDRiseColors.primaryGreen,
  },
  scrollContainer: {
    flex: 1,
    padding: EMDRiseSpacing.lg,
  },
  guidanceCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  guidanceTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
  },
  guidanceText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  card: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.md,
  },
  cardTitleIcon: {
    fontSize: 24,
    marginRight: EMDRiseSpacing.sm,
  },
  cardTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
  },
  therapistQuote: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    fontStyle: 'italic',
    marginBottom: EMDRiseSpacing.md,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  principlesContainer: {
    backgroundColor: EMDRiseColors.primaryBlue + '15',
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    marginTop: EMDRiseSpacing.md,
  },
  principlesTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  principleItem: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  label: {
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  textArea: {
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    backgroundColor: EMDRiseColors.therapeuticBg,
    minHeight: 120,
    marginBottom: EMDRiseSpacing.md,
  },
  guidelinesContainer: {
    backgroundColor: EMDRiseColors.primaryGreen + '15',
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    marginBottom: EMDRiseSpacing.md,
  },
  guidelinesTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  guidelineItem: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  establishButton: {
    backgroundColor: EMDRiseColors.primaryGreen,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
  },
  establishButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  blsGuideButton: {
    alignSelf: 'flex-start',
    marginBottom: EMDRiseSpacing.md,
  },
  blsGuideButtonText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.primaryBlue,
    textDecorationLine: 'underline',
  },
  blsOptionsContainer: {
    gap: EMDRiseSpacing.md,
  },
  blsOptionCard: {
    backgroundColor: EMDRiseColors.therapeuticBg,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    borderWidth: 2,
    borderColor: EMDRiseColors.border,
    alignItems: 'center',
    position: 'relative',
  },
  blsOptionCardSelected: {
    backgroundColor: EMDRiseColors.primaryBlue + '15',
    borderColor: EMDRiseColors.primaryBlue,
  },
  blsOptionIcon: {
    fontSize: 40,
    marginBottom: EMDRiseSpacing.sm,
  },
  blsOptionTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  blsOptionTitleSelected: {
    color: EMDRiseColors.primaryBlue,
  },
  blsOptionDescription: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },
  blsOptionDescriptionSelected: {
    color: EMDRiseColors.text.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: EMDRiseSpacing.sm,
    right: EMDRiseSpacing.sm,
    width: 24,
    height: 24,
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.bold,
  },
  preferredMethodText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginTop: EMDRiseSpacing.md,
  },
  preferredMethodBold: {
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    textTransform: 'capitalize',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing.xl,
    gap: EMDRiseSpacing.md,
  },
  backButton: {
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.lg,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  backButtonText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  continueButton: {
    flex: 1,
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: EMDRiseColors.text.muted,
  },
  disabledButtonText: {
    color: EMDRiseColors.text.secondary,
  },
  continueButtonText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.white,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: EMDRiseSpacing.lg,
  },
  modalContent: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    marginBottom: EMDRiseSpacing.lg,
    textAlign: 'center',
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.base,
  },
  instructionsContainer: {
    marginBottom: EMDRiseSpacing.lg,
  },
  instructionsTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  instructionItem: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    marginBottom: EMDRiseSpacing.xs,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: EMDRiseSpacing.md,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    backgroundColor: EMDRiseColors.therapeuticBg,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    backgroundColor: EMDRiseColors.primaryBlue,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.white,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
});