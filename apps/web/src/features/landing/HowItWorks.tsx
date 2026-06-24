import React from 'react';
import { Building2, Milestone, Truck, CheckSquare } from 'lucide-react';

interface StepItem {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const HowItWorks: React.FC = () => {
  const steps: StepItem[] = [
    {
      number: "01",
      icon: <Building2 className="text-[#2563EB]" size={24} />,
      title: "Register Your SACCO",
      description: "Set up your management portal profile, secure access parameters, and input your central terminal administration details."
    },
    {
      number: "02",
      icon: <Milestone className="text-[#2563EB]" size={24} />,
      title: "Map Stages & Routes",
      description: "Digitally draw your operational routes, link your transit bays, and establish priority queue parameters."
    },
    {
      number: "03",
      icon: <Truck className="text-[#2563EB]" size={24} />,
      title: "Onboard Vehicles & Crew",
      description: "Register fleet number plates and assign roles to drivers, conductors, and terminal field marshals instantly."
    },
    {
      number: "04",
      icon: <CheckSquare className="text-[#2563EB]" size={24} />,
      title: "Go Fully Digital",
      description: "Launch real-time scheduling queues, dispatch units dynamically, and receive structured end-of-day revenue reports."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white w-full border-b border-slate-100">
      {/* CONTAINER FLUID: Left-to-right alignment matching the blueprint */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
            Deployment Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Transitioning to digital logistics is simple
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl">
            No massive system overhauls needed. StageTrack deploys seamlessly over your existing physical routing structure in four quick stages.
          </p>
        </div>

        {/* Timeline Flow Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connecting Line Effect for Desktop Screens */}
          <div className="hidden lg:block absolute top-[68px] left-8 right-8 h-[2px] bg-slate-100 -z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col group">
              
              {/* Header Badge Layer */}
              <div className="flex items-center justify-between mb-6 lg:justify-start lg:gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm ring-4 ring-white group-hover:border-blue-200 group-hover:bg-blue-50/20 transition-all duration-300">
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-200/80 tracking-tight font-mono group-hover:text-blue-200 transition-colors duration-300">
                  {step.number}
                </span>
              </div>

              {/* Text Blocks */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>

              {/* Mobile Decorative Divider */}
              {idx !== steps.length - 1 && (
                <div className="block md:hidden w-full h-[1px] bg-slate-100 my-6" />
              )}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};