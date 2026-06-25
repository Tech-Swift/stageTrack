import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, ArrowRight, Users } from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  route: string;
  status: 'In Queue' | 'Loading' | 'Dispatched';
}

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', plate: 'KDF 456A', route: '102 - Kikuyu', status: 'Loading' },
    { id: '2', plate: 'KCD 789B', route: '102 - Kikuyu', status: 'In Queue' },
    { id: '3', plate: 'KBA 111C', route: '102 - Kikuyu', status: 'In Queue' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) => {
        const updated = [...prev];
        const shifted = updated.shift();

        if (shifted) {
          const nextNum = Math.floor(100 + Math.random() * 899);
          const letters = ['X', 'Y', 'Z', 'G', 'H'];
          const nextLetter = letters[Math.floor(Math.random() * letters.length)];

          updated.push({
            id: Date.now().toString(),
            plate: `KDC ${nextNum}${nextLetter}`,
            route: '102 - Kikuyu',
            status: 'In Queue',
          });

          if (updated[0]) {
            updated[0].status = 'Loading';
          }
        }

        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white text-slate-900 dark:bg-[#0F172A] dark:text-white pt-28 pb-20 lg:pt-36 lg:pb-32 transition-colors duration-300">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl grid grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:px-12">
                    {/* Left Content */}
          <div className="space-y-6 text-center lg:col-span-6 lg:text-left xl:col-span-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB] dark:border-blue-500/20 dark:bg-blue-500/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2563EB]" />
            Digital Terminal Logistics Platform
          </span>

          <h1 className="text-4xl font-black leading-none tracking-tight sm:text-5xl xl:text-6xl">
            Modern Transport <br />
            <span className="text-[#2563EB]">Stage Management</span> <br />
            for SACCOs & Terminals
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg lg:mx-0 lg:max-w-xl xl:max-w-2xl">
            Digitize your physical stages, assign marshals instantly, monitor
            live vehicle queues, and streamline your entire transport ecosystem
            from an edge-to-edge unified platform.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
            <button
              onClick={() => navigate('/register')}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 sm:w-auto"
            >
              Request Demo / Register
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-100 px-8 py-4 font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto"
            >
              Explore Modules
            </button>
          </div>
        </div>

        {/* Right Widget */}
        <div className="flex w-full justify-center lg:col-span-6 lg:justify-end xl:col-span-6">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#22C55E]" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Live Terminal Monitor
                </h4>
              </div>

              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-[#2563EB] dark:border-blue-500/20 dark:bg-blue-500/10">
                STAGE-A
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {vehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                      index === 0
                        ? 'border-[#2563EB]/40 bg-blue-600/10 shadow-inner'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-800/80 dark:bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`rounded-lg p-2.5 ${
                          index === 0
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <Bus size={20} />
                      </div>

                      <div>
                        <p className="font-mono text-base font-bold tracking-wider text-slate-900 dark:text-white">
                          {vehicle.plate}
                        </p>
                        <p className="text-xs text-slate-500">
                          {vehicle.route}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${
                        vehicle.status === 'Loading'
                          ? 'border border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800/60">
              <span className="flex items-center gap-1">
                <Users size={14} />
                Active Marshals: 4
              </span>

              <span>Avg. Load Time: 6m</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

