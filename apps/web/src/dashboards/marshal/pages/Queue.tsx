import { useState } from "react";

import AddArrivalModal from "../components/AddArrivalModal";
import LoadingVehicleCard from "../components/LoadingVehicleCard";
import QueueVehicleCard from "../components/QueueVehicleCard";
import QueueStats from "../components/QueueStats";
import EmptyQueue from "../components/EmptyQueue";

import { useDashboard } from "../hooks/useDashboard";
import { useQueue, useMarkReady } from "../hooks/useQueue";

export default function Queue() {
  const [showArrivalModal, setShowArrivalModal] = useState(false);

  const { data: dashboard } = useDashboard();

  const canManageQueue = dashboard?.canManageQueue ?? false;

  const stage =
    dashboard?.activeAssignment?.stage ??
    dashboard?.lastAssignment?.stage;

  const stageId = stage?.id;

  const { data: queue = [], isLoading } = useQueue(stageId);

  const markReadyMutation = useMarkReady();

  if (!dashboard) {
    return <div className="p-6">Loading...</div>;
  }

  const primaryColor =
    dashboard.branding?.primaryColor ?? "#2563EB";

  const waitingVehicles = queue.filter(
    (vehicle) => vehicle.status === "QUEUED"
  );

  const handleReady = async (
      queueId: string
    ) => {
      if (!canManageQueue) {
        return;
      }

      try {
        await markReadyMutation.mutateAsync(queueId);
      } catch (error) {
        console.error("Ready failed:", error);
      }
    };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <QueueStats
        waiting={dashboard.queueSummary?.waiting ?? 0}
        loading={dashboard.queueSummary?.loading ?? 0}
        dispatchedToday={dashboard.queueSummary?.dispatchedToday ?? 0}
      />
      {!canManageQueue && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>

            <div>
              <h3 className="font-semibold text-amber-900">
                You are currently offline
              </h3>

              <p className="mt-1 text-sm text-amber-800">
                You do not have an active duty assignment at the
                moment. Queue operations are disabled until your
                scheduled shift begins.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Loading Vehicle */}
      {dashboard.loadingVehicle && (
        <LoadingVehicleCard
          vehicle={dashboard.loadingVehicle}
          primaryColor={primaryColor}
          onReady={() =>
            handleReady(dashboard.loadingVehicle.id)
          }
        />
      )}

      {/* Waiting Queue Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Waiting Queue</h2>
          <button
          onClick={() => {
            if (canManageQueue) {
              setShowArrivalModal(true);
            }
          }}
          disabled={!canManageQueue}
          className={`rounded-xl px-4 py-2 font-semibold text-white transition ${
            !canManageQueue
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          style={{ backgroundColor: primaryColor }}
        >
          + Add Arrival
        </button>
        </div>

        {/* TRUE EMPTY STATE LOGIC */}
        {isLoading ? (
          <div className="rounded-2xl border bg-white p-6 text-center">
            Loading queue...
          </div>
        ) : waitingVehicles.length > 0 ? (
          <div className="space-y-3">
            {waitingVehicles.map((vehicle) => (
              <QueueVehicleCard
                key={vehicle.id}
                vehicle={vehicle}
              />
            ))}
          </div>
        ) : (
          <EmptyQueue />
        )}
      </div>

      {/* Arrival Modal */}
      {showArrivalModal &&
        canManageQueue && (
          <AddArrivalModal
            stageId={stageId ?? ""}
            primaryColor={primaryColor}
            onClose={() =>
              setShowArrivalModal(false)
            }
          />
      )}
    </div>
  );
}