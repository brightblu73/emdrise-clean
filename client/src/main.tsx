import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installAuthListener, redirectAfterLogout } from './lib/auth';
import { App as CapacitorApp } from '@capacitor/app';
import * as Sentry from '@sentry/capacitor';
import * as SentryReact from '@sentry/react';

createRoot(document.getElementById("root")!).render(<App />);

// Install global sign-out listener (multi-tab safety)
try {
  installAuthListener(() => { redirectAfterLogout(); });

  Sentry.init({
      dsn: "https://095cf54033112cf20e7109208958267c@o4510346928324608.ingest.de.sentry.io/4510526101913680",
      integrations: [
        Sentry.browserTracingIntegration()
      ]
    },
    // Forward the init method from @sentry/react
    SentryReact.init
  );
} catch (e) {
  console.warn('Auth listener not installed:', e);
}

// Handle deep links for Apple Sign-In
CapacitorApp.addListener('appUrlOpen', (data) => {
  // Handle the deep link URL
  const urlString = data.url;
  if (!urlString || typeof urlString !== 'string') return;

  // Extract hash and search parts manually
  const hashIndex = urlString.indexOf('#');
  const hash = hashIndex !== -1 ? urlString.substring(hashIndex) : '';
  const searchIndex = urlString.indexOf('?');
  const search = searchIndex !== -1 ? urlString.substring(searchIndex, hashIndex !== -1 ? hashIndex : undefined) : '';

  console.log("appUrlOpen", JSON.stringify(data));
  console.log("appUrlOpen hash", JSON.stringify(hash));
  console.log("appUrlOpen search", JSON.stringify(search));

  // Check if this is an Apple Sign-In callback
  if (urlString.includes('/auth/callback')) {
    // Extract the authorization code or other parameters from the URL
    const params = new URLSearchParams(search.substring(1)); // Remove the leading '?'
    const code = params.get('code');
    const state = params.get('state');

    if (code) {
      // Store the authorization code for the auth component to use
      sessionStorage.setItem('apple_auth_code', code);
      sessionStorage.setItem('apple_auth_state', state || '');

      // Navigate to auth page if not already there
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      } else {
        // Trigger a custom event to notify the auth component
        window.dispatchEvent(new CustomEvent('appleAuthCallback', {
          detail: { code, state }
        }));
      }
    }
  }
  // Check if this is a password reset deep link
  else if (urlString.includes('/reset-password') && hash.includes('type=recovery')) {
    // Password reset links contain recovery tokens in the hash
    // Navigate to reset-password page with the hash intact so the component can process it
    if (window.location.pathname !== '/reset-password') {
      console.log("going to reset password", hash);
      window.location.href = '/reset-password' + hash;
    } else {
      // If already on reset-password page, update the URL hash to trigger the useEffect
      window.location.hash = hash;
    }
  }
});