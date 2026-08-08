import {
  LayoutDashboard,
  Bus,
  Route,
  Users,
  Building2,
  UserCog,
  ClipboardList,
  Settings,
} from "lucide-react";

import type { NavigationItem } from "../types/navigation";

import { DASHBOARD_MODULES } from "@/dashboards/config/dashboardModules";

export const navigationConfig: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    module: DASHBOARD_MODULES.OVERVIEW,
  },

  {
    label: "Queue",
    path: "/queue",
    icon: ClipboardList,
    module: DASHBOARD_MODULES.QUEUE,
  },

  {
    label: "Fleet",
    path: "/fleet",
    icon: Bus,
    module: DASHBOARD_MODULES.FLEET,
  },

  {
    label: "Routes",
    path: "/routes",
    icon: Route,
    module: DASHBOARD_MODULES.ROUTES,
  },

  {
    label: "Users",
    path: "/users",
    icon: Users,
    module: DASHBOARD_MODULES.USERS,
  },

  {
    label: "Saccos",
    path: "/saccos",
    icon: Building2,
    module: DASHBOARD_MODULES.SACCOS,
  },

  {
    label: "Assignments",
    path: "/assignments",
    icon: UserCog,
    module: DASHBOARD_MODULES.STAGE_ASSIGNMENTS,
  },

  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    module: DASHBOARD_MODULES.SETTINGS,
  },
];