 import type { UserRole } from "./roles";

export interface AppShellUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AppShellTenant {
  id: string;
  name: string;
  code: string;
}

export interface AppShellBranding {
  primaryColor: string;
  secondaryColor: string | null;
  logoUrl: string | null;
}

export interface AppShellData {
  user: AppShellUser;
  tenant: AppShellTenant | null;
  branding: AppShellBranding;
  unreadNotifications: number;
}

export interface AppShellResponse {
  success: boolean;
  data: AppShellData;
}