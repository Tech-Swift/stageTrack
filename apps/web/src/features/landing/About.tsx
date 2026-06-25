import React from 'react';
import { Target, Lightbulb, TrendingUp } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      icon: <Target className="text-[#2563EB]" size={20} />,
      title: 'Built For Real Operations',
      desc: "We don't build abstract software. StageTrack is explicitly engineered to handle the chaotic, fast-moving realities of physical loading bays, field marshals, and multi-route fleet operations.",
    },
    {
      icon: <Lightbulb className="text-[#2563EB]" size={20} />,
      title: 'Our Mission',
      desc: 'To empower public transport SACCOs and terminal operators across Kenya with modern digital tools that plug revenue leaks, protect data asset registries, and restore complete operational sanity.',
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden border-b border-slate-200 bg-white py-24 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Background Accent */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 dark:opacity-10" />

      {/* FIXED CONTAINER (prevents stretching) */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
        {/* LEFT SIDE */}
        <div className="space-y-6 lg:col-span-6">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2563EB] dark:bg-blue-500/10">
            Our Story
          </span>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Bridging local transit tradition with clean digital innovation
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            StageTrack was born out of a simple observation: public transport
            terminal operations move at lightning speed, yet the admin systems
            tracking them are completely weighed down by physical clipboards,
            lost logbooks, and fragmented communication loops.
          </p>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            We built a platform that respects the existing workflows of SACCO
            operators, field crews, and drivers while introducing secure,
            cloud-synced precision tracking to give decision-makers instant
            oversight over their entire fleet network.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full space-y-6 lg:col-span-6 lg:ml-auto lg:max-w-2xl">
          {values.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors duration-200 hover:border-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/20 sm:flex-row"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                {item.icon}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Stat Bar */}
          <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-slate-200 p-6 text-xs font-medium text-slate-400 transition-colors dark:border-slate-800 dark:text-slate-500 sm:text-sm">
            <span>Designed for Kenyan SACCO Infrastructure</span>

            <span className="flex items-center gap-1 font-bold text-[#2563EB]">
              <TrendingUp size={16} />
              100% Digital Shift
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};