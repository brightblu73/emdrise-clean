import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./state/AuthProvider";
import Navigation from "./components/navigation";
import Home from "./pages/home";
import Auth from "./pages/auth";
import Therapist from "./pages/therapist";
import Resources from "./pages/resources";
import Progress from "./pages/progress";
import Subscribe from "./pages/subscribe";

import EMDRSession from "./pages/emdr-session";
import TermsOfUse from "./pages/terms-of-use";
import PrivacyPolicy from "./pages/privacy-policy";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/therapist" component={Therapist} />
      {/* Redirect old routes to new video-guided workflow */}
      <Route path="/preparation" component={EMDRSession} />
      <Route path="/assessment" component={EMDRSession} />
      <Route path="/processing" component={EMDRSession} />
      <Route path="/resources" component={Resources} />
      <Route path="/progress" component={Progress} />
      <Route path="/subscribe" component={Subscribe} />

      <Route path="/emdr-session" component={EMDRSession} />
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-therapeutic-bg">
            <Navigation />
            <Router />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
