import { useAuth } from "@/features/auth/hooks/useAuth";

import { hasPermission } from "../utils/permissions";

import type { DashboardModule } from "@/dashboards/config/dashboardModules";
import type { DashboardAction } from "@/dashboards/config/dashboardPermissions";

export const usePermissions = () => {
  const { user } = useAuth();

  const role = user?.role;

  const can = (
    module: DashboardModule,
    action: DashboardAction
  ): boolean => {
    if (!role) {
      return false;
    }

    return hasPermission(
      role,
      module,
      action
    );
  };

  return {
    can,
    role,
  };
};