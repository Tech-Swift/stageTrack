import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { useDispatch } from "../hooks/useDispatch";
import { calculateDispatchCharges } from "../utils/dispatchCalculator";

import DispatchHeader from "../ui/DispatchHeader";
import { DispatchSummary } from "../ui/DispatchSummary";
import { DispatchForm } from "../ui/DispatchForm";
import { DispatchActions } from "../ui/DispatchActions";

import type { QueueVehicle } from "../types/queue";
import type { TenantBranding } from "../types/dashboard";

interface DispatchModalProps {
  open: boolean;
  onClose: () => void;

  queueVehicle: QueueVehicle | null;

  branding: TenantBranding | null;

  onSuccess?: () => void;
}

export function DispatchModal({
  open,
  onClose,
  queueVehicle,
  branding,
  onSuccess,
}: DispatchModalProps) {
  const dispatchMutation = useDispatch();
  const isSubmitting =
  dispatchMutation.isPending;

  const [busFare, setBusFare] = useState("");
  const [saccoFee, setSaccoFee] = useState("");
  const [remarks, setRemarks] = useState("");

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  useEffect(() => {
    if (!open) {
      setBusFare("");
      setSaccoFee("");
      setRemarks("");
      setConfirmOpen(false);
    }
  }, [open]);

  const charges = useMemo(() => {
    if (!queueVehicle) {
      return null;
    }

    return calculateDispatchCharges({
      capacity: queueVehicle.vehicle.capacity,
      busFare: Number(busFare) || 0,
      saccoFee: Number(saccoFee) || 0,
    });
  }, [queueVehicle, busFare, saccoFee]);

  if (!queueVehicle || !charges) {
    return null;
  }

  async function handleDispatch() {
    if (!queueVehicle || !charges) { return null; }  
    await dispatchMutation.mutateAsync({
      queueId: queueVehicle.id,
      busFare: Number(busFare),
      saccoFee: Number(saccoFee),
      remarks,
    });

    setConfirmOpen(false);

    onSuccess?.();

    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent
        className="
          w-[96vw]
          max-w-4xl
          max-h-[92vh]
          overflow-hidden
          rounded-2xl
          p-0
          flex
          flex-col
        "
      >
        {/* Header */}

        <DispatchHeader
          branding={
            branding ?? {
              displayName: "StageTrack",
              primaryColor: "#2563EB",
            }
          }
          stage={{
            name:
              queueVehicle.stage?.name ??
              "Unknown Stage",
          }}
          route={{
            name:
              queueVehicle.route?.name ?? "",
            origin:
              queueVehicle.route?.origin ?? "",
            destination:
              queueVehicle.route?.destination ??
              "",
          }}
        />

        {/* Body */}

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[42%_58%]
              gap-6
              items-start
            "
          >
            {/* Form */}
            <div
              className="
                order-1
                lg:order-2
                self-start
                rounded-2xl
                border
                bg-white
                shadow-sm
              "
            >
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-semibold">
                  Dispatch Details
                </h3>

                <p className="text-sm text-muted-foreground">
                  Enter the trip financial details before
                  dispatching the vehicle.
                </p>
              </div>

              <div className="p-6">
                <DispatchForm
                  busFare={busFare}
                  saccoFee={saccoFee}
                  remarks={remarks}
                  onBusFareChange={setBusFare}
                  onSaccoFeeChange={setSaccoFee}
                  onRemarksChange={setRemarks}
                />
              </div>
            </div>

            {/* Summary */}
            <div
              className="
                order-2
                lg:order-1
                self-start
                rounded-2xl
                border
                bg-white
                shadow-sm
              "
            >
              <DispatchSummary
                plateNumber={queueVehicle.vehicle.plateNumber}
                stageName={queueVehicle.stage.name}
                routeName={queueVehicle.route?.name ?? ""}
                capacity={queueVehicle.vehicle.capacity}
                expectedRevenue={charges.expectedRevenue}
                platformFee={charges.platformFee}
                saccoFee={charges.saccoFee}
                totalPayable={charges.totalPayableToMarshal}
              />
            </div>
          </div>
        </div>

        {/* Footer */}

        <DispatchActions
          loading={isSubmitting}
          disabled={
            !busFare ||
            Number(busFare) <= 0
          }
          openConfirm={confirmOpen}
          onOpenConfirmChange={
            setConfirmOpen
          }
          primaryColor={
            branding?.primaryColor
          }
          plateNumber={
            queueVehicle.vehicle
              .plateNumber
          }
          routeName={
            queueVehicle.route?.name ??
            ""
          }
          expectedRevenue={
            charges.expectedRevenue
          }
          platformFee={
            charges.platformFee
          }
          saccoFee={
            charges.saccoFee
          }
          totalPayable={
            charges.totalPayableToMarshal
          }
          onCancel={onClose}
          onDispatch={
            handleDispatch
          }
        />
      </DialogContent>
    </Dialog>
  );
}