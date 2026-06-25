import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden border-t border-slate-200 bg-white py-16 text-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
    >
      {/* Background Accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1e3a8a,transparent_60%)] opacity-20 dark:opacity-30" />

      {/* CONTAINER (fix stretching) */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
        {/* LEFT SIDE */}
        <div className="space-y-4 lg:col-span-5">
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2563EB] dark:bg-blue-500/10">
            Get Started
          </span>

          <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Ready to digitize your terminal logistics?
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Leave your contact details and our deployment team will reach out
            within 24 hours to schedule a custom system demo for your SACCO
            board directors.
          </p>

          {/* Contact Info */}
          <div className="space-y-3 pt-2 text-sm text-slate-600 dark:text-slate-400">
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

        {/* RIGHT SIDE */}
        <div className="w-full lg:col-span-7 lg:ml-auto">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#2563EB] dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />

                  <input
                    required
                    type="text"
                    placeholder="SACCO Name"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#2563EB] dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#2563EB] dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />

                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#2563EB] dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                {/* Message */}
                <textarea
                  rows={3}
                  placeholder="Operational requirements (optional)"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition-colors focus:border-[#2563EB] dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />

                {/* Button */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] p-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700"
                >
                  Book Consultation
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="space-y-4 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-[#2563EB]">
                  <CheckCircle2 size={28} />
                </div>

                <h3 className="text-lg font-bold">
                  Request Received Successfully
                </h3>

                <p className="mx-auto max-w-sm text-sm text-slate-600 dark:text-slate-400">
                  A StageTrack systems specialist will reach out shortly to
                  coordinate your consultation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};