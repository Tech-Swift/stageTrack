import type { DashboardAction } from "./dashboardPermissions";
import type { DashboardModule } from "./dashboardModules";
import type { UserRole } from "@/dashboards/shared/types/roles";

export interface DashboardModuleConfig {
  module: DashboardModule;
  label: string;
  description?: string;
  permissions?: DashboardAction[];
}

export interface DashboardRoleConfig {
  role: UserRole;
  modules: DashboardModuleConfig[];
}