export interface VehicleSearchResult {
    id: string;
    plateNumber: string;
    capacity: number;
}

export interface CreateArrivalPayload {
  vehicleId: string;
  stageId: string;
}