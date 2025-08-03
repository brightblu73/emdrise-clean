import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import mariaPortrait from "@/assets/maria-portrait.svg";
import alistairPortrait from "@/assets/alistair-portrait.svg";

interface TherapistSelectorProps {
  onSelect: (therapist: "female" | "male") => void;
  selectedTherapist?: "female" | "male";
}

export default function TherapistSelector({ onSelect, selectedTherapist }: TherapistSelectorProps) {
  const [selected, setSelected] = useState<"female" | "male" | null>(selectedTherapist || null);

  const handleSelect = (therapist: "female" | "male") => {
    setSelected(therapist);
    onSelect(therapist);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Therapist</h1>
        <p className="text-lg text-gray-600">
          Select the therapist you'd like to guide you through your EMDR journey. 
          Both therapists provide identical professional guidance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Female Therapist - Maria */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selected === "female" 
              ? "ring-2 ring-blue-500 shadow-lg" 
              : "border-gray-200"
          }`}
          onClick={() => handleSelect("female")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <img src={mariaPortrait} alt="Maria" className="w-full h-full object-cover" />
            </div>
            <CardTitle className="text-xl">Maria</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-4">
              Warm, compassionate guidance with a gentle approach to EMDR therapy.
            </p>
            {selected === "female" && (
              <div className="flex items-center justify-center text-blue-600">
                <UserCheck className="h-5 w-5 mr-2" />
                <span className="font-medium">Selected</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Male Therapist - Alistair */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selected === "male" 
              ? "ring-2 ring-blue-500 shadow-lg" 
              : "border-gray-200"
          }`}
          onClick={() => handleSelect("male")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <img src={alistairPortrait} alt="Alistair" className="w-full h-full object-cover" />
            </div>
            <CardTitle className="text-xl">Alistair</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-4">
              Calm, steady guidance with a structured approach to EMDR therapy.
            </p>
            {selected === "male" && (
              <div className="flex items-center justify-center text-blue-600">
                <UserCheck className="h-5 w-5 mr-2" />
                <span className="font-medium">Selected</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selected && (
        <div className="text-center mt-8">
          <Button size="lg" className="px-8">
            Continue with {selected === "female" ? "Maria" : "Alistair"}
          </Button>
        </div>
      )}
    </div>
  );
}