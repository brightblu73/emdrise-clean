import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { apiRequest } from '@/lib/queryClient';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setLocation('/auth');
          return;
        }

        if (data.session) {
          console.log('User authenticated successfully, redirecting to Stripe checkout...');
          
          // User is now authenticated, redirect to Stripe checkout
          try {
            const response = await apiRequest('POST', '/api/create-checkout-session');
            const checkoutData = await response.json();
            
            if (checkoutData.url) {
              // Redirect to Stripe Checkout
              window.location.href = checkoutData.url;
            } else {
              // If user already has subscription, go to homepage
              setLocation('/');
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
        <p className="text-lg">Setting up your trial...</p>
      </div>
    </div>
  );
}