export interface AssignCrewToVehicleDto {
  tenantId: string;
  vehicleId: string;
  driverId: string;
  conductorId: string;
  assignedById: string;
  notes?: string;
}