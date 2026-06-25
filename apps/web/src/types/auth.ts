export type UserRole = 
  | 'SUPER_ADMIN'
  | 'SACCO_ADMIN'
  | 'STAGE_MARSHAL'
  | 'DIRECTOR'
  | 'MANAGER'
  | 'DRIVER'
  | 'CONDUCTOR'
  | 'VEHICLE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}