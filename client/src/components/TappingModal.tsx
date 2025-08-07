import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface TappingModalProps {
  onClose: () => void;
  onSetComplete: () => void;
}

export default function TappingModal({ onClose, onSetComplete }: TappingModalProps) {
  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const [isActive, setIsActive] = useState(false);
  const [setCount, setSetCount] = useState(0);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [phase, setPhase] = useState<'ready' | 'active' | 'complete' | 'notice'>('ready');

  // Session memory for speed - remembers during session, resets after session ends
  const getSessionSpeed = () => {
    const sessionSpeed = sessionStorage.getItem('blsSpeed');
    return sessionSpeed ? parseFloat(sessionSpeed) : 8.0; // Default to 8.0
  };

  // Professional BLS settings
  const TOTAL_SETS = 22;
  const [speed, setSpeed] = useState(getSessionSpeed()); // Use same 1.0-10.0 scale as visual
  const speedRef = useRef<number>(getSessionSpeed()); // Use ref for immediate access in animation

  // Speed mapping using same scale as visual BLS (1.0 to 10.0)
  const speedMap: { [key: number]: number } = {
    1.0: 4000,   // 4.0s - 15 BPM
    1.5: 3000,   // 3.0s - 20 BPM
    2.0: 2200,   // 2.2s - 27 BPM
    2.5: 1750,   // 1.75s - 34 BPM
    3.0: 1460,   // 1.46s - 41 BPM
    3.5: 1250,   // 1.25s - 48 BPM
    4.0: 1090,   // 1.09s - 55 BPM
    4.5: 970,    // 0.97s - 62 BPM
    5.0: 880,    // 0.88s - 68 BPM
    5.5: 800,    // 0.8s - 75 BPM
    6.0: 730,    // 0.73s - 82 BPM
    6.5: 670,    // 0.67s - 90 BPM
    7.0: 630,    // 0.63s - 95 BPM
    7.5: 580,    // 0.58s - 103 BPM
    8.0: 540,    // 0.54s - 111 BPM (default)
    8.5: 500,    // 0.5s - 120 BPM
    9.0: 380,    // 0.38s - 158 BPM
    9.5: 250,    // 0.25s - 240 BPM
    10.0: 150    // 0.15s - 400 BPM
  };

  const getTapDuration = (currentSpeed: number) => {
    return speedMap[currentSpeed] || 540; // Default to 8.0 speed (0.54s - 111 BPM)
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    speedRef.current = newSpeed; // Update ref immediately for animation access
    
    // Remember speed during this session
    sessionStorage.setItem('blsSpeed', newSpeed.toString());
  };

  const startBLS = () => {
    setPhase('active');
    setIsActive(true);
    setSetCount(0);
    setCurrentSide('left');
    animateTapping();
  };

  const animateTapping = () => {
    let movements = 0;
    let currentSideState: 'left' | 'right' = 'left';

    const showNextTap = () => {
      if (movements >= TOTAL_SETS) {
        setPhase('complete');
        setIsActive(false);
        // Auto-close immediately after completing 22 sets
        setTimeout(() => {
          onSetComplete();
        }, 500);
        return;
      }

      setCurrentSide(currentSideState);
      setSetCount(movements + 1);
      
      movements++;
      currentSideState = currentSideState === 'left' ? 'right' : 'left';

      timeoutRef.current = setTimeout(showNextTap, getTapDuration(speedRef.current));
    };

    showNextTap();
  };

  const handleNoticeComplete = () => {
    setPhase('complete');
    onSetComplete();
  };

  const handleContinue = () => {
    setPhase('ready');
    setSetCount(0);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset speed to default when session ends (navigating away from therapy session)
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('blsSpeed');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto p-4 min-h-screen flex flex-col justify-center">
        
        {/* Tapping BLS Visualization */}
        <div className="relative bg-slate-800 rounded-lg h-64 mb-6 overflow-hidden flex items-center justify-center">
          {/* Left Hand */}
          <div className={`w-40 h-40 rounded-lg border-4 transition-all duration-200 mr-16 flex items-center justify-center ${
            isActive && currentSide === 'left' 
              ? 'border-purple-400 bg-purple-400/20 shadow-lg shadow-purple-400/50 scale-110' 
              : 'border-slate-500 bg-slate-700'
          }`}>
            <div className="text-center">
              <div className="text-white font-bold text-2xl mb-2">👈</div>
              <span className="text-white font-semibold">Left Hand</span>
            </div>
          </div>

          {/* Right Hand */}
          <div className={`w-40 h-40 rounded-lg border-4 transition-all duration-200 ml-16 flex items-center justify-center ${
            isActive && currentSide === 'right' 
              ? 'border-purple-400 bg-purple-400/20 shadow-lg shadow-purple-400/50 scale-110' 
              : 'border-slate-500 bg-slate-700'
          }`}>
            <div className="text-center">
              <div className="text-white font-bold text-2xl mb-2">👉</div>
              <span className="text-white font-semibold">Right Hand</span>
            </div>
          </div>

          {/* Movement Counter */}
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
              {phase === 'ready' && 'Ready for Tapping Bilateral Stimulation'}
              {phase === 'active' && 'Follow the Tapping Pattern'}
              {phase === 'notice' && 'What Do You Notice Now?'}
              {phase === 'complete' && 'Set Complete'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {phase === 'ready' && (
              <div className="text-center space-y-4">
                <p className="text-slate-300">
                  Tap gently on your knees, alternating left and right hands.
                  Follow the visual cues for {TOTAL_SETS} sets.
                </p>
                <Button
                  onClick={startBLS}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start Tapping BLS Set
                </Button>
              </div>
            )}

            {phase === 'active' && (
              <div className="text-center space-y-4">
                <p className="text-slate-300">
                  Tap with your {currentSide} hand.
                </p>
                {/* Speed Slider Control */}
                <div className="space-y-3">
                  <label className="text-sm text-slate-300 text-center block">
                    Adjust Speed
                  </label>
                  <div className="px-4">
                    <Slider
                      value={[speed]}
                      onValueChange={handleSpeedChange}
                      min={1.0}
                      max={10.0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center text-sm text-slate-400">
                    Speed: {speed.toFixed(1)}
                  </div>
                </div>
                <div className="text-lg text-purple-400">
                  Tap {setCount} of {TOTAL_SETS}
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