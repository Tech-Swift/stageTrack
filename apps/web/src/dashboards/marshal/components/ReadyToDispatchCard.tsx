import { ArrowLeft, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { QueueVehicle } from "../types/queue";

interface ReadyToDispatchCardProps {
  vehicle: QueueVehicle;
  primaryColor: string;

  onDispatch: () => void;
  onReturnToQueue: () => void;
}

export default function ReadyToDispatchCard({
  vehicle,
  primaryColor,
  onDispatch,
  onReturnToQueue,
}: ReadyToDispatchCardProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-orange-600 font-semibold">
            READY TO DISPATCH
          </p>

          <h3 className="mt-1 text-2xl font-bold">
            {vehicle.vehicle.plateNumber}
          </h3>

          <p className="text-sm text-muted-foreground">
            {vehicle.route?.name}
          </p>
        </div>

        <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
          Awaiting Confirmation
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onReturnToQueue}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Queue
        </Button>

        <Button
          style={{
            backgroundColor: primaryColor,
          }}
          onClick={onDispatch}
        >
          <Send className="mr-2 h-4 w-4" />
          Dispatch
        </Button>
      </div>
    </div>
  );
}