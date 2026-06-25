import type { UserRole } from "../types";

export const getDashboardRoute = (
  role: UserRole,
  tenantCode?: string
) => {
  const tenant =
    tenantCode ?? "platform";

  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin";

    case "SACCO_ADMIN":
      return `/${tenant}/admin`;

    case "MANAGER":
      return `/${tenant}/manager`;

    case "DIRECTOR":
      return `/${tenant}/director`;

    case "STAGE_MARSHAL":
      return `/${tenant}/marshal`;

    case "DRIVER":
      return `/${tenant}/driver`;

    case "CONDUCTOR":
      return `/${tenant}/conductor`;

    case "VEHICLE_OWNER":
      return `/${tenant}/vehicle-owner`;

    default:
      return "/";
  }
};