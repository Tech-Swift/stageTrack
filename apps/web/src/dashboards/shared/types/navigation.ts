import type { LucideIcon } from "lucide-react";

import type { UserRole } from "./roles";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
  children?: NavigationItem[];
}