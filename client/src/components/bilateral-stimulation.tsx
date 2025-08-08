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

  // Auto-start BLS if a type is provided and component is active - but only once per activation
  useEffect(() => {
    if (isActive && blsType && !activeModal) {
      console.log('Auto-starting BLS modal:', blsType);
      setActiveModal(blsType);
    }
  }, [isActive, blsType]);

  const handleModalClose = () => {
    setActiveModal(null);
    onComplete?.();
  };

  const handleSetComplete = () => {
    setActiveModal(null);
    onSetComplete?.();
  };

  const startBLS = (type: 'visual' | 'auditory' | 'tapping') => {
    // Close any currently active modal first, then immediately open new one
    setActiveModal(null);
    // Use immediate state update without delay for responsiveness
    setActiveModal(type);
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
          onClose={handleModalClose}
          onSetComplete={handleSetComplete}
        />
      )}

      {activeModal === 'auditory' && (
        <AuditoryModal 
          onClose={handleModalClose}
          onSetComplete={handleSetComplete}
        />
      )}

      {activeModal === 'tapping' && (
        <TappingModal 
          onClose={handleModalClose}
          onSetComplete={handleSetComplete}
        />
      )}
    </>
  );
}