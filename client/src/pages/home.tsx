import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Eye, Brain, Sprout, Clock, Play, Heart, CheckCircle, Volume2, Apple, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { signInWithGoogle, checkRedirectResult } from "@/lib/firebase";
import mariaPortrait from "@/assets/maria-headshot.jpg";
import alistairPortrait from "@/assets/alistair-headshot.jpg";
import EMDRJourneyTimeline from "@/components/EMDRJourneyTimeline";
import EndorsementCarousel from "@/components/EndorsementCarousel";
import { Logo } from "@/components/ui/logo";

export default function Home() {
  const { user, refetchUser, loginUser } = useAuth();
  const [, setLocation] = useLocation();
  const [isVisualBLSActive, setIsVisualBLSActive] = useState(false);
  const [isAudioBLSActive, setIsAudioBLSActive] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    email: "test@test.com",
    password: "secret"
  });
  const [selectedTherapist, setSelectedTherapist] = useState<'female' | 'male' | null>(() => {
    // Get saved therapist from localStorage
    return (localStorage.getItem('selectedTherapist') as 'female' | 'male') || null;
  });

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

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log("Attempting login with:", data);
      const response = await apiRequest("POST", "/api/login", data);
      console.log("Login response:", response);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Manually set user state for immediate UI update
      if (data.user) {
        loginUser(data.user);
      }
      setIsLoginModalOpen(false);
      setLocation("/emdr-session");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message || "Invalid email or password"}`);
    },
  });

  const handleStartFreeTrial = () => {
    if (!selectedTherapist) {
      alert("Please select a therapist before starting your EMDR journey.");
      return;
    }
    // Navigate to sign-in
    setLocation('/auth');
  };



  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginFormData.email || !loginFormData.password) {
      console.error("Please fill in both email and password");
      return;
    }
    loginMutation.mutate(loginFormData);
  };

  const handleTestLogin = () => {
    // Simulate login with test credentials
    loginMutation.mutate({
      email: "test@test.com",
      password: "secret"
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      
      if (user) {
        console.log('Google sign in successful:', user);
        console.log('User info:', {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL
        });
        
        refetchUser();
        setIsLoginModalOpen(false);
        setLocation("/emdr-session");
      }
      // If user is null, it means redirect was triggered
    } catch (error) {
      console.error('Google sign in failed:', error);
      
      // Show user-friendly error message
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('Domain not authorized')) {
        alert('This domain is not authorized for Google Sign In. Please use the TEST button or email sign in for now.');
      } else {
        alert('Sign in failed. Please try the TEST button or email sign in.');
      }
    }
  };

  // Check for redirect result on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      const user = await checkRedirectResult();
      if (user) {
        console.log('Google sign in successful (redirect):', user);
        refetchUser();
        setLocation("/emdr-session");
      }
    };
    
    handleRedirectResult();
  }, [refetchUser, setLocation]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative emdr-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="ny-heading mb-6">
                Professional EMDR Therapy
                <span className="block text-secondary-green">In Your Own Space</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Led by a therapist-designed video guide. Walking with you step by step offering structure, support, and connection when you need it most.
              </p>
              {user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/emdr-session">
                    <Button size="sm" className="bg-white text-primary hover:bg-slate-50 px-6 py-3">
                      Continue Your Journey
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={handleStartFreeTrial}
                    disabled={!selectedTherapist}
                    size="lg" 
                    className={`w-full py-4 text-lg font-semibold ${
                      selectedTherapist 
                        ? 'bg-white text-primary hover:bg-slate-50' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                    }`}
                  >
                    Start Your 7-Day Free Trial
                  </Button>

                  {/* Login to Continue Journey CTA */}
                  <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="lg" 
                        className="w-full py-4 text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
                      >
                        Log In to Continue Journey
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Log In to Continue Your Journey</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Only show if Apple is supported */}
                        {(() => {
                          const showAppleSignIn = false;
                          if (showAppleSignIn) {
                            return (
                              <Button 
                                variant="outline" 
                                className="w-full justify-start" 
                                disabled
                              >
                                <Apple className="mr-2 h-4 w-4" />
                                Sign in with Apple
                              </Button>
                            );
                          }
                          return null;
                        })()}

                        {/* Google Sign In - Currently unavailable */}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center mb-3">
                          <p className="text-sm font-medium text-blue-800">Google Sign In Coming Soon</p>
                          <p className="text-xs text-blue-600 mt-1">Use email sign in or the green TEST button below</p>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                          </div>
                        </div>

                        {/* Email Login Form */}
                        <form onSubmit={handleLogin} className="space-y-3">
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
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Signing In..." : "Sign In"}
                          </Button>
                        </form>

                        {/* TEST Button for Development - Made more prominent */}
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-center mb-2">
                            <p className="text-sm font-medium text-green-800">Quick Test Access</p>
                            <p className="text-xs text-green-600">Try the app immediately</p>
                          </div>
                          <Button 
                            onClick={handleTestLogin}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Signing In..." : "TEST - Quick Access"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {!selectedTherapist && (
                    <p className="text-sm text-blue-200 text-center">Select a therapist below to continue</p>
                  )}
                  <div className="text-sm text-blue-200 text-center">
                    ✓ 7-day free trial • ✓ £12.99/month after trial • ✓ Cancel anytime
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <Card className="therapeutic-bg p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Choose Your Therapist</h2>
                <p className="text-slate-600 mb-6">
                  Select your preferred therapist to guide your EMDR journey
                </p>

                {/* Therapist Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card 
                    className={`p-4 hover:shadow-md transition-all cursor-pointer border-2 ${
                      selectedTherapist === 'female' 
                        ? 'border-primary-green bg-green-50' 
                        : 'border-transparent hover:border-primary-green'
                    }`}
                    onClick={() => handleTherapistSelect('female')}
                  >
                    <div className="text-center">
                      <div className="w-40 h-40 rounded-full mx-auto mb-3 overflow-hidden border-3 border-gray-200 hover:border-primary-green transition-colors cursor-pointer bg-white shadow-sm">
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
                    className={`p-4 hover:shadow-md transition-all cursor-pointer border-2 ${
                      selectedTherapist === 'male' 
                        ? 'border-secondary-blue bg-blue-50' 
                        : 'border-transparent hover:border-secondary-blue'
                    }`}
                    onClick={() => handleTherapistSelect('male')}
                  >
                    <div className="text-center">
                      <div className="w-40 h-40 rounded-full mx-auto mb-3 overflow-hidden border-3 border-gray-200 hover:border-secondary-blue transition-colors cursor-pointer bg-white shadow-sm">
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
                  <p className="text-sm text-slate-500 mb-4">Please select a therapist to continue</p>
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

      {/* Pricing & Trial - Always show regardless of user status */}
      <section className="py-20 emdr-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="ny-subheading text-white mb-6">
            Start Your Healing Journey Today
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Experience professional EMDR therapy with expert therapeutic guidance
          </p>

          <Card className="max-w-lg mx-auto shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">EMDRise Premium</CardTitle>
              <div className="text-4xl font-bold text-primary mb-2">
                £12.99<span className="text-lg text-slate-600">/month</span>
              </div>
              <p className="text-sm text-slate-600">7-day free trial • Cancel anytime</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Complete eight phase EMDR protocol</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Professional therapist video guidance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Multiple bilateral stimulation options</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Session notes and progress tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Therapeutic resources and support</span>
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={handleStartFreeTrial}
                  disabled={!selectedTherapist}
                  className={`w-full ${
                    selectedTherapist 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                  }`}
                  size="lg"
                >
                  {selectedTherapist ? "Start Free Trial" : "Select Therapist Above"}
                </Button>
                <p className="text-xs text-slate-500 mt-2">No credit card required for trial</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} EMDRise. All rights reserved. 
              EMDRise is not a substitute for professional mental health care.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}