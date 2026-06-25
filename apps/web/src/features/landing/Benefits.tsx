import React from 'react';
import { Shield, HardHat, CheckCircle2 } from 'lucide-react';

interface BenefitCard {
  role: string;
  icon: React.ReactNode;
  points: string[];
}

export const Benefits: React.FC = () => {
  const benefitRoles: BenefitCard[] = [
    {
      role: 'For SACCO Management',
      icon: <Shield className="text-[#2563EB]" size={24} />,
      points: [
        'Complete visibility over multi-stage operations.',
        'Elimination of revenue leaks caused by paper tallying errors.',
        'Instant performance audits and operational data lookups.',
      ],
    },
    {
      role: 'For Stage Marshals',
      icon: <HardHat className="text-[#2563EB]" size={24} />,
      points: [
        'Clear digital bay assignments directly on the terminal floor.',
        'Simplified vehicle check-ins with automatic priority queuing.',
        'Zero arguments over manual clipboard sequence lists.',
      ],
    },
    {
      role: 'For Drivers & Crews',
      icon: <CheckCircle2 className="text-[#2563EB]" size={24} />,
      points: [
        'Fair, tamper-proof loading queues across all stations.',
        'Reduced turnaround confusion at complex intersections.',
        'Clear schedule tracking that ensures transparent allocations.',
      ],
    },
  ];

  return (
    <section
      id="benefits"
      className="w-full border-b border-slate-200 bg-[#F8FAFC] py-24 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
    >
      {/* FIXED CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center lg:text-left">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2563EB] dark:bg-blue-500/10">
            Operational Value
          </span>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Accountability and structure for everyone involved
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            StageTrack delivers value to the entire transport network—from
            directors tracking logistics dashboards down to teams navigating
            active loading bays.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {benefitRoles.map((card, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/20"
            >
              {/* Header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-blue-50 dark:border-slate-800 dark:bg-blue-500/10">
                  {card.icon}
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {card.role}
                </h3>
              </div>

              {/* Points */}
              <ul className="space-y-4">
                {card.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-8 border-t border-slate-100 pt-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800">
                Optimized Workflow
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};