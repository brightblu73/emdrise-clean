import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { apiRequest } from '@/lib/queryClient';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState('Verifying your account...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Verifying your account...');
        
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setLocation('/auth');
          return;
        }

        if (data.session) {
          console.log('User authenticated successfully, redirecting to homepage...');
          setStatus('Welcome back! Redirecting...');
          
          // Always redirect to homepage - let the homepage handle subscription status
          // Trial setup handled through homepage trial flow
          setTimeout(() => setLocation('/'), 500);
        } else {
          // No session, redirect to auth
          setLocation('/auth');
        }
      } catch (error) {
        console.error('Auth callback processing error:', error);
        setLocation('/auth');
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}