interface Props {
  vehicle: any;
}

export default function QueueVehicleCard({
  vehicle,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">
            Position #{vehicle.position}
          </p>

          <h3 className="text-lg font-bold">
            {
              vehicle.vehicle
                .plateNumber
            }
          </h3>

          <p className="text-sm text-slate-500">
            {
              vehicle.vehicle
                .capacity
            }
            -Seater
          </p>
        </div>

        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm">
          Waiting
        </div>
      </div>
    </div>
  );
}