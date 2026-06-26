import type {
  QueueVehicle,
} from "../types/queue";

interface Props {
  vehicle: QueueVehicle;
  primaryColor: string;
  onReady: () => void;
}

export default function LoadingVehicleCard({
  vehicle,
  primaryColor,
  onReady,
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
          {vehicle.vehicle.capacity}
          {" "}Seater
        </p>
      </div>

      <button
        onClick={onReady}
        className="w-full rounded-xl py-3 text-white font-bold"
        style={{
          backgroundColor:
            primaryColor,
        }}
      >
        Ready For Dispatch
      </button>
    </div>
  );
}