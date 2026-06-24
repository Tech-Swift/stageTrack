import React from 'react';
import { Target, Lightbulb, TrendingUp } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      icon: <Target className="text-[#2563EB]" size={20} />,
      title: "Built For Real Operations",
      desc: "We don't build abstract software. StageTrack is explicitly engineered to handle the chaotic, fast-moving realities of physical loading bays, field marshals, and multi-route fleet operations."
    },
    {
      icon: <Lightbulb className="text-[#2563EB]" size={20} />,
      title: "Our Mission",
      desc: "To empower public transport SACCOs and terminal operators across Kenya with modern digital tools that plug revenue leaks, protect data asset registries, and restore complete operational sanity."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white w-full border-b border-slate-100 relative overflow-hidden">
      {/* Subtle grid accent flair on the far right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />

      {/* CONTAINER FLUID: Left-to-right alignment matching layout parameters */}
      <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Your Story / Vision Statement */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full inline-block">
            Our Story
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
            Bridging local transit tradition with clean digital innovation
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            StageTrack was born out of a simple observation: public transport terminal operations move at lightning speed, yet the admin systems tracking them are completely weighed down by physical clipboards, lost logbooks, and fragmented communication loops.
          </p>
          
          <p className="text-slate-600 text-sm leading-relaxed">
            We built a platform that respects the existing workflows of SACCO operators, field crews, and drivers while introducing secure, cloud-synced precision tracking to give decision-makers instant oversight over their entire fleet network.
          </p>
        </div>

        {/* Right Side: Core Values Matrix */}
        <div className="lg:col-span-6 space-y-6 w-full max-w-2xl lg:ml-auto">
          {values.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start transition-colors duration-200 hover:border-blue-100"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0F172A]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}

          {/* Micro Stat Bar */}
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-slate-400 font-medium">
            <span>Designed for Kenyan SACCO Infrastructure</span>
            <span className="text-[#2563EB] font-bold flex items-center gap-1">
              <TrendingUp size={16} /> 100% Digital Shift
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};