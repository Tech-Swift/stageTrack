import React from 'react';
import { Bus, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 w-full transition-colors duration-300">
      {/* FIXED CONTAINER WIDTH: Matching the exact spacing constraints of the updated Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-[#2563EB] p-1.5 rounded-lg text-white flex items-center justify-center">
                <Bus size={18} />
              </div>
              <span className="text-lg font-black tracking-tight text-[#0F172A] dark:text-white">
                Stage<span className="text-[#2563EB]">Track</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Modern digital transport operations built specifically to streamline SACCO management, marshal duties, and terminal logistics.
            </p>
          </div>

          {/* Platform Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleScrollTo('features')} className="hover:text-[#2563EB] dark:hover:text-slate-200 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('how-it-works')} className="hover:text-[#2563EB] dark:hover:text-slate-200 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('benefits')} className="hover:text-[#2563EB] dark:hover:text-slate-200 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer">
                  Benefits
                </button>
              </li>
            </ul>
          </div>

          {/* Company / Contact Meta */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleScrollTo('about')} className="hover:text-[#2563EB] dark:hover:text-slate-200 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('contact')} className="hover:text-[#2563EB] dark:hover:text-slate-200 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer">
                  Request Access
                </button>
              </li>
            </ul>
          </div>

          {/* Support / Trust Badge info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Support & Trust</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Mail size={16} className="text-[#2563EB]" />
              <span>support@stagetrack.co.ke</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl max-w-xs">
              <ShieldCheck size={18} className="text-[#22C55E] mt-0.5 shrink-0" />
              <p className="text-xs leading-snug text-slate-500 dark:text-slate-400">
                Data protected & optimized for local SACCO operations compliance.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} StageTrack. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-[#2563EB] dark:hover:text-white transition-colors text-slate-500 dark:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#2563EB] dark:hover:text-white transition-colors text-slate-500 dark:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};