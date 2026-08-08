import type { UserRole } from "@/dashboards/shared/types/roles";

import {
  DASHBOARD_ROLE_PERMISSIONS,
} from "@/dashboards/config/dashboardRoles";

import type { DashboardModule } from "@/dashboards/config/dashboardModules";
import type { DashboardAction } from "@/dashboards/config/dashboardPermissions";

export const hasPermission = (
  role: UserRole,
  module: DashboardModule,
  action: DashboardAction
): boolean => {
  const permissions =
    DASHBOARD_ROLE_PERMISSIONS[role];

  if (!permissions) {
    return false;
  }

  const modulePermissions =
    permissions[module];

  if (!modulePermissions) {
    return false;
  }

  return modulePermissions.includes(action);
};