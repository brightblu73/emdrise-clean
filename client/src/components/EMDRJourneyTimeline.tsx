import { Sliders, Cloud, Target, RefreshCcw, Link, Activity, Lock, Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function EMDRJourneyTimeline() {
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
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div 
                    className="text-center cursor-pointer p-3 rounded-lg hover:bg-primary-green/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue/20"
                    data-testid={`emdr-stage-${step.label.toLowerCase().replace(/\s+/g, '-')}`}
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
                  side="top"
                  sideOffset={8}
                  collisionPadding={16}
                  avoidCollisions={true}
                  className="max-w-[220px] bg-primary-green/10 text-primary-blue border border-primary-green/20 rounded-md p-3 text-xs shadow-xl backdrop-blur-sm"
                  data-testid={`emdr-stage-tooltip-${step.label.toLowerCase().replace(/\s+/g, '-')}`}
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