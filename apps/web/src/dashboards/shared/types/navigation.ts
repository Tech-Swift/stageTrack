import type { LucideIcon } from "lucide-react";

import type { DashboardModule } from "@/dashboards/config/dashboardModules";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  module: DashboardModule;
  children?: NavigationItem[];
}