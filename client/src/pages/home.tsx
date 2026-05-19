import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../state/AuthProvider";
import { useSubscription } from "../state/SubscriptionProvider";
import { Eye, Brain, Sprout, Clock, Play, Heart, CheckCircle, Volume2, Apple, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { supabase } from '@/lib/supabase';
import { gotoAuthOrSession } from '@/utils/gotoAuthOrSession'
import { apiRequest } from '@/lib/queryClient'
import { revenueCatService } from '@/lib/revenuecat';
import mariaPortrait from "@/assets/maria-headshot.jpg";
import alistairPortrait from "@/assets/alistair-headshot.jpg";
import EMDRJourneyTimeline from "@/components/EMDRJourneyTimeline";
import EndorsementCarousel from "@/components/EndorsementCarousel";
import { Logo } from "@/components/ui/logo";

export default function Home() {
  const { user, loading, userName } = useAuth();
  const { hasActiveSubscription, refreshSubscriptionStatus } = useSubscription();
  const [, setLocation] = useLocation();
  const [isVisualBLSActive, setIsVisualBLSActive] = useState(false);
  const [isAudioBLSActive, setIsAudioBLSActive] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: ""
  });
  const [selectedTherapist, setSelectedTherapist] = useState<'female' | 'male' | null>(() => {
    // Get saved therapist from localStorage
    return (localStorage.getItem('selectedTherapist') as 'female' | 'male') || null;
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);
  const [showTrialSuccessMessage, setShowTrialSuccessMessage] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const panRef = useRef<number>(-1);

  const playBeep = (panValue: number) => {
    const ctx = audioContextRef.current || new AudioContext();
    audioContextRef.current = ctx;

    const oscillator = ctx.createOscillator();
    const panNode = new StereoPannerNode(ctx, { pan: panValue });
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

    oscillator.connect(panNode).connect(gainNode).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  };

  const safeAreaConfig = async () => {
    // SafeArea.getSafeAreaInsets().then(({ insets }) => {
    //   console.log(insets);
    //   for (const [key, value] of Object.entries(insets)) {
    //     document.documentElement.style.setProperty(
    //       `--safe-area-inset-${key}`,
    //       `${value}px`,
    //     );
    //   }
    // });

    // SafeArea.getStatusBarHeight().then(({ statusBarHeight }) => {
    //   console.log(statusBarHeight, 'statusbarHeight');
    // });

    // await SafeArea.removeAllListeners();

    // // when safe-area changed
    // await SafeArea.addListener('safeAreaChanged', data => {
    //   const { insets } = data;
    //   for (const [key, value] of Object.entries(insets)) {
    //     document.documentElement.style.setProperty(
    //       `--safe-area-inset-${key}`,
    //       `${value}px`,
    //     );
    //   }
    // });
  };

  useEffect(() => {
    if (isAudioBLSActive) {
      intervalRef.current = window.setInterval(() => {
        panRef.current = -panRef.current;
        playBeep(panRef.current);
      }, 400);
      return () => clearInterval(intervalRef.current!);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isAudioBLSActive]);

  const startVisualBLS = () => {
    // Stop any other BLS first
    setIsAudioBLSActive(false);
    setIsVisualBLSActive(true);
    setTimeout(() => setIsVisualBLSActive(false), 10000); // Stop after 10 seconds
  };

  const startAudioBLS = () => {
    // Stop any other BLS first
    setIsVisualBLSActive(false);
    setIsAudioBLSActive(!isAudioBLSActive);
  };

  const startTappingBLS = () => {
    // Stop any other BLS first
    setIsVisualBLSActive(false);
    setIsAudioBLSActive(false);
    alert("Tapping instructions: Cross your arms over your chest and tap alternately, or tap your thighs with both hands alternately.");
  };



  const handleTherapistSelect = (therapist: 'female' | 'male') => {
    setSelectedTherapist(therapist);
    localStorage.setItem('selectedTherapist', therapist);
  };



  // Missing handler functions removed - keeping the more complete implementation below

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginFormData.email,
        password: loginFormData.password
      });
      if (error) {
        alert('Login failed: ' + error.message);
        return;
      }
      setLocation('/emdr-session');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleStartFreeTrial = () => {
    if (!selectedTherapist) {
      alert("Please select a guide before starting your EMDR journey.");
      return;
    }
    // Navigate to sign-in
    window.location.href = '/auth';
  };








  // Lock orientation to portrait when home page loads
  useEffect(() => {
    ScreenOrientation.lock({ orientation: 'portrait' }).catch((error) => {
      console.warn('Failed to lock orientation to portrait on home page:', error);
    });
  }, []);

  // Check URL parameters for trial success and scroll to top
  useEffect(() => {
    // Always scroll to top when homepage loads
    window.scrollTo(0, 0);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('trial_started') === 'true') {
      setShowTrialSuccessMessage(true);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    refreshSubscriptionStatus();

    safeAreaConfig();
  }, []);



  // Handle subscription flow for authenticated users
  const handleSubscriptionFlow = async () => {
    try {
      // Check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        // User not authenticated, redirect to auth
        setLocation('/auth');
        return;
      }

      setIsCreatingSubscription(true);

      // Import RevenueCat service dynamically to avoid issues
      const { revenueCatService } = await import('@/lib/revenuecat');

      // Initialize RevenueCat with the user's Supabase ID
      await revenueCatService.initialize(currentUser.id);

      // Attempt to purchase the subscription
      try {
        const customerInfo = await revenueCatService.purchaseSubscription();
        if (customerInfo.success) {
          console.log('Subscription purchase successful:', customerInfo);

          await refreshSubscriptionStatus();
          
          // Navigate to EMDR session after successful purchase
          setLocation('/emdr-session');
        } else if (customerInfo.error) {
          alert(customerInfo.error);
        }
        
      } catch (error) {
        // Handle purchase failure
        console.error('Subscription purchase failed:', error);

        // For web users, show a more helpful message
        if (error instanceof Error && error.message?.includes('native mobile app')) {
          alert('📱 Subscriptions are only available in the native EMDRise mobile app.\n\nPlease download the app from the App Store to access premium features and start your EMDR therapy journey.');
        } else {
          alert(error instanceof Error ? error.message : 'Unable to complete subscription. Please try again.');
        }
      }
    } catch (error) {
      console.error('Subscription flow error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  // Enhanced auth or subscription handler
  const handleStartTrial = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        // User is authenticated, proceed with checkout flow
        if (hasActiveSubscription) {
          setLocation('/emdr-session');
        } else {
          await handleSubscriptionFlow();
        }
      } else {
        // User not authenticated, redirect to auth
        setLocation('/auth');
      }
    } catch (error) {
      console.error('Start trial error:', error);
      setLocation('/auth');
    }
  };

  // Handle restore purchases
  const handleRestorePurchases = async () => {
    try {
      setIsRestoringPurchases(true);

      // Initialize RevenueCat if user is authenticated
      if (user) {
        await revenueCatService.initialize(user.id);
      } else {
        await revenueCatService.initialize();
      }

      // Attempt to restore purchases
      await revenueCatService.restorePurchases();

      // Refresh subscription status after restore
      await refreshSubscriptionStatus();

      // Check if restore was successful by checking current subscription status
      if (hasActiveSubscription) {
        alert('Purchases restored successfully! Your subscription is now active.');
        // Navigate to session if user is authenticated
        if (user) {
          setLocation('/emdr-session');
        }
      } else {
        alert('No active subscriptions found. If you believe this is an error, please contact support.');
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      alert('Failed to restore purchases. Please try again or contact support if the issue persists.');
    } finally {
      setIsRestoringPurchases(false);
    }
  };



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative emdr-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="ny-heading mb-6">
                Professional Self-Directed EMDR In Your Own Space
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                EMDRise guides you step by step with therapist-designed videos that provide structure, reassurance, and support whenever you need it.
              </p>
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  {showTrialSuccessMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-green-800 font-medium">🎉 Trial Started Successfully!</p>
                      <p className="text-green-700 text-sm">Your 7-day free trial is now active. Start your EMDR journey below.</p>
                    </div>
                  )}
                  <div className="text-center space-y-4">
                    {/* Welcome Message */}
                    <div className="text-white">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        {userName ? `Welcome back, ${userName}!` : 'Welcome back!'}
                      </h2>
                      <p className="text-lg sm:text-xl text-blue-100">
                        Choose Your Guide and Continue Your Healing
                      </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleStartTrial}
                        disabled={isCreatingSubscription}
                        size="lg"
                        className="w-full max-w-xs mx-auto py-4 text-lg font-semibold bg-white text-primary hover:bg-slate-50"
                      >
                        {!hasActiveSubscription ? (isCreatingSubscription ? 'Setting up your trial...' : 'Start Your 7-Day Free Trial') : 'Begin EMDR Session'}
                      </Button>

                      {!hasActiveSubscription && (
                        <>
                          <Button
                            onClick={handleRestorePurchases}
                            disabled={isRestoringPurchases}
                            size="lg"
                            className="w-full max-w-xs mx-auto py-3 text-lg font-semibold bg-white text-primary hover:bg-slate-50"
                          >
                            {isRestoringPurchases ? 'Restoring...' : 'Restore Purchases'}
                          </Button>
                          <div className="text-sm text-blue-200 text-center mt-2">
                            ✓ 7-day free trial • ✓ Cancel anytime
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleStartTrial}
                    disabled={isCreatingSubscription}
                    size="lg"
                    className="w-full py-4 text-lg font-semibold bg-white text-primary hover:bg-slate-50"
                  >
                    {isCreatingSubscription ? 'Setting up your trial...' : 'Start Your 7-Day Free Trial'}
                  </Button>
                  {/* <Button
                    onClick={handleRestorePurchases}
                    disabled={isRestoringPurchases}
                    size="lg"
                    className="w-full py-3 text-lg font-semibold bg-white text-primary hover:bg-slate-50"
                  >
                    {isRestoringPurchases ? 'Restoring...' : 'Restore Purchases'}
                  </Button> */}
                  <div className="text-sm text-blue-200 text-center mt-2">
                    ✓ 7-day free trial • ✓ Cancel anytime
                  </div>

                  {/* Login to Continue Journey CTA */}
                  <p className="text-blue-100 text-sm text-center mb-2">
                    Already signed up? Log in and continue your journey after selecting your guide.
                  </p>
                  <Button
                    onClick={handleStartTrial}
                    disabled={isCreatingSubscription}
                    size="lg"
                    className="w-full py-4 text-lg font-semibold bg-white text-primary hover:bg-slate-50 whitespace-normal break-words text-center leading-snug"
                  >
                    {isCreatingSubscription ? 'Setting up...' : 'Choose Guide & Continue'}
                  </Button>
                </div>
              )}

              <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="w-full py-4 text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
                    style={{ display: 'none' }}
                  >
                    Hidden Modal Trigger
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Your Guide & Continue Your Journey</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        setIsLoggingIn(true);
                        const { data, error } = await supabase.auth.signInWithPassword({
                          email: loginFormData.email,
                          password: loginFormData.password
                        });
                        if (error) {
                          alert('Login failed: ' + error.message);
                          return;
                        }
                        window.location.href = '/emdr-session';
                      } finally {
                        setIsLoggingIn(false);
                      }
                    }} className="space-y-3">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginFormData.email}
                          onChange={(e) => setLoginFormData(prev => ({...prev, email: e.target.value}))}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginFormData.password}
                          onChange={(e) => setLoginFormData(prev => ({...prev, password: e.target.value}))}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>


            </div>
            <div className="relative">
              <Card className="therapeutic-bg p-8 text-center">

                {/* Therapist Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
   <Card
                    className={`p-4 hover:shadow-md transition-all cursor-pointer border-2 ${selectedTherapist === 'female'
                        ? 'border-primary-green bg-primary-green/10'
                        : 'border-transparent'
                      }`}
                    onClick={() => handleTherapistSelect('female')}
                  >
                    <div className="text-center">
                      <div className="w-40 h-40 rounded-full mx-auto mb-3 overflow-hidden border-3 border-gray-200 transition-colors cursor-pointer bg-white shadow-sm">
                        <img src={mariaPortrait} alt="Maria" className="w-full h-full object-cover object-top" />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-1">Maria</h3>
                      {selectedTherapist === 'female' && (
                        <div className="mt-2">
                          <CheckCircle className="h-5 w-5 text-primary-green mx-auto" />
                        </div>
                      )}
                    </div>
                  </Card>
                  <Card
                    className={`p-4 hover:shadow-md transition-all cursor-pointer border-2 ${selectedTherapist === 'male'
                        ? 'border-secondary-blue bg-secondary-blue/10'
                        : 'border-transparent'
                      }`}
                    onClick={() => handleTherapistSelect('male')}
                  >
                    <div className="text-center">
                      <div className="w-40 h-40 rounded-full mx-auto mb-3 overflow-hidden border-3 border-gray-200 transition-colors cursor-pointer bg-white shadow-sm">
                        <img src={alistairPortrait} alt="Alistair" className="w-full h-full object-cover object-top" />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-1">Alistair</h3>
                      {selectedTherapist === 'male' && (
                        <div className="mt-2">
                          <CheckCircle className="h-5 w-5 text-secondary-blue mx-auto" />
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Note about therapist selection */}
                {!selectedTherapist && (
                  <p className="text-sm text-slate-500 mb-4">Please select a guide to continue</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* EMDR Journey Timeline */}
      <EMDRJourneyTimeline />

      {/* EMDR Endorsements */}
      <EndorsementCarousel />

      {/* Pricing & Trial - Only show if user doesn't have active subscription */}
      {!hasActiveSubscription && (
        <section className="py-20 emdr-gradient">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="ny-subheading text-white mb-6">
              Start Your Healing Journey Today
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Experience professional Self-Directed EMDR with expert therapeutic guidance
            </p>

            <Card className="max-w-lg mx-auto shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2 text-primary-blue font-bold">EMDRise Premium</CardTitle>
                {/* <div className="text-4xl font-bold text-primary mb-2">
                  £9.99<span className="text-lg text-slate-600">/month</span>
                </div> */}
                <p className="text-sm text-slate-600">7-day free trial • Cancel anytime</p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary-green mr-3 flex-shrink-0" />
                    <span className="text-sm">Full eight-phase EMDR protocol</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary-green mr-3 flex-shrink-0" />
                    <span className="text-sm">Therapist-designed video guidance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary-green mr-3 flex-shrink-0" />
                    <span className="text-sm">Choice of bilateral stimulation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary-green mr-3 flex-shrink-0" />
                    <span className="text-sm">Guided memory processing & calm place</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary-green mr-3 flex-shrink-0" />
                    <span className="text-sm">Built-in aftercare support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary-green mr-3 flex-shrink-0" />
                    <span className="text-sm">Progress tracking</span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleStartTrial}
                    disabled={isCreatingSubscription}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {isCreatingSubscription ? 'Setting up your trial...' : 'Start Your 7-Day Free Trial'}
                  </Button>
                  <Button
                    onClick={handleRestorePurchases}
                    disabled={isRestoringPurchases}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                    size="lg"
                  >
                    {isRestoringPurchases ? 'Restoring...' : 'Restore Purchases'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}



      {/* Minimal Footer */}
      <footer style={{backgroundColor: 'var(--therapeutic-bg)'}} className="border-t border-primary-blue/20 py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm text-primary-blue/80">
              © {new Date().getFullYear()} EMDRise Ltd. All rights reserved. 
              EMDRise Ltd is not a substitute for professional mental health care.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
