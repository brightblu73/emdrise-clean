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
          console.log('User authenticated successfully, checking subscription status...');
          setStatus('Checking your subscription...');
          
          // Check if user already has an active subscription
          try {
            const statusResponse = await apiRequest('GET', '/api/subscription-status');
            const statusData = await statusResponse.json();
            console.log('Subscription status in auth-callback:', statusData);
            
            if (statusData.hasActiveSubscription) {
              console.log('User already has active subscription, redirecting to homepage');
              setStatus('Welcome back! Redirecting...');
              setTimeout(() => setLocation('/?trial_started=true'), 500);
              return;
            }
          } catch (error) {
            console.error('Error checking subscription status:', error);
          }
          
          // User doesn't have subscription, redirect to Stripe checkout
          setStatus('Setting up your trial...');
          try {
            const response = await apiRequest('POST', '/api/create-checkout-session');
            const checkoutData = await response.json();
            
            if (checkoutData.url) {
              // Redirect to Stripe Checkout
              console.log('Redirecting to Stripe Checkout:', checkoutData.url);
              setStatus('Redirecting to checkout...');
              // Small delay to show status before redirect
              setTimeout(() => {
                window.location.href = checkoutData.url;
              }, 800);
            } else {
              // If user already has subscription, go to homepage
              setStatus('Finalizing setup...');
              setTimeout(() => setLocation('/?trial_started=true'), 500);
            }
          } catch (error) {
            console.error('Error creating checkout session:', error);
            setLocation('/');
          }
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