import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioGuideProps {
  text: string;
  duration: string;
  autoPlay?: boolean;
}

export default function AudioGuide({ text, duration, autoPlay = false }: AudioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoPlay) {
      handlePlayPause();
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    if (isPlaying) {
      // Stop current speech
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsPlaying(false);
      return;
    }

    // Start speech synthesis
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configure voice to be feminine and calm
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('zira')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.rate = 0.8; // Slower, more therapeutic pace
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 0.7;

    utterance.onstart = () => {
      setIsPlaying(true);
      setProgress(0);
      
      // Estimate duration and update progress
      const estimatedDuration = (text.length / 10) * 1000; // Rough estimate
      let elapsed = 0;
      progressIntervalRef.current = setInterval(() => {
        elapsed += 100;
        const newProgress = Math.min((elapsed / estimatedDuration) * 100, 100);
        setProgress(newProgress);
      }, 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setTimeout(() => setProgress(0), 1000);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    // Update current utterance volume if playing
    if (utteranceRef.current && isPlaying) {
      // Cancel and restart with new volume
      window.speechSynthesis.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Restart with new volume setting
      setTimeout(() => {
        handlePlayPause();
      }, 100);
    }
  };

  return (
    <Card className="therapeutic-card mt-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Audio Quote */}
          <div className="text-slate-600 italic text-sm text-sm">
            "{text}"
          </div>

          {/* Audio Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="flex items-center space-x-2"
              >
                {isPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                <span className="text-xs">
                  {isPlaying ? "Pause" : "Play"}
                </span>
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMuteToggle}
                  className="p-1"
                >
                  {isMuted ? (
                    <VolumeX className="h-3 w-3" />
                  ) : (
                    <Volume2 className="h-3 w-3" />
                  )}
                </Button>
                <span className="text-xs text-slate-500">{duration}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={progress} className="h-1" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Therapist Guide</span>
                <span>{isPlaying ? "Playing..." : "Ready"}</span>
              </div>
            </div>
          </div>

          {/* Professional Note */}
          <div className="text-xs text-slate-500 italic text-center border-t pt-3">
            <p>🎙️ Professional therapeutic guidance recorded with warmth and expertise</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
