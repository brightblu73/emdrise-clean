import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Target, ArrowRight, AlertTriangle, ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TargetMemoryData {
  targetMemory: string;
  worstPartImage: string;
  negativeCognition: string;
  positiveCognition: string;
  initialVoc: number;
  emotions: string;
  initialSuds: number;
  bodyLocation: string;
}

interface TargetMemorySetupProps {
  sessionId: number;
  onComplete: (targetId: number) => void;
  onBack?: () => void;
}

export default function TargetMemorySetup({ sessionId, onComplete, onBack }: TargetMemorySetupProps) {
  const [formData, setFormData] = useState<TargetMemoryData>({
    targetMemory: "",
    worstPartImage: "",
    negativeCognition: "",
    positiveCognition: "",
    initialVoc: 1,
    emotions: "",
    initialSuds: 0,
    bodyLocation: ""
  });

  const [errors, setErrors] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const createTarget = useMutation({
    mutationFn: async (data: TargetMemoryData) => {
      console.log("Creating target memory with data:", data);
      // Use localStorage instead of backend API for frontend-only session management
      const targetId = Date.now(); // Simple ID generation
      const target = { id: targetId, ...data, sessionId };
      
      // Store in localStorage
      const existingTargets = JSON.parse(localStorage.getItem('emdr_targets') || '[]');
      existingTargets.push(target);
      localStorage.setItem('emdr_targets', JSON.stringify(existingTargets));
      
      return target;
    },
    onSuccess: (target: any) => {
      console.log("Target memory created successfully:", target);
      onComplete(target.id);
    },
    onError: (error: any) => {
      console.error("Failed to create target memory:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
    }
  });

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    const requiredFields: (keyof TargetMemoryData)[] = [
      "targetMemory", "worstPartImage", "negativeCognition", "positiveCognition", 
      "emotions", "bodyLocation"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        const fieldNames: Record<keyof TargetMemoryData, string> = {
          targetMemory: "Target Memory",
          worstPartImage: "Worst Part (Image)", 
          negativeCognition: "Negative Cognition",
          positiveCognition: "Positive Cognition",
          emotions: "Emotions/Feelings",
          bodyLocation: "Location of body sensation",
          initialVoc: "VOC",
          initialSuds: "SUDS"
        };
        newErrors.push(fieldNames[field]);
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Target memory form submitted with data:", formData);
    
    if (!validateForm()) {
      console.log("Form validation failed, missing fields:", errors);
      return;
    }
    
    console.log("Form validation passed, creating target memory...");
    createTarget.mutate(formData);
  };

  const updateField = (field: keyof TargetMemoryData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-blue-800">
            <Target className="mr-3 h-6 w-6" />
            Setting up the Target Memory
          </CardTitle>
          <p className="text-gray-600">
            Identifying the target memory to be reprocessed.
          </p>
        </CardHeader>
        <CardContent>
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-red-800 font-medium">Please complete the following required fields:</p>
                  <ul className="text-red-700 mt-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Memory */}
            <div className="space-y-2">
              <Label htmlFor="targetMemory" className="text-base font-medium">
                Target Memory - What memory are we going to work on today? *
              </Label>
              <Textarea
                id="targetMemory"
                value={formData.targetMemory}
                onChange={(e) => updateField("targetMemory", e.target.value)}
                placeholder="Describe the specific memory you want to work on..."
                rows={3}
                className="w-full"
                required
              />
            </div>

            {/* Worst Part Image */}
            <div className="space-y-2">
              <Label htmlFor="worstPartImage" className="text-base font-medium">
                Worst Part (Image) - What picture represents the worst part of the incident? *
              </Label>
              <Textarea
                id="worstPartImage"
                value={formData.worstPartImage}
                onChange={(e) => updateField("worstPartImage", e.target.value)}
                placeholder="Describe the most disturbing image or snapshot from this memory..."
                rows={3}
                className="w-full"
                required
              />
            </div>

            {/* Negative Cognition */}
            <div className="space-y-2">
              <Label htmlFor="negativeCognition" className="text-base font-medium">
                Negative Cognition - When you bring up the picture, what negative belief do you have about yourself now? *
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                (The negative cognition should be self-referential: "I'm shameful", "I should have done something", "I am in danger", "I'm weak")
              </p>
              <Input
                id="negativeCognition"
                value={formData.negativeCognition}
                onChange={(e) => updateField("negativeCognition", e.target.value)}
                placeholder="I am..."
                className="w-full"
                required
              />
            </div>

            {/* Positive Cognition */}
            <div className="space-y-2">
              <Label htmlFor="positiveCognition" className="text-base font-medium">
                Positive Cognition - When you bring up that picture/incident, what would you prefer to believe about yourself now? *
              </Label>
              <p className="text-sm text-gray-600 mb-2">
                (The positive cognition should be self-referential: "I'm a good person", "I did the best I could", "It's over; I'm safe now", "I'm strong")
              </p>
              <Input
                id="positiveCognition"
                value={formData.positiveCognition}
                onChange={(e) => updateField("positiveCognition", e.target.value)}
                placeholder="I am..."
                className="w-full"
                required
              />
            </div>

            {/* VOC Rating */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Validity Of Cognition (VOC) - When you think of that picture/incident, how true does that positive cognition feel to you now?
              </Label>
              <p className="text-sm text-gray-600">
                Scale of 1 to 7, where 1 is untrue and 7 is totally true
              </p>
              <div className="w-full px-4">
                <Slider
                  value={[formData.initialVoc]}
                  onValueChange={(value) => updateField("initialVoc", value[0])}
                  max={7}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 (Untrue)</span>
                  <span className="font-medium text-blue-600">Current: {formData.initialVoc}</span>
                  <span>7 (Totally True)</span>
                </div>
              </div>
            </div>

            {/* Emotions */}
            <div className="space-y-2">
              <Label htmlFor="emotions" className="text-base font-medium">
                Emotions/Feelings - When you bring up that incident and those words (negative cognition), what emotions do you feel now? *
              </Label>
              <Input
                id="emotions"
                value={formData.emotions}
                onChange={(e) => updateField("emotions", e.target.value)}
                placeholder="Fear, anger, sadness, shame..."
                className="w-full"
                required
              />
            </div>

            {/* SUDS Rating */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                SUDS (Subjective Units of Distress) - On a scale of 0 to 10, how disturbing does it feel to you now?
              </Label>
              <p className="text-sm text-gray-600">
                Where 0 is no disturbance and 10 is the highest disturbance imaginable
              </p>
              <div className="w-full px-4">
                <Slider
                  value={[formData.initialSuds]}
                  onValueChange={(value) => updateField("initialSuds", value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0 (No Disturbance)</span>
                  <span className="font-medium text-blue-600">Current: {formData.initialSuds}</span>
                  <span>10 (Highest Disturbance)</span>
                </div>
              </div>
            </div>

            {/* Body Location */}
            <div className="space-y-2">
              <Label htmlFor="bodyLocation" className="text-base font-medium">
                Location of body sensation - Where do you feel that in your body? *
              </Label>
              <Input
                id="bodyLocation"
                value={formData.bodyLocation}
                onChange={(e) => updateField("bodyLocation", e.target.value)}
                placeholder="Chest, stomach, shoulders, throat..."
                className="w-full"
                required
              />
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                size="lg"
                disabled={createTarget.isPending}
                className="flex items-center"
              >
                {createTarget.isPending ? "Setting up..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}