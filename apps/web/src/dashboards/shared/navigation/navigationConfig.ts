import {
  BarChart3,
  Bus,
  ClipboardList,
  Home,
  Settings,
  Shield,
  Users,
} from "lucide-react";

import type { UserRole } from "@/features/auth/types";
import type { NavigationItem } from "../types/dashboard";

export const navigationConfig: Record<UserRole, NavigationItem[]> = {
  SUPER_ADMIN: [
    {
      label: "Dashboard",
      href: "/super-admin/dashboard",
      icon: Home,
    },
    {
      label: "SACCOs",
      href: "/super-admin/saccos",
      icon: Shield,
    },
    {
      label: "Users",
      href: "/super-admin/users",
      icon: Users,
    },
    {
      label: "Registrations",
      href: "/super-admin/registrations",
      icon: ClipboardList,
    },
    {
      label: "Vehicles",
      href: "/super-admin/vehicles",
      icon: Bus,
    },
    {
      label: "Reports",
      href: "/super-admin/reports",
      icon: BarChart3,
    },
    {
      label: "Settings",
      href: "/super-admin/settings",
      icon: Settings,
    },
  ],

  SACCO_ADMIN: [],

  DIRECTOR: [],

  MANAGER: [],

  STAGE_MARSHAL: [],

  DRIVER: [],

  CONDUCTOR: [],

  VEHICLE_OWNER: [],
};