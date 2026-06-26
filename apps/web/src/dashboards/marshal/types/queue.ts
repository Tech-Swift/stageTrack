export type QueueStatus =
  | "QUEUED"
  | "SKIPPED"
  | "REMOVED"
  | "LOADING"
  | "DISPATCHED"
  | "READY_TO_DISPATCH";

export interface QueueVehicle {
  id: string;
  stageId: string;
  vehicleId: string;
  arrivalId: string;
  position: number | null;
  sequenceNumber: number;
  status: QueueStatus;
  enqueuedAt: string;
  dispatchedAt: string | null;

  vehicle: {
    id: string;
    plateNumber: string;
    registrationNumber: string;
    capacity: number;
  };
}