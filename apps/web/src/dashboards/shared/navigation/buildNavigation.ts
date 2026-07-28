// src/dashboards/shared/navigation/buildNavigation.ts

import { navigationConfig } from "./navigationconfig";

import type {
  NavigationItem,
} from "../types/navigation";

import type { UserRole } from "../types/roles";

export const buildNavigation = (
  role: UserRole
): NavigationItem[] => {
  return navigationConfig.filter((item) =>
    item.roles.includes(role)
  );
};