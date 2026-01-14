import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { Logo } from "@/components/ui/logo";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  const [passwordResetMessageType, setPasswordResetMessageType] = useState<'success' | 'error' | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  // Check for valid recovery session on component mount
  useEffect(() => {
    const checkRecoverySession = async () => {
      try {
        // Parse recovery tokens from hash fragment (Supabase sends them here)
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (type === 'recovery' && accessToken && refreshToken) {
          // User clicked password reset link in email - establish session first
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Failed to establish recovery session:', error);
            setPasswordResetMessage('Invalid or expired reset link. Please request a new password reset.');
            setPasswordResetMessageType('error');
            // Redirect to auth page after a delay
            setTimeout(() => {
              setLocation('/auth');
            }, 3000);
            return;
          }

          // Session established successfully
          setIsValidSession(true);

          // Clear recovery tokens from URL hash after session is established
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else if (type === 'recovery') {
          // Recovery type but missing tokens
          setPasswordResetMessage('Invalid reset link. Please request a new password reset.');
          setPasswordResetMessageType('error');
          setTimeout(() => {
            setLocation('/auth');
          }, 3000);
        } else {
          // No recovery tokens found, redirect to auth
          setPasswordResetMessage('No valid reset link found. Please request a new password reset.');
          setPasswordResetMessageType('error');
          setTimeout(() => {
            setLocation('/auth');
          }, 3000);
        }
      } catch (error) {
        console.error('Recovery session exception:', error);
        setPasswordResetMessage('Failed to process reset link. Please request a new password reset.');
        setPasswordResetMessageType('error');
        setTimeout(() => {
          setLocation('/auth');
        }, 3000);
      }
    };

    checkRecoverySession();
  }, [history]);

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
        setNewPassword('');
        setConfirmPassword('');
        setPasswordResetMessage('');
        setPasswordResetMessageType(null);
        setIsUpdatingPassword(false);

        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);

        // Redirect to auth page
        setLocation('/auth');
      }, 2000);

    } catch (error) {
      console.error('Password update exception:', error);
      setPasswordResetMessage('Failed to update password. Please try again.');
      setPasswordResetMessageType('error');
      setIsUpdatingPassword(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center m-4" style={{backgroundColor: 'var(--safe-space)'}}>
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Your Password</CardTitle>
            <p className="text-sm text-slate-600 text-center">
              Enter your new password below
            </p>
          </CardHeader>
          <CardContent>
            {!isValidSession ? (
              // Loading state while checking session
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Verifying reset link...</p>
              </div>
            ) : (
              // Password reset form
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}