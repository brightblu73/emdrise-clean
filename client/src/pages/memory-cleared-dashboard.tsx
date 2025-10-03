import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Home } from "lucide-react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Logo } from "@/components/ui/logo";

export default function MemoryClearedDashboard() {
  const [, setLocation] = useLocation();
  const [memoriesCleared, setMemoriesCleared] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchMemoriesCleared = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('memories_cleared')
            .eq('email', user.email)
            .single();
          
          if (profile) {
            setMemoriesCleared(profile.memories_cleared || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching memories cleared:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemoriesCleared();
    
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleReturnHome = () => {
    localStorage.removeItem('emdrSession');
    setLocation("/");
  };

  return (
    <div className="min-h-screen emdr-gradient flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Logo variant="header" />
        </div>

        <Card className="therapeutic-card border-2 border-primary-green/30 shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="relative inline-block">
              <CheckCircle2 
                className="w-24 h-24 text-primary-green mx-auto animate-in zoom-in duration-500" 
                data-testid="icon-success"
              />
              {showConfetti && (
                <Sparkles 
                  className="absolute -top-2 -right-2 w-8 h-8 text-warm-accent animate-pulse"
                  data-testid="icon-sparkles"
                />
              )}
            </div>

            <div className="space-y-3">
              <h1 
                className="text-3xl md:text-4xl font-bold text-primary-blue"
                data-testid="text-title"
              >
                Memory Cleared Successfully
              </h1>
              
              <p 
                className="text-lg text-slate-700 leading-relaxed"
                data-testid="text-description"
              >
                You've completed your EMDR session and successfully processed this memory. 
                This is a significant step forward in your healing journey.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-blue/10 to-primary-green/10 rounded-xl p-6 my-6">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm font-medium text-primary-blue uppercase tracking-wide">
                  Total Memories Cleared
                </p>
                {isLoading ? (
                  <div 
                    className="text-5xl font-bold text-primary-green animate-pulse"
                    data-testid="text-loading"
                  >
                    ...
                  </div>
                ) : (
                  <div 
                    className="text-6xl font-bold text-primary-green"
                    data-testid="text-memories-count"
                  >
                    {memoriesCleared}
                  </div>
                )}
                <p className="text-sm text-slate-600">
                  {memoriesCleared === 1 ? 'session completed' : 'sessions completed'}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="bg-therapeutic-bg rounded-lg p-4 text-left">
                <h3 className="font-semibold text-primary-blue mb-2 text-sm">
                  What's Next?
                </h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Take time to rest and process your experience</li>
                  <li>• Practice self-care and be gentle with yourself</li>
                  <li>• Return when you're ready to process another memory</li>
                </ul>
              </div>

              <Button
                onClick={handleReturnHome}
                size="lg"
                className="w-full emdr-gradient text-white hover:opacity-90 transition-opacity font-semibold text-lg py-6"
                data-testid="button-return-home"
              >
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
            </div>

            <p className="text-xs text-slate-500 pt-4">
              Your progress is automatically saved and synced across all your devices.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
