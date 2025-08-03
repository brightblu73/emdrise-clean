import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface VisualModalProps {
  onClose: () => void;
  onSetComplete: () => void;
}

export default function VisualModal({ onClose, onSetComplete }: VisualModalProps) {
  const ballRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [setCount, setSetCount] = useState(0);
  const [speed, setSpeed] = useState(2); // 1=slow, 2=normal, 3=fast
  const [phase, setPhase] = useState<'ready' | 'active' | 'complete'>('ready');

  // Professional BLS settings
  const TOTAL_SETS = 22;
  const BALL_SIZE = 40;
  
  // Speed settings (duration per half cycle in milliseconds)
  const getSpeed = () => {
    switch(speed) {
      case 1: return 1000; // Slow
      case 2: return 700;  // Normal  
      case 3: return 500;  // Fast
      default: return 700;
    }
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
    let currentPosition = leftBound + (totalDistance / 2); // Start at center
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const cycleDuration = getSpeed();
      const progress = Math.min(elapsed / cycleDuration, 1);
      
      // Smooth easing function for natural movement
      const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
      const easedProgress = easeInOutSine(progress);
      
      if (isMovingRight) {
        // Moving from center to right
        currentPosition = leftBound + (totalDistance / 2) + (totalDistance / 2) * easedProgress;
      } else {
        // Moving from right to left
        currentPosition = rightBound - totalDistance * easedProgress;
      }
      
      // Update ball position smoothly
      ballElement.style.transform = `translate(${currentPosition - BALL_SIZE/2}px, -50%)`;
      
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
            // Auto-close after completing 22 sets
            setTimeout(() => {
              onSetComplete();
            }, 500);
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

  const adjustSpeed = (newSpeed: number) => {
    setSpeed(Math.max(1, Math.min(3, newSpeed)));
  };

  const getSpeedLabel = () => {
    switch(speed) {
      case 1: return 'Slow';
      case 2: return 'Normal';
      case 3: return 'Fast';
      default: return 'Normal';
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
          
          {/* Ball */}
          <div
            ref={ballRef}
            className={`absolute top-1/2 rounded-full transition-colors duration-200 ${
              isActive ? 'bg-white shadow-xl' : 'bg-slate-300'
            }`}
            style={{
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
                
                {/* Working Speed Controls */}
                <div className="flex items-center gap-4 justify-center">
                  <Button
                    onClick={() => adjustSpeed(speed - 1)}
                    variant="outline"
                    size="sm"
                    disabled={speed <= 1}
                    className="border-slate-500 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                  >
                    Slower
                  </Button>
                  <span className="text-sm text-slate-400 min-w-16">
                    {getSpeedLabel()}
                  </span>
                  <Button
                    onClick={() => adjustSpeed(speed + 1)}
                    variant="outline"
                    size="sm"
                    disabled={speed >= 3}
                    className="border-slate-500 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                  >
                    Faster
                  </Button>
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