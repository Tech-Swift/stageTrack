import type { User } from "@/features/auth/types";

import type { NavigationItem } from "../types/dashboard";
import { navigationConfig } from "./navigationConfig";

/**
 * Returns the sidebar navigation for the authenticated user.
 */
export function buildNavigation(user: User): NavigationItem[] {
  return navigationConfig[user.role] ?? [];
}