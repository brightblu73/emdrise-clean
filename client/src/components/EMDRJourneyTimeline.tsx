import { Sliders, Cloud, Target, RefreshCcw, Link, Activity, Lock, Heart } from "lucide-react";

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
              <div key={index} className="text-center relative group cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="w-10 h-10 mx-auto mb-3 text-blue-600">
                  <step.icon className="w-full h-full" />
                </div>
                <div className="text-sm font-semibold text-blue-600 leading-tight">
                  {step.label}
                </div>
                
                {/* Tooltip */}
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                  <div className="w-44 bg-blue-50 text-blue-800 text-center rounded-md p-2 text-xs shadow-lg border border-blue-200">
                    {step.tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-50"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}