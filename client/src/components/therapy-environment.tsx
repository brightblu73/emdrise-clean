import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Lightbulb, Eye, Waves } from "lucide-react";
import therapistImage from "@assets/therapist_1751129297089.jpg";

interface TherapyEnvironmentProps {
  isActive: boolean;
  onEnvironmentReady?: () => void;
}

export default function TherapyEnvironment({ isActive, onEnvironmentReady }: TherapyEnvironmentProps) {
  const [ambientVolume, setAmbientVolume] = useState([50]);
  const [lightingLevel, setLightingLevel] = useState([70]);
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);
  const [environmentType, setEnvironmentType] = useState<'office' | 'nature' | 'minimal'>('office');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [ambientSound, setAmbientSound] = useState<OscillatorNode | null>(null);

  // Initialize ambient audio
  useEffect(() => {
    if (isActive && !audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [isActive, audioContext]);

  // Create ambient soundscape
  useEffect(() => {
    if (audioContext && isActive && !isAmbientMuted) {
      // Create a gentle ambient sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime); // Low frequency hum
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime((ambientVolume[0] / 100) * 0.1, audioContext.currentTime);
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      setAmbientSound(oscillator);
      
      return () => {
        oscillator.stop();
        setAmbientSound(null);
      };
    }
  }, [audioContext, isActive, isAmbientMuted, ambientVolume]);

  const getEnvironmentStyles = () => {
    const opacity = lightingLevel[0] / 100;
    
    switch (environmentType) {
      case 'office':
        return {
          background: `linear-gradient(135deg, 
            rgba(139, 69, 19, ${opacity * 0.1}) 0%, 
            rgba(160, 82, 45, ${opacity * 0.15}) 50%, 
            rgba(205, 133, 63, ${opacity * 0.1}) 100%)`,
          filter: `brightness(${0.7 + (opacity * 0.3)})`
        };
      case 'nature':
        return {
          background: `linear-gradient(135deg, 
            rgba(34, 139, 34, ${opacity * 0.1}) 0%, 
            rgba(46, 125, 50, ${opacity * 0.15}) 50%, 
            rgba(76, 175, 80, ${opacity * 0.1}) 100%)`,
          filter: `brightness(${0.7 + (opacity * 0.3)})`
        };
      case 'minimal':
        return {
          background: `linear-gradient(135deg, 
            rgba(96, 125, 139, ${opacity * 0.1}) 0%, 
            rgba(120, 144, 156, ${opacity * 0.15}) 50%, 
            rgba(144, 164, 174, ${opacity * 0.1}) 100%)`,
          filter: `brightness(${0.8 + (opacity * 0.2)})`
        };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Therapy Environment Container */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="relative h-64 transition-all duration-1000 ease-in-out"
            style={getEnvironmentStyles()}
          >
            {/* Background Environment */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            
            {/* Therapist Presence */}
            <div className="absolute right-4 bottom-4 w-24 h-32 rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
              <img 
                src={therapistImage} 
                alt="Your therapist"
                className="w-full h-full object-cover object-top"
                style={{ filter: `brightness(${0.9 + (lightingLevel[0] / 100) * 0.1})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-1 left-1 text-white text-xs">Present</div>
            </div>

            {/* Environment Details */}
            {environmentType === 'office' && (
              <>
                <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400/60 rounded-full shadow-lg" />
                <div className="absolute top-8 right-12 w-3 h-12 bg-brown-600/40 rounded" />
                <div className="absolute bottom-8 left-8 w-16 h-4 bg-green-600/30 rounded-full" />
              </>
            )}

            {environmentType === 'nature' && (
              <>
                <div className="absolute top-6 left-6 w-4 h-8 bg-green-700/50 rounded-t-full" />
                <div className="absolute top-4 right-8 w-6 h-6 bg-blue-400/40 rounded-full" />
                <div className="absolute bottom-6 center w-20 h-2 bg-green-500/30 rounded" />
              </>
            )}

            {/* Ambient Lighting Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ 
                background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,${1 - lightingLevel[0]/100}) 100%)` 
              }}
            />

            {/* Center Focus Area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/90">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-medium">Processing Space</p>
                <p className="text-xs opacity-75">Focus here during bilateral stimulation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h4 className="font-semibold text-slate-800 mb-3">Therapy Environment</h4>
          
          {/* Environment Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Environment</label>
            <div className="flex space-x-2">
              <Button
                variant={environmentType === 'office' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEnvironmentType('office')}
                className="flex-1"
              >
                Office
              </Button>
              <Button
                variant={environmentType === 'nature' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEnvironmentType('nature')}
                className="flex-1"
              >
                Nature
              </Button>
              <Button
                variant={environmentType === 'minimal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEnvironmentType('minimal')}
                className="flex-1"
              >
                Minimal
              </Button>
            </div>
          </div>

          {/* Lighting Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <Lightbulb className="w-4 h-4 mr-1" />
                Lighting
              </label>
              <span className="text-xs text-slate-500">{lightingLevel[0]}%</span>
            </div>
            <Slider
              value={lightingLevel}
              onValueChange={setLightingLevel}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Ambient Sound Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <Waves className="w-4 h-4 mr-1" />
                Ambient Sound
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAmbientMuted(!isAmbientMuted)}
              >
                {isAmbientMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
            <Slider
              value={ambientVolume}
              onValueChange={setAmbientVolume}
              max={100}
              step={1}
              disabled={isAmbientMuted}
              className="w-full"
            />
          </div>

          {/* Environment Status */}
          <div className="text-center pt-2 border-t">
            <p className="text-sm text-slate-600">
              {isActive ? (
                <span className="text-green-600 font-medium">✓ Therapy environment active</span>
              ) : (
                <span className="text-slate-500">Environment ready</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}