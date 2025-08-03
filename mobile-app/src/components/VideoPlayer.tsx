import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getVideoSource, getScriptInfo } from '../utils/videoMapping';

interface VideoPlayerProps {
  therapist: 'maria' | 'alistair';
  scriptNumber: number | string;
  onVideoComplete?: () => void;
  onClose?: () => void;
}

export default function VideoPlayer({ therapist, scriptNumber, onVideoComplete, onClose }: VideoPlayerProps) {
  const [status, setStatus] = useState({});
  const video = useRef(null);

  const videoSource = getVideoSource(therapist, scriptNumber);
  const scriptInfo = getScriptInfo(scriptNumber);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Script {scriptNumber}: {scriptInfo.title}</Text>
        <Text style={styles.therapist}>Therapist: {therapist === 'maria' ? 'Maria' : 'Alistair'}</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Video
        ref={video}
        style={styles.video}
        source={{ uri: videoSource }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay={false}
        onPlaybackStatusUpdate={(status: any) => {
          setStatus(status);
          if (status.didJustFinish && onVideoComplete) {
            onVideoComplete();
          }
        }}
      />

      <View style={styles.controls}>
        <Text style={styles.description}>
          Your therapist will guide you through this phase of EMDR therapy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1e293b',
    position: 'relative',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  therapist: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
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
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 40,
  },
  videoText: {
    fontSize: 64,
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  videoSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    padding: 16,
    backgroundColor: '#1e293b',
  },
  description: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
});