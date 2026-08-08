import { useAuth } from "@/features/auth/hooks/useAuth";

import type { DashboardModule } from "@/dashboards/config/dashboardModules";
import type { DashboardAction } from "@/dashboards/config/dashboardPermissions";

import { canAccessModule } from "@/dashboards/config/dashboardAccess";

export const useDashboardPermissions = () => {
  const { user } = useAuth();

  const role = user?.role;

  const can = (
    module: DashboardModule,
    action: DashboardAction
  ): boolean => {
    if (!role) {
      return false;
    }

    return canAccessModule(
      role,
      module,
      action
    );
  };

  return {
    can,
  };
};