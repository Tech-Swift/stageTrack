export interface PageMetadata {
  title: string;
  description: string;
}

export const pageMetadata: Record<string, PageMetadata> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of your workspace",
  },

  "/queue": {
    title: "Queue Management",
    description: "Manage vehicles waiting for dispatch",
  },

  "/dispatches": {
    title: "Dispatch Management",
    description: "Monitor vehicle dispatches",
  },

  "/arrivals": {
    title: "Vehicle Arrivals",
    description: "Track incoming vehicles",
  },

  "/fleet": {
    title: "Fleet Management",
    description: "Monitor and manage your fleet",
  },

  "/routes": {
    title: "Routes",
    description: "Manage transport routes",
  },

  "/users": {
    title: "User Management",
    description: "Manage users and permissions",
  },

  "/assignments": {
    title: "Assignments",
    description: "Manage staff assignments",
  },

  "/reports": {
    title: "Reports",
    description: "View operational reports",
  },

  "/settings": {
    title: "Settings",
    description: "Manage your application settings",
  },

  "/profile": {
    title: "Profile",
    description: "View and update your profile",
  },

  "/saccos": {
    title: "Saccos",
    description: "Manage registered saccos",
  },
};