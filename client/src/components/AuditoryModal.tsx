import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuditoryModalProps {
  onClose: () => void;
  onSetComplete: () => void;
}

export default function AuditoryModal({ onClose, onSetComplete }: AuditoryModalProps) {
  const audioContext = useRef<AudioContext | null>(null);
  const leftGain = useRef<GainNode | null>(null);
  const rightGain = useRef<GainNode | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const [isActive, setIsActive] = useState(false);
  const [setCount, setSetCount] = useState(0);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [phase, setPhase] = useState<'ready' | 'active' | 'complete' | 'notice' | 'warning'>('ready');

  // Professional BLS settings  
  const TOTAL_SETS = 22;
  const [toneDuration, setToneDuration] = useState(300); // ms per tone
  const TONE_FREQUENCY = 440; // Hz
  const PAUSE_BETWEEN = 200; // ms pause between tones

  // Initialize audio context
  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create stereo setup
      leftGain.current = audioContext.current.createGain();
      rightGain.current = audioContext.current.createGain();
      
      const merger = audioContext.current.createChannelMerger(2);
      leftGain.current.connect(merger, 0, 0);
      rightGain.current.connect(merger, 0, 1);
      merger.connect(audioContext.current.destination);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Note: Removed auto-start to match visual BLS behavior - user manually starts

  const playTone = (side: 'left' | 'right') => {
    if (!audioContext.current || !leftGain.current || !rightGain.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    
    oscillator.frequency.value = TONE_FREQUENCY;
    oscillator.type = 'sine';
    
    // Set stereo positioning with clear channel separation
    if (side === 'left') {
      leftGain.current.gain.value = 0.5;  // Increased volume for clearer distinction
      rightGain.current.gain.value = 0;   // Complete silence in right ear
      gain.connect(leftGain.current);
    } else {
      leftGain.current.gain.value = 0;    // Complete silence in left ear
      rightGain.current.gain.value = 0.5; // Increased volume for clearer distinction
      gain.connect(rightGain.current);
    }
    
    oscillator.connect(gain);
    
    const now = audioContext.current.currentTime;
    gain.gain.setValueAtTime(0.5, now);  // Match the increased stereo volume
    gain.gain.exponentialRampToValueAtTime(0.01, now + toneDuration / 1000);
    
    oscillator.start(now);
    oscillator.stop(now + toneDuration / 1000);
  };

  const startBLS = () => {
    setPhase('active');
    setIsActive(true);
    setSetCount(0);
    setCurrentSide('left');
    animateAudio();
  };

  const animateAudio = () => {
    let movements = 0;
    let currentSideState: 'left' | 'right' = 'left';

    const playNextTone = () => {
      if (movements >= TOTAL_SETS) {
        setPhase('complete');
        setIsActive(false);
        // Auto-close immediately after completing 22 sets
        setTimeout(() => {
          onSetComplete();
        }, 500);
        return;
      }

      playTone(currentSideState);
      setCurrentSide(currentSideState);
      setSetCount(movements + 1);
      
      movements++;
      currentSideState = currentSideState === 'left' ? 'right' : 'left';

      timeoutRef.current = setTimeout(playNextTone, toneDuration + PAUSE_BETWEEN);
    };

    playNextTone();
  };

  const handleNoticeComplete = () => {
    setPhase('complete');
    onSetComplete();
  };

  const handleContinue = () => {
    setPhase('ready');
    setSetCount(0);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto p-4 min-h-screen flex flex-col justify-center">
        
        {/* Headphone Notification */}
        <div className="mb-6 bg-blue-600 text-white p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">🎧</div>
          <p className="font-semibold">Please put on headphones for the best auditory BLS experience</p>
        </div>
        
        {/* Audio BLS Visualization */}
        <div className="relative bg-slate-800 rounded-lg h-64 mb-6 overflow-hidden flex items-center justify-center">
          {/* Left Speaker */}
          <div className={`w-32 h-32 rounded-full border-4 transition-all duration-200 mr-16 ${
            isActive && currentSide === 'left' 
              ? 'border-green-400 bg-green-400/20 shadow-lg shadow-green-400/50' 
              : 'border-slate-500 bg-slate-700'
          }`}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
          </div>

          {/* Right Speaker */}
          <div className={`w-32 h-32 rounded-full border-4 transition-all duration-200 ml-16 ${
            isActive && currentSide === 'right' 
              ? 'border-green-400 bg-green-400/20 shadow-lg shadow-green-400/50' 
              : 'border-slate-500 bg-slate-700'
          }`}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          </div>

          {/* Set Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-slate-700/80 px-4 py-2 rounded-lg text-white text-center">
              <div className="text-2xl font-bold">{setCount}</div>
              <div className="text-sm text-slate-300">of {TOTAL_SETS} sets</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {phase === 'ready' && 'Ready for Auditory Bilateral Stimulation'}
              {phase === 'active' && 'Listen to the Tones'}
              {phase === 'notice' && 'What Do You Notice Now?'}
              {phase === 'complete' && 'Set Complete'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {phase === 'ready' && (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 border-blue-200 border rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-medium">
                    🎧 For the best experience and to benefit from the BLS please use headphones when using audio
                  </p>
                </div>
                <p className="text-slate-300">
                  Listen to the alternating tones in your left and right ears.
                  The set will automatically complete after {TOTAL_SETS} sets.
                </p>
                {/* Speed Controls */}
                <div className="flex items-center gap-4 justify-center mb-4">
                  <Button
                    onClick={() => setToneDuration(Math.min(500, toneDuration + 100))}
                    variant="outline"
                    size="sm"
                    className="border-slate-500 text-slate-300 hover:bg-slate-700"
                  >
                    Slower
                  </Button>
                  <span className="text-sm text-slate-400">
                    Speed: {toneDuration === 200 ? 'Fast' : toneDuration === 300 ? 'Normal' : 'Slow'}
                  </span>
                  <Button
                    onClick={() => setToneDuration(Math.max(200, toneDuration - 100))}
                    variant="outline"
                    size="sm"
                    className="border-slate-500 text-slate-300 hover:bg-slate-700"
                  >
                    Faster
                  </Button>
                </div>
                <Button
                  onClick={startBLS}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Auditory BLS Set
                </Button>
              </div>
            )}

            {phase === 'active' && (
              <div className="text-center space-y-4">
                <p className="text-slate-300">
                  Listen to the tones.
                </p>
                <div className="text-lg text-green-400">
                  Set {setCount} of {TOTAL_SETS}
                </div>
                {/* Speed Controls during active BLS */}
                <div className="flex items-center gap-4 justify-center">
                  <Button
                    onClick={() => setToneDuration(Math.min(500, toneDuration + 100))}
                    variant="outline"
                    size="sm"
                    className="border-slate-500 text-slate-300 hover:bg-slate-700"
                  >
                    Slower
                  </Button>
                  <span className="text-sm text-slate-400">
                    Speed: {toneDuration === 200 ? 'Fast' : toneDuration === 300 ? 'Normal' : 'Slow'}
                  </span>
                  <Button
                    onClick={() => setToneDuration(Math.max(200, toneDuration - 100))}
                    variant="outline"
                    size="sm"
                    className="border-slate-500 text-slate-300 hover:bg-slate-700"
                  >
                    Faster
                  </Button>
                </div>
              </div>
            )}

            {phase === 'notice' && (
              <div className="text-center space-y-6">
                <div className="text-lg text-white font-semibold">
                  What do you notice now?
                </div>
                <p className="text-slate-300 max-w-lg mx-auto leading-relaxed">
                  You might have had a memory pop up, a feeling, a change in sensation — or even nothing at all. That's okay.
                  <br /><br />
                  Whatever came up, just notice it.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleContinue}
                    variant="outline"
                    className="border-slate-500 text-slate-300 hover:bg-slate-700"
                  >
                    Continue with further bilateral stimulation
                  </Button>
                  <Button
                    onClick={handleNoticeComplete}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Move to Next Phase
                  </Button>
                </div>
              </div>
            )}

            {phase === 'complete' && (
              <div className="text-center space-y-4">
                <p className="text-green-400 font-semibold">
                  Bilateral stimulation set complete
                </p>
                <Button
                  onClick={onClose}
                  className="bg-primary-green hover:bg-primary-green/90"
                >
                  Continue Session
                </Button>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                Close BLS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}