import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../state/AuthProvider";
import { Eye, Brain, Sprout, Clock, Play, Heart, CheckCircle, Volume2, Apple, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { gotoAuthOrSession } from '@/utils/gotoAuthOrSession'
import mariaPortrait from "@/assets/maria-headshot.jpg";
import alistairPortrait from "@/assets/alistair-headshot.jpg";
import EMDRJourneyTimeline from "@/components/EMDRJourneyTimeline";
import EndorsementCarousel from "@/components/EndorsementCarousel";
import { Logo } from "@/components/ui/logo";

export default function Home() {
  const { user } = useAuth();
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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



  const handleStartFreeTrial = () => {
    if (!selectedTherapist) {
      alert("Please select a therapist before starting your EMDR journey.");
      return;
    }
    // Navigate to sign-in
    window.location.href = '/auth';
  };







  // Google Sign In with Supabase (simplified)
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/emdr-session`
        }
      });
      if (error) {
        console.error('Google sign in error:', error);
        alert(error.message);
      }
    } catch (error) {
      console.error('Google sign in failed:', error);
      alert('Sign in failed. Please try email sign in.');
    }
  };

  // Check Supabase authentication state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setIsLoggedIn(!!session?.user))
    return () => subscription.unsubscribe()
  }, []);



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
              {user && isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={gotoAuthOrSession}
                    size="lg" 
                    className="w-full max-w-md mx-auto py-4 text-lg font-semibold bg-white text-primary hover:bg-slate-50 whitespace-normal break-words text-center leading-snug"
                  >
                    Choose Therapist & Continue
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={gotoAuthOrSession}
                    size="lg" 
                    className="w-full py-4 text-lg font-semibold bg-white text-primary hover:bg-slate-50"
                  >
                    Start Your 7-Day Free Trial
                  </Button>

                  {/* Login to Continue Journey CTA */}
                  <Button
                    onClick={gotoAuthOrSession}
                    variant="outline"
                    size="lg" 
                    className="w-full py-4 text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary whitespace-normal break-words text-center leading-snug"
                  >
                    Choose Therapist & Continue
                  </Button>

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
                        <DialogTitle>Select Your Therapist & Continue Your Journey</DialogTitle>
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

                  <div className="text-sm text-blue-200 text-center">
                    ✓ 7-day free trial • £12.99/month after trial • ✓ Cancel anytime
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
                  <span className="text-sm">Professional EMDR therapist led video guidance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Multiple bilateral stimulation options</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Guided memory processing and calm place visualization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary-green mr-3" />
                  <span className="text-sm">Therapeutic grounding resources and aftercare support</span>
                </div>
              </div>
              <div className="pt-4">
                {/* {!isLoggedIn && ( */}
                  <Button 
                    onClick={gotoAuthOrSession}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Start Your 7-Day Free Trial
                  </Button>
                {/* )}
                {isLoggedIn && (
                  <Link href="/emdr-session">
                    <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                      Select Your Therapist & Continue Your Journey
                    </Button>
                  </Link>
                )} */}

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