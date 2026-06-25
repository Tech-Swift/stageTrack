import type { UserRole } from "../types";

export const getDashboardRoute = (
  role: UserRole
) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin";

    case "SACCO_ADMIN":
      return "/admin";

    case "STAGE_MARSHAL":
      return "/marshal";

    case "DIRECTOR":
      return "/director";

    case "MANAGER":
      return "/manager";

    case "DRIVER":
      return "/driver";

    case "CONDUCTOR":
      return "/conductor";

    case "VEHICLE_OWNER":
      return "/vehicle-owner";

    default:
      return "/";
  }
};