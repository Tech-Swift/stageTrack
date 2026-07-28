export type UserRole =
  | "SUPER_ADMIN"
  | "SACCO_ADMIN"
  | "STAGE_MARSHAL"
  | "DIRECTOR"
  | "MANAGER"
  | "DRIVER"
  | "CONDUCTOR"
  | "VEHICLE_OWNER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  tenantCode?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface TenantBranding {
  id: string;
  tenantId: string;
  displayName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string | null;
  buttonRadius: number;
}