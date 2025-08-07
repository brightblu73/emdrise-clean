import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface BLSComponentProps {
  type: 'visual' | 'auditory' | 'tapping';
  speed: 'slow' | 'normal' | 'fast';
  onComplete?: () => void;
  onClose?: () => void;
}

export default function BLSComponent({ type, speed, onComplete, onClose }: BLSComponentProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  const ballPosition = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxSets = 22;
  const speeds = {
    slow: 2000,
    normal: 1500,
    fast: 1000
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const startBLS = async () => {
    setIsActive(true);
    setCurrentSet(0);
    
    if (type === 'auditory') {
      await setupAudio();
    }
    
    runBLSCycle();
  };

  const stopBLS = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  const setupAudio = async () => {
    try {
      // Create bilateral audio tone for left/right stereo effect
      const { sound: audioSound } = await Audio.Sound.createAsync(
        require('../../assets/bilateral-tone.mp3'),
        { shouldPlay: false, isLooping: false }
      );
      setSound(audioSound);
    } catch (error) {
      console.log('Audio setup failed:', error);
    }
  };

  const runBLSCycle = () => {
    const interval = speeds[speed];
    let setCount = 0;
    let side: 'left' | 'right' = 'left';

    intervalRef.current = setInterval(() => {
      setCurrentSide(side);
      
      switch (type) {
        case 'visual':
          animateVisual(side);
          break;
        case 'auditory':
          playAudio(side);
          break;
        case 'tapping':
          performHaptic(side);
          break;
      }

      side = side === 'left' ? 'right' : 'left';
      if (side === 'left') {
        setCount++;
        setCurrentSet(setCount);
        
        if (setCount >= maxSets) {
          stopBLS();
          if (onComplete) {
            onComplete();
          }
        }
      }
    }, interval / 2);
  };

  const animateVisual = (side: 'left' | 'right') => {
    Animated.timing(ballPosition, {
      toValue: side === 'left' ? 0 : 1,
      duration: speeds[speed] / 4,
      useNativeDriver: false,
    }).start();
  };

  const playAudio = async (side: 'left' | 'right') => {
    if (sound) {
      try {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (error) {
        console.log('Audio playback failed:', error);
      }
    }
  };

  const performHaptic = (side: 'left' | 'right') => {
    const pattern = side === 'left' 
      ? [100, 50] 
      : [50, 100];
    
    try {
      // Use Expo Haptics for better mobile experience
      Haptics.impactAsync(
        side === 'left' 
          ? Haptics.ImpactFeedbackStyle.Light 
          : Haptics.ImpactFeedbackStyle.Medium
      );
    } catch (error) {
      // Fallback to basic vibration
      Vibration.vibrate(pattern);
    }
  };

  const renderVisualBLS = () => (
    <View style={styles.visualContainer}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.ball,
            {
              left: ballPosition.interpolate({
                inputRange: [0, 1],
                outputRange: ['10%', '80%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.instruction}>Follow the ball with your eyes</Text>
    </View>
  );

  const renderAuditoryBLS = () => (
    <View style={styles.auditoryContainer}>
      <View style={styles.audioIndicators}>
        <View style={[styles.audioSide, currentSide === 'left' && styles.audioActive]}>
          <Text style={styles.audioText}>L</Text>
        </View>
        <View style={[styles.audioSide, currentSide === 'right' && styles.audioActive]}>
          <Text style={styles.audioText}>R</Text>
        </View>
      </View>
      <Text style={styles.instruction}>Listen with headphones for stereo effect</Text>
    </View>
  );

  const renderTappingBLS = () => (
    <View style={styles.tappingContainer}>
      <View style={styles.tappingIndicators}>
        <View style={[styles.tappingSide, currentSide === 'left' && styles.tappingActive]}>
          <Text style={styles.tappingText}>Left</Text>
        </View>
        <View style={[styles.tappingSide, currentSide === 'right' && styles.tappingActive]}>
          <Text style={styles.tappingText}>Right</Text>
        </View>
      </View>
      <Text style={styles.instruction}>Feel the gentle haptic vibrations</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {type === 'visual' && 'Visual BLS'}
          {type === 'auditory' && 'Auditory BLS'}
          {type === 'tapping' && 'Tapping BLS'}
        </Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {type === 'visual' && renderVisualBLS()}
        {type === 'auditory' && renderAuditoryBLS()}
        {type === 'tapping' && renderTappingBLS()}
      </View>

      <View style={styles.controls}>
        <Text style={styles.setCounter}>
          Set {currentSet} of {maxSets}
        </Text>
        
        {!isActive ? (
          <TouchableOpacity style={styles.startButton} onPress={startBLS}>
            <Text style={styles.startButtonText}>Start BLS</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopBLS}>
            <Text style={styles.stopButtonText}>Stop BLS</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3b82f6',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  visualContainer: {
    width: '100%',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 40,
    position: 'relative',
  },
  ball: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0C2340',
    position: 'absolute',
    top: -8,
  },
  auditoryContainer: {
    alignItems: 'center',
  },
  audioIndicators: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 40,
  },
  audioSide: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioActive: {
    backgroundColor: '#3b82f6',
  },
  audioText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tappingContainer: {
    alignItems: 'center',
  },
  tappingIndicators: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 40,
  },
  tappingSide: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tappingActive: {
    backgroundColor: '#059669',
  },
  tappingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  instruction: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 20,
  },
  controls: {
    padding: 20,
    backgroundColor: '#fff',
  },
  setCounter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});