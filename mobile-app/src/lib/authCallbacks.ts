import { Linking } from 'react-native';
import { supabase } from './supabase';

/**
 * Handle OAuth callback from deep links
 * This handles the redirect from Apple Sign In OAuth flow
 */
export const handleOAuthCallback = async (url: string) => {
  try {
    console.log('Handling OAuth callback:', url);
    
    // Parse the URL to extract the session data
    const { data, error } = await supabase.auth.getSessionFromUrl({ url });
    
    if (error) {
      console.error('OAuth callback error:', error);
      return { error };
    }
    
    if (data.session) {
      console.log('OAuth successful, session created:', data.session.user?.email);
      return { session: data.session, error: null };
    }
    
    return { error: new Error('No session found in callback') };
  } catch (error) {
    console.error('OAuth callback processing failed:', error);
    return { error };
  }
};

/**
 * Set up deep link listener for OAuth callbacks
 */
export const setupOAuthListener = (onAuthSuccess: (session: any) => void) => {
  const handleDeepLink = async (event: { url: string }) => {
    if (event.url.includes('auth-callback')) {
      const result = await handleOAuthCallback(event.url);
      if (result.session) {
        onAuthSuccess(result.session);
      }
    }
  };

  // Listen for incoming links
  const subscription = Linking.addEventListener('url', handleDeepLink);
  
  // Check if app was opened via a deep link
  Linking.getInitialURL().then((url) => {
    if (url && url.includes('auth-callback')) {
      handleDeepLink({ url });
    }
  });

  return subscription;
};