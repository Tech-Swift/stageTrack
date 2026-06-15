import { prisma } from "../lib/prisma";

async function backfillRoleEntities() {
    console.log("Starting role backfill...");

    const users = await prisma.user.findMany({
        where: {
            accountStatus: "ACTIVE",
        },
    });

    console.log(`Found ${users.length} active users`);

    for (const user of users) {
        try {
            switch (user.role) {

                case "VEHICLE_OWNER":
                    await prisma.vehicleOwner.upsert({
                        where: { userId: user.id },
                        update: {},
                        create: {
                            userId: user.id,
                            tenantId: user.tenantId!,
                        },
                    });
                    break;

                case "DRIVER":
                    await prisma.driver.upsert({
                        where: { userId: user.id },
                        update: {},
                        create: {
                            userId: user.id,
                            tenantId: user.tenantId!,
                        },
                    });
                    break;

                case "CONDUCTOR":
                    await prisma.conductor.upsert({
                        where: { userId: user.id },
                        update: {},
                        create: {
                            userId: user.id,
                            tenantId: user.tenantId!,
                        },
                    });
                    break;

                case "STAGE_MARSHAL":
                    await prisma.stageMarshal.upsert({
                        where: { userId: user.id },
                        update: {},
                        create: {
                            userId: user.id,
                            tenantId: user.tenantId!,
                        },
                    });
                    break;

                default:
                    break;
            }
        } catch (err) {
            console.error(`Failed for user ${user.id}`, err);
        }
    }

    console.log("Role backfill completed successfully");
}

backfillRoleEntities()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });