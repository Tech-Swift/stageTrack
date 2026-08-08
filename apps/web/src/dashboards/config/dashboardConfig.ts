import type { NavigationItem } from "@/dashboards/shared/types/navigation";
import type { DashboardModule } from "@/dashboards/config/dashboardModules";

import { DASHBOARD_MODULE_CONFIG } from "@/dashboards/config/dashboardModulesConfig";

const NAVIGATION_MODULES: DashboardModule[] = [
  "OVERVIEW",
  "TENANT_APPLICATIONS",
  "SACCOS",
  "USERS",
  "REGISTRATION_REQUESTS",
  "FLEET",
  "VEHICLE_OWNERS",
  "VEHICLE_CREWS",
  "ROUTES",
  "STAGES",
  "STAGE_ASSIGNMENTS",
  "QUEUE",
  "ARRIVALS",
  "DISPATCHES",
  "PLATFORM_CHARGES",
  "PROFILE",
  "SETTINGS",
];

export const navigationConfig: NavigationItem[] =
  DASHBOARD_MODULE_CONFIG
    .filter((module) =>
      NAVIGATION_MODULES.includes(module.module)
    )
    .map((module) => ({
      label: module.label,
      path: module.path,
      icon: module.icon,
      module: module.module,
    }));