import { useState } from "react";

import AddArrivalModal from "../components/AddArrivalModal";
import { DispatchModal } from "../components/DispatchModal";
import EmptyQueue from "../components/EmptyQueue";
import LoadingVehicleCard from "../components/LoadingVehicleCard";
import QueueStats from "../components/QueueStats";
import QueueVehicleCard from "../components/QueueVehicleCard";
import ReadyToDispatchCard from "../components/ReadyToDispatchCard";

import RemoveVehicleDialog from "../ui/RemoveVehicleDialog";

import { useDashboard } from "../hooks/useDashboard";
import { useMarkReady, useQueue } from "../hooks/useQueue";
import { useReturnToQueue } from "../hooks/useDispatch";

import type { QueueVehicle } from "../types/queue";

export default function Queue() {
  const [showArrivalModal, setShowArrivalModal] =
    useState(false);

  const [showDispatchModal, setShowDispatchModal] =
    useState(false);

  const [showRemoveDialog, setShowRemoveDialog] =
    useState(false);

  const [selectedVehicle, setSelectedVehicle] =
    useState<QueueVehicle | null>(null);

  const { data: dashboard } = useDashboard();

  const canManageQueue =
    dashboard?.canManageQueue ?? false;

  const stage =
    dashboard?.activeAssignment?.stage ??
    dashboard?.lastAssignment?.stage;

  const stageId = stage?.id;

  const {
    data: queue = [],
    isLoading,
  } = useQueue(stageId);

  const markReadyMutation = useMarkReady();
  const returnToQueueMutation =
    useReturnToQueue();

  if (!dashboard) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  const primaryColor =
    dashboard.branding?.primaryColor ??
    "#2563EB";

  const waitingVehicles = queue.filter(
    (vehicle) => vehicle.status === "QUEUED"
  );

  const loadingVehicle = queue.find(
    (vehicle) =>
      vehicle.status === "LOADING"
  );

  const readyToDispatchVehicles =
    queue.filter(
      (vehicle) =>
        vehicle.status ===
        "READY_TO_DISPATCH"
    );

  const handleReady = async (
    vehicle: QueueVehicle
  ) => {
    if (!canManageQueue) {
      return;
    }

    try {
      await markReadyMutation.mutateAsync(
        vehicle.id
      );

      setSelectedVehicle(vehicle);
      setShowDispatchModal(true);
    } catch (error) {
      console.error(
        "Ready failed:",
        error
      );
    }
  };

  const handleReturnToQueue = async (
    vehicle: QueueVehicle
  ) => {
    try {
      await returnToQueueMutation.mutateAsync(
        vehicle.id
      );
    } catch (error) {
      console.error(
        "Failed to return vehicle to queue:",
        error
      );
    }
  };

  return (
    <div className="space-y-6">
      <QueueStats
        waiting={
          dashboard.queueSummary?.waiting ??
          0
        }
        loading={
          dashboard.queueSummary?.loading ??
          0
        }
        dispatchedToday={
          dashboard.queueSummary
            ?.dispatchedToday ?? 0
        }
      />

      {!canManageQueue && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              ⚠️
            </div>

            <div>
              <h3 className="font-semibold text-amber-900">
                You are currently offline
              </h3>

              <p className="mt-1 text-sm text-amber-800">
                You do not have an active duty
                assignment at the moment.
                Queue operations are disabled
                until your scheduled shift
                begins.
              </p>
            </div>
          </div>
        </div>
      )}

      {loadingVehicle && (
        <LoadingVehicleCard
          vehicle={loadingVehicle}
          primaryColor={primaryColor}
          onReady={() =>
            handleReady(loadingVehicle)
          }
          onRemove={() => {
            setSelectedVehicle(
              loadingVehicle
            );
            setShowRemoveDialog(true);
          }}
        />
      )}

      {readyToDispatchVehicles.length >
        0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">
            Ready to Dispatch
          </h2>

          {readyToDispatchVehicles.map(
            (vehicle) => (
              <ReadyToDispatchCard
                key={vehicle.id}
                vehicle={vehicle}
                primaryColor={
                  primaryColor
                }
                onDispatch={() => {
                  setSelectedVehicle(
                    vehicle
                  );
                  setShowDispatchModal(
                    true
                  );
                }}
                onReturnToQueue={() =>
                  handleReturnToQueue(
                    vehicle
                  )
                }
              />
            )
          )}
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Waiting Queue
          </h2>

          <button
            onClick={() => {
              if (canManageQueue) {
                setShowArrivalModal(
                  true
                );
              }
            }}
            disabled={!canManageQueue}
            className={`rounded-xl px-4 py-2 font-semibold text-white transition ${
              !canManageQueue
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            style={{
              backgroundColor:
                primaryColor,
            }}
          >
            + Add Arrival
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border bg-white p-6 text-center">
            Loading queue...
          </div>
        ) : waitingVehicles.length >
          0 ? (
          <div className="space-y-3">
            {waitingVehicles.map(
              (vehicle) => (
                <QueueVehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onRemove={() => {
                    setSelectedVehicle(
                      vehicle
                    );
                    setShowRemoveDialog(
                      true
                    );
                  }}
                />
              )
            )}
          </div>
        ) : (
          <EmptyQueue />
        )}
      </div>

      {showArrivalModal &&
        canManageQueue && (
          <AddArrivalModal
            stageId={stageId ?? ""}
            primaryColor={
              primaryColor
            }
            onClose={() =>
              setShowArrivalModal(
                false
              )
            }
          />
        )}

      {showDispatchModal &&
        selectedVehicle && (
          <DispatchModal
            open={showDispatchModal}
            queueVehicle={
              selectedVehicle
            }
            branding={
              dashboard.branding
            }
            onClose={() => {
              setShowDispatchModal(
                false
              );
              setSelectedVehicle(
                null
              );
            }}
            onSuccess={() => {
              setShowDispatchModal(
                false
              );
              setSelectedVehicle(
                null
              );
            }}
          />
        )}

      {showRemoveDialog &&
        selectedVehicle && (
          <RemoveVehicleDialog
            open={showRemoveDialog}
            vehicle={selectedVehicle}
            onClose={() => {
              setShowRemoveDialog(
                false
              );
              setSelectedVehicle(
                null
              );
            }}
          />
        )}
    </div>
  );
}