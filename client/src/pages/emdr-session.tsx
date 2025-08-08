import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEMDRSession } from "@/hooks/use-emdr-session";
import { useAuth } from "@/hooks/use-auth";
import EMDRVideoPlayer from "@/components/emdr-video-player";
import BilateralStimulation from "@/components/bilateral-stimulation";
import BLSOptionBox from "@/components/BLSOptionBox";
import TherapistSelector from "@/components/therapist-selector";
import CalmPlaceSetup from "@/components/calm-place-setup";
import TargetMemorySetup from "@/components/target-memory-setup";
import { Brain, ArrowRight, Clock, RotateCcw, Save, Star, ArrowLeft, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function EMDRSession() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  
  const {
    currentSession,
    isLoading,
    canAdvance: hookCanAdvance,
    scriptInfo,
    isVideoCompleted,
    setIsVideoCompleted,
    startSession,
    advanceScript,
    saveProgress,
    updateSession,
    pauseSession,
    isStartingSession,
    isAdvancing,
    updateCurrentScript,
  } = useEMDRSession();

  // Remove voice-over feature as it was not requested

  // Local canAdvance logic that ensures continue button works per amendments
  const canAdvance = hookCanAdvance || isVideoCompleted;

  const [sessionNotes, setSessionNotes] = useState("");
  const [sudsRating, setSudsRating] = useState([5]);
  const [vocRating, setVocRating] = useState([4]);
  const [showBLS, setShowBLS] = useState(false);
  const [userInput, setUserInput] = useState<any>({});
  const [blsType, setBLSType] = useState<'visual' | 'auditory' | 'tapping'>('visual');
  const [bodyScanStep, setBodyScanStep] = useState<'scanning' | 'disturbance' | 'clearing' | 'complete'>('scanning');
  const [localVideoCompleted, setLocalVideoCompleted] = useState(false);
  const [disturbanceLevel, setDisturbanceLevel] = useState([0]);
  const [selectedTherapist, setSelectedTherapist] = useState<'female' | 'male' | null>(null);
  const [isSetupPhase, setIsSetupPhase] = useState(false);
  const [setupStep, setSetupStep] = useState<'therapist' | 'calm-place' | 'target' | 'complete'>('therapist');

  // Client-side fix to prevent duplicate EMDR script blocks
  useEffect(() => {
    const cleanupDuplicates = () => {
      const scripts = document.querySelectorAll('.emdr-script');
      if (scripts.length > 1) {
        // Keep only the first visible script block
        for (let i = 1; i < scripts.length; i++) {
          scripts[i].remove();
        }
        console.log('Duplicate EMDR script removed');
      }
    };

    // Run cleanup on mount and periodically
    cleanupDuplicates();
    const interval = setInterval(cleanupDuplicates, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Debug: Log session state changes
  useEffect(() => {
    if (currentSession) {
      console.log('EMDR Session State:', {
        script: currentSession.currentScript,
        status: currentSession.status,
        // These properties may exist on frontend-only sessions stored in localStorage
        pausedFromScript: (currentSession as any).pausedFromScript,
        pausedAt: (currentSession as any).pausedAt
      });
    }
  }, [currentSession]);
  
  // Auto-start session if therapist is selected and user is authenticated
  useEffect(() => {
    const isFromHomepage = !currentSession; // If no current session, we're coming from homepage
    
    // Simple detection using the pause flag
    const pauseFlag = localStorage.getItem('emdrPauseFlag');
    const pausedSession = localStorage.getItem('pausedEMDRSession');
    const hasPausedSession = pauseFlag === 'true' || pausedSession;
    
    console.log("Checking for paused session - pauseFlag:", pauseFlag, "pausedSession:", !!pausedSession);
    
    if (hasPausedSession && selectedTherapist && user && isFromHomepage) {
      console.log("Found paused session, triggering startSession to resume at Script 5a");
      startSession();
      return;
    }
    
    if (selectedTherapist && !currentSession && !isLoading && !isStartingSession && user && !hasPausedSession) {
      console.log("Auto-starting new session with therapist:", selectedTherapist);
      startSession();
    }
  }, [selectedTherapist, currentSession, isLoading, isStartingSession, user]);

  // Use the therapist selected from localStorage, or default to Alistair if none selected
  useEffect(() => {
    const savedTherapist = localStorage.getItem('selectedTherapist') as 'female' | 'male' | null;
    if (!savedTherapist) {
      const defaultTherapist = 'male'; // Default to Alistair only if none selected
      setSelectedTherapist(defaultTherapist);
      localStorage.setItem('selectedTherapist', defaultTherapist);
      console.log('No therapist selected, defaulting to:', defaultTherapist);
    } else {
      setSelectedTherapist(savedTherapist);
      console.log('Using saved therapist selection:', savedTherapist);
    }
  }, []);

  // Redirect to login if user is not authenticated - simplified logic
  useEffect(() => {
    if (!user && !isLoading) {
      console.log("User not authenticated, redirecting to auth");
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  // Scroll to top when script changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSession?.currentScript]);

  // Reset BLS when script changes
  useEffect(() => {
    setShowBLS(false);
    if (currentSession?.currentScript === 8) {
      setBodyScanStep('scanning');
    }
  }, [currentSession?.currentScript]);

  // New script mapping for 10-script sequence with therapist-specific videos
  const getScriptInfo = (scriptNumber: number | string) => {
    const therapistPrefix = selectedTherapist === 'female' ? 'maria' : 'alistair';
    console.log(`Getting script info for Script ${scriptNumber}, selectedTherapist: ${selectedTherapist}, prefix: ${therapistPrefix}`);
    const scripts: Record<string | number, { title: string; phase: string; videoUrl: string; needsSetup?: boolean; hasBLS?: boolean; isLoop?: boolean; description?: string }> = {
      1: { 
        title: "Welcome & Introduction to EMDR", 
        phase: "introduction", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script1-welcome.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script1-welcome.mp4',
        needsSetup: true 
      },
      2: { 
        title: "Setting up your Calm Place", 
        phase: "calm_place_setup", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script2-calmplace.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script2-calmplace.mp4',
        needsSetup: true 
      },
      3: { 
        title: "Setting up the Target Memory", 
        phase: "target_setup", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script3-target.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script3-target.mp4',
        needsSetup: true 
      },
      4: { 
        title: "Desensitization and Reprocessing", 
        phase: "desensitization_setup", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script4-reprocessing.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script4-reprocessing.mp4',
        needsSetup: true 
      },
      5: { 
        title: "Reprocessing", 
        phase: "reprocessing", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script5-reprocessing-continued.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script5-reprocessing-continued.mp4',
        hasBLS: true, 
        description: "Bilateral stimulation and reprocessing" 
      },
      '5a': { 
        title: "Continue Reprocessing After an Incomplete Session", 
        phase: "reprocessing_resumption", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script5a-continue-reprocessing.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script5a-continue-reprocessing.mp4',
        hasBLS: true, 
        description: "Resuming interrupted reprocessing session" 
      },
      6: { 
        title: "Installation of Positive Belief", 
        phase: "installation", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script6-installation.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script6-installation.mp4',
        hasBLS: true 
      },
      7: { 
        title: "Installation Continued", 
        phase: "installation_continued", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script7-installation-continued.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script7-installation-continued.mp4',
        hasBLS: true, 
        isLoop: true 
      },
      8: { 
        title: "Body Scan", 
        phase: "body_scan", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script8-body-scan.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script8-body-scan.mp4',
        hasBLS: true, 
        description: "Scanning for remaining disturbance in the body" 
      },
      9: { 
        title: "Calm Place Return", 
        phase: "calm_place_return", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script9-calm-place.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script9-calm-place.mp4',
        needsSetup: true 
      },
      10: { 
        title: "Aftercare", 
        phase: "aftercare", 
        videoUrl: therapistPrefix === 'maria' 
          ? 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//maria-script10-aftercare.mp4'
          : 'https://jxhjghgectlpgrpwpkfd.supabase.co/storage/v1/object/public/videos//alistair-script10-aftercare.mp4'
      }
    };
    const scriptInfo = scripts[scriptNumber] || scripts[1];
    console.log(`Script ${scriptNumber} info:`, scriptInfo);
    return scriptInfo;
  };

  // Helper function to determine if BLS should be available  
  const isBLSPhase = () => {
    if (!currentSession) return false;
    const script = currentSession.currentScript;
    // BLS available in: Scripts 4, 5, 5a, 6, 7, 8 (Reprocessing, Installation, Body Scan)
    return ['4', '5', '5a', '6', '7', '8'].includes(String(script));
  };

  // Therapist selection handler
  const handleTherapistSelect = (therapist: 'female' | 'male') => {
    setSelectedTherapist(therapist);
    localStorage.setItem('selectedTherapist', therapist);
  };

  // Helper function to go back to previous script - optimized with debouncing
  const goBackToPreviousScript = () => {
    if (!currentSession || !updateCurrentScript || updateCurrentScript.isPending) return;
    const currentScript = currentSession.currentScript;
    const previousScript = Math.max(1, currentScript - 1);
    updateCurrentScript.mutate({ sessionId: currentSession.id, scriptNumber: previousScript });
  };

  // Helper function to get phase-specific instructions
  const getBLSInstructions = () => {
    if (!currentSession) return "";
    const script = currentSession.currentScript;
    switch (String(script)) {
      case "4": return "Preparing for bilateral stimulation and reprocessing.";
      case "5": return "Continue BLS while focusing on the memory. Notice what comes up.";
      case "5a": return "Resume BLS processing from where you left off in your previous session.";
      case "6": return "Use BLS while holding both the memory and positive belief together.";
      case "7": return "Continue strengthening the positive belief with BLS.";
      case "8": return "Scan your body. If you notice disturbance, use BLS to clear it.";
      default: return "";
    }
  };

  const handleBLSComplete = () => {
    setShowBLS(false);
    
    // Automatic looping behavior for loop scripts
    if (currentSession) {
      if (String(currentSession.currentScript) === "4") {
        // After Script 4 (Reprocessing) → automatically go to Script 5 (Reprocessing Continued) 
        advanceScript(false);
        return;
      }
      
      if (String(currentSession.currentScript) === "5a") {
        // After Script 5a (Resume Reprocessing) → return to Script 5 (Reprocessing Continued)
        updateCurrentScript.mutate({ sessionId: currentSession.id, scriptNumber: 5 });
        return;
      }
      
      if (String(currentSession.currentScript) === "6") {
        // After Script 6 (Installation) → automatically go to Script 7 (Installation Continued)
        advanceScript(false);
        return;
      }
    }
    
    // Special handling for body scan phase
    if (currentSession?.currentScript === 8 && bodyScanStep === 'clearing') {
      setBodyScanStep('scanning');
    }
  };

  const handleDisturbanceDetected = () => {
    setBodyScanStep('disturbance');
  };

  const handleStartDisturbanceClearing = () => {
    setBodyScanStep('clearing');
    setShowBLS(true);
  };

  const handleBodyScanComplete = () => {
    setBodyScanStep('complete');
  };

  const handleVideoComplete = () => {
    setIsVideoCompleted(true);
    setLocalVideoCompleted(true);
    
    // Auto-save progress when video completes
    if (currentSession) {
      saveProgress({
        sessionId: currentSession.id,
        scriptNumber: currentSession.currentScript,
        userInput: { sudsRating: sudsRating[0], vocRating: vocRating[0], ...userInput },
        notes: sessionNotes,
      });
    }
  };

  const handleVideoClose = () => {
    // Allow users to close video at any time - they can continue with the session
    setIsVideoCompleted(true);
    setLocalVideoCompleted(true);
  };

  const handleAdvanceScript = () => {
    if (!currentSession || isAdvancing) return; // Prevent double-clicks
    
    // Special handling for Script 10 - Complete Session and return to homepage
    if (currentSession.currentScript === 10) {
      console.log("Session completed, redirecting to homepage");
      // Clear active session but do NOT clear paused session if it exists
      localStorage.removeItem('emdrSession');
      setLocation("/"); // Navigate to homepage
      return;
    }
    
    // Save current progress before advancing (but don't wait for response)
    saveProgress({
      sessionId: currentSession.id,
      scriptNumber: currentSession.currentScript,
      userInput: { sudsRating: sudsRating[0], vocRating: vocRating[0], ...userInput },
      notes: sessionNotes,
    });
    
    // Update session with ratings (async, don't wait)
    updateSession({
      sessionId: currentSession.id,
      updates: {
        sudsRating: sudsRating[0],
        vocRating: vocRating[0],
        notes: sessionNotes,
      },
    });
    
    // Advance to next script immediately
    advanceScript(false);
    
    // Clear notes for next script
    setSessionNotes("");
    setUserInput({});
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      introduction: "bg-blue-100 text-blue-800",
      target_setup: "bg-purple-100 text-purple-800", 
      desensitisation_setup: "bg-orange-100 text-orange-800",
      processing: "bg-red-100 text-red-800",
      installation: "bg-green-100 text-green-800",
      body_scan: "bg-indigo-100 text-indigo-800",
      closure: "bg-gray-100 text-gray-800",
    };
    return colors[phase] || "bg-gray-100 text-gray-800";
  };

  // Handlers for new setup phases

  const handleCalmPlaceComplete = (calmPlaceId: number) => {
    // Advance to next script after calm place setup
    if (currentSession) {
      console.log("Calm place completed, advancing script...");
      advanceScript(false);
    }
  };

  const handleTargetMemoryComplete = (targetId: number) => {
    // Advance to next script after target memory setup
    if (currentSession) {
      console.log("Target memory completed, advancing script...");
      advanceScript(false);
    }
  };

  const requiresRatings = false; // No generic ratings needed - custom interfaces handle their own
  const allowsBLS = currentSession && [4, 5, 6, 7, 8].includes(currentSession.currentScript); // Keep as numbers for this variable
  const currentScriptInfo = currentSession ? getScriptInfo(currentSession.currentScript) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary-green mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-slate-600">Loading your EMDR session...</p>
        </div>
      </div>
    );
  }

  // Skip authentication check for now - move directly to therapist selection
  // The user should always see therapist selection first, regardless of auth status

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-4xl mx-auto px-4 py-8" key={`session-${currentSession?.id}-script-${currentSession?.currentScript}`}>
        {/* Remove main header completely - page titles shown in video component only per amendments */}

        {/* Navigation Bar - Back to Previous Step for all scripts except Script 1 */}
        <div className="flex items-center justify-between mb-6">
          {currentSession && (currentSession.currentScript > 1 || String(currentSession.currentScript) === "5a") ? (
            <Button 
              onClick={goBackToPreviousScript}
              disabled={updateCurrentScript?.isPending}
              variant="outline" 
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {updateCurrentScript?.isPending ? "Loading..." : "Back to Previous Step"}
            </Button>
          ) : (
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          )}
        </div>

        {/* Force direct access to EMDR session - bypass therapist selection */}
        {!currentSession ? (
          <div className="space-y-8">
            <div className="text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <Brain className="h-12 w-12 text-primary-green mx-auto mb-4 animate-pulse" />
                  <p className="text-lg text-slate-600">
                    Starting your EMDR session with {selectedTherapist === 'female' ? 'Maria' : 'Alistair'}...
                  </p>
                  {isStartingSession && (
                    <p className="text-sm text-slate-500 mt-2">Please wait while we prepare your session...</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-8 emdr-script">
            {/* Setup Phase - Special handling for Scripts 1, 2, 3 */}
            {currentScriptInfo?.needsSetup && currentSession.currentScript === 1 && (
              <div className="space-y-6">
                {/* Introduction Video */}
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo.title}
                  description="Your therapist introduces EMDR therapy and what to expect in your session."
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* Always show BLS Testing and Headphone Advice - regardless of video completion */}
                <div className="space-y-8">
                  {/* Headphone advice */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6 text-center">
                      <h4 className="text-lg font-semibold text-blue-800 mb-2">Important: Use Headphones</h4>
                      <p className="text-blue-700">
                        For the best EMDR experience, please use headphones or earbuds. This ensures proper stereo audio bilateral stimulation that alternates between your left and right ears.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Test Bilateral Stimulation</h3>
                    <p className="text-slate-600 mb-6">Try each method to find what works best for you during processing</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <BLSOptionBox
                        type="visual"
                        onClick={() => {
                          setShowBLS(true);
                          setBLSType('visual');
                        }}
                        isSelected={blsType === 'visual'}
                        size="medium"
                      />
                      
                      <BLSOptionBox
                        type="auditory"
                        onClick={() => {
                          setShowBLS(true);
                          setBLSType('auditory');
                        }}
                        isSelected={blsType === 'auditory'}
                        size="medium"
                      />
                      
                      <BLSOptionBox
                        type="tapping"
                        onClick={() => {
                          setShowBLS(true);
                          setBLSType('tapping');
                        }}
                        isSelected={blsType === 'tapping'}
                        size="medium"
                      />
                    </div>

                    {showBLS && (
                      <div className="mb-8">
                        <BilateralStimulation 
                          isActive={showBLS}
                          onComplete={() => setShowBLS(false)}
                          blsType={blsType}
                        />
                      </div>
                    )}
                  </div>

                  {/* Continue button only - removed Skip Introduction per user request */}
                  <div className="flex justify-center items-center">
                    <Button 
                      onClick={handleAdvanceScript}
                      disabled={isAdvancing}
                      className="bg-primary-green hover:bg-primary-green/90"
                      size="lg"
                    >
                      {isAdvancing ? "Loading..." : "Continue to Calm Place Setup"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Script 2: Calm Place Setup */}
            {currentScriptInfo?.needsSetup && currentSession.currentScript === 2 && (
              <div className="space-y-6">
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo.title}
                  description="Set up your safe, calm place for grounding during and after processing."
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* Always show calm place setup form after video or if video was watched */}
                <CalmPlaceSetup 
                  sessionId={currentSession.id}
                  onComplete={handleCalmPlaceComplete}
                  onBack={() => {
                    // Go back to Script 1 (Welcome)
                    updateCurrentScript.mutate({ sessionId: currentSession.id, scriptNumber: 1 });
                  }}
                />
              </div>
            )}

            {/* Script 3: Target Memory Setup */}
            {currentScriptInfo?.needsSetup && currentSession.currentScript === 3 && (
              <div className="space-y-6">
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo.title}
                  description="Identifying the target memory to be reprocessed"
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* Always show target memory setup form after video or if video was watched */}
                <TargetMemorySetup 
                  sessionId={currentSession.id}
                  onComplete={handleTargetMemoryComplete}
                  onBack={() => {
                    // Go back to Script 2 (Calm Place Setup)
                    updateCurrentScript.mutate({ sessionId: currentSession.id, scriptNumber: 2 });
                  }}
                />
              </div>
            )}

            {/* Script 4: Desensitisation and Reprocessing - BLS Setup */}
            {currentSession.currentScript === 4 && (
              <div className="space-y-6">
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo?.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo?.title || "Desensitisation and Reprocessing"}
                  description={currentScriptInfo?.description || "Preparing for bilateral stimulation and reprocessing"}
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* BLS Testing Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">ℹ</div>
                    <h3 className="text-lg font-semibold text-blue-800">Important: Use Headphones</h3>
                  </div>
                  <p className="text-blue-700 mb-6">
                    For proper bilateral stimulation, please ensure you're wearing headphones or earbuds. 
                    This ensures the stereo audio stimulation works correctly.
                  </p>
                  
                  <p className="text-blue-700 mb-4 font-semibold">
                    Choose your preferred method of bilateral stimulation:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <BLSOptionBox
                      type="visual"
                      onClick={() => setBLSType('visual')}
                      isSelected={blsType === 'visual'}
                      size="large"
                    />
                    
                    <BLSOptionBox
                      type="auditory"
                      onClick={() => setBLSType('auditory')}
                      isSelected={blsType === 'auditory'}
                      size="large"
                    />
                    
                    <BLSOptionBox
                      type="tapping"
                      onClick={() => setBLSType('tapping')}
                      isSelected={blsType === 'tapping'}
                      size="large"
                    />
                  </div>
                </div>

                {/* BLS Component - Only show when activated via Start Reprocessing */}
                {showBLS && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                    <BilateralStimulation
                      isActive={showBLS}
                      onComplete={() => {
                        setShowBLS(false);
                        // After completing BLS on Script 4, auto-advance to Script 5
                        if (currentSession && currentSession.currentScript === 4) {
                          advanceScript(true);
                        }
                      }}
                      onSetComplete={() => {
                        setShowBLS(false);
                        // After completing BLS on Script 4, auto-advance to Script 5  
                        if (currentSession && currentSession.currentScript === 4) {
                          advanceScript(true);
                        }
                      }}
                      blsType={blsType}
                    />
                  </div>
                )}

                {/* Processing Control Button - Single green button */}
                <div className="flex justify-center items-center">
                  <Button
                    onClick={async () => {
                      // Start reprocessing - activate BLS and will auto-advance to Script 5
                      setShowBLS(true);
                      if (currentSession) {
                        updateSession({
                          sessionId: currentSession.id,
                          updates: {
                            notes: sessionNotes,
                          },
                        });
                      }
                    }}
                    size="lg"
                    className="bg-primary-green hover:bg-primary-green/90"
                  >
                    Continue to Start Reprocessing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Script 5: Reprocessing Continued - Looping BLS */}
            {currentSession.currentScript === 5 && String(currentSession.currentScript) !== "5a" && (
              <div className="space-y-6">
                {/* Always show video for Script 5 - keep visible throughout processing */}
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo?.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo?.title || "Reprocessing Continued"}
                  description={currentScriptInfo?.description || "Continue bilateral stimulation processing with what you notice now"}
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* BLS Processing with "What do you notice now?" prompts - always show */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">Processing Phase</h4>
                  <p className="text-amber-700 mb-4">
                    Continue with bilateral stimulation. After each set, notice what comes up and share if needed.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <BLSOptionBox
                      type="visual"
                      onClick={() => setBLSType('visual')}
                      isSelected={blsType === 'visual'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="auditory"
                      onClick={() => setBLSType('auditory')}
                      isSelected={blsType === 'auditory'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="tapping"
                      onClick={() => setBLSType('tapping')}
                      isSelected={blsType === 'tapping'}
                      size="medium"
                    />
                  </div>

                  {/* BLS Component - Only show when activated via Continue Reprocessing */}
                  {showBLS && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                      <BilateralStimulation
                        isActive={showBLS}
                        onComplete={() => setShowBLS(false)}
                        onSetComplete={() => setShowBLS(false)}
                        blsType={blsType}
                      />
                    </div>
                  )}

                  {/* SUDS Rating for Script 5 */}
                  <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-center mb-3">
                      <Star className="mr-2 h-5 w-5 text-amber-600" />
                      <h5 className="font-semibold text-amber-800">SUDS Rating</h5>
                    </div>
                    <p className="text-sm text-amber-700 mb-3">
                      Rate your distress level (0 = no distress, 10 = highest distress)
                    </p>
                    <div className="space-y-2">
                      <Slider
                        value={sudsRating}
                        onValueChange={setSudsRating}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary-green">{sudsRating[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing Control Buttons */}
                <div className="space-y-3">
                  <div className="flex justify-center items-center mb-2">
                    <Button
                      onClick={async () => {
                        // Continue reprocessing - activate BLS and stay on Script 5
                        setShowBLS(true);
                        if (currentSession) {
                          updateSession({
                            sessionId: currentSession.id,
                            updates: {
                              sudsRating: sudsRating[0],
                              notes: sessionNotes,
                            },
                          });
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800 text-xs px-4 py-2"
                    >
                      Continue Reprocessing
                    </Button>
                  </div>

                  <div className="flex justify-center items-center space-x-3">
                    <Button
                      onClick={async () => {
                        // Pause reprocessing - save state and jump to Script 9 for safe closure
                        pauseSession();
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-800 text-xs px-3 py-2"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Pause Reprocessing
                    </Button>

                    <Button
                      onClick={async () => {
                        // Complete reprocessing - advance to installation phase
                        if (currentSession) {
                          updateSession({
                            sessionId: currentSession.id,
                            updates: {
                              sudsRating: sudsRating[0],
                              notes: sessionNotes,
                            },
                          });
                          advanceScript(true); // Force next phase
                        }
                      }}
                      variant="default"
                      size="sm"
                      disabled={isAdvancing}
                      className="bg-primary-green hover:bg-primary-green/90 text-xs px-3 py-2"
                    >
                      {isAdvancing ? "Processing..." : "Finished Processing"}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Script 5a: Resume Reprocessing After Incomplete Session */}
            {String(currentSession.currentScript) === "5a" && (
              <div className="space-y-6">
                {/* Video for Script 5a */}
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo?.videoUrl || "/videos/maria-script5a-resume-reprocessing.mp4"}
                  title={currentScriptInfo?.title || "Continue Reprocessing After an Incomplete Session"}
                  description={currentScriptInfo?.description || "Resume reprocessing from where you left off in your previous session"}
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* Resume Processing Info */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-800 mb-4">Resume Processing Phase</h4>
                  <p className="text-purple-700 mb-4">
                    Welcome back. Let's continue your reprocessing from where you left off in your previous session.
                  </p>
                </div>

                {/* BLS Controls for Script 5a - Since it's a reprocessing continuation */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-4">Bilateral Stimulation</h4>
                  <p className="text-red-700 mb-4">
                    Resume BLS processing from where you left off in your previous session.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <BLSOptionBox
                      type="visual"
                      onClick={() => setBLSType('visual')}
                      isSelected={blsType === 'visual'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="auditory"
                      onClick={() => setBLSType('auditory')}
                      isSelected={blsType === 'auditory'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="tapping"
                      onClick={() => setBLSType('tapping')}
                      isSelected={blsType === 'tapping'}
                      size="medium"
                    />
                  </div>

                  {/* BLS Component - Only show when activated */}
                  {showBLS && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                      <BilateralStimulation
                        isActive={showBLS}
                        onComplete={() => {
                          setShowBLS(false);
                          // After completing BLS on Script 5a, auto-advance to Script 5
                          if (currentSession && String(currentSession.currentScript) === "5a") {
                            advanceScript(true);
                          }
                        }}
                        onSetComplete={() => {
                          setShowBLS(false);
                          // After completing BLS on Script 5a, auto-advance to Script 5  
                          if (currentSession && String(currentSession.currentScript) === "5a") {
                            advanceScript(true);
                          }
                        }}
                        blsType={blsType}
                      />
                    </div>
                  )}

                  {/* BLS Activation Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setShowBLS(!showBLS)}
                      variant={showBLS ? "destructive" : "default"}
                      size="lg"
                      className={showBLS ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                    >
                      {showBLS ? "Stop BLS" : "Start BLS Processing"}
                    </Button>
                  </div>


                </div>
              </div>
            )}

            {/* Script 6: Installation of Positive Belief */}
            {currentSession.currentScript === 6 && (
              <div className="space-y-6">
                {/* Always show video for Script 6 - keep visible throughout processing */}
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo?.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo?.title || "Installation of Positive Belief"}
                  description={currentScriptInfo?.description || "Strengthening positive beliefs and new neural pathways"}
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* BLS Processing with installation focus - always show */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">Installation Phase</h4>
                  <p className="text-green-700 mb-4">
                    Use bilateral stimulation to strengthen positive beliefs and new neural pathways.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <BLSOptionBox
                      type="visual"
                      onClick={() => setBLSType('visual')}
                      isSelected={blsType === 'visual'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="auditory"
                      onClick={() => setBLSType('auditory')}
                      isSelected={blsType === 'auditory'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="tapping"
                      onClick={() => setBLSType('tapping')}
                      isSelected={blsType === 'tapping'}
                      size="medium"
                    />
                  </div>

                  {/* BLS Component - Only show when activated via Begin Installation */}
                  {showBLS && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                      <BilateralStimulation
                        isActive={showBLS}
                        onComplete={() => {
                          setShowBLS(false);
                          // After completing or closing first installation BLS, advance to Script 7
                          if (currentSession && currentSession.currentScript === 6) {
                            advanceScript(true);
                          }
                        }}
                        onSetComplete={() => {
                          setShowBLS(false);
                          // After completing or closing first installation BLS, advance to Script 7
                          if (currentSession && currentSession.currentScript === 6) {
                            advanceScript(true);
                          }
                        }}
                        blsType={blsType}
                      />
                    </div>
                  )}

                  {/* VOC Rating for Script 6 */}
                  <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center mb-3">
                      <Star className="mr-2 h-5 w-5 text-green-600" />
                      <h5 className="font-semibold text-green-800">VOC Rating</h5>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      Rate how true your positive belief feels (1 = completely false, 7 = completely true)
                    </p>
                    <div className="space-y-2">
                      <Slider
                        value={vocRating}
                        onValueChange={setVocRating}
                        min={1}
                        max={7}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary-green">{vocRating[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Installation Control Buttons */}
                <div className="flex justify-center items-center">
                  <Button
                    onClick={async () => {
                      // Begin installation - activate BLS for Script 6
                      setShowBLS(true);
                      if (currentSession) {
                        updateSession({
                          sessionId: currentSession.id,
                          updates: {
                            vocRating: vocRating[0],
                            notes: sessionNotes,
                          },
                        });
                      }
                    }}
                    size="lg"
                    className="bg-primary-green hover:bg-primary-green/90"
                  >
                    Begin Installation
                  </Button>
                </div>
              </div>
            )}

            {/* Script 7: Installation of Positive Belief Continued - Script 5 Layout with VOC */}
            {currentSession.currentScript === 7 && (
              <div className="space-y-6">
                {/* Always show video for Script 7 - keep visible throughout processing */}
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo?.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo?.title || "Installation Continued"}
                  description={currentScriptInfo?.description || "Continue installation with bilateral stimulation and positive belief strengthening"}
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* BLS Processing with installation continuation focus - same layout as Script 5 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">Installation Continued</h4>
                  <p className="text-green-700 mb-4">
                    Continue with bilateral stimulation to strengthen positive beliefs. After each set, notice what comes up.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <BLSOptionBox
                      type="visual"
                      onClick={() => setBLSType('visual')}
                      isSelected={blsType === 'visual'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="auditory"
                      onClick={() => setBLSType('auditory')}
                      isSelected={blsType === 'auditory'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="tapping"
                      onClick={() => setBLSType('tapping')}
                      isSelected={blsType === 'tapping'}
                      size="medium"
                    />
                  </div>

                  {/* BLS Component - Only show when activated via Continue Installation */}
                  {showBLS && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                      <BilateralStimulation
                        isActive={showBLS}
                        onComplete={() => setShowBLS(false)}
                        onSetComplete={() => setShowBLS(false)}
                        blsType={blsType}
                      />
                    </div>
                  )}

                  {/* VOC Rating for Script 7 (instead of SUDS) */}
                  <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center mb-3">
                      <Star className="mr-2 h-5 w-5 text-green-600" />
                      <h5 className="font-semibold text-green-800">VOC Rating</h5>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      Rate how true your positive belief feels (1 = completely false, 7 = completely true)
                    </p>
                    <div className="space-y-2">
                      <Slider
                        value={vocRating}
                        onValueChange={setVocRating}
                        min={1}
                        max={7}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary-green">{vocRating[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Installation Control Buttons - same layout as Script 5 */}
                <div className="space-y-3">
                  <div className="flex justify-center items-center">
                    <Button
                      onClick={async () => {
                        // Continue installation - activate BLS and stay on Script 7
                        setShowBLS(true);
                        if (currentSession) {
                          updateSession({
                            sessionId: currentSession.id,
                            updates: {
                              vocRating: vocRating[0],
                              notes: sessionNotes,
                            },
                          });
                        }
                      }}
                      variant="outline"
                      size="lg"
                      className="bg-green-50 hover:bg-green-100 border-green-300 text-green-800"
                    >
                      Continue Installation
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <Button
                      onClick={async () => {
                        // Complete installation - advance to next phase
                        if (currentSession) {
                          updateSession({
                            sessionId: currentSession.id,
                            updates: {
                              vocRating: vocRating[0],
                              notes: sessionNotes,
                            },
                          });
                          advanceScript(true); // Force next phase
                        }
                      }}
                      variant="default"
                      size="lg"
                      disabled={isAdvancing}
                      className="bg-primary-green hover:bg-primary-green/90"
                    >
                      {isAdvancing ? "Processing..." : "Finished Installation"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Script 8: Body Scan - Custom interface with integrated BLS */}
            {currentSession.currentScript === 8 && (
              <div className="space-y-6">
                {/* Always show video for Script 8 - keep visible throughout body scan */}
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo?.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo?.title || "Body Scan"}
                  description={currentScriptInfo?.description || "Scan your body for any remaining disturbance and clear with BLS"}
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* Body Scan Processing with BLS integration */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-indigo-800 mb-4">Body Scan</h4>
                  <p className="text-indigo-700 mb-4">
                    Scan your body from head to toe for any remaining sensations, tension, or disturbance. Use BLS to clear any areas that feel activated.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <BLSOptionBox
                      type="visual"
                      onClick={() => setBLSType('visual')}
                      isSelected={blsType === 'visual'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="auditory"
                      onClick={() => setBLSType('auditory')}
                      isSelected={blsType === 'auditory'}
                      size="medium"
                    />
                    
                    <BLSOptionBox
                      type="tapping"
                      onClick={() => setBLSType('tapping')}
                      isSelected={blsType === 'tapping'}
                      size="medium"
                    />
                  </div>

                  {/* BLS Component - Only show when activated */}
                  {showBLS && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                      <BilateralStimulation
                        isActive={showBLS}
                        onComplete={() => setShowBLS(false)}
                        onSetComplete={() => setShowBLS(false)}
                        blsType={blsType}
                      />
                    </div>
                  )}

                  {/* Body Scan Control Buttons */}
                  <div className="space-y-3">
                    <div className="flex justify-center items-center">
                      <Button
                        onClick={() => {
                          // Start BLS for body scan clearing
                          setShowBLS(true);
                        }}
                        variant="outline"
                        size="lg"
                        className="bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-800"
                      >
                        Clear with BLS
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <Button
                        onClick={async () => {
                          // Complete body scan - advance to closure
                          if (currentSession) {
                            advanceScript(true);
                          }
                        }}
                        variant="default"
                        size="lg"
                        disabled={isAdvancing}
                        className="bg-primary-green hover:bg-primary-green/90"
                      >
                        {isAdvancing ? "Processing..." : "Body Scan Complete"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Script 9: Calm Place Return (After Body Scan) */}
            {currentScriptInfo?.needsSetup && currentSession.currentScript === 9 && (
              <div className="space-y-6">
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo.videoUrl || "/EMDR.mp4"}
                  title={currentScriptInfo.title}
                  description="Return to your calm place for closure and grounding."
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* Calm Place Guidance - Always show regardless of video completion */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">Return to Your Calm Place</h4>
                  <div className="space-y-4 text-blue-700">
                    <p className="mb-3">
                      Take a moment to reconnect with your calm, safe place. Let yourself settle back into this peaceful space.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>See:</strong> What do you see in your calm place? Notice the colors, shapes, and visual details that make this space feel safe.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Hear:</strong> What sounds are present? Perhaps gentle nature sounds, peaceful silence, or comforting background noises.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Feel:</strong> Notice the physical sensations - the temperature, textures, and the feeling of safety in your body.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Breathe:</strong> Take slow, deep breaths and feel yourself becoming more grounded and centered in this safe space.</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
                      <p className="text-sm">
                        <strong>Reminder:</strong> This is your safe space. You can return here anytime you need comfort, grounding, or peace.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Continue Button - Centered and with proper spacing */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleAdvanceScript}
                    className="bg-primary-green hover:bg-primary-green/90"
                    size="lg"
                    disabled={isAdvancing}
                  >
                    {isAdvancing ? "Advancing..." : "Continue to Aftercare"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Script 10: Aftercare - Final Session Closure */}
            {currentSession.currentScript === 10 && (
              <div className="space-y-6">
                <EMDRVideoPlayer
                  videoUrl={currentScriptInfo?.videoUrl || "/videos/alistair-script10-aftercare.mp4"}
                  title={currentScriptInfo?.title || "Aftercare"}
                  description="Session closure and self-care guidance for after EMDR therapy."
                  onVideoComplete={handleVideoComplete}
                  isVideoCompleted={isVideoCompleted}
                  onClose={handleVideoClose}
                />
                
                {/* Aftercare Guidance - Always show regardless of video completion */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">Session Complete - Aftercare</h4>
                  <div className="space-y-4 text-green-700">
                    <p className="mb-3">
                      Congratulations on completing your EMDR session. This is an important time for self-care and integration.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Rest:</strong> Take time to rest and be gentle with yourself. Processing may continue for days after your session.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Hydrate:</strong> Drink plenty of water to support your body's natural healing processes.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Journal:</strong> Consider writing about your experience, insights, or any changes you notice.</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Support:</strong> Reach out to trusted friends, family, or professionals if you need additional support.</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-100 rounded border-l-4 border-green-400">
                      <p className="text-sm">
                        <strong>Remember:</strong> Healing is a journey. Be patient and compassionate with yourself as you integrate this experience.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Session Complete Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => {
                      // Complete the session and return to home
                      localStorage.removeItem('emdrSession');
                      localStorage.removeItem('pausedEMDRSession');
                      
                      // Reset BLS speed to default (7.0) for next session
                      sessionStorage.removeItem('blsSpeed');
                      
                      window.location.href = '/';
                    }}
                    className="bg-primary-green hover:bg-primary-green/90"
                    size="lg"
                  >
                    Complete Session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* DISABLED: Regular Processing Scripts catch-all removed to prevent duplication and TypeScript errors */}

            {/* Ratings Section */}
            {requiresRatings && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-5 w-5" />
                      VOC Rating
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      Rate how true the positive belief feels (1 = completely false, 7 = completely true)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="px-3">
                        <Slider
                          value={vocRating}
                          onValueChange={setVocRating}
                          max={7}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-secondary-blue">
                          {vocRating[0]}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-5 w-5" />
                      SUDS Rating
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      Rate your distress level (0 = no distress, 10 = highest distress)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="px-3">
                        <Slider
                          value={sudsRating}
                          onValueChange={setSudsRating}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-primary-green">
                          {sudsRating[0]}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}





            {/* Session Notes - Completely removed from Scripts 2, 3, 4, 6, 8 per amendments */}
            {currentSession?.currentScript === 1 && false && ( // Disabled - no session notes needed per amendments
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Save className="mr-2 h-5 w-5" />
                    Session Notes
                  </CardTitle>
                  <p className="text-sm text-slate-600">
                    Record your thoughts, feelings, or insights during this script.
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="What are you noticing? Any thoughts, feelings, sensations, or images?"
                    rows={4}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                {/* Remove "This script may be repeated as needed" text per amendments */}
              </div>

              <div className="flex gap-3">







                {/* DISABLED: Standard continue button to prevent extra buttons on scripts 4-8 */}
                {false && !currentScriptInfo?.needsSetup && ![4,5,'5a',6,7,8].includes(String(currentSession?.currentScript)) && (
                  <Button
                    onClick={handleAdvanceScript}
                    disabled={isAdvancing}
                    className="bg-primary-green hover:bg-primary-green/90"
                    size="lg"
                  >
                    {isAdvancing ? "Processing..." : 
                     currentSession?.currentScript === 1 ? "Continue to Calm Place Setup" :
                     currentSession?.currentScript === 10 ? "Complete Session" : "Continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}