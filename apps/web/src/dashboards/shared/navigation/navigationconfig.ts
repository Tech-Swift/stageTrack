// src/dashboards/shared/navigation/navigationConfig.ts

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

export const navigationConfig: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "SUPER_ADMIN",
      "SACCO_ADMIN",
      "DIRECTOR",
      "MANAGER",
      "STAGE_MARSHAL",
      "VEHICLE_OWNER",
      "DRIVER",
      "CONDUCTOR",
    ],
  },

  {
    label: "Queue",
    path: "/queue",
    icon: ClipboardList,
    roles: ["STAGE_MARSHAL"],
  },

  {
    label: "Fleet",
    path: "/fleet",
    icon: Bus,
    roles: [
      "DIRECTOR",
      "MANAGER",
      "SACCO_ADMIN",
    ],
  },

  {
    label: "Routes",
    path: "/routes",
    icon: Route,
    roles: [
      "DIRECTOR",
      "MANAGER",
      "SACCO_ADMIN",
    ],
  },

  {
    label: "Users",
    path: "/users",
    icon: Users,
    roles: [
      "SUPER_ADMIN",
      "SACCO_ADMIN",
    ],
  },

  {
    label: "Saccos",
    path: "/saccos",
    icon: Building2,
    roles: ["SUPER_ADMIN"],
  },

  {
    label: "Assignments",
    path: "/assignments",
    icon: UserCog,
    roles: [
      "MANAGER",
      "SACCO_ADMIN",
    ],
  },

  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    roles: [
      "SUPER_ADMIN",
      "SACCO_ADMIN",
      "DIRECTOR",
      "MANAGER",
      "STAGE_MARSHAL",
      "VEHICLE_OWNER",
      "DRIVER",
      "CONDUCTOR",
    ],
  },
];