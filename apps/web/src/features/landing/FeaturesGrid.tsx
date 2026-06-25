import React from 'react';
import {
  Layers,
  Map,
  Users,
  Truck,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  onClick?: () => void;
  href?: string;
}

export const FeaturesGrid: React.FC = () => {
  const modules: FeatureItem[] = [
    {
      icon: <Layers className="text-[#2563EB]" size={26} />,
      title: 'Stage Management',
      description:
        'Register physical transit bays, track live bay occupancy, and assign digital marshal logs cleanly—no clipboards or notebooks required.',
      tags: ['Live Allocation', 'Marshal Schedules', 'Bay Capacity'],
      onClick: () => console.log('Navigate to Stage Management'),
    },
    {
      icon: <Map className="text-[#2563EB]" size={26} />,
      title: 'Route Assignments',
      description:
        'Map exact routes, link specific stages together, and ensure complete SACCO route compliance effortlessly.',
      tags: ['Route Networks', 'Compliance Checking'],
    },
    {
      icon: <Users className="text-[#2563EB]" size={26} />,
      title: 'Crew Management',
      description:
        'Keep secure digital records for all system operators including conductors, drivers, and field marshals.',
      tags: ['Personnel Profiles', 'Accountability Logs'],
    },
    {
      icon: <Truck className="text-[#2563EB]" size={26} />,
      title: 'Vehicle Operations & Queues',
      description:
        'Manage physical vehicle registrations, auto-arrange queuing priorities, and track dispatch cycles live.',
      tags: ['Automated Queues', 'Turnaround Optimization'],
    },
    {
      icon: <BarChart3 className="text-[#2563EB]" size={26} />,
      title: 'Analytics & Reporting',
      description:
        'Instantly compile detailed daily operations data, active vehicle tallies, and station turnaround performance logs.',
      tags: ['Automated Math', 'Daily Audit Export'],
    },
  ];

  return (
    <section
      id="features"
      className="w-full border-b border-slate-200 bg-[#F8FAFC] py-24 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Centered Container (fixes stretching) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center lg:text-left">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2563EB] dark:bg-blue-500/10">
            Platform Capabilities
          </span>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to digitize terminal operations
          </h2>

          <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            StageTrack brings fragmented field workflows together into a
            centralized digital matrix. Click to explore our core infrastructure
            modules.
          </p>
        </div>

        {/* Grid (FIXED: no more extreme stretching) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((item, index) => {
            const isInteractive = Boolean(item.onClick || item.href);

            const interactiveProps = isInteractive
              ? {
                  role: 'button',
                  tabIndex: 0,
                  onClick: item.onClick,
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      item.onClick?.();
                    }
                  },
                }
              : {};

            return (
              <div
                key={index}
                {...interactiveProps}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${
                  isInteractive ? 'cursor-pointer' : ''
                }`}
              >
                {/* Hover Icon */}
                <div className="absolute right-4 top-4 text-slate-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-slate-600">
                  <ArrowUpRight size={18} />
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 ring-4 ring-blue-50/50 transition-transform duration-300 group-hover:scale-105 dark:bg-blue-500/10 dark:ring-blue-500/10">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-[#2563EB] dark:text-white">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-600 transition-colors group-hover:bg-blue-50/60 group-hover:text-[#2563EB] dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
