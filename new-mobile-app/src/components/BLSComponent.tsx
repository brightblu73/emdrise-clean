import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { EMDRiseColors, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseTypography } from '../constants/branding';

const { width, height } = Dimensions.get('window');

interface BLSComponentProps {
  type: 'visual' | 'auditory' | 'haptic';
  onComplete: () => void;
  onClose: () => void;
  duration?: number; // Duration in seconds
}

export default function BLSComponent({ type, onComplete, onClose, duration = 30 }: BLSComponentProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  
  // Animation values
  const dotPosition = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;
  
  // Audio references
  const [leftSound, setLeftSound] = useState<Audio.Sound | null>(null);
  const [rightSound, setRightSound] = useState<Audio.Sound | null>(null);
  
  // Intervals and animation references
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const blsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Initialize audio for auditory BLS
  useEffect(() => {
    if (type === 'auditory') {
      initializeAudio();
    }
    
    return () => {
      cleanupAudio();
    };
  }, [type]);

  const initializeAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create simple tones for left and right channels
      const leftTone = { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LCaB4Hb1j/4+e0RgjBU...' }; // Placeholder - in production use proper audio files
      const rightTone = { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LCaB4Hb1j/4+e0RgjBU...' }; // Placeholder - different frequency

      const { sound: leftAudio } = await Audio.Sound.createAsync(leftTone, { shouldPlay: false });
      const { sound: rightAudio } = await Audio.Sound.createAsync(rightTone, { shouldPlay: false });
      
      setLeftSound(leftAudio);
      setRightSound(rightAudio);
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  const cleanupAudio = async () => {
    try {
      if (leftSound) {
        await leftSound.unloadAsync();
      }
      if (rightSound) {
        await rightSound.unloadAsync();
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };

  const startBLS = () => {
    setIsActive(true);
    setIsPaused(false);
    
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stopBLS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start BLS based on type
    switch (type) {
      case 'visual':
        startVisualBLS();
        break;
      case 'auditory':
        startAuditoryBLS();
        break;
      case 'haptic':
        startHapticBLS();
        break;
    }
  };

  const pauseBLS = () => {
    setIsPaused(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (blsIntervalRef.current) {
      clearInterval(blsIntervalRef.current);
    }
    
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const resumeBLS = () => {
    setIsPaused(false);
    startBLS();
  };

  const stopBLS = () => {
    setIsActive(false);
    setIsPaused(false);
    
    // Clear all intervals and animations
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (blsIntervalRef.current) {
      clearInterval(blsIntervalRef.current);
    }
    
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    // Reset animations
    dotPosition.setValue(0);
    dotOpacity.setValue(1);
    
    // Call completion callback
    onComplete();
  };

  const startVisualBLS = () => {
    const animateVisualBLS = () => {
      // Animate dot from left to right and back
      animationRef.current = Animated.sequence([
        Animated.timing(dotPosition, {
          toValue: width - 100, // Account for margins and dot size
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(dotPosition, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]);
      
      animationRef.current.start(() => {
        if (isActive && !isPaused) {
          animateVisualBLS();
        }
      });
    };
    
    animateVisualBLS();
  };

  const startAuditoryBLS = () => {
    let isLeftChannel = true;
    
    blsIntervalRef.current = setInterval(async () => {
      try {
        if (isLeftChannel && leftSound) {
          await leftSound.replayAsync();
        } else if (!isLeftChannel && rightSound) {
          await rightSound.replayAsync();
        }
        
        isLeftChannel = !isLeftChannel;
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }, 800); // 800ms interval for bilateral audio
  };

  const startHapticBLS = () => {
    let isLeftPattern = true;
    
    blsIntervalRef.current = setInterval(async () => {
      try {
        if (isLeftPattern) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        
        isLeftPattern = !isLeftPattern;
      } catch (error) {
        console.error('Error generating haptic feedback:', error);
      }
    }, 600); // 600ms interval for haptic feedback
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderBLSContent = () => {
    switch (type) {
      case 'visual':
        return (
          <View style={styles.visualContainer}>
            <View style={styles.visualTrack}>
              <Animated.View
                style={[
                  styles.visualDot,
                  {
                    transform: [{ translateX: dotPosition }],
                    opacity: dotOpacity,
                  },
                ]}
              />
            </View>
            <Text style={styles.instructionText}>
              Follow the moving dot with your eyes while thinking about your target memory
            </Text>
          </View>
        );

      case 'auditory':
        return (
          <View style={styles.auditoryContainer}>
            <View style={styles.audioIndicator}>
              <Text style={styles.audioText}>🎵</Text>
            </View>
            <Text style={styles.instructionText}>
              Listen to the bilateral audio tones while focusing on your target memory
            </Text>
            <Text style={styles.audioNote}>
              Use headphones for the best bilateral audio experience
            </Text>
          </View>
        );

      case 'haptic':
        return (
          <View style={styles.hapticContainer}>
            <View style={styles.hapticIndicator}>
              <Text style={styles.hapticText}>📱</Text>
            </View>
            <Text style={styles.instructionText}>
              Feel the alternating vibrations while focusing on your target memory
            </Text>
            <Text style={styles.hapticNote}>
              Hold your device comfortably in both hands
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Bilateral Stimulation
        </Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.timerLabel}>remaining</Text>
      </View>

      {/* BLS Content */}
      <View style={styles.contentContainer}>
        {renderBLSContent()}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {!isActive ? (
          <TouchableOpacity style={styles.startButton} onPress={startBLS}>
            <Text style={styles.startButtonText}>Start Bilateral Stimulation</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.activeControls}>
            <TouchableOpacity 
              style={styles.pauseButton} 
              onPress={isPaused ? resumeBLS : pauseBLS}
            >
              <Text style={styles.pauseButtonText}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.stopButton} onPress={stopBLS}>
              <Text style={styles.stopButtonText}>Complete Set</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>During bilateral stimulation:</Text>
        <Text style={styles.instructionsText}>
          • Focus on your target memory{'\n'}
          • Notice any thoughts, feelings, or images that arise{'\n'}
          • Don't try to control or change anything{'\n'}
          • Let whatever happens, happen naturally
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EMDRiseColors.therapeuticBg,
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
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: EMDRiseColors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: EMDRiseColors.gray[600],
  },
  title: {
    fontSize: EMDRiseTypography.fontSize.lg,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.primaryBlue,
  },
  placeholder: {
    width: 30,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing.xl,
    backgroundColor: EMDRiseColors.white,
  },
  timerText: {
    fontSize: EMDRiseTypography.fontSize['4xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.primaryBlue,
  },
  timerLabel: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[600],
    marginTop: EMDRiseSpacing.xs,
  },
  contentContainer: {
    flex: 1,
    padding: EMDRiseSpacing.lg,
  },
  visualContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualTrack: {
    width: width - (EMDRiseSpacing.lg * 2),
    height: 100,
    justifyContent: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  visualDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: EMDRiseColors.primaryBlue,
    position: 'absolute',
  },
  auditoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: EMDRiseColors.primaryGreen + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  audioText: {
    fontSize: 40,
  },
  audioNote: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[500],
    textAlign: 'center',
    marginTop: EMDRiseSpacing.md,
    fontStyle: 'italic',
  },
  hapticContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hapticIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: EMDRiseColors.warmAccent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  hapticText: {
    fontSize: 40,
  },
  hapticNote: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[500],
    textAlign: 'center',
    marginTop: EMDRiseSpacing.md,
    fontStyle: 'italic',
  },
  instructionText: {
    fontSize: EMDRiseTypography.fontSize.lg,
    color: EMDRiseColors.gray[700],
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: EMDRiseSpacing.md,
  },
  controlsContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.white,
  },
  startButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.lg,
    paddingHorizontal: EMDRiseSpacing.xl,
  },
  startButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.lg,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center',
  },
  activeControls: {
    flexDirection: 'row',
    gap: EMDRiseSpacing.md,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: EMDRiseColors.warmAccent,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  pauseButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center',
  },
  stopButton: {
    flex: 1,
    backgroundColor: EMDRiseColors.primaryGreen,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  stopButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center',
  },
  instructionsContainer: {
    padding: EMDRiseSpacing.lg,
    backgroundColor: EMDRiseColors.primaryBlue + '10',
    margin: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.md,
  },
  instructionsTitle: {
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.sm,
  },
  instructionsText: {
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.primaryBlue,
    lineHeight: 20,
  },
});