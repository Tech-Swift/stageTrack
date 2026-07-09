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
  status: QueueStatus;
  sequenceNumber: number;

  vehicle: {
    id: string;
    plateNumber: string;
    capacity: number;
  };

  arrival: {
    arrivalTime: string;
  };

  stage: {
    id: string;
    name: string;
  };

  route: {
    id: string;
    name: string;
    origin: string;
    destination: string;
  };
}