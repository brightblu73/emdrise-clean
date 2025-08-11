import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { signInWithGoogle, checkRedirectResult } from "@/lib/firebase";
import { supabase } from '@/lib/supabaseClient'
import { Brain, Apple, Mail } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { refetchUser, loginUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log("Auth page login attempt:", data);
      const response = await apiRequest("POST", "/api/login", data);
      console.log("Auth page login response:", response);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Auth page login successful:", data);
      // Manually set user state for immediate UI update
      if (data.user) {
        loginUser(data.user);
      }
      setLocation("/emdr-session");
    },
    onError: (error: any) => {
      console.error("Auth page login failed:", error.message || "Invalid email or password");
      alert(`Login failed: ${error.message || "Invalid email or password"}`);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) =>
      apiRequest("POST", "/api/register", data),
    onSuccess: () => {
      refetchUser();
      setLocation("/emdr-session");
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.message || "Please try again");
    },
  });

  // TEST button functionality for development
  async function handleEmailLogin(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { console.error(error); alert(error.message); return }
    window.location.href = '/'
  }

  async function handleEmailSignUp(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { console.error(error); alert(error.message); return }
    alert('Check your email to confirm, then log in.')
  }



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Please accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Please accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }
    registerMutation.mutate(formData);
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
            <form onSubmit={handleEmailLogin} className="space-y-4">
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

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <a href="/terms-of-use" className="text-primary hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full emdr-gradient text-white"
                disabled={loginMutation.isPending}
                onClick={handleEmailLogin}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                disabled={loginMutation.isPending}
                onClick={handleEmailSignUp}
              >
                Create Account / Start Free Trial (email)
              </Button>
            </form>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
