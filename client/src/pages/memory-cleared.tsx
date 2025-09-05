import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '../state/AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { Brain, Home, Trophy, Sparkles, Star } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function MemoryCleared() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [memoriesCleared, setMemoriesCleared] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [confettiVisible, setConfettiVisible] = useState(true);

  useEffect(() => {
    fetchMemoryCount();
    
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setConfettiVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fetchMemoryCount = async () => {
    try {
      const response = await fetch('/api/memory-count');
      if (response.ok) {
        const data = await response.json();
        setMemoriesCleared(data.memoriesCleared || 0);
      } else {
        console.error('Failed to fetch memory count');
      }
    } catch (error) {
      console.error('Error fetching memory count:', error);
      toast({
        title: "Error",
        description: "Unable to load your progress data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {confettiVisible && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-bounce ${
                i % 4 === 0 ? 'text-primary' : 
                i % 4 === 1 ? 'text-primary-green' : 
                i % 4 === 2 ? 'text-yellow-500' : 'text-blue-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {i % 3 === 0 ? '✨' : i % 3 === 1 ? '🌟' : '💫'}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo variant="hero" />
            </div>
          </div>

          {/* Main Celebration Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 text-center">
              {/* Achievement Badge */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-green rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <h1 className="text-3xl font-bold text-primary-green mb-4 flex items-center justify-center gap-2">
                Memory Cleared! <Brain className="h-8 w-8" />
              </h1>
              
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                You've just cleared another memory. That takes real courage and strength — well done! 🧠💪✨
              </p>

              {/* Progress Statistics */}
              <div className="bg-gradient-to-r from-primary/10 to-primary-green/10 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <Sparkles className="h-6 w-6 text-primary-green" />
                  <h2 className="text-xl font-semibold text-primary-green">Your Progress</h2>
                  <Sparkles className="h-6 w-6 text-primary-green" />
                </div>
                
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-32 mx-auto"></div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {memoriesCleared}
                    </div>
                    <div className="text-slate-600 font-medium">
                      {memoriesCleared === 1 ? 'Memory Cleared' : 'Memories Cleared'}
                    </div>
                  </div>
                )}
              </div>

              {/* Motivational Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 font-medium text-sm">
                  Each session is a step forward in your healing journey. Your commitment to growth is inspiring.
                </p>
              </div>

              {/* Return Home Button */}
              <Button 
                onClick={handleReturnHome}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary-green hover:from-primary/90 hover:to-primary-green/90 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg"
              >
                <Home className="h-5 w-5 mr-3" />
                Return to Home
              </Button>

              {/* Small celebration text */}
              <p className="text-sm text-slate-500 mt-4">
                Take a moment to acknowledge your progress 🌟
              </p>
            </CardContent>
          </Card>

          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}