import type { UserRole } from "@/dashboards/shared/types/roles";

import type { DashboardModule } from "./dashboardModules";
import type { DashboardAction } from "./dashboardPermissions";

import { DASHBOARD_ROLE_PERMISSIONS } from "./dashboardRoles";

export const canAccessModule = (
  role: UserRole,
  module: DashboardModule,
  action: DashboardAction
): boolean => {
  const permissions =
    DASHBOARD_ROLE_PERMISSIONS[role];

  if (!permissions) {
    return false;
  }

  return (
    permissions[module]?.includes(action) ??
    false
  );
};