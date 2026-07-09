import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { useDispatch } from "../hooks/useDispatch";

import { calculateDispatchCharges } from "../utils/dispatchCalculator";

import { DispatchActions } from "../ui/DispatchActions";
import DispatchHeader from "../ui/DispatchHeader";
import { DispatchSummary } from "../ui/DispatchSummary";
import { DispatchForm } from "../ui/DispatchForm";
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

  const [busFare, setBusFare] = useState("");
  const [saccoFee, setSaccoFee] = useState("");
  const [remarks, setRemarks] = useState("");

    useEffect(() => {
    if (!open) {
        setBusFare("");
        setSaccoFee("");
        setRemarks("");
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
      if (!queueVehicle || !charges) {
    return;
  }

    await dispatchMutation.mutateAsync({
        queueId: queueVehicle.id,
        busFare: Number(busFare),
        saccoFee: Number(saccoFee),
        remarks,
    });

    onSuccess?.();

    onClose();
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onClose}
      >
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">

          <DispatchHeader
              branding={
                branding ?? {
                  displayName: "StageTrack",
                  primaryColor: "#2563EB",
                }
              }
              stage={{
                name: queueVehicle.stage?.name ?? "Unknown Stage",
              }}
                route={{
                    name: queueVehicle.route?.name ?? "",
                    origin: queueVehicle.route?.origin ?? "",
                    destination:
                    queueVehicle.route?.destination ?? "",
                }}
                />

          <div className="space-y-6 p-6">

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

            <DispatchForm
              busFare={busFare}
              saccoFee={saccoFee}
              remarks={remarks}
              onBusFareChange={setBusFare}
              onSaccoFeeChange={setSaccoFee}
              onRemarksChange={setRemarks}
            />

          </div>

          <DispatchActions
            loading={dispatchMutation.isPending}
            disabled={!busFare || Number(busFare) <= 0}
            primaryColor={branding?.primaryColor ?? undefined}
            plateNumber={
              queueVehicle.vehicle.plateNumber
            }
            routeName={
              queueVehicle.route?.name ?? ""
            }
            expectedRevenue={
              charges.expectedRevenue
            }
            platformFee={
              charges.platformFee
            }
            saccoFee={charges.saccoFee}
            totalPayable={
              charges.totalPayableToMarshal
            }
            onCancel={onClose}
            onDispatch={handleDispatch
            }
          />

        </DialogContent>
      </Dialog>
    </>
  );
}
