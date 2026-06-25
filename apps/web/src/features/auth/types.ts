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