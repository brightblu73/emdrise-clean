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
          {/* Add extra vertical spacing to accommodate tooltips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 gap-y-20">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative group cursor-pointer p-3 rounded-lg hover:bg-primary-green/10 transition-colors">
                <div className="w-10 h-10 mx-auto mb-3 text-primary-blue">
                  <step.icon className="w-full h-full" />
                </div>
                <div className="text-sm font-semibold text-primary-blue leading-tight mb-2">
                  {step.label}
                </div>
                
                {/* Tooltip - Smart positioning based on grid position */}
                <div className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute z-50 left-1/2 transform -translate-x-1/2
                  ${index < 2 ? 'top-full mt-3' : ''}
                  ${index >= 2 && index < 3 ? 'sm:bottom-full sm:mb-4 top-full mt-3' : ''}
                  ${index >= 3 && index < 4 ? 'md:bottom-full md:mb-4 sm:bottom-full sm:mb-4 top-full mt-3' : ''}
                  ${index >= 4 ? 'md:bottom-full md:mb-4 sm:bottom-full sm:mb-4 top-full mt-3' : ''}
                `}>
                  <div className="w-36 sm:w-40 md:w-44 bg-primary-green/10 text-primary-blue text-center rounded-md p-3 text-xs shadow-xl border border-primary-green/20 backdrop-blur-sm">
                    {step.tooltip}
                    
                    {/* Arrow for mobile (always below) */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 bottom-full border-l-4 border-r-4 border-b-4 border-transparent border-b-primary-green/10 sm:hidden"></div>
                    
                    {/* Arrow for tablet (3rd item) */}
                    {index >= 2 && index < 3 && (
                      <>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-green/10 hidden sm:block md:hidden"></div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 bottom-full border-l-4 border-r-4 border-b-4 border-transparent border-b-primary-green/10 block sm:hidden"></div>
                      </>
                    )}
                    
                    {/* Arrow for desktop (4th+ items) */}
                    {index >= 3 && (
                      <>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-green/10 hidden md:block"></div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 top-full border-l-4 border-r-4 border-t-4 border-transparent border-t-primary-green/10 hidden sm:block md:hidden"></div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 bottom-full border-l-4 border-r-4 border-b-4 border-transparent border-b-primary-green/10 block sm:hidden"></div>
                      </>
                    )}
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