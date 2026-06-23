// src/types/registration.ts

export type AllowedRole = 'DRIVER' | 'CONDUCTOR' | 'STAGE_MARSHAL' | 'VEHICLE_OWNER';

export interface Tenant {
  id: string;
  name: string;
  code: string;
}

export interface RegistrationFormData {
  tenantCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalId: string;
  role: AllowedRole | '';
  profileImageUrl?: string;
  goodConductUrl?: string;
  licenceUrl?: string;
  badgeUrl?: string;
  vehicleLogbookUrl?: string;
}

// Partial mapping ensures optional document fields can hold string errors
export type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;