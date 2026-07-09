export interface DispatchCalculation {
  capacity: number;

  busFare: number;

  expectedRevenue: number;

  platformRate: number;

  platformFee: number;

  saccoFee: number;

  totalPayableToMarshal: number;
}

export interface CreateDispatchPayload {
  queueId: string;

  busFare: number;

  saccoFee?: number;

  remarks?: string;
}

export interface DispatchVehicle {
  id: string;

  registrationNumber: string;

  plateNumber: string;

  capacity: number;
}

export interface DispatchStage {
  id: string;

  name: string;
}

export interface ReadyToDispatchVehicle {
  id: string;

  queueId: string;

  sequenceNumber: number;

  vehicle: DispatchVehicle;

  stage: DispatchStage;
}

export interface DispatchResponse {
  message: string;

  dispatch: SavedDispatch;

  charges: DispatchCalculation;
}

export interface SavedDispatch {
  id: string;

  dispatchTime: string;

  vehicleId: string;

  stageId: string;

  routeId: string;

  expectedRevenue: number;

  busFare: number;

  capacity: number;

  remarks?: string;
}