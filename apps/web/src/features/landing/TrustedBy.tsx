import React from 'react';
import { ShieldCheck, Landmark, ShieldAlert, Award } from 'lucide-react';

export const TrustedBy: React.FC = () => {
  return (
    <section className="bg-slate-900 text-slate-400 py-8 border-b border-slate-800 w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2 shrink-0">
          <ShieldCheck className="text-[#2563EB]" size={20} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Engineered for Transport Standards:
          </span>
        </div>

        {/* Mock Regulatory / SACCO Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-sm font-bold tracking-wide text-slate-400">
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Landmark size={18} className="text-slate-500" />
            <span>NTSA Operations Compliant</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Award size={18} className="text-slate-500" />
            <span>Built for Matatu SACCOs</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <ShieldAlert size={18} className="text-slate-500" />
            <span>Secure Fleet Data Audit</span>
          </div>
        </div>

      </div>
    </section>
  );
};