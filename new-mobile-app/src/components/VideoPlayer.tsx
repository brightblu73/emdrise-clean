import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { EMDRiseColors, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseTypography } from '../constants/branding';

interface VideoPlayerProps {
  source: { uri: string };
  onEnd?: () => void;
  poster?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({ source, onEnd, poster, autoPlay = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<Video>(null);

  const handlePlayPause = async () => {
    try {
      if (!videoRef.current) return;

      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing/pausing video:', error);
      Alert.alert('Playback Error', 'Unable to control video playback. Please try again.');
    }
  };

  const handleSeek = async (newPosition: number) => {
    try {
      if (!videoRef.current || duration === 0) return;
      
      const seekPosition = (newPosition / 100) * duration;
      await videoRef.current.setPositionAsync(seekPosition);
    } catch (error) {
      console.error('Error seeking video:', error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load video</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              setIsLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={source}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isPlaying}
        isLooping={false}
        onLoad={(status) => {
          setIsLoading(false);
          if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
          }
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying);
            
            // Check if video ended
            if (status.didJustFinish && onEnd) {
              onEnd();
            }
          }
        }}
        onError={(error) => {
          console.error('Video error:', error);
          setHasError(true);
          setIsLoading(false);
        }}
      />

      {/* Video Controls Overlay */}
      <View style={styles.controlsOverlay}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        {!isLoading && !hasError && (
          <>
            {/* Play/Pause Button */}
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? '⏸️' : '▶️'}
              </Text>
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
                />
                <TouchableOpacity
                  style={[styles.progressThumb, { left: `${progressPercentage}%` }]}
                  onTouchEnd={(event) => {
                    const touchX = event.nativeEvent.locationX;
                    const containerWidth = event.currentTarget.parent?.measure?.width || 0;
                    const newPosition = (touchX / containerWidth) * 100;
                    handleSeek(newPosition);
                  }}
                />
              </View>
              
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: EMDRiseColors.black,
    aspectRatio: 16 / 9,
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: EMDRiseSpacing.md,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing.lg,
  },
  loadingText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: EMDRiseColors.gray[800],
  },
  errorText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
    marginBottom: EMDRiseSpacing.md,
  },
  retryButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.sm,
    borderRadius: EMDRiseBorderRadius.sm,
  },
  retryButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.sm,
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 20,
  },
  progressContainer: {
    paddingTop: EMDRiseSpacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: EMDRiseSpacing.sm,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: EMDRiseColors.primaryBlue,
    transform: [{ translateX: -8 }],
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.xs,
  },
});