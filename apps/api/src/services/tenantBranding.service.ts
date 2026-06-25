import { prisma } from "../lib/prisma";

export interface UpdateTenantBrandingDto {
  displayName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonRadius?: number;
}

export const getTenantBranding = async (
  tenantId: string
) => {
  return prisma.tenantBranding.findUnique({
    where: {
      tenantId,
    },
  });
};

export const updateTenantBranding = async (
  tenantId: string,
  data: UpdateTenantBrandingDto
) => {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return prisma.tenantBranding.upsert({
    where: {
      tenantId,
    },
    update: data,
    create: {
      tenantId,
      displayName:
        data.displayName ?? tenant.name,
      ...data,
    },
  });
};