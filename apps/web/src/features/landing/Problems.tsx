import React from 'react';
import { XCircle, CheckCircle, Clipboard, Users, ShieldAlert, TrendingDown } from 'lucide-react';

export const Problems: React.FC = () => {
  const manualProblems = [
    {
      icon: <Clipboard className="text-red-500" size={24} />,
      title: "Paper Queue Management",
      desc: "Vehicle logs on clipboards lead to tracking errors, missed slots, and zero real-time terminal visibility."
    },
    {
      icon: <Users className="text-red-500" size={24} />,
      title: "Unclear Marshal Duties",
      desc: "Lack of centralized schedules leaves staff allocations uncoordinated across separate bays and shifts."
    },
    {
      icon: <ShieldAlert className="text-red-500" size={24} />,
      title: "Scattered Route Data",
      desc: "Fleet operational statuses and route compliance metrics are completely cut off from SACCO headquarters."
    },
    {
      icon: <TrendingDown className="text-red-500" size={24} />,
      title: "No Operational Reports",
      desc: "Compiling end-of-day revenue performance and vehicle turnover rates takes hours of manual processing."
    }
  ];

  return (
    <section id="problems" className="py-20 bg-white w-full border-b border-slate-100">
      {/* CONTAINER FLUID: Matching alignment */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
            The Industry Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Terminal Operations Are Still Managed Manually
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Relying on physical logbooks creates revenue leaks and communication breakdowns. StageTrack bridges that operational gap.
          </p>
        </div>

        {/* Content Split: Manual Chaos vs Digital Streamline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Block: The Manual Way */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <XCircle className="text-red-500 shrink-0" size={22} />
                <h3 className="text-lg font-bold text-slate-800">The Traditional Manual Way</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {manualProblems.map((prob, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                      {prob.icon}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{prob.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{prob.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200/60 text-xs font-medium text-slate-400">
              Result: Slow terminal dispatch times and administrative errors.
            </div>
          </div>

          {/* Right Block: The StageTrack Way */}
          <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#1e3a8a,transparent_70%)] opacity-40" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="text-[#22C55E] shrink-0" size={22} />
                <h3 className="text-lg font-bold text-white">The StageTrack Solution</h3>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                By taking your vehicle queues, route assignments, and personnel profiles completely digital, StageTrack centralizes your workspace onto an cloud-synced operational matrix.
              </p>

              <ul className="space-y-4">
                {[
                  "Real-time visibility into active queue positions.",
                  "Transparent marshal assignments directly via web dashboard.",
                  "Automated route compliance logs for transport operators.",
                  "Instant digital report compilation with zero math required."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-md bg-[#2563EB]/20 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 relative z-10 text-xs font-semibold text-[#2563EB]">
              Result: Fast terminal turnarounds, organized crews, and secure metrics.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};