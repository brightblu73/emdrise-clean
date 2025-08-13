import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../state/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Brain, Shield } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/assessment",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // User will be automatically updated by AuthProvider
      toast({
        title: "Payment Successful",
        description: "Welcome to EMDRise Premium! You now have full access.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe} 
        className="w-full emdr-gradient text-white"
        size="lg"
      >
        Subscribe to Heal EMDR Premium
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.subscriptionStatus === 'trial') {
      // Create subscription setup for when trial expires
      apiRequest("POST", "/api/get-or-create-subscription")
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          toast({
            title: "Setup Error",
            description: "Unable to prepare payment setup. Please try again.",
            variant: "destructive",
          });
        });
    } else {
      setIsLoading(false);
    }
  }, [user, toast]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center safe-space-bg">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">Please sign in to subscribe.</p>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.subscriptionStatus === 'active') {
    return (
      <div className="min-h-screen safe-space-bg py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">You're Already Subscribed!</h1>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for being a Heal EMDR Premium member. Continue your healing journey.
            </p>
            <Button className="emdr-gradient text-white">
              Continue to Sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || (user.subscriptionStatus === 'trial' && !clientSecret)) {
    return (
      <div className="min-h-screen flex items-center justify-center safe-space-bg">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-space-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="text-white h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-slate-600">
            Continue your healing journey with full access to professional EMDR therapy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <div className="space-y-6">
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Complete 8-Phase EMDR Protocol</h4>
                    <p className="text-sm text-slate-600">Full professional therapy protocol with all phases</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">therapist Audio Guidance</h4>
                    <p className="text-sm text-slate-600">Expert therapist guidance throughout every session</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Professional Bilateral Stimulation</h4>
                    <p className="text-sm text-slate-600">Integration with bilateralstimulation.io platform</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Progress Tracking & History</h4>
                    <p className="text-sm text-slate-600">Comprehensive session tracking and progress monitoring</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Resource Creation Tools</h4>
                    <p className="text-sm text-slate-600">Safe place, wise figure, and protective figure development</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary-green h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-slate-800">Unlimited Sessions</h4>
                    <p className="text-sm text-slate-600">Process as many targets as you need at your own pace</p>
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
                    <h4 className="font-semibold text-slate-800 mb-2">Professional EMDR Support</h4>
                    <div className="text-sm text-slate-600">
                      "Your commitment to healing is already evident in starting this journey. EMDR has helped countless individuals process trauma and find emotional freedom. Our platform provides expert guidance through each step with professional care and expertise."
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Form */}
          <div>
            <Card className="therapeutic-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">EMDRise Premium</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">
                  £12.99<span className="text-lg text-slate-600">/month</span>
                </div>
                <Badge variant="secondary" className="mb-4">
                  {user.subscriptionStatus === 'trial' ? 'Upgrade from Trial' : 'New Subscription'}
                </Badge>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <SubscribeForm />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">
                      {user.subscriptionStatus === 'expired' || user.subscriptionStatus === 'cancelled' 
                        ? 'Reactivate your subscription to continue your healing journey.'
                        : 'Ready to begin your premium EMDR experience?'
                      }
                    </p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="emdr-gradient text-white"
                    >
                      Initialize Subscription
                    </Button>
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500">
                    ✓ Cancel anytime • ✓ Secure payment • ✓ 30-day money-back guarantee
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="therapeutic-card mt-6">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary-green mx-auto mb-2" />
                <p className="text-sm text-slate-600">
                  Your payment information is secure and encrypted. We use Stripe for payment processing and never store your card details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
