import { UserRole } from "@prisma/client";

import { prisma } from "../lib/prisma";

export const getAppShellData = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tenant: {
        include: {
          branding: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPlatformUser =
    user.role === UserRole.SUPER_ADMIN;

  if (!isPlatformUser && !user.tenant) {
    throw new Error("User is not assigned to a tenant");
  }

  const tenant = user.tenant;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    tenant: tenant
      ? {
          id: tenant.id,
          name: tenant.name,
          code: tenant.code,
        }
      : null,

    branding: tenant?.branding
      ? {
          primaryColor: tenant.branding.primaryColor,
          secondaryColor:
            tenant.branding.secondaryColor,
          logoUrl: tenant.branding.logoUrl,
        }
      : {
          primaryColor: "#2563EB",
          secondaryColor: "#1E40AF",
          logoUrl: null,
        },

    unreadNotifications: 0,
  };
};