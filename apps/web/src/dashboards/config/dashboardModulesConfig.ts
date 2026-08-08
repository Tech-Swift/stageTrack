import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Users,
  Bus,
  UserRound,
  UserCog,
  Route,
  MapPin,
  ListOrdered,
  LogIn,
  Send,
  WalletCards,
  UserCircle,
  Settings,
} from "lucide-react";

import { DASHBOARD_MODULES } from "./dashboardModules";

export interface DashboardModuleConfig {
  module: keyof typeof DASHBOARD_MODULES;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const DASHBOARD_MODULE_CONFIG: DashboardModuleConfig[] = [
  {
    module: "OVERVIEW",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    module: "TENANT_APPLICATIONS",
    label: "Tenant Applications",
    path: "/tenant-applications",
    icon: ClipboardList,
  },

  {
    module: "SACCOS",
    label: "SACCOs",
    path: "/saccos",
    icon: Building2,
  },

  {
    module: "USERS",
    label: "Users",
    path: "/users",
    icon: Users,
  },

  {
    module: "REGISTRATION_REQUESTS",
    label: "Registration Requests",
    path: "/registration-requests",
    icon: ClipboardList,
  },

  {
    module: "FLEET",
    label: "Fleet",
    path: "/fleet",
    icon: Bus,
  },

  {
    module: "VEHICLE_OWNERS",
    label: "Vehicle Owners",
    path: "/vehicle-owners",
    icon: UserRound,
  },

  {
    module: "VEHICLE_CREWS",
    label: "Vehicle Crews",
    path: "/vehicle-crews",
    icon: UserCog,
  },

  {
    module: "ROUTES",
    label: "Routes",
    path: "/routes",
    icon: Route,
  },

  {
    module: "STAGES",
    label: "Stages",
    path: "/stages",
    icon: MapPin,
  },

  {
    module: "STAGE_ASSIGNMENTS",
    label: "Stage Assignments",
    path: "/stage-assignments",
    icon: UserCog,
  },

  {
    module: "QUEUE",
    label: "Queue",
    path: "/queue",
    icon: ListOrdered,
  },

  {
    module: "ARRIVALS",
    label: "Arrivals",
    path: "/arrivals",
    icon: LogIn,
  },

  {
    module: "DISPATCHES",
    label: "Dispatches",
    path: "/dispatches",
    icon: Send,
  },

  {
    module: "PLATFORM_CHARGES",
    label: "Platform Charges",
    path: "/platform-charges",
    icon: WalletCards,
  },

  {
    module: "PROFILE",
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
  },

  {
    module: "SETTINGS",
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];