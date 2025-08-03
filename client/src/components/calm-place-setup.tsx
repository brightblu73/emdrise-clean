import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CalmPlaceData {
  imageDescription: string;
  sensoryDetails: string;
  positiveEmotion: string;
  bodyLocation: string;
  cueWord: string;
  reminderPrompt: string;
}

interface CalmPlaceSetupProps {
  sessionId: number;
  onComplete: (calmPlaceId: number) => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export default function CalmPlaceSetup({ sessionId, onComplete, onSkip, onBack }: CalmPlaceSetupProps) {
  const [formData, setFormData] = useState<CalmPlaceData>({
    imageDescription: "",
    sensoryDetails: "",
    positiveEmotion: "",
    bodyLocation: "",
    cueWord: "",
    reminderPrompt: ""
  });

  const queryClient = useQueryClient();

  const createCalmPlace = useMutation({
    mutationFn: async (data: CalmPlaceData) => {
      console.log("Creating calm place with data:", data);
      // Use localStorage instead of backend API for frontend-only session management
      const calmPlaceId = Date.now(); // Simple ID generation
      const calmPlace = { id: calmPlaceId, ...data, sessionId };
      
      // Store in localStorage
      const existingCalmPlaces = JSON.parse(localStorage.getItem('emdr_calm_places') || '[]');
      existingCalmPlaces.push(calmPlace);
      localStorage.setItem('emdr_calm_places', JSON.stringify(existingCalmPlaces));
      
      return calmPlace;
    },
    onSuccess: (calmPlace: any) => {
      console.log("Calm place created successfully:", calmPlace);
      onComplete(calmPlace.id);
    },
    onError: (error) => {
      console.error("Failed to create calm place:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    // Validate required fields
    const required = ["imageDescription", "sensoryDetails", "positiveEmotion", "bodyLocation", "cueWord"];
    const missing = required.filter(field => !formData[field as keyof CalmPlaceData]);
    
    if (missing.length > 0) {
      console.log("Missing required fields:", missing);
      alert(`Please complete all required fields: ${missing.join(", ")}`);
      return;
    }
    
    console.log("All fields valid, creating calm place...");
    createCalmPlace.mutate(formData);
  };

  const updateField = (field: keyof CalmPlaceData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-blue-800">
            <Heart className="mr-3 h-6 w-6" />
            Your Calm Place Details
          </CardTitle>
          <p className="text-gray-600">
            Create a personal sanctuary in your mind that you can return to whenever you need peace and grounding.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Description */}
            <div className="space-y-2">
              <Label htmlFor="imageDescription" className="text-base font-medium">
                What does your Calm Place look like? *
              </Label>
              <Textarea
                id="imageDescription"
                value={formData.imageDescription}
                onChange={(e) => updateField("imageDescription", e.target.value)}
                placeholder="Describe the visual details of your calm place - a beach, forest, room, or any space that feels peaceful to you..."
                rows={3}
                className="w-full"
                required
              />
            </div>

            {/* Sensory Details */}
            <div className="space-y-2">
              <Label htmlFor="sensoryDetails" className="text-base font-medium">
                What sounds, smells, colors, or textures are in your Calm Place? *
              </Label>
              <Textarea
                id="sensoryDetails"
                value={formData.sensoryDetails}
                onChange={(e) => updateField("sensoryDetails", e.target.value)}
                placeholder="Include any sensory details - the sound of waves, scent of flowers, warm sunlight, soft grass..."
                rows={3}
                className="w-full"
                required
              />
            </div>

            {/* Positive Emotion */}
            <div className="space-y-2">
              <Label htmlFor="positiveEmotion" className="text-base font-medium">
                What emotions do you feel when you imagine being there? *
              </Label>
              <Input
                id="positiveEmotion"
                value={formData.positiveEmotion}
                onChange={(e) => updateField("positiveEmotion", e.target.value)}
                placeholder="Peace, calm, safety, happiness, contentment..."
                className="w-full"
                required
              />
            </div>

            {/* Body Location */}
            <div className="space-y-2">
              <Label htmlFor="bodyLocation" className="text-base font-medium">
                Where in your body do you feel these calming sensations? *
              </Label>
              <Input
                id="bodyLocation"
                value={formData.bodyLocation}
                onChange={(e) => updateField("bodyLocation", e.target.value)}
                placeholder="Chest, shoulders, stomach, whole body..."
                className="w-full"
                required
              />
            </div>

            {/* Cue Word */}
            <div className="space-y-2">
              <Label htmlFor="cueWord" className="text-base font-medium">
                Choose a word that brings you back to this place *
              </Label>
              <Input
                id="cueWord"
                value={formData.cueWord}
                onChange={(e) => updateField("cueWord", e.target.value)}
                placeholder="Peace, safe, calm, breathe..."
                className="w-full"
                required
              />
            </div>

            {/* Reminder Prompt (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="reminderPrompt" className="text-base font-medium">
                What would you like to remind yourself the next time you visit this place? (Optional)
              </Label>
              <Textarea
                id="reminderPrompt"
                value={formData.reminderPrompt}
                onChange={(e) => updateField("reminderPrompt", e.target.value)}
                placeholder="A personal message of encouragement or reminder..."
                rows={2}
                className="w-full"
              />
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                size="lg"
                disabled={createCalmPlace.isPending}
                className="flex items-center"
              >
                {createCalmPlace.isPending ? "Creating..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}