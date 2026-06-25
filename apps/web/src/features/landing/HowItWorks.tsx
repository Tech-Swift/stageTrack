import React from 'react';
import {
  Building2,
  Milestone,
  Truck,
  CheckSquare,
} from 'lucide-react';

interface StepItem {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const HowItWorks: React.FC = () => {
  const steps: StepItem[] = [
    {
      number: '01',
      icon: <Building2 className="text-[#2563EB]" size={24} />,
      title: 'Register Your SACCO',
      description:
        'Set up your management portal profile, secure access parameters, and input your central terminal administration details.',
    },
    {
      number: '02',
      icon: <Milestone className="text-[#2563EB]" size={24} />,
      title: 'Map Stages & Routes',
      description:
        'Digitally draw your operational routes, link your transit bays, and establish priority queue parameters.',
    },
    {
      number: '03',
      icon: <Truck className="text-[#2563EB]" size={24} />,
      title: 'Onboard Vehicles & Crew',
      description:
        'Register fleet number plates and assign roles to drivers, conductors, and terminal field marshals instantly.',
    },
    {
      number: '04',
      icon: <CheckSquare className="text-[#2563EB]" size={24} />,
      title: 'Go Fully Digital',
      description:
        'Launch real-time scheduling queues, dispatch units dynamically, and receive structured end-of-day revenue reports.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full border-b border-slate-200 bg-white py-24 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
    >
      {/* FIXED CONTAINER (prevents stretching) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-3xl space-y-4 text-center lg:text-left">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2563EB] dark:bg-blue-500/10">
            Deployment Roadmap
          </span>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Transitioning to digital logistics is simple
          </h2>

          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            No massive system overhauls needed. StageTrack deploys seamlessly
            over your existing physical routing structure in four quick stages.
          </p>
        </div>

        {/* Steps Grid (NO horizontal line anymore) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={idx} className="group flex flex-col">
              {/* Icon + Number */}
              <div className="mb-6 flex items-center justify-between lg:justify-start lg:gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm ring-4 ring-white transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50/30 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-950 dark:group-hover:border-blue-500/30 dark:group-hover:bg-blue-500/10">
                  {step.icon}
                </div>

                <span className="font-mono text-3xl font-black tracking-tight text-slate-200 transition-colors duration-300 group-hover:text-blue-200 dark:text-slate-800 dark:group-hover:text-blue-400">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-[#2563EB] dark:text-white">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};