export default function EmptyQueue() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="text-5xl">
        🚌
      </div>

      <h3 className="mt-4 text-lg font-bold">
        No Vehicles in Queue
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Add a vehicle arrival to begin
        loading passengers.
      </p>
    </div>
  );
}