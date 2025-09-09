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
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoPlayer from '../components/VideoPlayer';
import BLSComponent from '../components/BLSComponent';

const { width } = Dimensions.get('window');

interface EMDRSessionScreenProps {
  route?: any;
}

export default function EMDRSessionScreen({ route }: EMDRSessionScreenProps) {
  const { user } = useAuth();
  const { selectedTherapist, createSession, currentSession, updateSession } = useEMDR();
  const navigation = useNavigation();
  
  // Session state
  const [loading, setLoading] = useState(true);
  const [currentScript, setCurrentScript] = useState(1);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBLS, setShowBLS] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  
  // User input state
  const [sessionNotes, setSessionNotes] = useState('');
  const [sudsRating, setSudsRating] = useState([5]);
  const [vocRating, setVocRating] = useState([4]);
  const [userInput, setUserInput] = useState<any>({});
  const [blsType, setBLSType] = useState<'visual' | 'auditory' | 'tapping'>('visual');
  const [blsSpeed, setBLSSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  
  // Setup state
  const [localSelectedTherapist, setLocalSelectedTherapist] = useState<'female' | 'male' | null>(null);
  const [isSetupPhase, setIsSetupPhase] = useState(false);
  const [setupStep, setSetupStep] = useState<'therapist' | 'calm-place' | 'target' | 'complete'>('therapist');
  
  // Body scan state  
  const [bodyScanStep, setBodyScanStep] = useState<'scanning' | 'disturbance' | 'clearing' | 'complete'>('scanning');
  const [disturbanceLevel, setDisturbanceLevel] = useState([0]);

  // Load therapist and initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        
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
  }, []);

  // Script definitions matching web version
  const getScriptInfo = (scriptNumber: number | string) => {
    const therapistPrefix = localSelectedTherapist === 'female' ? 'maria' : 'alistair';
    const scripts: Record<string | number, { 
      title: string; 
      phase: string; 
      videoUrl: string; 
      needsSetup?: boolean; 
      hasBLS?: boolean; 
      isLoop?: boolean; 
      description?: string;
    }> = {
      1: { 
        title: "Welcome & Introduction to EMDR", 
        phase: "introduction", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script1-welcome.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script1-welcome.mp4',
        needsSetup: true 
      },
      2: { 
        title: "Setting up your Calm Place", 
        phase: "calm_place_setup", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script2-calmplace.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script2-calmplace.mp4',
        needsSetup: true 
      },
      3: { 
        title: "Setting up the Target Memory", 
        phase: "target_setup", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script3-target.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script3-target.mp4',
        needsSetup: true 
      },
      4: { 
        title: "Desensitization and Reprocessing", 
        phase: "desensitization_setup", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script4-reprocessing.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script4-reprocessing.mp4',
        needsSetup: true 
      },
      5: { 
        title: "Reprocessing", 
        phase: "reprocessing", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script5-reprocessing-continued.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script5-reprocessing-continued.mp4',
        hasBLS: true, 
        description: "Bilateral stimulation and reprocessing" 
      },
      '5a': { 
        title: "Continue Reprocessing After an Incomplete Session", 
        phase: "resume_reprocessing", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script5a-resume.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script5a-resume.mp4',
        hasBLS: true, 
        description: "Resume bilateral stimulation processing" 
      },
      6: { 
        title: "Installation of Positive Belief", 
        phase: "installation", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script6-installation.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script6-installation.mp4',
        hasBLS: true 
      },
      7: { 
        title: "Installation of Positive Belief Continued", 
        phase: "installation_continued", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script7-installation-continued.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script7-installation-continued.mp4',
        hasBLS: true 
      },
      8: { 
        title: "Body Scan", 
        phase: "body_scan", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script8-bodyscan.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script8-bodyscan.mp4',
        hasBLS: true 
      },
      9: { 
        title: "Calm Place Return", 
        phase: "calm_place_return", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script9-calmplace-return.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script9-calmplace-return.mp4'
      },
      10: { 
        title: "Aftercare", 
        phase: "aftercare", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script10-aftercare.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script10-aftercare.mp4'
      }
    };
    return scripts[scriptNumber] || scripts[1];
  };

  const currentScriptInfo = useMemo(() => {
    return getScriptInfo(currentScript);
  }, [currentScript, localSelectedTherapist]);

  // Helper functions
  const isBLSPhase = () => {
    return ['4', '5', '5a', '6', '7', '8'].includes(String(currentScript));
  };

  const getBLSInstructions = () => {
    switch (String(currentScript)) {
      case "4": return "Preparing for bilateral stimulation and reprocessing.";
      case "5": return "Continue BLS while focusing on the memory. Notice what comes up.";
      case "5a": return "Resume BLS processing from where you left off in your previous session.";
      case "6": return "Use BLS while holding both the memory and positive belief together.";
      case "7": return "Continue strengthening the positive belief with BLS.";
      case "8": return "Scan your body. If you notice disturbance, use BLS to clear it.";
      default: return "";
    }
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      introduction: "#dbeafe",
      target_setup: "#e0e7ff", 
      desensitization_setup: "#fed7aa",
      processing: "#fecaca",
      installation: "#bbf7d0",
      body_scan: "#c7d2fe",
      closure: "#f3f4f6",
    };
    return colors[phase] || "#f3f4f6";
  };

  // Event handlers
  const handleVideoComplete = () => {
    setIsVideoCompleted(true);
    setShowVideo(false);
  };

  const handleVideoClose = () => {
    setIsVideoCompleted(true);
    setShowVideo(false);
  };

  const handleBLSComplete = () => {
    setShowBLS(false);
    
    // Auto-advance logic
    if (String(currentScript) === "4") {
      handleAdvanceScript();
      return;
    }
    
    if (String(currentScript) === "5a") {
      setCurrentScript(5);
      return;
    }
    
    if (String(currentScript) === "6") {
      handleAdvanceScript();
      return;
    }
    
    // Special handling for body scan
    if (currentScript === 8 && bodyScanStep === 'clearing') {
      setBodyScanStep('scanning');
    }
  };

  const handleAdvanceScript = async () => {
    if (isAdvancing) return;
    
    setIsAdvancing(true);
    
    try {
      // Special handling for Script 10 - Complete Session
      if (currentScript === 10) {
        await AsyncStorage.removeItem('emdrSession');
        await AsyncStorage.removeItem('pausedEMDRSession');
        navigation.navigate('Home');
        return;
      }
      
      // Save progress
      if (currentSession) {
        await updateSession({
          currentScript: currentScript + 1,
          sudsRating: sudsRating[0],
          vocRating: vocRating[0],
          notes: sessionNotes,
        });
      }
      
      // Advance to next script
      setCurrentScript(prev => prev + 1);
      setIsVideoCompleted(false);
      setSessionNotes("");
      setUserInput({});
      
    } catch (error) {
      console.error('Error advancing script:', error);
      Alert.alert('Error', 'Failed to advance script. Please try again.');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleGoBack = async () => {
    if (currentScript > 1) {
      setCurrentScript(prev => prev - 1);
      setIsVideoCompleted(false);
    } else {
      navigation.goBack();
    }
  };

  const handlePauseSession = async () => {
    try {
      // Only allow pausing during reprocessing phases
      if (currentScript === 5 || currentScript === '5a') {
        const pausedSession = {
          pausedAt: new Date().toISOString(),
          pausedFromScript: currentScript,
          sudsRating: sudsRating[0],
          vocRating: vocRating[0],
          notes: sessionNotes,
        };
        
        await AsyncStorage.setItem('pausedEMDRSession', JSON.stringify(pausedSession));
        Alert.alert(
          'Session Paused',
          'Your session has been safely paused. You can resume from Script 5a when you return.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert('Cannot Pause', 'Sessions can only be paused during reprocessing phases (Scripts 5-5a).');
      }
    } catch (error) {
      console.error('Error pausing session:', error);
      Alert.alert('Error', 'Failed to pause session. Please try again.');
    }
  };

  // Rating slider components
  const RatingSlider = ({ title, value, onChange, min = 0, max = 10 }: {
    title: string;
    value: number[];
    onChange: (value: number[]) => void;
    min?: number;
    max?: number;
  }) => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingTitle}>{title}</Text>
      <View style={styles.ratingSlider}>
        <Text style={styles.ratingValue}>{value[0]}</Text>
        {/* Simplified slider - in real implementation would use @react-native-community/slider */}
        <View style={styles.sliderContainer}>
          <TouchableOpacity 
            style={[styles.sliderButton, { left: `${(value[0] / max) * 80}%` }]}
            onPressIn={() => {
              // Simple increment/decrement for mobile
            }}
          />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparing your EMDR session...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header with navigation */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← {currentScript > 1 ? 'Previous Step' : 'Home'}</Text>
          </TouchableOpacity>
          
          {/* Session info */}
          <View style={styles.sessionInfo}>
            <Text style={styles.scriptNumber}>Script {currentScript}</Text>
            <Text style={styles.sessionPhase} style={{backgroundColor: getPhaseColor(currentScriptInfo.phase)}}>
              {currentScriptInfo.phase.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          
          {/* Pause button for reprocessing phases */}
          {(currentScript === 5 || currentScript === '5a') && (
            <TouchableOpacity style={styles.pauseButton} onPress={handlePauseSession}>
              <Text style={styles.pauseButtonText}>Pause Session</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Script title */}
          <Text style={styles.scriptTitle}>{currentScriptInfo.title}</Text>
          
          {/* Video section */}
          <View style={styles.videoSection}>
            <TouchableOpacity 
              style={styles.videoButton} 
              onPress={() => setShowVideo(true)}
            >
              <Text style={styles.videoButtonText}>▶ Watch Therapist Video</Text>
              <Text style={styles.videoButtonSubtext}>
                {localSelectedTherapist === 'female' ? 'Maria' : 'Alistair'} will guide you through this phase
              </Text>
            </TouchableOpacity>
          </View>

          {/* BLS section - for applicable scripts */}
          {isBLSPhase() && (
            <View style={styles.blsSection}>
              <Text style={styles.blsSectionTitle}>Bilateral Stimulation</Text>
              <Text style={styles.blsInstructions}>{getBLSInstructions()}</Text>
              
              <View style={styles.blsTypeSelector}>
                {(['visual', 'auditory', 'tapping'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.blsTypeButton, blsType === type && styles.blsTypeButtonActive]}
                    onPress={() => setBLSType(type)}
                  >
                    <Text style={[styles.blsTypeButtonText, blsType === type && styles.blsTypeButtonTextActive]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.startBlsButton} 
                onPress={() => setShowBLS(true)}
              >
                <Text style={styles.startBlsButtonText}>Start BLS Session</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Ratings section - for scripts that need them */}
          {[3, 4, 5, '5a', 6, 7].includes(currentScript) && (
            <View style={styles.ratingsSection}>
              <Text style={styles.ratingSectionTitle}>Rate Your Current Experience</Text>
              
              <RatingSlider
                title="SUDS (Subjective Units of Disturbance Scale): How disturbing does the memory feel right now?"
                value={sudsRating}
                onChange={setSudsRating}
                max={10}
              />
              
              <RatingSlider
                title="VOC (Validity of Cognition): How true does the positive belief feel?"
                value={vocRating}
                onChange={setVocRating}
                min={1}
                max={7}
              />
            </View>
          )}

          {/* Body scan specific UI */}
          {currentScript === 8 && (
            <View style={styles.bodyScanSection}>
              <Text style={styles.bodyScanTitle}>Body Scan Process</Text>
              
              {bodyScanStep === 'scanning' && (
                <View style={styles.bodyScanStep}>
                  <Text style={styles.bodyScanInstructions}>
                    Slowly scan your body from head to toe. Notice any areas of tension, discomfort, or unusual sensations.
                  </Text>
                  <TouchableOpacity 
                    style={styles.bodyScanButton} 
                    onPress={() => setBodyScanStep('disturbance')}
                  >
                    <Text style={styles.bodyScanButtonText}>I Notice Some Disturbance</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bodyScanButton} 
                    onPress={() => setBodyScanStep('complete')}
                  >
                    <Text style={styles.bodyScanButtonText}>Body Feels Clear</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {bodyScanStep === 'disturbance' && (
                <View style={styles.bodyScanStep}>
                  <Text style={styles.bodyScanInstructions}>
                    Rate the level of disturbance you feel in your body:
                  </Text>
                  <RatingSlider
                    title="Disturbance Level"
                    value={disturbanceLevel}
                    onChange={setDisturbanceLevel}
                    max={10}
                  />
                  <TouchableOpacity 
                    style={styles.bodyScanButton} 
                    onPress={() => {
                      setBodyScanStep('clearing');
                      setShowBLS(true);
                    }}
                  >
                    <Text style={styles.bodyScanButtonText}>Clear with BLS</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {bodyScanStep === 'complete' && (
                <View style={styles.bodyScanStep}>
                  <Text style={styles.bodyScanInstructions}>
                    ✓ Body scan complete. Your body feels clear and comfortable.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Notes section */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Session Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Record any thoughts, feelings, or insights from this phase..."
              value={sessionNotes}
              onChangeText={setSessionNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Continue button */}
          <View style={styles.continueSection}>
            <TouchableOpacity 
              style={[styles.continueButton, !isVideoCompleted && styles.continueButtonDisabled]} 
              onPress={handleAdvanceScript}
              disabled={!isVideoCompleted || isAdvancing}
            >
              <Text style={styles.continueButtonText}>
                {isAdvancing ? 'Advancing...' : currentScript === 10 ? 'Complete Session' : 'Continue to Next Phase'}
              </Text>
            </TouchableOpacity>
            
            {!isVideoCompleted && (
              <Text style={styles.continueNote}>Watch the video to continue</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Video Modal */}
      <Modal visible={showVideo} animationType="slide" presentationStyle="fullScreen">
        <VideoPlayer
          therapist={localSelectedTherapist || 'alistair'}
          scriptNumber={currentScript}
          onVideoComplete={handleVideoComplete}
          onClose={handleVideoClose}
        />
      </Modal>

      {/* BLS Modal */}
      <Modal visible={showBLS} animationType="slide" presentationStyle="fullScreen">
        <BLSComponent
          type={blsType}
          speed={blsSpeed}
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
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  sessionInfo: {
    alignItems: 'center',
    flex: 1,
  },
  scriptNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sessionPhase: {
    fontSize: 12,
    color: '#64748b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  pauseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 6,
  },
  pauseButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  mainContent: {
    padding: 20,
  },
  scriptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },
  videoSection: {
    marginBottom: 24,
  },
  videoButton: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  videoButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  videoButtonSubtext: {
    fontSize: 14,
    color: '#dbeafe',
  },
  blsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  blsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  blsInstructions: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  blsTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  blsTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
  },
  blsTypeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  blsTypeButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  blsTypeButtonTextActive: {
    color: '#ffffff',
  },
  startBlsButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startBlsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  ratingsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ratingSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  ratingSlider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    width: 40,
  },
  sliderContainer: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginLeft: 12,
    justifyContent: 'center',
  },
  sliderButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
  bodyScanSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bodyScanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  bodyScanStep: {
    alignItems: 'center',
  },
  bodyScanInstructions: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  bodyScanButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
    minWidth: 200,
  },
  bodyScanButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  notesSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  continueSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 200,
  },
  continueButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  continueNote: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
});