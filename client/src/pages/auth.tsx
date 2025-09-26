import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "../state/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { authRegistrationSchema, authLoginSchema, type AuthRegistration, type AuthLogin } from "@shared/schema";

import { supabase } from '@/lib/supabase';
import { apiRequest } from '@/lib/queryClient';
import { Brain, Apple, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { signInWithEmail } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(true); // Toggle between sign up and sign in
  
  // Forgot password state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetMessageType, setResetMessageType] = useState<'success' | 'error' | null>(null);

  // Password reset form state
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  const [passwordResetMessageType, setPasswordResetMessageType] = useState<'success' | 'error' | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showResetSuccessMessage, setShowResetSuccessMessage] = useState(false);

  // React Hook Form setup for registration
  const registrationForm = useForm<AuthRegistration>({
    resolver: zodResolver(authRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  // React Hook Form setup for login
  const loginForm = useForm<AuthLogin>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Supabase authentication handlers
  async function handleLogin(data: AuthLogin) {
    console.log('Starting sign in process for:', data.email);
    
    try {
      const { error } = await signInWithEmail(data.email, data.password);
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

  async function handleSignUp(data: AuthRegistration) {
    console.log('Starting sign up process for:', data.email);
    
    try {
      const userMetadata: any = {
        full_name: data.name.trim()
      };
      
      // Add date of birth to metadata if provided
      if (data.dateOfBirth && data.dateOfBirth.trim()) {
        userMetadata.date_of_birth = data.dateOfBirth.trim();
      }
      
      const { data: signUpData, error } = await supabase.auth.signUp({ 
        email: data.email, 
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`,
          data: userMetadata
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        alert(error.message);
        return;
      }
      
      console.log('Sign up response:', signUpData);
      
      if (signUpData.user && !signUpData.user.email_confirmed_at) {
        alert('Check your email to verify your account. After verification, you\'ll be redirected to complete your trial setup.');
      } else if (signUpData.user && signUpData.user.email_confirmed_at) {
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

  // Forgot password handler
  async function handleForgotPassword(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!resetEmail.trim()) {
      setResetMessage('Please enter your email address');
      setResetMessageType('error');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setResetMessage('There was a problem sending the reset link. Please try again.');
        setResetMessageType('error');
        return;
      }
      
      setResetMessage('Password reset link sent! Please check your email.');
      setResetMessageType('success');
      
      // Close modal after short delay
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setResetEmail('');
        setResetMessage('');
        setResetMessageType(null);
      }, 3000);
      
    } catch (error) {
      console.error('Password reset exception:', error);
      setResetMessage('There was a problem sending the reset link. Please try again.');
      setResetMessageType('error');
    }
  }

  // Password update handler
  async function handlePasswordUpdate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!newPassword.trim()) {
      setPasswordResetMessage('Please enter a new password');
      setPasswordResetMessageType('error');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordResetMessage('Password must be at least 6 characters long');
      setPasswordResetMessageType('error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordResetMessage('Passwords do not match');
      setPasswordResetMessageType('error');
      return;
    }
    
    setIsUpdatingPassword(true);
    setPasswordResetMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('Password update error:', error);
        setPasswordResetMessage('Failed to update password. Please try again.');
        setPasswordResetMessageType('error');
        setIsUpdatingPassword(false);
        return;
      }
      
      setPasswordResetMessage('Password updated successfully! Redirecting to login...');
      setPasswordResetMessageType('success');
      
      // Clear form and redirect after delay
      setTimeout(async () => {
        // Sign out user and redirect to fresh login
        await supabase.auth.signOut();
        setShowPasswordResetForm(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordResetMessage('');
        setPasswordResetMessageType(null);
        setIsUpdatingPassword(false);
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Show success message in normal login form
        setShowResetSuccessMessage(true);
      }, 2000);
      
    } catch (error) {
      console.error('Password update exception:', error);
      setPasswordResetMessage('Failed to update password. Please try again.');
      setPasswordResetMessageType('error');
      setIsUpdatingPassword(false);
    }
  }

  // Check for password reset URL parameters and recovery tokens
  useEffect(() => {
    // Parse recovery tokens from hash fragment (Supabase sends them here)
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const expiresIn = hashParams.get('expires_in');
    
    // Also check query params for fallback cases
    const urlParams = new URLSearchParams(window.location.search);
    
    if (type === 'recovery' && accessToken && refreshToken) {
      // User clicked password reset link in email - establish session first
      const establishRecoverySession = async () => {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Failed to establish recovery session:', error);
            setPasswordResetMessage('Invalid or expired reset link. Please request a new password reset.');
            setPasswordResetMessageType('error');
            // Do NOT show password reset form when session establishment fails
            return;
          }
          
          // Session established successfully - show password reset form
          setShowPasswordResetForm(true);
          
          // Clear recovery tokens from URL hash after session is established
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
          
        } catch (error) {
          console.error('Recovery session exception:', error);
          setPasswordResetMessage('Failed to process reset link. Please request a new password reset.');
          setPasswordResetMessageType('error');
          // Do NOT show password reset form when there's an exception
        }
      };
      
      establishRecoverySession();
    } else if (type === 'recovery') {
      // Recovery type but missing tokens - show error message but not the form
      setPasswordResetMessage('Invalid reset link. Please request a new password reset.');
      setPasswordResetMessageType('error');
      // Do NOT show password reset form when tokens are missing
    } else if (urlParams.get('reset') === 'true') {
      // Fallback for old-style reset confirmation
      alert('Your password has been updated successfully. You can now log in with your new password.');
      // Clear the reset parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--safe-space)'}}>
      <div className="max-w-md w-full mx-4">

        {/* Password Reset Error Message - shown outside form gating */}
        {passwordResetMessage && !showPasswordResetForm && (
          <div className={`mb-6 p-3 rounded-md text-sm ${
            passwordResetMessageType === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`} data-testid="password-reset-error-message">
            {passwordResetMessage}
          </div>
        )}

        {/* Password Reset Form - shown when user comes from reset email */}
        {showPasswordResetForm ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <p className="text-sm text-slate-600">Enter your new password below</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isUpdatingPassword}
                    data-testid="input-new-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isUpdatingPassword}
                    data-testid="input-confirm-password"
                  />
                </div>

                {passwordResetMessage && (
                  <div className={`p-3 rounded-md text-sm ${
                    passwordResetMessageType === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`} data-testid="password-reset-message">
                    {passwordResetMessage}
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full text-white"
                  style={{background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))'}}
                  disabled={isUpdatingPassword}
                  data-testid="button-update-password"
                >
                  {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Normal authentication forms - shown when not in password reset mode
          <>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUpMode ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-sm text-slate-600 text-center">
              {isSignUpMode ? 'Register to start your EMDR therapy journey' : 'Sign in to access your EMDR sessions'}
            </p>
            
            {/* Toggle Buttons */}
            <div className="flex rounded-lg bg-slate-100 p-1 mt-4">
              <button
                type="button"
                onClick={() => setIsSignUpMode(false)}
                className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                  !isSignUpMode
                    ? 'bg-white text-primary-blue shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                data-testid="toggle-login"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsSignUpMode(true)}
                className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                  isSignUpMode
                    ? 'bg-white text-primary-blue shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                data-testid="toggle-register"
              >
                Register
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 min-h-[600px]">
            {/* Apple Sign In - only show on registration */}
            {isSignUpMode && (
              <>
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
              </>
            )}

            {/* Registration Form */}
            {isSignUpMode ? (
              <Form {...registrationForm}>
                <form onSubmit={registrationForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={registrationForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registrationForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registrationForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-date-of-birth" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registrationForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} data-testid="input-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registrationForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} data-testid="input-confirm-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-terms-agreement"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                            By creating an account, you agree to our{' '}
                            <button
                              type="button"
                              onClick={() => openInWebView('/terms-of-use')}
                              className="text-primary-blue hover:text-primary-blue/80 underline font-medium"
                              data-testid="link-terms-of-use"
                            >
                              Terms of Service
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
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit"
                    className="w-full text-white"
                    style={{background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))'}}
                    data-testid="button-create-account"
                  >
                    Create Account
                  </Button>
                </form>
              </Form>
            ) : (
              // Sign In Form
              <>
                {/* Password Reset Success Message */}
                {showResetSuccessMessage && (
                  <div className="p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200" data-testid="reset-success-message">
                    Password updated successfully! You can now log in with your new password.
                  </div>
                )}
                
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" type="email" {...field} data-testid="input-login-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            <span>Password</span>
                            <button
                              type="button"
                              onClick={() => setShowForgotPasswordModal(true)}
                              className="text-primary-blue hover:text-primary-blue/80 underline text-sm font-medium"
                              data-testid="link-forgot-password"
                            >
                              Forgot password?
                            </button>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" type="password" {...field} data-testid="input-login-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="w-full text-white"
                      style={{background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))'}}
                      data-testid="button-sign-in"
                    >
                      Sign In
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
        </>
        )}

        {/* Forgot Password Modal */}
        <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    data-testid="input-reset-email"
                  />
                </div>

                {resetMessage && (
                  <div className={`p-3 rounded-md text-sm ${
                    resetMessageType === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`} data-testid="reset-message">
                    {resetMessage}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowForgotPasswordModal(false);
                      setResetEmail('');
                      setResetMessage('');
                      setResetMessageType(null);
                    }}
                    className="flex-1"
                    data-testid="button-cancel-reset"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 text-white"
                    style={{background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))'}}
                    data-testid="button-send-reset"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
