import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Volume2, Vibrate } from "lucide-react";
import VisualModal from "./VisualModal";
import AuditoryModal from "./AuditoryModal";
import TappingModal from "./TappingModal";
import BLSOptionBox from "./BLSOptionBox";

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
          <BLSOptionBox
            type="visual"
            onClick={() => startBLS('visual')}
            isSelected={blsType === 'visual'}
            size="large"
          />
          
          <BLSOptionBox
            type="auditory"
            onClick={() => startBLS('auditory')}
            isSelected={blsType === 'auditory'}
            size="large"
          />
          
          <BLSOptionBox
            type="tapping"
            onClick={() => startBLS('tapping')}
            isSelected={blsType === 'tapping'}
            size="large"
          />
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