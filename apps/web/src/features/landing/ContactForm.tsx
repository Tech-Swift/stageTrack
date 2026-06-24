import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#0F172A] text-white w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1e3a8a,transparent_60%)] opacity-30" />

      <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Info */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to digitize your terminal logistics?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Leave your contact details and our deployment team will reach out within 24 hours to schedule a custom system demo for your SACCO board directors.
          </p>

          <div className="space-y-4 pt-4 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#2563EB]" />
              <span>deploy@stagetrack.co.ke</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[#2563EB]" />
              <span>+254 700 000000</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Intake Form */}
        <div className="lg:col-span-7 w-full max-w-2xl lg:ml-auto">
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                    <input required type="text" placeholder="e.g., John Kamau" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">SACCO Name</label>
                    <input required type="text" placeholder="e.g., 2N KMM Transport" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <input required type="tel" placeholder="e.g., 0712345678" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input required type="email" placeholder="e.g., info@sacco.co.ke" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message / Operational Requirements</label>
                  <textarea rows={4} placeholder="Tell us how many stages or vehicles your fleet manages..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors text-white resize-none" />
                </div>

                <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold p-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm">
                  Book Operational Consultation
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 text-[#2563EB] border border-blue-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold">Request Received Successfully</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Thank you. A StageTrack systems specialist will reach out directly to coordinate your consultation.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};