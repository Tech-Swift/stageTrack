export type QueueStatus =
  | "QUEUED"
  | "SKIPPED"
  | "REMOVED"
  | "LOADING"
  | "DISPATCHED"
  | "READY_TO_DISPATCH";

export interface Vehicle {
  id: string;
  plateNumber: string;
  registrationNumber: string;
  capacity: number;
}

export interface Stage {
  id: string;
  name: string;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
}

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

  vehicle: Vehicle;

  // Added
  stage: Stage;

  // Added
  route?: Route;
}