import { Trash2 } from "lucide-react";

import type { QueueVehicle } from "../types/queue";

interface Props {
  vehicle: QueueVehicle;
  onRemove: () => void;
}

export default function QueueVehicleCard({
  vehicle,
  onRemove,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">
            Position #{vehicle.position}
          </p>

          <h3 className="text-lg font-bold">
            {vehicle.vehicle.plateNumber}
          </h3>

          <p className="text-sm text-slate-500">
            {vehicle.vehicle.capacity}
            -Seater
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm">
            Waiting
          </div>

          <button
            onClick={onRemove}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}