import { prisma } from "../src/lib/prisma";

async function seed() {
  console.log("Seeding Role Policies...");

  await prisma.rolePolicy.createMany({
    data: [
      {
        actorRole: "DIRECTOR",
        fromRole: "DRIVER",
        toRole: "VEHICLE_OWNER",
      },
      {
        actorRole: "DIRECTOR",
        fromRole: "DRIVER",
        toRole: "STAGE_MARSHAL",
      },
      {
        actorRole: "SACCO_ADMIN",
        fromRole: "DRIVER",
        toRole: "STAGE_MARSHAL",
      },
      {
        actorRole: "SACCO_ADMIN",
        fromRole: "VEHICLE_OWNER",
        toRole: "DRIVER",
      },
      {
        actorRole: "SACCO_ADMIN",
        fromRole: "MANAGER",
        toRole: "DIRECTOR",
      },
    ],
    skipDuplicates: true, // important
  });

  console.log("Seeding completed");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });