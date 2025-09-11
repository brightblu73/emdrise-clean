import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';
import Slider from '@react-native-community/slider';

type ProcessingPhase = 'bls' | 'notice' | 'install' | 'bodyscan' | 'closure';
type BLSType = 'visual' | 'auditory' | 'tapping';

// Visual BLS Component with Animation
const VisualBLS = ({ isActive }: { isActive: boolean }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      const animation = () => {
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
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

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  if (!isActive) return null;

  return (
    <View style={styles.visualBLSContainer}>
      <Animated.View 
        style={[
          styles.blsBall,
          { transform: [{ translateX }] }
        ]} 
      />
    </View>
  );
};

// BLS Option Card Component
const BLSOptionCard = ({ 
  type, 
  icon, 
  title, 
  description, 
  isSelected, 
  onSelect 
}: { 
  type: BLSType;
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

export default function ProcessingScreen() {
  const { isAuthenticated, user } = useAuth();
  const navigation = useNavigation();
  
  // Processing state
  const [blsType, setBlsType] = useState<BLSType>('visual');
  const [phase, setPhase] = useState<ProcessingPhase>('bls');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // BLS state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Form state
  const [userNote, setUserNote] = useState('');
  const [positiveBelief, setPositiveBelief] = useState('');
  const [voc, setVoc] = useState(4);
  const [sessionNotes, setSessionNotes] = useState('');
  const [saved, setSaved] = useState(false);

  // Load preferred BLS method
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferred = await AsyncStorage.getItem('preferredBLS');
        if (preferred && ['visual', 'auditory', 'tapping'].includes(preferred)) {
          setBlsType(preferred as BLSType);
        }
      } catch (error) {
        console.error('Error loading BLS preference:', error);
      }
    };
    loadPreferences();
  }, []);

  // Audio BLS simulation (would use actual audio in production)
  useEffect(() => {
    if (isAudioPlaying && blsType === 'auditory') {
      audioInterval.current = setInterval(() => {
        // In a real implementation, you would play alternating beeps here
        console.log('Playing alternating beeps...');
      }, 400);
    } else {
      if (audioInterval.current) {
        clearInterval(audioInterval.current);
        audioInterval.current = null;
      }
    }

    return () => {
      if (audioInterval.current) {
        clearInterval(audioInterval.current);
      }
    };
  }, [isAudioPlaying, blsType]);

  const startBLS = () => {
    setIsProcessing(true);
    if (blsType === 'auditory') {
      setIsAudioPlaying(true);
    }
  };

  const stopBLS = () => {
    setIsProcessing(false);
    setIsAudioPlaying(false);
    setPhase('notice');
  };

  const handleGoWithThat = () => {
    setUserNote('');
    setPhase('bls');
    setIsProcessing(false);
    setIsAudioPlaying(false);
  };

  const handleInstallPositiveCognition = () => {
    setPhase('install');
  };

  const handleInstallWithBLS = () => {
    if (!positiveBelief.trim()) {
      Alert.alert('Missing Positive Belief', 'Please enter a positive belief before continuing.');
      return;
    }
    setPhase('bodyscan');
  };

  const handleCompleteSession = () => {
    setPhase('closure');
  };

  const handleSaveSession = async () => {
    try {
      await AsyncStorage.setItem('emdrSessionNotes', sessionNotes);
      setSaved(true);
      Alert.alert(
        'Session Saved',
        'Your EMDR session has been saved successfully.',
        [
          {
            text: 'Return to Home',
            onPress: () => navigation.navigate('Home' as never),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save session notes. Please try again.');
    }
  };

  const getBLSContent = () => {
    switch (blsType) {
      case 'visual':
        return (
          <View style={styles.blsContent}>
            <Text style={styles.blsInstructions}>
              Follow the moving dot with your eyes while keeping your head still.
            </Text>
            <VisualBLS isActive={isProcessing && phase === 'bls'} />
          </View>
        );
      case 'auditory':
        return (
          <View style={styles.blsContent}>
            <Text style={styles.blsInstructions}>
              🔊 Listen to the alternating sounds. Use headphones for best results.
            </Text>
            {isAudioPlaying && (
              <View style={styles.audioIndicator}>
                <ActivityIndicator size="large" color={EMDRiseColors.primaryBlue} />
                <Text style={styles.audioIndicatorText}>Playing alternating beeps...</Text>
              </View>
            )}
          </View>
        );
      case 'tapping':
        return (
          <View style={styles.blsContent}>
            <Text style={styles.blsInstructions}>
              👐 Cross your arms over your chest and tap alternately, or tap your thighs with both hands alternately.
            </Text>
            <View style={styles.tappingInstructions}>
              <Text style={styles.tappingStep}>1. Cross arms over chest (butterfly hug)</Text>
              <Text style={styles.tappingStep}>2. Tap alternately with each hand</Text>
              <Text style={styles.tappingStep}>3. Find a comfortable rhythm</Text>
              <Text style={styles.tappingStep}>4. Continue while focusing on the memory</Text>
            </View>
          </View>
        );
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authMessage}>Please sign in to access EMDR processing.</Text>
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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EMDR Processing</Text>
          <Text style={styles.headerSubtitle}>Phase 4-7: Memory Reprocessing</Text>
        </View>

        {phase === 'bls' && (
          <>
            {/* BLS Mode Selection */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Select BLS Mode</Text>
              <View style={styles.blsOptionsContainer}>
                <BLSOptionCard
                  type="visual"
                  icon="👁️"
                  title="Visual"
                  description="Follow moving dots"
                  isSelected={blsType === 'visual'}
                  onSelect={() => setBlsType('visual')}
                />
                
                <BLSOptionCard
                  type="auditory"
                  icon="🎵"
                  title="Auditory"
                  description="Alternating sounds"
                  isSelected={blsType === 'auditory'}
                  onSelect={() => setBlsType('auditory')}
                />
                
                <BLSOptionCard
                  type="tapping"
                  icon="👐"
                  title="Tapping"
                  description="Self-tapping patterns"
                  isSelected={blsType === 'tapping'}
                  onSelect={() => setBlsType('tapping')}
                />
              </View>
            </View>

            {/* BLS Content */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Bilateral Stimulation</Text>
              {getBLSContent()}
              
              <View style={styles.blsControls}>
                {!isProcessing ? (
                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={startBLS}
                    data-testid="start-bls-button"
                  >
                    <Text style={styles.startButtonText}>Start BLS Processing</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.stopButton}
                    onPress={stopBLS}
                    data-testid="stop-bls-button"
                  >
                    <Text style={styles.stopButtonText}>Stop BLS - What do you notice?</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}

        {phase === 'notice' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What do you notice?</Text>
            <Text style={styles.therapistPrompt}>
              "What are you noticing now?"
            </Text>
            <TextInput
              style={styles.noticeTextArea}
              placeholder="Describe any images, thoughts, feelings, or sensations that came up during the BLS..."
              value={userNote}
              onChangeText={setUserNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              data-testid="notice-input"
            />
            
            <View style={styles.noticeControls}>
              <TouchableOpacity 
                style={styles.goWithThatButton}
                onPress={handleGoWithThat}
                data-testid="go-with-that-button"
              >
                <Text style={styles.goWithThatButtonText}>Go With That (next round)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.installButton}
                onPress={handleInstallPositiveCognition}
                data-testid="install-button"
              >
                <Text style={styles.installButtonText}>Ready to Install Positive Belief</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {phase === 'install' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Positive Cognition Installation</Text>
            <Text style={styles.therapistPrompt}>
              "What positive belief would you like to strengthen?"
            </Text>
            
            <Text style={styles.label}>Positive belief</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. I am safe now, I am strong, I did the best I could..."
              value={positiveBelief}
              onChangeText={setPositiveBelief}
              data-testid="positive-belief-input"
            />
            
            <Text style={styles.label}>VOC (Validity of Cognition): How true does this feel? (1-7)</Text>
            <View style={styles.vocContainer}>
              <View style={styles.vocLabels}>
                <Text style={styles.vocLabel}>1 - Not true</Text>
                <Text style={styles.vocLabel}>7 - Completely true</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>1</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={7}
                  step={1}
                  value={voc}
                  onValueChange={setVoc}
                  minimumTrackTintColor={EMDRiseColors.primaryBlue}
                  maximumTrackTintColor={EMDRiseColors.border}
                  thumbStyle={{ backgroundColor: EMDRiseColors.primaryBlue }}
                />
                <Text style={styles.sliderValue}>7</Text>
                <View style={styles.vocDisplayValue}>
                  <Text style={styles.vocDisplayText}>{voc}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.installWithBLSButton}
              onPress={handleInstallWithBLS}
              data-testid="install-with-bls-button"
            >
              <Text style={styles.installWithBLSButtonText}>Install Positive Belief with BLS</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'bodyscan' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Body Scan</Text>
            <Text style={styles.therapistPrompt}>
              "Bring up the memory and the positive belief. Notice any tension in your body."
            </Text>
            <Text style={styles.bodyscanInstructions}>
              Take a moment to scan your body from head to toe. Notice any areas of tension, 
              discomfort, or sensation. These may indicate areas that still need processing.
            </Text>
            
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleCompleteSession}
              data-testid="complete-session-button"
            >
              <Text style={styles.completeButtonText}>Complete Session</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'closure' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Session Closure</Text>
            <Text style={styles.therapistPrompt}>
              "Take a moment to visualize your calm place. How are you feeling now?"
            </Text>
            <Text style={styles.closureInstructions}>
              If the session feels incomplete, return to your safe place mentally. 
              Take a few deep breaths and ground yourself before ending.
            </Text>
            
            <Text style={styles.label}>Session notes and reflections</Text>
            <TextInput
              style={styles.sessionNotesTextArea}
              placeholder="Notes, reflections, what was processed, how you're feeling now..."
              value={sessionNotes}
              onChangeText={setSessionNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              data-testid="session-notes-input"
            />
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveSession}
              data-testid="save-session-button"
            >
              <Text style={styles.saveButtonText}>Save Session</Text>
            </TouchableOpacity>
            
            {saved && (
              <View style={styles.savedIndicator}>
                <Text style={styles.savedText}>✅ Session Saved!</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
    padding: EMDRiseSpacing.lg,
  },
  header: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    alignItems: 'center',
    ...EMDRiseShadows.small,
  },
  headerTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  headerSubtitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
  },
  card: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  cardTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
  },
  blsOptionsContainer: {
    gap: EMDRiseSpacing.md,
  },
  blsOptionCard: {
    backgroundColor: EMDRiseColors.therapeuticBg,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    borderWidth: 2,
    borderColor: EMDRiseColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  blsOptionCardSelected: {
    backgroundColor: EMDRiseColors.primaryBlue + '15',
    borderColor: EMDRiseColors.primaryBlue,
  },
  blsOptionIcon: {
    fontSize: 32,
    marginRight: EMDRiseSpacing.md,
  },
  blsOptionTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    flex: 1,
  },
  blsOptionTitleSelected: {
    color: EMDRiseColors.primaryBlue,
  },
  blsOptionDescription: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
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
  blsContent: {
    marginBottom: EMDRiseSpacing.lg,
  },
  blsInstructions: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  visualBLSContainer: {
    height: 80,
    backgroundColor: EMDRiseColors.muted,
    borderRadius: EMDRiseBorderRadius.lg,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  blsBall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: EMDRiseColors.primaryBlue,
    position: 'absolute',
    left: '50%',
    marginLeft: -15,
  },
  audioIndicator: {
    alignItems: 'center',
    padding: EMDRiseSpacing.xl,
  },
  audioIndicatorText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    marginTop: EMDRiseSpacing.md,
  },
  tappingInstructions: {
    backgroundColor: EMDRiseColors.primaryBlue + '10',
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
  },
  tappingStep: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  blsControls: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing.xl,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  stopButton: {
    backgroundColor: EMDRiseColors.primaryGreen,
    paddingHorizontal: EMDRiseSpacing.xl,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    minWidth: 200,
    alignItems: 'center',
  },
  stopButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  therapistPrompt: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    fontStyle: 'italic',
    marginBottom: EMDRiseSpacing.md,
    textAlign: 'center',
  },
  noticeTextArea: {
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    backgroundColor: EMDRiseColors.therapeuticBg,
    minHeight: 100,
    marginBottom: EMDRiseSpacing.lg,
  },
  noticeControls: {
    gap: EMDRiseSpacing.md,
  },
  goWithThatButton: {
    backgroundColor: EMDRiseColors.secondaryBlue,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
  },
  goWithThatButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  installButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
  },
  installButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  label: {
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    backgroundColor: EMDRiseColors.therapeuticBg,
    marginBottom: EMDRiseSpacing.lg,
  },
  vocContainer: {
    marginBottom: EMDRiseSpacing.lg,
  },
  vocLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: EMDRiseSpacing.sm,
  },
  vocLabel: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    color: EMDRiseColors.text.secondary,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EMDRiseSpacing.md,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    color: EMDRiseColors.text.secondary,
    minWidth: 20,
    textAlign: 'center',
  },
  vocDisplayValue: {
    width: 32,
    height: 32,
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vocDisplayText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.white,
  },
  installWithBLSButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
  },
  installWithBLSButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  bodyscanInstructions: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.base,
    marginBottom: EMDRiseSpacing.lg,
  },
  completeButton: {
    backgroundColor: EMDRiseColors.primaryGreen,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
  },
  completeButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  closureInstructions: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.base,
    marginBottom: EMDRiseSpacing.lg,
  },
  sessionNotesTextArea: {
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    backgroundColor: EMDRiseColors.therapeuticBg,
    minHeight: 100,
    marginBottom: EMDRiseSpacing.lg,
  },
  saveButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  savedIndicator: {
    alignItems: 'center',
    marginTop: EMDRiseSpacing.md,
  },
  savedText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.primaryGreen,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
});