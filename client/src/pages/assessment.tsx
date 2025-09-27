import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import TherapistOffice from "@/components/therapist-office";
import AudioGuide from "@/components/audio-guide";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface AssessmentData {
  memory: string;
  image: string;
  negativeCognition: string;
  positiveCognition: string;
  emotions: string[];
  initialSuds: number;
  bodyLocation: string;
}

export default function Assessment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    memory: "",
    image: "",
    negativeCognition: "",
    positiveCognition: "",
    emotions: [],
    initialSuds: 5,
    bodyLocation: "",
  });

  const createTargetMutation = useMutation({
    mutationFn: async (data: AssessmentData) => {
      const response = await apiRequest("POST", "/api/targets", {
        memory: data.memory,
        image: data.image,
        negativeCognition: data.negativeCognition,
        positiveCognition: data.positiveCognition,
        emotions: data.emotions,
        initialSuds: data.initialSuds,
        bodyLocation: data.bodyLocation,
      });
      return response.json();
    },
    onSuccess: (target) => {
      toast({
        title: "Assessment Complete",
        description: "Your target has been identified. Moving to processing phase.",
      });
      setLocation(`/processing?targetId=${target.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save assessment",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof AssessmentData, value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmotionChange = (emotion: string) => {
    setAssessmentData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const handleSubmit = () => {
    if (!assessmentData.memory || !assessmentData.image || !assessmentData.negativeCognition) {
      toast({
        title: "Incomplete Assessment",
        description: "Please complete all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    createTargetMutation.mutate(assessmentData);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Please sign in to access EMDR therapy.</p>
            <Link href="/auth" className="block mt-4">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-space-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-800">Phase 3: Assessment</h1>
            <div className="flex items-center space-x-2">
              <div className="emdr-phase-indicator emdr-phase-3">3</div>
              <span className="text-sm text-slate-600">Phase 3 of 8</span>
            </div>
          </div>
          <Progress value={37.5} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Therapist Guidance */}
          <div className="lg:col-span-1">
            <Card className="therapeutic-card">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Assessment Guidance</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Now we'll identify the specific memory to work on and assess how it affects you currently. Take your time with each question and be as specific as possible.
                </p>
                <AudioGuide 
                  text="Now we'll identify the specific memory to work on and assess how it affects you currently. Take your time with each question and be as specific as possible."
                  duration="1:45"
                />
              </CardContent>
            </Card>
          </div>

          {/* Assessment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Memory */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Target Memory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "What memory are we going to work on today?"
                </div>
                <div>
                  <Label htmlFor="memory">Describe the memory you'd like to process</Label>
                  <Textarea
                    id="memory"
                    placeholder="Describe the specific memory or incident..."
                    value={assessmentData.memory}
                    onChange={(e) => handleInputChange('memory', e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Representation */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "What picture represents the worst part of the incident?"
                </div>
                <div>
                  <Label htmlFor="image">Describe the image that comes to mind</Label>
                  <Textarea
                    id="image"
                    placeholder="What do you see, hear, smell? Describe the vivid details..."
                    value={assessmentData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Negative Cognition */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Negative Cognition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "When you bring up that picture, what negative belief do you have about yourself now?"
                </div>
                <div>
                  <Label htmlFor="negativeCognition">Negative belief about yourself</Label>
                  <Select value={assessmentData.negativeCognition} onValueChange={(value) => handleInputChange('negativeCognition', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a negative belief..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I am powerless">I am powerless</SelectItem>
                      <SelectItem value="I am not safe">I am not safe</SelectItem>
                      <SelectItem value="I am not good enough">I am not good enough</SelectItem>
                      <SelectItem value="I am in danger">I am in danger</SelectItem>
                      <SelectItem value="I am helpless">I am helpless</SelectItem>
                      <SelectItem value="I am worthless">I am worthless</SelectItem>
                      <SelectItem value="I cannot trust anyone">I cannot trust anyone</SelectItem>
                      <SelectItem value="I am responsible">I am responsible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Positive Cognition */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Positive Cognition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "When you bring up that picture, what would you like to believe about yourself now?"
                </div>
                <div>
                  <Label htmlFor="positiveCognition">Preferred positive belief</Label>
                  <Textarea
                    id="positiveCognition"
                    placeholder="I am safe, I am strong, I did the best I could..."
                    value={assessmentData.positiveCognition}
                    onChange={(e) => handleInputChange('positiveCognition', e.target.value)}
                    rows={2}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emotions */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Emotions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "When you bring up that incident and those words, what emotions do you feel now?"
                </div>
                <div>
                  <Label>Select all emotions you're experiencing</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {['Fear', 'Anger', 'Sadness', 'Shame', 'Guilt', 'Helplessness', 'Anxiety', 'Disgust', 'Rage'].map((emotion) => (
                      <Button
                        key={emotion}
                        type="button"
                        variant={assessmentData.emotions.includes(emotion) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEmotionChange(emotion)}
                        className="justify-start"
                      >
                        {emotion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SUDS Scale */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Disturbance Level (SUDS)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "On a scale of 0 to 10, where 0 is no disturbance and 10 is the highest disturbance imaginable, how disturbing does it feel to you now?"
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">0 - No disturbance</span>
                    <span className="text-sm text-slate-600">10 - Highest imaginable</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">0</span>
                    <Slider
                      value={[assessmentData.initialSuds]}
                      onValueChange={(value) => handleInputChange('initialSuds', value[0])}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-slate-600">10</span>
                    <div className="w-12 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-semibold">
                      {assessmentData.initialSuds}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Body Location */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle>Body Sensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "Where do you feel that in your body?"
                </div>
                <div>
                  <Label htmlFor="bodyLocation">Location of physical sensation</Label>
                  <Textarea
                    id="bodyLocation"
                    placeholder="Describe where you feel tension, discomfort, or sensations in your body..."
                    value={assessmentData.bodyLocation}
                    onChange={(e) => handleInputChange('bodyLocation', e.target.value)}
                    rows={2}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Link href="/preparation">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Preparation
                </Button>
              </Link>
              
              <Button 
                onClick={handleSubmit}
                className="emdr-gradient text-white"
                disabled={createTargetMutation.isPending || !assessmentData.memory || !assessmentData.image || !assessmentData.negativeCognition}
              >
                {createTargetMutation.isPending ? "Saving..." : "Continue to Processing"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
