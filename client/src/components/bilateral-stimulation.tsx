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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset BLS states and handle transitions when component state changes
  useEffect(() => {
    if (!isActive) {
      // Set transitioning state when component becomes inactive
      setIsTransitioning(true);
      
      // Force hide all grid elements immediately using DOM manipulation
      const hideGrids = () => {
        const grids = document.querySelectorAll('.grid, [class*="grid"]');
        grids.forEach(grid => {
          (grid as HTMLElement).style.display = 'none';
          (grid as HTMLElement).style.visibility = 'hidden';
          (grid as HTMLElement).style.opacity = '0';
        });
      };
      
      hideGrids();
      setTimeout(hideGrids, 10);
      
      // Reset states
      setHasAutoStarted(false);
      setActiveModal(null);
      
      // Clear transitioning state after delay
      const transitionTimer = setTimeout(() => {
        setIsTransitioning(false);
        
        // Restore grid elements visibility after transition
        const restoreGrids = () => {
          const grids = document.querySelectorAll('.grid, [class*="grid"]');
          grids.forEach(grid => {
            (grid as HTMLElement).style.display = '';
            (grid as HTMLElement).style.visibility = '';
            (grid as HTMLElement).style.opacity = '';
          });
        };
        
        restoreGrids();
      }, 300);
      
      return () => clearTimeout(transitionTimer);
    }
  }, [isActive]);

  // Auto-start BLS ONLY once when first activated - NEVER restart automatically
  useEffect(() => {
    console.log('BLS useEffect triggered - isActive:', isActive, 'blsType:', blsType, 'activeModal:', activeModal, 'hasAutoStarted:', hasAutoStarted);
    
    // ONLY auto-start on FIRST activation - never after user interactions
    if (isActive && blsType && !activeModal && !disableAutoStart && !hasAutoStarted) {
      console.log('Auto-starting BLS modal:', blsType, 'isActive:', isActive, 'activeModal:', activeModal);
      setActiveModal(blsType);
      setHasAutoStarted(true);
    }
  }, [isActive, blsType, disableAutoStart, hasAutoStarted]); // Keep hasAutoStarted to track state properly

  const handleModalClose = () => {
    console.log('BLS Modal closing, current activeModal:', activeModal);
    setActiveModal(null);
    setHasAutoStarted(true); // PREVENT any auto-restart
    console.log('BLS Modal closed, calling onComplete');
    // Add a small delay to prevent immediate re-triggering
    setTimeout(() => {
      onComplete?.();
    }, 100);
  };

  const handleSetComplete = () => {
    setActiveModal(null);
    onSetComplete?.();
  };

  const startBLS = (type: 'visual' | 'auditory' | 'tapping') => {
    console.log('Manual BLS start requested:', type);
    // Only allow manual start if no modal is currently active
    if (!activeModal) {
      setActiveModal(type);
      setHasAutoStarted(true); // Mark as manually started to prevent auto-restart
    }
  };

  return (
    <>
      {/* Only show BLS Type Selection if no active modal - hide when BLS is already running */}
      {!activeModal && (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isTransitioning ? 'bls-transitioning' : ''}`}>
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