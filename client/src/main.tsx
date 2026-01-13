import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installAuthListener, redirectAfterLogout } from './lib/auth';
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
