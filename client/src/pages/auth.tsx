import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../state/AuthProvider";

import { supabase } from '@/lib/supabase';
import { Brain, Apple, Mail } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Supabase authentication handlers
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await signInWithEmail(email, password);
    if (error) {
      console.error('Login error:', error);
      alert(error.message);
      return;
    }
    setLocation("/emdr-session");
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Sign up error:', error);
      alert(error.message);
      return;
    }
    alert('Check your email to confirm your account, then sign in.');
  }





  // Google Sign In with Supabase
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

  return (
    <div className="min-h-screen flex items-center justify-center safe-space-bg">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="text-white h-8 w-8" />
          </div>
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-3xl font-bold text-slate-800 mr-1">EMDR</h1>
            <div className="flex space-x-1 mr-1">
              <div className="w-3 h-2 bg-primary rounded-full relative">
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
              <div className="w-3 h-2 bg-primary rounded-full relative">
                <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">ise</h1>
          </div>
          <p className="text-slate-600">Begin your journey to emotional freedom</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Start Your 7-Day Free Trial</CardTitle>
            <p className="text-sm text-slate-600">Choose your sign-in method</p>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm font-medium text-blue-800">Google Sign In Coming Soon</p>
              <p className="text-sm text-muted-foreground">
                Use email sign‑in for now.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email and Password Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full emdr-gradient text-white"
              >
                Sign In
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={handleSignUp}
              >
                Create Account / Start Free Trial
              </Button>
            </form>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
