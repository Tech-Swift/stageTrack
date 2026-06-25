import React from 'react';
import {
  XCircle,
  CheckCircle,
  Clipboard,
  Users,
  ShieldAlert,
  TrendingDown,
} from 'lucide-react';

export const Problems: React.FC = () => {
  const manualProblems = [
    {
      icon: <Clipboard className="text-red-500" size={24} />,
      title: 'Paper Queue Management',
      desc: 'Vehicle logs on clipboards lead to tracking errors, missed slots, and zero real-time terminal visibility.',
    },
    {
      icon: <Users className="text-red-500" size={24} />,
      title: 'Unclear Marshal Duties',
      desc: 'Lack of centralized schedules leaves staff allocations uncoordinated across separate bays and shifts.',
    },
    {
      icon: <ShieldAlert className="text-red-500" size={24} />,
      title: 'Scattered Route Data',
      desc: 'Fleet operational statuses and route compliance metrics are completely cut off from SACCO headquarters.',
    },
    {
      icon: <TrendingDown className="text-red-500" size={24} />,
      title: 'No Operational Reports',
      desc: 'Compiling end-of-day revenue performance and vehicle turnover rates takes hours of manual processing.',
    },
  ];

  return (
    <section
      id="problems"
      className="w-full border-b border-slate-200 bg-white py-20 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Centered Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl space-y-3 text-center">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#2563EB] dark:bg-blue-500/10">
            The Industry Challenge
          </span>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Terminal Operations Are Still Managed Manually
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Relying on physical logbooks creates revenue leaks and communication
            breakdowns. StageTrack bridges that operational gap.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Manual Operations Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <XCircle className="shrink-0 text-red-500" size={22} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  The Traditional Manual Way
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {manualProblems.map((problem, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
                      {problem.icon}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {problem.title}
                    </h4>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {problem.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Result: Slow terminal dispatch times and administrative errors.
            </div>
          </div>

          {/* StageTrack Solution Card */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-white p-6 transition-colors dark:border-slate-800 dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A] sm:p-8">
            {/* Glow Effect (Dark Mode Only) */}
            <div className="absolute inset-0 hidden dark:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#1e3a8a,transparent_70%)] opacity-40" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <CheckCircle
                    className="shrink-0 text-[#22C55E]"
                    size={22}
                  />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    The StageTrack Solution
                  </h3>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  By taking your vehicle queues, route assignments, and
                  personnel profiles completely digital, StageTrack centralizes
                  your workspace into a cloud-synced operational command center.
                </p>

                <ul className="space-y-4">
                  {[
                    'Real-time visibility into active queue positions.',
                    'Transparent marshal assignments directly via web dashboard.',
                    'Automated route compliance logs for transport operators.',
                    'Instant digital report compilation with zero math required.',
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 sm:text-sm"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2563EB]/20 text-xs font-bold text-[#2563EB]">
                        ✓
                      </span>

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-8 border-t border-blue-100 pt-6 text-xs font-semibold text-[#2563EB] dark:border-slate-800">
                Result: Fast terminal turnarounds, organized crews, and secure
                metrics.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
