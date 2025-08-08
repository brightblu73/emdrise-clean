import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface VisualModalProps {
  onClose: () => void;
  onSetComplete: () => void;
}

export default function VisualModal({ onClose, onSetComplete }: VisualModalProps) {
  const ballRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Session memory for speed - remembers during session, resets after session ends
  const getSessionSpeed = () => {
    const sessionSpeed = sessionStorage.getItem('blsSpeed');
    return sessionSpeed ? parseFloat(sessionSpeed) : 8.0; // Default to 8.0
  };
  
  const speedRef = useRef<number>(getSessionSpeed()); // Use ref for immediate access in animation
  
  const [isActive, setIsActive] = useState(false);
  const [setCount, setSetCount] = useState(0);
  const [speed, setSpeed] = useState(getSessionSpeed()); // Load session speed or default to 7.0
  const [phase, setPhase] = useState<'ready' | 'active' | 'complete'>('ready');

  // Professional BLS settings
  const TOTAL_SETS = 22;
  const BALL_SIZE = 40;
  
  // Optimized BLS speed mapping for therapeutic effectiveness
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
    7.0: 630,    // 0.63s - 95 BPM (default)
    7.5: 580,    // 0.58s - 103 BPM
    8.0: 540,    // 0.54s - 111 BPM
    8.5: 500,    // 0.5s - 120 BPM
    9.0: 380,    // 0.38s - 158 BPM
    9.5: 250,    // 0.25s - 240 BPM
    10.0: 150    // 0.15s - 400 BPM
  };

  const getSpeed = (currentSpeed: number) => {
    const timeInMs = speedMap[currentSpeed] || 630; // Default to 7.0 speed (0.63s - 95 BPM)
    // The CSV values represent time-per-pass (one direction), not full round trip
    return timeInMs;
  };

  const startBLS = () => {
    setPhase('active');
    setIsActive(true);
    setSetCount(0);
    animateBall();
  };

  const animateBall = () => {
    if (!ballRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const ballElement = ballRef.current;
    
    // Calculate movement boundaries (10% padding on each side)
    const leftBound = containerWidth * 0.1;
    const rightBound = containerWidth * 0.9;
    const totalDistance = rightBound - leftBound;
    
    let currentSet = 0;
    let isMovingRight = true;
    let startTime = Date.now();
    // Start at left position
    let lastSpeed = speedRef.current;
    
    const animate = () => {
      const now = Date.now();
      
      // Reset timing if speed changed (immediate effect)
      if (speedRef.current !== lastSpeed) {
        startTime = now;
        lastSpeed = speedRef.current;
      }
      
      const elapsed = now - startTime;
      const passDirection = getSpeed(speedRef.current); // Time for one direction (left→right or right→left)
      const progress = Math.min(elapsed / passDirection, 1);
      
      let currentPosition;
      // Linear movement for smooth, straight motion
      if (isMovingRight) {
        // Moving from left to right
        currentPosition = leftBound + (totalDistance * progress);
      } else {
        // Moving from right to left
        currentPosition = rightBound - (totalDistance * progress);
      }
      
      // Update ball position with linear motion (no easing)
      ballElement.style.transitionTimingFunction = 'linear';
      ballElement.style.transform = `translateX(${currentPosition - BALL_SIZE/2}px) translateY(-50%)`;
      
      // Check if half-cycle is complete
      if (progress >= 1) {
        if (isMovingRight) {
          // Completed right movement, now go left
          isMovingRight = false;
        } else {
          // Completed left movement, now go right - this completes one full set
          isMovingRight = true;
          currentSet++;
          setSetCount(currentSet);
          
          if (currentSet >= TOTAL_SETS) {
            setPhase('complete');
            setIsActive(false);
            // Auto-close immediately after completing 22 sets
            onSetComplete();
            return;
          }
        }
        
        startTime = now; // Reset timing for next half-cycle
      }
      
      if (currentSet < TOTAL_SETS) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    speedRef.current = newSpeed; // Update ref immediately for animation access
    
    // Remember speed during this session
    sessionStorage.setItem('blsSpeed', newSpeed.toString());
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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
        
        {/* X Close Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-700 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Visual BLS Area with Grey Background */}
        <div 
          ref={containerRef}
          className="relative bg-gray-500 rounded-lg h-64 mb-6 overflow-hidden"
        >
          {/* Center reference line */}
          <div className="absolute top-1/2 left-1/2 w-1 h-8 bg-slate-600 transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
          
          {/* Ball - Blue color as per requirements */}
          <div
            ref={ballRef}
            className={`absolute top-1/2 rounded-full transition-colors duration-200`}
            style={{
              backgroundColor: '#0C2340', // Pantone 289 blue
              boxShadow: isActive ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              width: `${BALL_SIZE}px`,
              height: `${BALL_SIZE}px`,
              transform: 'translate(50%, -50%)'
            }}
          />

          {/* Set Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-slate-800/90 px-4 py-2 rounded-lg text-white text-center">
              <div className="text-2xl font-bold">{setCount}</div>
              <div className="text-sm text-slate-300">of {TOTAL_SETS} sets</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {phase === 'ready' && 'Ready for Visual Bilateral Stimulation'}
              {phase === 'active' && 'Follow the Ball'}
              {phase === 'complete' && 'Set Complete'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {phase === 'ready' && (
              <div className="text-center space-y-4">
                <p className="text-slate-300">
                  Follow the white ball with your eyes as it moves smoothly from side to side.
                  The set will automatically complete after {TOTAL_SETS} movements.
                </p>
                <Button
                  onClick={startBLS}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Visual BLS
                </Button>
              </div>
            )}

            {phase === 'active' && (
              <div className="text-center space-y-4">
                <p className="text-slate-300">
                  Keep your head still and follow the ball with your eyes only.
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
                
                <div className="text-lg text-blue-400">
                  Set {setCount} of {TOTAL_SETS}
                </div>
              </div>
            )}

            {phase === 'complete' && (
              <div className="text-center space-y-4">
                <p className="text-green-400 font-semibold">
                  Visual bilateral stimulation set complete
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