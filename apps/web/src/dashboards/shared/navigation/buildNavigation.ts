import type { NavigationItem } from "../types/navigation";
import type { UserRole } from "../types/roles";

import { DASHBOARD_ROLE_PERMISSIONS } from "@/dashboards/config/dashboardRoles";
import { DASHBOARD_ACTIONS } from "@/dashboards/config/dashboardPermissions";

import { navigationConfig } from "./navigationconfig";

export const buildNavigation = (
  role: UserRole
): NavigationItem[] => {
  const permissions = DASHBOARD_ROLE_PERMISSIONS[role];

  if (!permissions) {
    return [];
  }

  return navigationConfig.filter((item) => {
    const actions = permissions[item.module];

    return actions?.includes(DASHBOARD_ACTIONS.VIEW) ?? false;
  });
};