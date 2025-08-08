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
  disableAutoStart?: boolean;
}

export default function BilateralStimulation({ isActive, onComplete, onSetComplete, blsType = 'visual', disableAutoStart = false }: BilateralStimulationProps) {
  const [activeModal, setActiveModal] = useState<'visual' | 'auditory' | 'tapping' | null>(null);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  // Auto-start BLS if a type is provided and component is active (unless disabled)
  useEffect(() => {
    console.log('BLS useEffect triggered - isActive:', isActive, 'blsType:', blsType, 'activeModal:', activeModal, 'hasAutoStarted:', hasAutoStarted);
    if (isActive && blsType && !activeModal && !disableAutoStart && !hasAutoStarted) {
      console.log('Auto-starting BLS modal:', blsType, 'isActive:', isActive, 'activeModal:', activeModal);
      setActiveModal(blsType);
      setHasAutoStarted(true);
    }
    // Reset only when component becomes truly inactive
    if (!isActive) {
      console.log('Component inactive, resetting hasAutoStarted');
      setHasAutoStarted(false);
      setActiveModal(null); // Ensure modal is closed when inactive
    }
  }, [isActive, blsType, activeModal, disableAutoStart, hasAutoStarted]);

  const handleModalClose = () => {
    console.log('BLS Modal closing, current activeModal:', activeModal);
    setActiveModal(null);
    setHasAutoStarted(true); // Keep auto-start flag true to prevent re-triggering
    console.log('BLS Modal closed, calling onComplete');
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