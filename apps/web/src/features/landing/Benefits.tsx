import React from 'react';
import { Shield, HardHat, CheckCircle2 } from 'lucide-react';

interface BenefitCard {
  role: string;
  icon: React.ReactNode;
  points: string[];
  bgClass: string;
}

export const Benefits: React.FC = () => {
  const benefitRoles: BenefitCard[] = [
    {
      role: "For SACCO Management",
      icon: <Shield className="text-[#2563EB]" size={24} />,
      bgClass: "bg-white border-slate-200/80",
      points: [
        "Complete visibility over multi-stage operations.",
        "Elimination of revenue leaks caused by paper tallying errors.",
        "Instant performance audits and instant operational data lookups."
      ]
    },
    {
      role: "For Stage Marshals",
      icon: <HardHat className="text-[#2563EB]" size={24} />,
      bgClass: "bg-white border-slate-200/80",
      points: [
        "Clear digital bay assignments directly on the terminal floor.",
        "Simplified vehicle check-ins with automatic priority queuing.",
        "Zero arguments over manual clipboard sequence lists."
      ]
    },
    {
      role: "For Drivers & Crews",
      icon: <CheckCircle2 className="text-[#2563EB]" size={24} />,
      bgClass: "bg-white border-slate-200/80",
      points: [
        "Fair, tamper-proof loading queues across all stations.",
        "Reduced turnaround confusion at complex intersections.",
        "Clear schedule tracking that ensures transparent allocations."
      ]
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-[#F8FAFC] w-full border-b border-slate-200/60">
      {/* CONTAINER FLUID: Left-to-right alignment */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
            Operational Value
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Accountability and structure for everyone involved
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl">
            StageTrack delivers value to the entire transport network—from directors tracking logistics dashboards down to teams navigating active loading bays.
          </p>
        </div>

        {/* Roles Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {benefitRoles.map((card, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl border flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md ${card.bgClass}`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-black text-[#0F172A]">{card.role}</h3>
                </div>

                {/* Benefits Bullet Stack */}
                <ul className="space-y-4">
                  {card.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0 mt-2" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Decoration */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-slate-400 tracking-wider uppercase">
                Optimized Workflow
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};