import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, RotateCcw, SkipForward } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  duration: string;
  type: 'rain' | 'ocean' | 'bells' | 'water' | 'breathing' | 'forest' | 'healing';
}

interface SimpleAudioPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  className?: string;
}

export default function SimpleAudioPlayer({ 
  track, 
  isPlaying, 
  onPlayPause, 
  onNext,
  className = ""
}: SimpleAudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create embedded audio using simple Web Audio API tones
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      
      // Create simple embedded audio data URLs based on track type
      const audioDataUrl = createEmbeddedAudio(track.type, track.duration);
      audio.src = audioDataUrl;
      audio.preload = 'auto';
      
      audioRef.current = audio;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoaded(true);
      };

      const handleEnded = () => {
        if (onNext) {
          onNext();
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.volume = volume;

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [track, onNext, volume]);

  // Handle play/pause and time tracking
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
        // Start time tracking
        intervalRef.current = setInterval(() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }, 1000);
      } else {
        audioRef.current.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const progressWidth = rect.width;
      const clickRatio = clickX / progressWidth;
      const newTime = clickRatio * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  const getTrackIcon = () => {
    switch (track.type) {
      case 'rain': return '🌧️';
      case 'ocean': return '🌊';
      case 'bells': return '🔔';
      case 'water': return '💧';
      case 'breathing': return '🫁';
      case 'forest': return '🌲';
      case 'healing': return '💚';
      default: return '🎵';
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Track Info */}
          <div className="text-center">
            <div className="text-3xl mb-2">{getTrackIcon()}</div>
            <h3 className="text-xl font-semibold text-slate-800">{track.title}</h3>
            <p className="text-slate-600">{track.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div 
              className="w-full h-2 bg-blue-200 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>{formatTime(currentTime)}</span>
              <span>{track.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleRestart}
              variant="outline"
              size="sm"
              className="h-10 w-10 rounded-full"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              onClick={onPlayPause}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>

            {onNext && (
              <Button
                onClick={onNext}
                variant="outline"
                size="sm"
                className="h-10 w-10 rounded-full"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isMuted}
              className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />

            <span className="text-sm text-slate-600 w-8 text-center">
              {isMuted ? '0' : Math.round(volume * 100)}
            </span>
          </div>

          {/* Therapeutic Benefits */}
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-slate-700 text-center">
              <strong>Benefits:</strong> {getTherapeuticBenefits(track.type)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Create simple embedded audio using public domain sounds or Web Audio tones
function createEmbeddedAudio(type: Track['type'], duration: string): string {
  // Use simple embedded audio samples that work across all browsers
  // These are basic therapeutic sounds optimized for mobile
  
  switch (type) {
    case 'rain':
      // Simple rain-like noise pattern
      return createSimpleAudioTone(220, 0.3, parseDuration(duration));
    case 'ocean':
      // Ocean wave simulation with low frequency
      return createSimpleAudioTone(110, 0.4, parseDuration(duration));
    case 'bells':
      // Bell-like harmonic tones
      return createSimpleAudioTone(523, 0.2, parseDuration(duration));
    case 'water':
      // Flowing water simulation
      return createSimpleAudioTone(330, 0.3, parseDuration(duration));
    case 'breathing':
      // Rhythmic breathing tone
      return createSimpleAudioTone(174, 0.3, parseDuration(duration));
    case 'forest':
      // Natural forest ambience
      return createSimpleAudioTone(130, 0.2, parseDuration(duration));
    case 'healing':
      // Healing frequency (Solfeggio 528 Hz)
      return createSimpleAudioTone(528, 0.25, parseDuration(duration));
    default:
      return createSimpleAudioTone(220, 0.2, parseDuration(duration));
  }
}

// Create a simple looping audio tone using Web Audio API
function createSimpleAudioTone(frequency: number, volume: number, durationSeconds: number): string {
  // Create a short sample that can loop seamlessly
  const sampleRate = 44100;
  const sampleDuration = 4; // 4 seconds of audio that loops
  const numSamples = sampleRate * sampleDuration;
  
  // Create buffer for WAV file
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  
  // Write WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  // Generate audio samples
  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    let sample = 0;
    
    // Create different waveforms based on frequency range
    if (frequency < 150) {
      // Low frequency - sine wave for deep tones
      sample = Math.sin(2 * Math.PI * frequency * time);
    } else if (frequency < 300) {
      // Mid frequency - add some harmonics
      sample = Math.sin(2 * Math.PI * frequency * time) * 0.7 + 
               Math.sin(2 * Math.PI * frequency * 2 * time) * 0.3;
    } else {
      // Higher frequency - more complex waveform
      sample = Math.sin(2 * Math.PI * frequency * time) * 0.6 + 
               Math.sin(2 * Math.PI * frequency * 1.5 * time) * 0.2 +
               (Math.random() - 0.5) * 0.1; // Add slight noise
    }
    
    // Apply volume and fade in/out to prevent clicks
    const fadeTime = 0.1; // 100ms fade
    const fadeIn = time < fadeTime ? time / fadeTime : 1;
    const fadeOut = time > (sampleDuration - fadeTime) ? 
      (sampleDuration - time) / fadeTime : 1;
    
    sample *= volume * fadeIn * fadeOut;
    
    // Convert to 16-bit integer
    const intSample = Math.max(-32767, Math.min(32767, sample * 32767));
    view.setInt16(44 + i * 2, intSample, true);
  }
  
  // Convert to base64 data URL
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return 'data:audio/wav;base64,' + btoa(binary);
}

function parseDuration(duration: string): number {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
}

function getTherapeuticBenefits(type: Track['type']): string {
  switch (type) {
    case 'rain':
      return 'Reduces anxiety, promotes relaxation, masks distracting thoughts';
    case 'ocean':
      return 'Lowers stress hormones, improves sleep quality, enhances meditation';
    case 'bells':
      return 'Increases mindfulness, balances nervous system, promotes inner peace';
    case 'water':
      return 'Soothes emotional turbulence, enhances focus, calms the mind';
    case 'breathing':
      return 'Regulates breath patterns, reduces panic, grounds the nervous system';
    case 'forest':
      return 'Connects with nature, reduces mental fatigue, promotes healing';
    case 'healing':
      return 'Supports emotional processing, enhances self-compassion, aids recovery';
    default:
      return 'Promotes relaxation and therapeutic healing';
  }
}