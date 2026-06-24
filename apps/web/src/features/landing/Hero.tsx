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
          updated[0].status = 'Loading';
        }
        return updated;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#0F172A] pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden text-white w-full">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30" />

      {/* CONTAINER FLUID: Responsive side margins, no maximum width restriction */}
      <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Grid Layout */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-[#2563EB] border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            Digital Terminal Logistics Platform
          </span>
          
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-none">
            Modern Transport <br />
            <span className="text-[#2563EB]">Stage Management</span> <br />
            for SACCOs & Terminals
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Digitize your physical stages, assign marshals instantly, monitor live vehicle queues, and streamline your entire transport ecosystem from an edge-to-edge unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Request Demo / Register
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('features');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-8 py-4 rounded-xl transition-colors cursor-pointer"
            >
              Explore Modules
            </button>
          </div>
        </div>

        {/* Right Grid Layout (Dashboard Monitor Widget stretches beautifully) */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end w-full">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl backdrop-blur-sm w-full max-w-xl">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400">Live Terminal Monitor</h4>
              </div>
              <span className="text-[10px] bg-blue-500/10 text-[#2563EB] border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                STAGE-A
              </span>
            </div>

            {/* Queue Cards */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {vehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      index === 0
                        ? 'bg-blue-600/10 border-[#2563EB]/40 shadow-inner'
                        : 'bg-slate-950/40 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-lg ${index === 0 ? 'bg-[#2563EB] text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Bus size={20} />
                      </div>
                      <div>
                        <p className="font-mono font-bold tracking-wider text-base text-white">{vehicle.plate}</p>
                        <p className="text-xs text-slate-500">{vehicle.route}</p>
                      </div>
                    </div>
                    
                    <span className={`text-[11px] px-3 py-1 rounded-full font-bold tracking-wide ${
                      vehicle.status === 'Loading' 
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {vehicle.status}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users size={14} /> Active Marshals: 4
              </span>
              <span>Avg. Load Time: 6m</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};