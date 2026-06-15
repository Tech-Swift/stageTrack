import { prisma } from "../lib/prisma";

export const userActivationService = {
    activateRoleEntities: async (user: any) => {

        if (user.role === "VEHICLE_OWNER") {
            await prisma.vehicleOwner.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    tenantId: user.tenantId!,
                },
            });
        }

        if (user.role === "DRIVER") {
            await prisma.driver.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    tenantId: user.tenantId!,
                },
            });
        }

        if (user.role === "CONDUCTOR") {
            await prisma.conductor.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    tenantId: user.tenantId!,
                },
            });
        }

        if (user.role === "STAGE_MARSHAL") {
            await prisma.stageMarshal.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    tenantId: user.tenantId!,
                },
            });
        }
    }
};