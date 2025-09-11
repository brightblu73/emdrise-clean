import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';
import Slider from '@react-native-community/slider';

interface AssessmentData {
  memory: string;
  image: string;
  negativeCognition: string;
  positiveCognition: string;
  emotions: string[];
  initialSuds: number;
  bodyLocation: string;
}

const NEGATIVE_COGNITIONS = [
  'I am powerless',
  'I am not safe',
  'I am not good enough',
  'I am in danger',
  'I am helpless',
  'I am worthless',
  'I cannot trust anyone',
  'I am responsible'
];

const EMOTIONS = [
  'Fear', 'Anger', 'Sadness', 'Shame', 'Guilt', 'Helplessness', 'Anxiety', 'Disgust', 'Rage'
];

const EmotionButton = ({ 
  emotion, 
  isSelected, 
  onToggle 
}: { 
  emotion: string; 
  isSelected: boolean; 
  onToggle: () => void; 
}) => (
  <TouchableOpacity
    style={[styles.emotionButton, isSelected && styles.emotionButtonSelected]}
    onPress={onToggle}
    data-testid={`emotion-${emotion.toLowerCase()}`}
  >
    <Text style={[styles.emotionButtonText, isSelected && styles.emotionButtonTextSelected]}>
      {emotion}
    </Text>
  </TouchableOpacity>
);

const NegativeCognitionSelector = ({ 
  selectedValue, 
  onSelect 
}: { 
  selectedValue: string; 
  onSelect: (value: string) => void; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.selectorContainer}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setIsExpanded(!isExpanded)}
        data-testid="negative-cognition-selector"
      >
        <Text style={[styles.selectorButtonText, !selectedValue && styles.placeholderText]}>
          {selectedValue || 'Select a negative belief...'}
        </Text>
        <Text style={styles.selectorArrow}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.selectorDropdown}>
          {NEGATIVE_COGNITIONS.map((cognition) => (
            <TouchableOpacity
              key={cognition}
              style={[styles.selectorItem, selectedValue === cognition && styles.selectorItemSelected]}
              onPress={() => {
                onSelect(cognition);
                setIsExpanded(false);
              }}
              data-testid={`cognition-${cognition}`}
            >
              <Text style={[styles.selectorItemText, selectedValue === cognition && styles.selectorItemTextSelected]}>
                {cognition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const ProgressHeader = ({ phase, totalPhases, progress }: { phase: number; totalPhases: number; progress: number }) => (
  <View style={styles.progressHeader}>
    <View style={styles.progressTitleContainer}>
      <Text style={styles.progressTitle}>Phase {phase}: Assessment</Text>
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

export default function AssessmentScreen() {
  const { isAuthenticated, user } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    memory: '',
    image: '',
    negativeCognition: '',
    positiveCognition: '',
    emotions: [],
    initialSuds: 5,
    bodyLocation: '',
  });

  const handleInputChange = (field: keyof AssessmentData, value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmotionToggle = (emotion: string) => {
    setAssessmentData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const validateForm = () => {
    if (!assessmentData.memory.trim()) {
      Alert.alert('Incomplete Assessment', 'Please describe the memory you\'d like to process.');
      return false;
    }
    if (!assessmentData.image.trim()) {
      Alert.alert('Incomplete Assessment', 'Please describe the image that represents the memory.');
      return false;
    }
    if (!assessmentData.negativeCognition) {
      Alert.alert('Incomplete Assessment', 'Please select a negative belief about yourself.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Assessment Complete',
        'Your target has been identified. Moving to processing phase.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Processing' as never),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      <ProgressHeader phase={3} totalPhases={8} progress={37.5} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Guidance Section */}
        <View style={styles.guidanceCard}>
          <Text style={styles.guidanceTitle}>Assessment Guidance</Text>
          <Text style={styles.guidanceText}>
            Now we'll identify the specific memory to work on and assess how it affects you currently. 
            Take your time with each question and be as specific as possible.
          </Text>
        </View>

        {/* Target Memory */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Target Memory</Text>
          <Text style={styles.therapistQuote}>
            "What memory are we going to work on today?"
          </Text>
          <Text style={styles.label}>Describe the memory you'd like to process</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the specific memory or incident..."
            value={assessmentData.memory}
            onChangeText={(text) => handleInputChange('memory', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            data-testid="memory-input"
          />
        </View>

        {/* Image Representation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Image</Text>
          <Text style={styles.therapistQuote}>
            "What picture represents the worst part of the incident?"
          </Text>
          <Text style={styles.label}>Describe the image that comes to mind</Text>
          <TextInput
            style={styles.textArea}
            placeholder="What do you see, hear, smell? Describe the vivid details..."
            value={assessmentData.image}
            onChangeText={(text) => handleInputChange('image', text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            data-testid="image-input"
          />
        </View>

        {/* Negative Cognition */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Negative Cognition</Text>
          <Text style={styles.therapistQuote}>
            "When you bring up that picture, what negative belief do you have about yourself now?"
          </Text>
          <Text style={styles.label}>Negative belief about yourself</Text>
          <NegativeCognitionSelector
            selectedValue={assessmentData.negativeCognition}
            onSelect={(value) => handleInputChange('negativeCognition', value)}
          />
        </View>

        {/* Positive Cognition */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Positive Cognition</Text>
          <Text style={styles.therapistQuote}>
            "When you bring up that picture, what would you like to believe about yourself now?"
          </Text>
          <Text style={styles.label}>Preferred positive belief</Text>
          <TextInput
            style={styles.textArea}
            placeholder="I am safe, I am strong, I did the best I could..."
            value={assessmentData.positiveCognition}
            onChangeText={(text) => handleInputChange('positiveCognition', text)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            data-testid="positive-cognition-input"
          />
        </View>

        {/* Emotions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emotions</Text>
          <Text style={styles.therapistQuote}>
            "When you bring up that incident and those words, what emotions do you feel now?"
          </Text>
          <Text style={styles.label}>Select all emotions you're experiencing</Text>
          <View style={styles.emotionsGrid}>
            {EMOTIONS.map((emotion) => (
              <EmotionButton
                key={emotion}
                emotion={emotion}
                isSelected={assessmentData.emotions.includes(emotion)}
                onToggle={() => handleEmotionToggle(emotion)}
              />
            ))}
          </View>
        </View>

        {/* SUDS Scale */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Disturbance Level (SUDS)</Text>
          <Text style={styles.therapistQuote}>
            "On a scale of 0 to 10, where 0 is no disturbance and 10 is the highest disturbance imaginable, how disturbing does it feel to you now?"
          </Text>
          <View style={styles.sudsContainer}>
            <View style={styles.sudsLabels}>
              <Text style={styles.sudsLabel}>0 - No disturbance</Text>
              <Text style={styles.sudsLabel}>10 - Highest imaginable</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>0</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={assessmentData.initialSuds}
                onValueChange={(value) => handleInputChange('initialSuds', value)}
                minimumTrackTintColor={EMDRiseColors.primaryBlue}
                maximumTrackTintColor={EMDRiseColors.border}
                thumbStyle={{ backgroundColor: EMDRiseColors.primaryBlue }}
              />
              <Text style={styles.sliderValue}>10</Text>
              <View style={styles.sudsDisplayValue}>
                <Text style={styles.sudsDisplayText}>{assessmentData.initialSuds}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Body Location */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Body Sensation</Text>
          <Text style={styles.therapistQuote}>
            "Where do you feel that in your body?"
          </Text>
          <Text style={styles.label}>Location of physical sensation</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe where you feel tension, discomfort, or sensations in your body..."
            value={assessmentData.bodyLocation}
            onChangeText={(text) => handleInputChange('bodyLocation', text)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            data-testid="body-location-input"
          />
        </View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            data-testid="back-button"
          >
            <Text style={styles.backButtonText}>← Back to Preparation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.continueButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading || !assessmentData.memory || !assessmentData.image || !assessmentData.negativeCognition}
            data-testid="continue-button"
          >
            {isLoading ? (
              <ActivityIndicator color={EMDRiseColors.text.white} />
            ) : (
              <Text style={styles.continueButtonText}>Continue to Processing →</Text>
            )}
          </TouchableOpacity>
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
    backgroundColor: EMDRiseColors.primaryBlue,
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
    backgroundColor: EMDRiseColors.primaryBlue,
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
  cardTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
  },
  therapistQuote: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    fontStyle: 'italic',
    marginBottom: EMDRiseSpacing.md,
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
    minHeight: 80,
  },
  selectorContainer: {
    position: 'relative',
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  selectorButtonText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    flex: 1,
  },
  placeholderText: {
    color: EMDRiseColors.text.muted,
  },
  selectorArrow: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
  },
  selectorDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: EMDRiseColors.card,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    zIndex: 1000,
    ...EMDRiseShadows.medium,
  },
  selectorItem: {
    padding: EMDRiseSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: EMDRiseColors.muted,
  },
  selectorItemSelected: {
    backgroundColor: EMDRiseColors.primaryBlue,
  },
  selectorItemText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
  },
  selectorItemTextSelected: {
    color: EMDRiseColors.text.white,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EMDRiseSpacing.sm,
  },
  emotionButton: {
    paddingHorizontal: EMDRiseSpacing.md,
    paddingVertical: EMDRiseSpacing.sm,
    borderRadius: EMDRiseBorderRadius.lg,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    backgroundColor: EMDRiseColors.therapeuticBg,
    minWidth: 80,
  },
  emotionButtonSelected: {
    backgroundColor: EMDRiseColors.primaryBlue,
    borderColor: EMDRiseColors.primaryBlue,
  },
  emotionButtonText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.primary,
    textAlign: 'center',
  },
  emotionButtonTextSelected: {
    color: EMDRiseColors.text.white,
  },
  sudsContainer: {
    marginTop: EMDRiseSpacing.sm,
  },
  sudsLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: EMDRiseSpacing.sm,
  },
  sudsLabel: {
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
  sudsDisplayValue: {
    width: 32,
    height: 32,
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sudsDisplayText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.white,
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
  continueButtonText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.white,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
});