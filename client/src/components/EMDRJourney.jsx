import React, { useState, useEffect } from 'react';

// Simple EMDRJourney component that renders only the current script
// This replaces any potential duplicate rendering issues
export default function EMDRJourney({ currentScript = 1, onScriptChange }) {
  const [activeScript, setActiveScript] = useState(currentScript);

  // Update active script when prop changes
  useEffect(() => {
    setActiveScript(currentScript);
  }, [currentScript]);

  const handleNext = () => {
    const nextScript = activeScript + 1;
    setActiveScript(nextScript);
    if (onScriptChange) {
      onScriptChange(nextScript);
    }
  };

  const handlePrevious = () => {
    const prevScript = Math.max(1, activeScript - 1);
    setActiveScript(prevScript);
    if (onScriptChange) {
      onScriptChange(prevScript);
    }
  };

  // Simple script renderer - renders only the current script
  const renderCurrentScript = () => {
    switch (activeScript) {
      case 1:
        return (
          <div className="emdr-script">
            <h2>Script 1: Welcome & Introduction</h2>
            <p>Beginning your EMDR journey with your therapist.</p>
            <button onClick={handleNext} className="continue-btn">
              Continue to Calm Place Setup
            </button>
          </div>
        );
      case 2:
        return (
          <div className="emdr-script">
            <h2>Script 2: Calm Place Setup</h2>
            <p>Creating your safe space for therapy.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Continue to Target Memory
            </button>
          </div>
        );
      case 3:
        return (
          <div className="emdr-script">
            <h2>Script 3: Target Memory</h2>
            <p>Identifying the memory to process.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Continue to Reprocessing
            </button>
          </div>
        );
      case 4:
        return (
          <div className="emdr-script">
            <h2>Script 4: Desensitization Setup</h2>
            <p>Preparing for bilateral stimulation and reprocessing.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Begin Reprocessing
            </button>
          </div>
        );
      case 5:
        return (
          <div className="emdr-script">
            <h2>Script 5: Reprocessing</h2>
            <p>Active bilateral stimulation and memory processing.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Continue to Installation
            </button>
          </div>
        );
      case 6:
        return (
          <div className="emdr-script">
            <h2>Script 6: Installation</h2>
            <p>Installing positive beliefs.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Continue Installation
            </button>
          </div>
        );
      case 7:
        return (
          <div className="emdr-script">
            <h2>Script 7: Installation Continued</h2>
            <p>Strengthening positive beliefs with BLS.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Continue to Body Scan
            </button>
          </div>
        );
      case 8:
        return (
          <div className="emdr-script">
            <h2>Script 8: Body Scan</h2>
            <p>Scanning for remaining disturbance in the body.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Continue to Closure
            </button>
          </div>
        );
      case 9:
        return (
          <div className="emdr-script">
            <h2>Script 9: Closure</h2>
            <p>Returning to your calm place.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={handleNext} className="continue-btn">
              Continue to Aftercare
            </button>
          </div>
        );
      case 10:
        return (
          <div className="emdr-script">
            <h2>Script 10: Aftercare</h2>
            <p>Final guidance and session completion.</p>
            <button onClick={handlePrevious} className="back-btn">Back</button>
            <button onClick={() => setActiveScript(1)} className="restart-btn">
              New Session
            </button>
          </div>
        );
      default:
        return (
          <div className="emdr-script">
            <h2>Session Complete</h2>
            <p>Thank you for completing your EMDR session.</p>
            <button onClick={() => setActiveScript(1)} className="restart-btn">
              Start New Session
            </button>
          </div>
        );
    }
  };

  // Render ONLY the current script - no duplicates
  return (
    <div className="emdr-journey-container">
      {renderCurrentScript()}
    </div>
  );
}