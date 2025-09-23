import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../state/AuthProvider";

import { supabase } from '@/lib/supabase';
import { apiRequest } from '@/lib/queryClient';
import { Brain, Apple, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  // Supabase authentication handlers
  async function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    console.log('Starting sign in process for:', email);
    
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        console.error('Login error:', error);
        alert(error.message);
        return;
      }
      
      // Session established successfully
      
      // Always redirect logged-in users to homepage - no subscription checking needed
      console.log('Login successful, redirecting to homepage...');
      
      // Small delay to ensure auth state is propagated
      setTimeout(() => {
        setLocation("/");
      }, 500);
    } catch (error) {
      console.error('Login exception:', error);
      alert('Login failed. Please try again.');
    }
  }

  async function handleSignUp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    if (!agreedToTerms) {
      setShowTermsError(true);
      return;
    }
    
    setShowTermsError(false);
    console.log('Starting sign up process for:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        alert(error.message);
        return;
      }
      
      console.log('Sign up response:', data);
      
      if (data.user && !data.user.email_confirmed_at) {
        alert('Check your email to verify your account. After verification, you\'ll be redirected to complete your trial setup.');
      } else if (data.user && data.user.email_confirmed_at) {
        // User is already confirmed, redirect to auth-callback to handle Stripe
        console.log('User already confirmed, redirecting to auth-callback');
        setLocation('/auth-callback');
      }
    } catch (error) {
      console.error('Sign up exception:', error);
      alert('Sign up failed. Please try again.');
    }
  }





  // Apple Sign In with Supabase
  const handleAppleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`
        }
      });
      if (error) {
        console.error('Apple sign in error:', error);
        alert(error.message);
      }
    } catch (error) {
      console.error('Apple sign in failed:', error);
      alert('Sign in failed. Please try email sign in.');
    }
  };

  // Handle opening terms and privacy policy in WebView/in-app browser
  const openInWebView = (url: string) => {
    // For web/PWA, we'll use window.open with specific parameters to simulate in-app browser
    // In a native mobile app with Capacitor, this could be replaced with the InAppBrowser plugin
    const webViewWindow = window.open(
      url,
      'webview',
      'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no'
    );
    
    // Focus the new window
    if (webViewWindow) {
      webViewWindow.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--safe-space)'}}>
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Logo variant="hero" className="mx-auto mb-4" />
          <p className="text-slate-600">Begin your journey to emotional freedom</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Start Your 7-Day Free Trial</CardTitle>
            <p className="text-sm text-slate-600">Choose your sign-in method</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Apple Sign In */}
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleAppleSignIn}
            >
              <Apple className="mr-2 h-4 w-4" />
              Sign in with Apple
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email and Password Form */}
            <div className="space-y-4">
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

              {/* Terms Agreement Checkbox */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms-agreement"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(!!checked);
                      setShowTermsError(false);
                    }}
                    data-testid="checkbox-terms-agreement"
                    className="mt-0.5"
                  />
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <label htmlFor="terms-agreement" className="cursor-pointer">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => openInWebView('/terms-of-use')}
                        className="text-primary-blue hover:text-primary-blue/80 underline font-medium"
                        data-testid="link-terms-of-use"
                      >
                        Terms of Use
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={() => openInWebView('/privacy-policy')}
                        className="text-primary-blue hover:text-primary-blue/80 underline font-medium"
                        data-testid="link-privacy-policy"
                      >
                        Privacy Policy
                      </button>
                      .
                    </label>
                  </div>
                </div>
                {showTermsError && (
                  <p 
                    className="text-red-600 text-sm mt-1 ml-6" 
                    data-testid="error-terms-required"
                  >
                    You must agree to the Terms of Use and Privacy Policy to continue.
                  </p>
                )}
              </div>

              {/* Create Account / Start Free Trial - Move to top */}
              <Button 
                type="button" 
                className={`w-full text-white transition-all duration-200 ${
                  !agreedToTerms 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg'
                }`}
                style={{background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))'}}
                onClick={handleSignUp}
                disabled={!agreedToTerms}
                data-testid="button-create-account"
              >
                Create Account / Start Free Trial
              </Button>

              {/* Separator */}
              <div className="text-center">
                <p className="text-sm text-slate-600">Already have an account? Sign in below.</p>
              </div>
              
              {/* Sign In Button */}
              <Button 
                type="button"
                className="w-full text-white"
                style={{background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))'}}
                onClick={handleLogin}
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
