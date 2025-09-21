import { Sliders, Cloud, Target, RefreshCcw, Link, Activity, Lock, Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

export default function EMDRJourneyTimeline() {
  const [openTooltips, setOpenTooltips] = useState<{ [key: number]: boolean }>({});
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle tooltip toggle for touch devices (single-open behavior)
  const handleTooltipToggle = (index: number) => {
    if (isTouchDevice) {
      setOpenTooltips(prev => {
        // If this tooltip is already open, close it
        if (prev[index]) {
          return {};
        }
        // Otherwise, close all others and open this one
        return { [index]: true };
      });
    }
  };

  // Close tooltip when clicking outside
  const handleClickOutside = () => {
    if (isTouchDevice) {
      setOpenTooltips({});
    }
  };

  // Add click outside listener
  useEffect(() => {
    if (isTouchDevice) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isTouchDevice]);

  const steps = [
    {
      icon: Sliders,
      label: "Preparation",
      tooltip: "Try your preferred BLS method."
    },
    {
      icon: Cloud,
      label: "Calm Place",
      tooltip: "Create a mental safe space to return to when needed."
    },
    {
      icon: Target,
      label: "Target Memory",
      tooltip: "Identify the image, belief, and emotions that represent the memory."
    },
    {
      icon: RefreshCcw,
      label: "Reprocessing",
      tooltip: "Process the memory using BLS while observing what comes up."
    },
    {
      icon: Link,
      label: "Installation",
      tooltip: "Strengthen the positive belief using BLS."
    },
    {
      icon: Activity,
      label: "Body Scan",
      tooltip: "Check your body for any lingering tension or discomfort."
    },
    {
      icon: Lock,
      label: "Closure",
      tooltip: "Return to a calm state before finishing the session."
    },
    {
      icon: Heart,
      label: "Aftercare",
      tooltip: "Reflect and take gentle steps to look after yourself post-session."
    }
  ];

  return (
    <section className="py-12 px-6 emdr-gradient">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Your EMDR Journey</h2>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Tooltip 
                key={index}
                open={isTouchDevice ? openTooltips[index] : undefined}
                onOpenChange={isTouchDevice ? undefined : undefined}
              >
                <TooltipTrigger asChild>
                  <div 
                    className="text-center cursor-pointer p-3 rounded-lg hover:bg-primary-green/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/20"
                    data-testid={`emdr-stage-${step.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={(e) => {
                      if (isTouchDevice) {
                        e.stopPropagation();
                        handleTooltipToggle(index);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (isTouchDevice) {
                          handleTooltipToggle(index);
                        }
                      }
                      if (e.key === 'Escape') {
                        setOpenTooltips({});
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isTouchDevice ? !!openTooltips[index] : undefined}
                    aria-describedby={isTouchDevice && openTooltips[index] ? `tooltip-${index}` : undefined}
                  >
                    <div className="w-10 h-10 mx-auto mb-3 text-primary-blue">
                      <step.icon className="w-full h-full" />
                    </div>
                    <div className="text-sm font-semibold text-primary-blue leading-tight">
                      {step.label}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  sideOffset={12}
                  collisionPadding={24}
                  avoidCollisions={true}
                  className="max-w-[240px] bg-primary-green/15 text-primary-blue border border-primary-green/25 rounded-lg p-4 text-sm font-semibold shadow-2xl backdrop-blur-md z-50 leading-relaxed"
                  style={{ color: 'hsl(217, 88%, 45%)' }}
                  data-testid={`emdr-stage-tooltip-${step.label.toLowerCase().replace(/\s+/g, '-')}`}
                  id={`tooltip-${index}`}
                >
                  {step.tooltip}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}