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
    if (!isActive) {
      console.log('Component inactive, resetting hasAutoStarted');
      setHasAutoStarted(false);
    }
  }, [isActive, blsType, activeModal, disableAutoStart, hasAutoStarted]);

  const handleModalClose = () => {
    console.log('BLS Modal closing, current activeModal:', activeModal);
    setActiveModal(null);
    setHasAutoStarted(false); // Reset auto-start flag
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
      {/* TEMPORARILY DISABLED BLS Option boxes to test if they're causing auto-clicks */}
      {!activeModal && (
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-800">BLS options temporarily disabled for debugging</p>
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