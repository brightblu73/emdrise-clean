import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Volume2, Vibrate } from "lucide-react";
import VisualModal from "./VisualModal";
import AuditoryModal from "./AuditoryModal";
import TappingModal from "./TappingModal";

interface BilateralStimulationProps {
  isActive: boolean;
  onComplete?: () => void;
  onSetComplete?: () => void;
  blsType?: 'visual' | 'auditory' | 'tapping';
}

export default function BilateralStimulation({ isActive, onComplete, onSetComplete, blsType = 'visual' }: BilateralStimulationProps) {
  const [activeModal, setActiveModal] = useState<'visual' | 'auditory' | 'tapping' | null>(null);

  // Auto-start BLS if a type is provided and component is active
  useEffect(() => {
    if (isActive && blsType && !activeModal) {
      setActiveModal(blsType);
    }
  }, [isActive, blsType, activeModal]);

  const handleModalClose = () => {
    setActiveModal(null);
    if (onComplete) {
      onComplete();
    }
  };

  const handleSetComplete = () => {
    if (onSetComplete) {
      onSetComplete();
    }
  };

  const startBLS = (type: 'visual' | 'auditory' | 'tapping') => {
    // Close any currently active modal first
    setActiveModal(null);
    // Then open the new one after a brief delay to ensure cleanup
    setTimeout(() => {
      setActiveModal(type);
    }, 50);
  };

  return (
    <>
      {/* Only show BLS Type Selection if no active modal - hide when BLS is already running */}
      {!activeModal && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => startBLS('visual')}
            variant={blsType === 'visual' ? 'default' : 'outline'}
            className="h-24 flex flex-col space-y-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
          >
            <Eye className="h-8 w-8 text-blue-600" />
            <span className="font-semibold text-blue-700">Visual</span>
            <span className="text-xs text-blue-600">Follow moving ball</span>
          </Button>

          <Button
            onClick={() => startBLS('auditory')}
            variant={blsType === 'auditory' ? 'default' : 'outline'}
            className="h-24 flex flex-col space-y-2 bg-green-50 hover:bg-green-100 border-green-200"
          >
            <Volume2 className="h-8 w-8 text-green-600" />
            <span className="font-semibold text-green-700">Auditory</span>
            <span className="text-xs text-green-600">Stereo sound tones</span>
          </Button>

          <Button
            onClick={() => startBLS('tapping')}
            variant={blsType === 'tapping' ? 'default' : 'outline'}
            className="h-24 flex flex-col space-y-2 bg-purple-50 hover:bg-purple-100 border-purple-200"
          >
            <Vibrate className="h-8 w-8 text-purple-600" />
            <span className="font-semibold text-purple-700">Tapping</span>
            <span className="text-xs text-purple-600">Self-administered</span>
          </Button>
        </div>
      )}

      {/* Professional BLS Modals */}
      {activeModal === 'visual' && (
        <VisualModal 
          onClose={() => {
            setActiveModal(null);
            if (onComplete) onComplete();
          }}
          onSetComplete={() => {
            setActiveModal(null);
            if (onSetComplete) onSetComplete();
          }}
        />
      )}

      {activeModal === 'auditory' && (
        <AuditoryModal 
          onClose={() => {
            setActiveModal(null);
            if (onComplete) onComplete();
          }}
          onSetComplete={() => {
            setActiveModal(null);
            if (onSetComplete) onSetComplete();
          }}

        />
      )}

      {activeModal === 'tapping' && (
        <TappingModal 
          onClose={() => {
            setActiveModal(null);
            if (onComplete) onComplete();
          }}
          onSetComplete={() => {
            setActiveModal(null);
            if (onSetComplete) onSetComplete();
          }}
        />
      )}
    </>
  );
}