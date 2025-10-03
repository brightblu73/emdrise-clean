import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../state/AuthProvider";
import { CheckCircle, Brain, Shield, Smartphone, Apple } from "lucide-react";

export default function Subscribe() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center safe-space-bg">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">Please sign in to view subscription information.</p>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-space-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="text-white h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            EMDRise Premium Mobile App
          </h1>
          <p className="text-xl text-slate-600">
            Professional EMDR therapy available through our native mobile application
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <div className="space-y-6">
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-primary" />
                  What's Included in Mobile App
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Complete 10-Phase EMDR Protocol</h4>
                    <p className="text-sm text-slate-600">Full professional therapy protocol with expert video guidance</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Professional Guide Videos</h4>
                    <p className="text-sm text-slate-600">Choose between Maria and Alistair for guided sessions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Native Mobile Bilateral Stimulation</h4>
                    <p className="text-sm text-slate-600">Haptic feedback, stereo audio, and visual stimulation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Session Persistence & Resume</h4>
                    <p className="text-sm text-slate-600">Native session management with Script 5a continuation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Apple Sign-In Integration</h4>
                    <p className="text-sm text-slate-600">Secure authentication with your Apple ID</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Offline Capability</h4>
                    <p className="text-sm text-slate-600">Continue therapy sessions without internet connection</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Message */}
            <Card className="therapeutic-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center">
                    <Brain className="text-white h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Mobile-First EMDR Platform</h4>
                    <div className="text-sm text-slate-600">
                      "EMDRise is designed as a native mobile experience, providing the intimate and focused environment needed for effective EMDR therapy. Our mobile app leverages device capabilities for enhanced bilateral stimulation and provides the privacy and convenience of therapy in your pocket."
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile App Information */}
          <div>
            <Card className="therapeutic-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">
                  <Apple className="h-8 w-8 inline mr-2" />
                  Mobile App
                </CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">
                  £9.99<span className="text-lg text-slate-600">/month</span>
                </div>
                <Badge variant="secondary" className="mb-4">
                  7-Day Free Trial
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Smartphone className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">
                    Coming Soon to App Store
                  </h3>
                  <p className="text-slate-600 mb-6">
                    EMDRise will be available as a native iOS and Android app. Subscriptions will be managed through Apple In-App Purchases for iOS and Google Play Billing for Android.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="text-primary-green h-5 w-5" />
                      <span className="text-sm text-slate-600">Native iOS & Android apps</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="text-primary-green h-5 w-5" />
                      <span className="text-sm text-slate-600">Apple In-App Purchase integration</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="text-primary-green h-5 w-5" />
                      <span className="text-sm text-slate-600">RevenueCat subscription management</span>
                    </div>
                  </div>

                  <Button 
                    className="emdr-gradient text-white mb-4"
                    disabled
                  >
                    App Store Release Pending
                  </Button>
                  
                  <p className="text-xs text-slate-500">
                    This web version serves as a preview. The full experience will be available in our mobile apps.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Development Information */}
            <Card className="therapeutic-card mt-6">
              <CardContent className="p-4">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary-green mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 mb-2">Mobile Architecture</h4>
                  <p className="text-sm text-slate-600">
                    This web application serves as the foundation for our mobile apps. The same codebase will be deployed to iOS and Android using Ionic Capacitor, ensuring consistency across platforms while leveraging native mobile capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}