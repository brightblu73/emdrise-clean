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
  const url = new URL(data.url);

  // Check if this is an Apple Sign-In callback
  if (url.pathname === '/auth/callback') {
    // Extract the authorization code or other parameters from the URL
    const params = new URLSearchParams(url.search);
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
});