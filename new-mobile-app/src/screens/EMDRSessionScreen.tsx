import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  TextInput,
  Alert,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { useEMDR } from '../providers/EMDRProvider';
import { useRevenueCat } from '../hooks/useRevenueCat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoPlayer from '../components/VideoPlayer';
import BLSComponent from '../components/BLSComponent';
import { EMDRiseColors, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseTypography, EMDRiseStyles } from '../constants/branding';

const { width } = Dimensions.get('window');

interface EMDRSessionScreenProps {
  route?: any;
}

export default function EMDRSessionScreen({ route }: EMDRSessionScreenProps) {
  const { user, isAuthenticated } = useAuth();
  const { selectedTherapist, createSession, currentSession, updateSession } = useEMDR();
  const { subscriptionStatus, loading: subscriptionLoading } = useRevenueCat();
  const navigation = useNavigation();
  
  // Session state
  const [loading, setLoading] = useState(true);
  const [currentScript, setCurrentScript] = useState(1);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sudsRating, setSudsRating] = useState(5);
  const [vocRating, setVocRating] = useState(4);
  const [showBLS, setShowBLS] = useState(false);
  const [blsType, setBLSType] = useState<'visual' | 'auditory' | 'haptic'>('visual');
  const [userInput, setUserInput] = useState<any>({});
  const [localSelectedTherapist, setLocalSelectedTherapist] = useState<'female' | 'male' | null>(null);
  
  // BLS and Processing state
  const [blsRounds, setBLSRounds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  
  // Body scan state  
  const [bodyScanStep, setBodyScanStep] = useState<'scanning' | 'disturbance' | 'clearing' | 'complete'>('scanning');
  const [disturbanceLevel, setDisturbanceLevel] = useState([0]);

  // Check subscription access and load therapist
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);

        // Check authentication first
        if (!isAuthenticated) {
          Alert.alert('Authentication Required', 'Please sign in to access EMDR sessions.');
          navigation.navigate('Login');
          return;
        }

        // Check subscription status
        if (!subscriptionLoading && !subscriptionStatus.isActive) {
          Alert.alert(
            'Subscription Required', 
            'Please subscribe to access EMDR therapy sessions.',
            [
              {
                text: 'Subscribe Now',
                onPress: () => navigation.navigate('Subscription')
              },
              {
                text: 'Go Back',
                style: 'cancel',
                onPress: () => navigation.goBack()
              }
            ]
          );
          return;
        }
        
        // Load saved therapist
        const savedTherapist = await AsyncStorage.getItem('selectedTherapist');
        if (savedTherapist) {
          setLocalSelectedTherapist(savedTherapist as 'female' | 'male');
        }
        
        // Initialize or resume session
        if (!currentSession) {
          await createSession();
        }
        
        // Check for paused session
        const pausedSession = await AsyncStorage.getItem('pausedEMDRSession');
        if (pausedSession) {
          const parsed = JSON.parse(pausedSession);
          setCurrentScript(parsed.pausedFromScript || 1);
          // Resume from Script 5a if paused during reprocessing
          if (parsed.pausedFromScript === 5) {
            setCurrentScript('5a');
          }
        } else if (currentSession) {
          setCurrentScript(currentSession.currentScript || 1);
        }
        
      } catch (error) {
        console.error('Error initializing session:', error);
        Alert.alert('Error', 'Failed to initialize EMDR session. Please try again.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [isAuthenticated, subscriptionStatus.isActive, subscriptionLoading]);

  // Script definitions matching web version
  const getScriptInfo = (scriptNumber: number | string) => {
    const therapistPrefix = localSelectedTherapist === 'female' ? 'maria' : 'alistair';
    
    const scripts: Record<string | number, any> = {
      1: {
        title: 'Welcome & Introduction to EMDR',
        description: 'Introduction to the EMDR process and what to expect',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script1-intro.mp4`,
        showRatings: false,
        showBLS: false,
      },
      2: {
        title: 'Calm Place Setup',
        description: 'Guided visualization to establish your safe, calm place',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script2-calmplace.mp4`,
        showRatings: false,
        showBLS: false,
      },
      3: {
        title: 'Target Memory Setup',
        description: 'Identify and prepare the memory for processing',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script3-targetmemory.mp4`,
        showRatings: true,
        showBLS: false,
      },
      4: {
        title: 'Desensitization Setup',
        description: 'Prepare for the processing phase',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script4-desensitization.mp4`,
        showRatings: true,
        showBLS: false,
      },
      5: {
        title: 'Reprocessing',
        description: 'Active bilateral stimulation and memory processing',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script5-reprocessing.mp4`,
        showRatings: true,
        showBLS: true,
        requireBLS: true,
      },
      '5a': {
        title: 'Resumption Video',
        description: 'Welcome back - resuming your EMDR journey',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script5a-resumption.mp4`,
        showRatings: true,
        showBLS: false,
      },
      6: {
        title: 'Installation - Positive Beliefs',
        description: 'Strengthening positive beliefs about yourself',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script6-installation.mp4`,
        showRatings: true,
        showBLS: true,
      },
      7: {
        title: 'Installation Continued',
        description: 'Further strengthening positive beliefs',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script7-installation2.mp4`,
        showRatings: true,
        showBLS: false,
      },
      8: {
        title: 'Body Scan',
        description: 'Checking for any remaining physical tension or disturbance',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script8-bodyscan.mp4`,
        showRatings: false,
        showBLS: false,
        showBodyScan: true,
      },
      9: {
        title: 'Return to Calm Place',
        description: 'Returning to your safe, calm space for closure',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script9-calmclose.mp4`,
        showRatings: false,
        showBLS: false,
      },
      10: {
        title: 'Aftercare & Closure',
        description: 'Session completion and self-care guidance',
        videoUrl: `https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/${therapistPrefix}-script10-aftercare.mp4`,
        showRatings: false,
        showBLS: false,
        isLastScript: true,
      },
    };

    return scripts[scriptNumber] || scripts[1];
  };

  const scriptInfo = useMemo(() => getScriptInfo(currentScript), [currentScript, localSelectedTherapist]);

  const handleVideoComplete = () => {
    setIsVideoCompleted(true);
  };

  const handleAdvanceScript = async () => {
    try {
      let nextScript: number | string;
      
      if (currentScript === '5a') {
        nextScript = 5; // After resumption video, continue with Script 5
      } else if (typeof currentScript === 'number') {
        if (currentScript >= 10) {
          // Session complete
          Alert.alert(
            'Session Complete!',
            'Congratulations on completing your EMDR session. Take some time to rest and be gentle with yourself.',
            [
              {
                text: 'Return Home',
                onPress: () => {
                  // Clear session data
                  AsyncStorage.multiRemove(['currentEMDRSession', 'pausedEMDRSession', 'emdrPauseFlag']);
                  navigation.navigate('Home');
                },
              },
            ]
          );
          return;
        }
        nextScript = currentScript + 1;
      } else {
        nextScript = 1;
      }

      setCurrentScript(nextScript);
      setIsVideoCompleted(false);
      setShowBLS(false);
      setProcessingComplete(false);
      setBLSRounds(0);

      // Update session in storage
      if (currentSession) {
        await updateSession({ currentScript: nextScript });
      }
    } catch (error) {
      console.error('Error advancing script:', error);
      Alert.alert('Error', 'Failed to advance to next phase. Please try again.');
    }
  };

  const handlePauseSession = async () => {
    try {
      Alert.alert(
        'Pause Session',
        'Are you sure you want to pause your EMDR session? You can resume later.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Pause Session',
            onPress: async () => {
              // Save pause state
              const pauseData = {
                pausedFromScript: typeof currentScript === 'number' ? currentScript : 5,
                pausedAt: new Date().toISOString(),
                therapist: localSelectedTherapist,
              };
              
              await AsyncStorage.setItem('pausedEMDRSession', JSON.stringify(pauseData));
              await AsyncStorage.setItem('emdrPauseFlag', 'true');
              
              // Navigate to script 9 for closure
              setCurrentScript(9);
              setIsVideoCompleted(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error pausing session:', error);
    }
  };

  const handleBLSComplete = () => {
    setShowBLS(false);
    setProcessingComplete(true);
    setBLSRounds(prev => prev + 1);
  };

  const renderBodyScan = () => (
    <View style={styles.bodyScanContainer}>
      <Text style={styles.sectionTitle}>Body Scan</Text>
      
      {bodyScanStep === 'scanning' && (
        <View style={styles.bodyScanStep}>
          <Text style={styles.bodyScanText}>
            Take a moment to scan your body from head to toe. Notice any areas of tension, discomfort, or unusual sensations.
          </Text>
          <TouchableOpacity 
            style={styles.bodyScanButton}
            onPress={() => setBodyScanStep('disturbance')}
          >
            <Text style={styles.bodyScanButtonText}>I've Completed the Scan</Text>
          </TouchableOpacity>
        </View>
      )}

      {bodyScanStep === 'disturbance' && (
        <View style={styles.bodyScanStep}>
          <Text style={styles.bodyScanText}>
            Do you notice any disturbance or tension in your body? Rate it from 0 (no disturbance) to 10 (maximum disturbance).
          </Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Disturbance Level: {disturbanceLevel[0]}</Text>
            <View style={styles.sliderContainer}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderButton,
                    disturbanceLevel[0] === value && styles.sliderButtonActive
                  ]}
                  onPress={() => setDisturbanceLevel([value])}
                >
                  <Text style={[
                    styles.sliderButtonText,
                    disturbanceLevel[0] === value && styles.sliderButtonTextActive
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.bodyScanButton}
            onPress={() => {
              if (disturbanceLevel[0] > 0) {
                setBodyScanStep('clearing');
              } else {
                setBodyScanStep('complete');
              }
            }}
          >
            <Text style={styles.bodyScanButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {bodyScanStep === 'clearing' && (
        <View style={styles.bodyScanStep}>
          <Text style={styles.bodyScanText}>
            Focus on the area of disturbance while using bilateral stimulation to help clear any remaining tension.
          </Text>
          
          <TouchableOpacity 
            style={styles.blsButton}
            onPress={() => setShowBLS(true)}
          >
            <Text style={styles.blsButtonText}>Start Bilateral Stimulation</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bodyScanButton}
            onPress={() => setBodyScanStep('complete')}
          >
            <Text style={styles.bodyScanButtonText}>Complete Body Scan</Text>
          </TouchableOpacity>
        </View>
      )}

      {bodyScanStep === 'complete' && (
        <View style={styles.bodyScanStep}>
          <Text style={styles.bodyScanText}>
            Body scan complete. Notice how your body feels now compared to when you started.
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAdvanceScript}
          >
            <Text style={styles.primaryButtonText}>Continue to Next Phase</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading || subscriptionLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparing your EMDR session...</Text>
      </SafeAreaView>
    );
  }

  // Additional security check - prevent render if no subscription
  if (!subscriptionStatus.isActive) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Checking subscription status...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>EMDR Session</Text>
          
          <TouchableOpacity 
            onPress={handlePauseSession}
            style={styles.pauseButton}
          >
            <Text style={styles.pauseButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Phase {currentScript} of 10: {scriptInfo.title}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(typeof currentScript === 'number' ? currentScript : 5) * 10}%` }
              ]} 
            />
          </View>
        </View>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          <VideoPlayer
            source={{ uri: scriptInfo.videoUrl }}
            onEnd={handleVideoComplete}
            poster={`https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos/thumbnails/${localSelectedTherapist === 'female' ? 'maria' : 'alistair'}-thumb.jpg`}
          />
        </View>

        {/* Script Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.scriptTitle}>{scriptInfo.title}</Text>
          <Text style={styles.scriptDescription}>{scriptInfo.description}</Text>
        </View>

        {/* SUDS/VOC Ratings */}
        {scriptInfo.showRatings && (
          <View style={styles.ratingsContainer}>
            <Text style={styles.sectionTitle}>Session Ratings</Text>
            
            <View style={styles.ratingItem}>
              <Text style={styles.ratingLabel}>
                SUDS Level (0-10): How disturbing does the memory feel? {sudsRating}
              </Text>
              <View style={styles.sliderContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.sliderButton,
                      sudsRating === value && styles.sliderButtonActive
                    ]}
                    onPress={() => setSudsRating(value)}
                  >
                    <Text style={[
                      styles.sliderButtonText,
                      sudsRating === value && styles.sliderButtonTextActive
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.ratingItem}>
              <Text style={styles.ratingLabel}>
                VOC Level (1-7): How true does the positive belief feel? {vocRating}
              </Text>
              <View style={styles.sliderContainer}>
                {[1, 2, 3, 4, 5, 6, 7].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.sliderButton,
                      vocRating === value && styles.sliderButtonActive
                    ]}
                    onPress={() => setVocRating(value)}
                  >
                    <Text style={[
                      styles.sliderButtonText,
                      vocRating === value && styles.sliderButtonTextActive
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* BLS Controls */}
        {scriptInfo.showBLS && (
          <View style={styles.blsContainer}>
            <Text style={styles.sectionTitle}>Bilateral Stimulation</Text>
            
            <View style={styles.blsTypeSelector}>
              {(['visual', 'auditory', 'haptic'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.blsTypeButton,
                    blsType === type && styles.blsTypeButtonActive
                  ]}
                  onPress={() => setBLSType(type)}
                >
                  <Text style={[
                    styles.blsTypeText,
                    blsType === type && styles.blsTypeTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.blsButton}
              onPress={() => setShowBLS(true)}
            >
              <Text style={styles.blsButtonText}>Start Bilateral Stimulation</Text>
            </TouchableOpacity>

            {blsRounds > 0 && (
              <Text style={styles.blsInfo}>
                Completed {blsRounds} round{blsRounds !== 1 ? 's' : ''} of bilateral stimulation
              </Text>
            )}
          </View>
        )}

        {/* Body Scan */}
        {scriptInfo.showBodyScan && renderBodyScan()}

        {/* Session Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Session Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={sessionNotes}
            onChangeText={setSessionNotes}
            placeholder="Record any thoughts, feelings, or insights from this session..."
            placeholderTextColor={EMDRiseColors.gray[400]}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Continue Button */}
        <View style={styles.continueContainer}>
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              (!isVideoCompleted && scriptInfo.requireBLS && !processingComplete) && styles.disabledButton
            ]}
            onPress={handleAdvanceScript}
            disabled={!isVideoCompleted && scriptInfo.requireBLS && !processingComplete}
          >
            <Text style={styles.primaryButtonText}>
              {scriptInfo.isLastScript ? 'Complete Session' : 'Continue to Next Phase'}
            </Text>
          </TouchableOpacity>
          
          {(!isVideoCompleted && scriptInfo.requireBLS && !processingComplete) && (
            <Text style={styles.continueNote}>
              Complete the video and bilateral stimulation to continue
            </Text>
          )}
        </View>
      </ScrollView>

      {/* BLS Modal */}
      <Modal
        visible={showBLS}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <BLSComponent
          type={blsType}
          onComplete={handleBLSComplete}
          onClose={() => setShowBLS(false)}
        />
      </Modal>
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
    fontSize: EMDRiseTypography.fontSize.lg,
    color: EMDRiseColors.primaryBlue,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.md,
    backgroundColor: EMDRiseColors.white,
    borderBottomWidth: 1,
    borderBottomColor: EMDRiseColors.gray[200],
  },
  backButton: {
    padding: EMDRiseSpacing.sm,
  },
  backButtonText: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.primaryBlue,
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  headerTitle: {
    fontSize: EMDRiseTypography.fontSize.lg,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.gray[800],
  },
  pauseButton: {
    backgroundColor: EMDRiseColors.warmAccent,
    paddingHorizontal: EMDRiseSpacing.md,
    paddingVertical: EMDRiseSpacing.sm,
    borderRadius: EMDRiseBorderRadius.sm,
  },
  pauseButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.sm,
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  progressContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
  },
  progressText: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[700],
    marginBottom: EMDRiseSpacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: EMDRiseColors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: EMDRiseColors.primaryGreen,
  },
  videoContainer: {
    backgroundColor: EMDRiseColors.black,
    aspectRatio: 16 / 9,
  },
  descriptionContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
  },
  scriptTitle: {
    fontSize: EMDRiseTypography.fontSize.xl,
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.sm,
  },
  scriptDescription: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[600],
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: EMDRiseTypography.fontSize.lg,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.md,
  },
  ratingsContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
    marginTop: EMDRiseSpacing.sm,
  },
  ratingItem: {
    marginBottom: EMDRiseSpacing.lg,
  },
  ratingLabel: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[700],
    marginBottom: EMDRiseSpacing.sm,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: EMDRiseColors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EMDRiseColors.gray[300],
  },
  sliderButtonActive: {
    backgroundColor: EMDRiseColors.primaryBlue,
    borderColor: EMDRiseColors.primaryBlue,
  },
  sliderButtonText: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[600],
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  sliderButtonTextActive: {
    color: EMDRiseColors.white,
  },
  blsContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
    marginTop: EMDRiseSpacing.sm,
  },
  blsTypeSelector: {
    flexDirection: 'row',
    marginBottom: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.gray[100],
    borderRadius: EMDRiseBorderRadius.md,
    overflow: 'hidden',
  },
  blsTypeButton: {
    flex: 1,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.sm,
    backgroundColor: 'transparent',
  },
  blsTypeButtonActive: {
    backgroundColor: EMDRiseColors.primaryBlue,
  },
  blsTypeText: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[600],
    textAlign: 'center',
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  blsTypeTextActive: {
    color: EMDRiseColors.white,
  },
  blsButton: {
    backgroundColor: EMDRiseColors.primaryGreen,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.md,
  },
  blsButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center',
  },
  blsInfo: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[600],
    textAlign: 'center',
  },
  bodyScanContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
    marginTop: EMDRiseSpacing.sm,
  },
  bodyScanStep: {
    alignItems: 'center',
  },
  bodyScanText: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[700],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: EMDRiseSpacing.lg,
  },
  bodyScanButton: {
    backgroundColor: EMDRiseColors.secondaryBlue,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  bodyScanButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center',
  },
  notesContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
    marginTop: EMDRiseSpacing.sm,
  },
  notesInput: {
    backgroundColor: EMDRiseColors.gray[50],
    borderWidth: 1,
    borderColor: EMDRiseColors.gray[300],
    borderRadius: EMDRiseBorderRadius.md,
    padding: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[800],
    textAlignVertical: 'top',
    minHeight: 100,
  },
  continueContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
    marginTop: EMDRiseSpacing.sm,
  },
  primaryButton: {
    ...EMDRiseStyles.primaryButton,
    marginBottom: EMDRiseSpacing.sm,
  },
  primaryButtonText: {
    ...EMDRiseStyles.primaryButtonText,
  },
  disabledButton: {
    backgroundColor: EMDRiseColors.gray[400],
  },
  continueNote: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[500],
    textAlign: 'center',
  },
});