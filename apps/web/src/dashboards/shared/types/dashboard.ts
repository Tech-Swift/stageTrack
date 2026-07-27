import type { LucideIcon } from "lucide-react";

import type { User } from "@/features/auth/types";

/**
 * Navigation item rendered in the dashboard sidebar.
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationItem[];
}

/**
 * Branding information for the current tenant.
 * This is expected to come from the backend.
 */
export interface TenantBranding {
  id: string;
  name: string;
  code: string;
  logo?: string;
  primaryColor?: string;
}

/**
 * Everything required to render a dashboard shell.
 */
export interface DashboardContext {
  user: User;
  tenant: TenantBranding;
  navigation: NavigationItem[];
}