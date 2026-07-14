import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useRemoveFromQueue } from "../hooks/useQueue";

import type { QueueVehicle } from "../types/queue";

interface RemoveVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: QueueVehicle;
}

export default function RemoveVehicleDialog({
  open,
  onClose,
  vehicle,
}: RemoveVehicleDialogProps) {
  const removeMutation =
    useRemoveFromQueue();

  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  async function handleRemove() {
    if (!reason.trim()) {
      return;
    }

    await removeMutation.mutateAsync({
      queueId: vehicle.id,
      reason: reason.trim(),
    });

    onClose();
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onClose}
    >
      <AlertDialogContent className="w-[95vw] max-w-5xl rounded-2xl">

        <AlertDialogHeader>

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>

          <AlertDialogTitle className="text-center text-2xl">
            Remove Vehicle
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            This action removes the vehicle from today's
            dispatch queue. A reason is required and will
            be recorded for audit purposes.
          </AlertDialogDescription>

        </AlertDialogHeader>
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Vehicle Summary */}

        <div className="rounded-xl border bg-slate-50 p-5">
          <h3 className="mb-4 font-semibold">
            Vehicle Details
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Vehicle
              </span>

              <span className="font-semibold">
                {vehicle.vehicle.plateNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Queue Number
              </span>

              <span className="font-semibold">
                #{vehicle.sequenceNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Position
              </span>

              <span className="font-semibold">
                {vehicle.position ?? "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Capacity
              </span>

              <span className="font-semibold">
                {vehicle.vehicle.capacity} Seater
              </span>
            </div>

            <div className="border-t" />

            <div className="flex justify-between">
              <span className="text-slate-500">
                Stage
              </span>

              <span className="font-semibold">
                {vehicle.stage?.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Route
              </span>

              <span className="font-semibold">
                {vehicle.route?.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Arrival
              </span>

              <span className="font-semibold">
                {new Date(
                  vehicle.arrival.arrivalTime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Reason */}

        <div className="space-y-3">
          <h3 className="font-semibold">
            Removal Reason
          </h3>

          <Textarea
            rows={10}
            placeholder="Explain why this vehicle is being removed from today's queue..."
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
          />
        </div>
      </div>

      {/* Warning */}

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="mb-2 font-semibold text-red-800">
          This action will:
        </p>

        <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
          <li>Remove the vehicle from today's queue.</li>
          <li>Record the removal reason.</li>
          <li>Record who removed the vehicle.</li>
          <li>Record the removal timestamp.</li>
        </ul>
      </div>
        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={removeMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={
              removeMutation.isPending ||
              !reason.trim()
            }
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            {removeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Vehicle
              </>
            )}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}