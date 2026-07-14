import type {
  QueueVehicle,
} from "../types/queue";

interface Props {
  vehicle: QueueVehicle;
  primaryColor: string;
  onReady: () => void;
  onRemove: () => void;
}

export default function LoadingVehicleCard({
  vehicle,
  primaryColor,
  onReady,
  onRemove,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm text-slate-500">
          Currently Loading
        </p>

        <h2 className="text-2xl font-bold">
          {vehicle.vehicle.plateNumber}
        </h2>

        <p className="text-slate-600">
          {vehicle.vehicle.capacity} Seater
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRemove}
          className="
            rounded-xl
            border
            border-red-200
            py-3
            font-semibold
            text-red-600
            transition
            hover:bg-red-50
          "
        >
          Remove
        </button>

        <button
          onClick={onReady}
          className="
            rounded-xl
            py-3
            font-bold
            text-white
          "
          style={{
            backgroundColor: primaryColor,
          }}
        >
          Ready For Dispatch
        </button>
      </div>
    </div>
  );
}