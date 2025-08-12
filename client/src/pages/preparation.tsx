import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import TherapistOffice from "@/components/therapist-office";
import AudioGuide from "@/components/audio-guide";
import VisualModal from "@/components/VisualModal";
import AuditoryModal from "@/components/AuditoryModal";
import TappingModal from "@/components/TappingModal";
import BLSPickerGuide from "@/components/BLSPickerGuide";
import BLSOptionBox from "@/components/BLSOptionBox";
import { useAuth } from "../state/AuthProvider";
import { ArrowRight, BookOpen, Shield, Brain } from "lucide-react";

export default function Preparation() {
  const { user } = useAuth();
  const [safePlace, setSafePlace] = useState("");
  const [hasEstablishedSafePlace, setHasEstablishedSafePlace] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [showAuditory, setShowAuditory] = useState(false);
  const [showTapping, setShowTapping] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const preferred = localStorage.getItem("preferredBLS");

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-800">Phase 2: Preparation</h1>
            <div className="flex items-center space-x-2">
              <div className="emdr-phase-indicator emdr-phase-1-2">2</div>
              <span className="text-sm text-slate-600">Phase 2 of 8</span>
            </div>
          </div>
          <Progress value={25} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Therapist Guidance */}
          <div className="lg:col-span-1">
            <Card className="therapeutic-card">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Preparation Guidance</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Welcome to your EMDR preparation phase. We'll establish the foundation for your healing journey.
                </p>
                <AudioGuide 
                  text="Welcome to your EMDR preparation phase. Today we'll establish the foundation for your healing journey by learning about EMDR theory and creating your safe place."
                  duration="2:30"
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* EMDR Theory */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-primary" />
                  Understanding EMDR Theory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "The eye movements we use in EMDR seem to unlock the nervous system and allow your brain to process the experience. That may be what is happening in REM, or dream, sleep: The eye movements may be involved in processing the unconscious material."
                </div>
                
                <div className="text-slate-600 italic text-sm">
                  "The important thing to remember is that it is your own brain that will be doing the healing and that you are the one in control. Often, when something traumatic happens, it seems to get locked in the nervous system with the original picture, sounds, thoughts, feelings, and so on."
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-2">Key EMDR Principles:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Your brain has natural healing capabilities</li>
                    <li>• You remain in control throughout the process</li>
                    <li>• Traumatic memories can become "unstuck" and processed</li>
                    <li>• Bilateral stimulation helps integrate separated memory networks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Safe Place Creation */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-primary-green" />
                  Create Your Safe Place
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "Your safe place is a mental sanctuary where you can find calm and stability. This can be a real place you've been to, or an imaginary location that feels peaceful and secure to you."
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="safePlace">Describe your safe place in detail</Label>
                    <Textarea
                      id="safePlace"
                      placeholder="Describe what you see, hear, smell, and feel in your safe place. Include as many sensory details as possible..."
                      value={safePlace}
                      onChange={(e) => setSafePlace(e.target.value)}
                      rows={6}
                      className="mt-2"
                    />
                  </div>

                  <div className="bg-primary-green/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-2">Safe Place Guidelines:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li>• Choose a place where you feel completely safe and calm</li>
                      <li>• Include all your senses: what you see, hear, smell, feel</li>
                      <li>• This place should be yours alone</li>
                      <li>• You can return here anytime during processing</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={() => setHasEstablishedSafePlace(true)}
                    disabled={!safePlace.trim()}
                    className="w-full"
                  >
                    Establish My Safe Place
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bilateral Stimulation Testing */}
            <Card className="therapeutic-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-secondary-blue" />
                  Testing Eye Movements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-slate-600 italic text-sm">
                  "Before we begin processing, let's test different types of bilateral stimulation to find what works best for you. We'll try different directions and speeds."
                </div>
                
                <button 
                  onClick={() => setShowGuide(true)} 
                  className="text-sm underline mt-2 text-blue-600 hover:text-blue-800"
                >
                  Which one should I use?
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BLSOptionBox
                    type="visual"
                    onClick={() => {
                      setShowVisual(true);
                      localStorage.setItem("preferredBLS", "visual");
                    }}
                    isSelected={preferred === "visual"}
                    size="medium"
                  />
                  
                  <BLSOptionBox
                    type="auditory"
                    onClick={() => {
                      setShowAuditory(true);
                      localStorage.setItem("preferredBLS", "auditory");
                    }}
                    isSelected={preferred === "auditory"}
                    size="medium"
                  />
                  
                  <BLSOptionBox
                    type="tapping"
                    onClick={() => {
                      setShowTapping(true);
                      localStorage.setItem("preferredBLS", "tapping");
                    }}
                    isSelected={preferred === "tapping"}
                    size="medium"
                  />
                </div>

                {/* Display preferred method */}
                {preferred && (
                  <p className="text-sm text-center mt-4 text-slate-600">
                    Your preferred method is: <span className="font-semibold capitalize">{preferred}</span>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Link href="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
              
              <Link href="/assessment">
                <Button 
                  className="emdr-gradient text-white"
                  disabled={!hasEstablishedSafePlace}
                >
                  Continue to Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Modal */}
      {showVisual && <VisualModal onClose={() => setShowVisual(false)} onSetComplete={() => setShowVisual(false)} />}
      
      {/* Auditory Modal */}
      {showAuditory && <AuditoryModal onClose={() => setShowAuditory(false)} onSetComplete={() => setShowAuditory(false)} />}
      
      {/* Tapping Modal */}
      {showTapping && <TappingModal onClose={() => setShowTapping(false)} onSetComplete={() => setShowTapping(false)} />}
      
      {/* BLS Picker Guide */}
      {showGuide && <BLSPickerGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}
