import React from 'react';
import { Layers, Map, Users, Truck, BarChart3, ArrowUpRight } from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  gridClass: string;
}

export const FeaturesGrid: React.FC = () => {
  const modules: FeatureItem[] = [
    {
      icon: <Layers className="text-[#2563EB]" size={26} />,
      title: "Stage Management",
      description: "Register physical transit bays, track live bay occupancy, and assign digital marshal logs cleanly—no clipboards or notebooks required.",
      tags: ["Live Allocation", "Marshal Schedules", "Bay Capacity"],
      gridClass: "md:col-span-2 lg:col-span-8"
    },
    {
      icon: <Map className="text-[#2563EB]" size={26} />,
      title: "Route Assignments",
      description: "Map exact routes, link specific stages together, and ensure complete SACCO route compliance effortlessly.",
      tags: ["Route Networks", "Compliance Checking"],
      gridClass: "md:col-span-1 lg:col-span-4"
    },
    {
      icon: <Users className="text-[#2563EB]" size={26} />,
      title: "Crew Management",
      description: "Keep secure digital records for all system operators including conductors, drivers, and field marshals.",
      tags: ["Personnel Profiles", "Accountability Logs"],
      gridClass: "md:col-span-1 lg:col-span-4"
    },
    {
      icon: <Truck className="text-[#2563EB]" size={26} />,
      title: "Vehicle Operations & Queues",
      description: "Manage physical vehicle registrations, auto-arrange queuing priorities, and track dispatch cycles live.",
      tags: ["Automated Queues", "Turnaround Optimization"],
      gridClass: "md:col-span-1 lg:col-span-4"
    },
    {
      icon: <BarChart3 className="text-[#2563EB]" size={26} />,
      title: "Analytics & Reporting",
      description: "Instantly compile detailed daily operations data, active vehicle tallies, and station turnaround performance logs.",
      tags: ["Automated Math", "Daily Audit Export"],
      gridClass: "md:col-span-1 lg:col-span-4"
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#F8FAFC] w-full border-b border-slate-200/60">
      {/* CONTAINER FLUID: Left-to-right fluid design */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Everything you need to digitize terminal operations
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
            StageTrack brings fragmented field workflows together into a centralized digital matrix. Click to explore our core infrastructure modules.
          </p>
        </div>

        {/* The Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {modules.map((item, index) => (
            <div
              key={index}
              className={`bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer ${item.gridClass}`}
            >
              {/* Decorative Subtle Corner Accent */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-300">
                <ArrowUpRight size={18} />
              </div>

              <div>
                {/* Icon Wrapper */}
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 ring-4 ring-blue-50/50 group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#2563EB] transition-colors duration-200">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-500 leading-relaxed text-sm mb-8 max-w-xl">
                  {item.description}
                </p>
              </div>

              {/* Tags Layer */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {item.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-[11px] font-bold tracking-wide bg-slate-100 text-slate-600 px-3 py-1 rounded-md transition-colors group-hover:bg-blue-50/60 group-hover:text-[#2563EB]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};