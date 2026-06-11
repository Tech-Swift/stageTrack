export interface CreateRegistrationDTO {
  tenantCode: string;

  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string;

  role: "DRIVER" | "CONDUCTOR" | "VEHICLE_OWNER" | "STAGE_MARSHAL";

  profileImageUrl?: string;
  goodConductUrl?: string;
  licenceUrl?: string;
  badgeUrl?: string;
  vehicleLogbookUrl?: string;
}