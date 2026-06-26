interface Props {
  waiting: number;
  loading: number;
  dispatchedToday: number;
}

export default function QueueStats({
  waiting,
  loading,
  dispatchedToday,
}: Props) {
  const stats = [
    {
      label: "Waiting",
      value: waiting,
    },
    {
      label: "Loading",
      value: loading,
    },
    {
      label: "Dispatched",
      value: dispatchedToday,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs text-slate-500">
            {stat.label}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}