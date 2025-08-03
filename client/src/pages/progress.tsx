import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, TrendingUp, Target, Brain, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface SessionData {
  id: number;
  phase: number;
  status: string;
  startedAt: string;
  completedAt?: string;
  target?: {
    memory: string;
    initialSuds: number;
    finalSuds: number;
    initialVoc: number;
    finalVoc: number;
  };
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['/api/sessions'],
    enabled: !!user,
  });

  const { data: targets = [] } = useQuery({
    queryKey: ['/api/targets'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Please sign in to view your progress.</p>
            <Link href="/auth" className="block mt-4">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedSessions = sessions.filter((s: SessionData) => s.status === 'complete');
  const totalProcessingTime = completedSessions.reduce((acc: number, session: SessionData) => {
    if (session.startedAt && session.completedAt) {
      const start = new Date(session.startedAt);
      const end = new Date(session.completedAt);
      return acc + (end.getTime() - start.getTime());
    }
    return acc;
  }, 0);

  const averageSudsReduction = targets.length > 0 
    ? targets.reduce((acc: number, target: any) => {
        if (target.initialSuds && target.finalSuds !== null) {
          const reduction = ((target.initialSuds - target.finalSuds) / target.initialSuds) * 100;
          return acc + reduction;
        }
        return acc;
      }, 0) / targets.filter((t: any) => t.finalSuds !== null).length
    : 0;

  const daysInTherapy = user.createdAt 
    ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen safe-space-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Your Healing Journey</h1>
          <p className="text-lg text-slate-600">Track your progress and celebrate your growth</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="therapeutic-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-white h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">{completedSessions.length}</div>
              <p className="text-sm text-slate-600">Sessions Completed</p>
            </CardContent>
          </Card>

          <Card className="therapeutic-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">{Math.round(averageSudsReduction)}%</div>
              <p className="text-sm text-slate-600">Average SUDS Reduction</p>
            </CardContent>
          </Card>

          <Card className="therapeutic-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-secondary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">{targets.length}</div>
              <p className="text-sm text-slate-600">Targets Processed</p>
            </CardContent>
          </Card>

          <Card className="therapeutic-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-warm-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-white h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">{daysInTherapy}</div>
              <p className="text-sm text-slate-600">Days of Healing</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session History */}
          <div className="lg:col-span-2">
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-primary" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">No sessions yet</p>
                    <Link href="/preparation">
                      <Button className="emdr-gradient text-white">Start Your First Session</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.slice(0, 10).map((session: SessionData) => (
                      <div key={session.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-slate-800">
                              {session.target?.memory ? 
                                session.target.memory.substring(0, 50) + (session.target.memory.length > 50 ? '...' : '') :
                                `Session ${session.id}`
                              }
                            </h4>
                            <p className="text-sm text-slate-500">
                              {format(new Date(session.startedAt), 'PPp')}
                            </p>
                          </div>
                          <Badge variant={session.status === 'complete' ? 'default' : 'secondary'}>
                            {session.status === 'complete' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Complete</>
                            ) : (
                              'In Progress'
                            )}
                          </Badge>
                        </div>
                        
                        {session.target && (
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            {session.target.initialSuds !== undefined && session.target.finalSuds !== undefined && (
                              <span>SUDS: {session.target.initialSuds} → {session.target.finalSuds}</span>
                            )}
                            {session.target.initialVoc !== undefined && session.target.finalVoc !== undefined && (
                              <span>VOC: {session.target.initialVoc} → {session.target.finalVoc}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Insights */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>This Week's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sessions Goal</span>
                      <span>2/3</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Practice Minutes</span>
                      <span>45/60</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                      {user.subscriptionStatus === 'trial' ? 'Free Trial' :
                       user.subscriptionStatus === 'active' ? 'Active' :
                       user.subscriptionStatus}
                    </Badge>
                  </div>
                  
                  {user.subscriptionStatus === 'trial' && user.trialEndsAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Trial Ends</span>
                      <span className="text-sm font-medium">
                        {format(new Date(user.trialEndsAt), 'PPP')}
                      </span>
                    </div>
                  )}
                  
                  {user.subscriptionStatus === 'trial' && (
                    <Link href="/subscribe" className="block">
                      <Button className="w-full emdr-gradient text-white" size="sm">
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/preparation" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Start New Session
                  </Button>
                </Link>
                
                <Link href="/resources" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Brain className="h-4 w-4 mr-2" />
                    Manage Resources
                  </Button>
                </Link>
                
                <Link href="/assessment" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
