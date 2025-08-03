import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Heart } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  duration: string;
  audioElement?: HTMLAudioElement;
  type: 'rain' | 'ocean' | 'bells' | 'water' | 'breathing' | 'forest' | 'healing';
}

interface TherapeuticAudioPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  className?: string;
}

export default function TherapeuticAudioPlayer({ 
  track, 
  isPlaying, 
  onPlayPause, 
  onNext,
  className = ""
}: TherapeuticAudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Initialize audio element
  useEffect(() => {
    if (track.audioElement) {
      audioRef.current = track.audioElement;
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoaded(true);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        if (onNext) {
          onNext();
        } else {
          // Loop the track for continuous relaxation
          audio.currentTime = 0;
          audio.play();
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      // Set initial volume
      audio.volume = volume[0] / 100;

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [track.audioElement, onNext, volume]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
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
            {!isLoaded && (
              <p className="text-sm text-blue-600 mt-2">Generating therapeutic audio...</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div 
              ref={progressRef}
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
              <span>{duration > 0 ? formatTime(duration) : track.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleRestart}
              variant="outline"
              size="sm"
              className="h-10 w-10 rounded-full"
              disabled={!isLoaded}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              onClick={onPlayPause}
              size="lg"
              disabled={!isLoaded}
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
                disabled={!isLoaded}
              >
                <Heart className="h-4 w-4" />
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

            <div className="flex-1">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                min={0}
                step={1}
                className="w-full"
                disabled={isMuted}
              />
            </div>

            <span className="text-sm text-slate-600 w-8 text-center">
              {isMuted ? '0' : volume[0]}
            </span>
          </div>

          {/* Therapeutic Benefits */}
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-sm text-slate-700 text-center">
              <strong>Therapeutic Benefits:</strong> {getTherapeuticBenefits(track.type)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
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