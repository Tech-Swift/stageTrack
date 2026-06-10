import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding StageTrack...");

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Forward Travelers SACCO",
    },
  });

  console.log("✅ Tenant created");

  // 2. Route
  const route = await prisma.route.create({
    data: {
      tenantId: tenant.id,
      name: "Nairobi → Nyeri",
      origin: "Nairobi",
      destination: "Nyeri",
    },
  });

  console.log("✅ Route created");

  // 3. Stage
  const stage = await prisma.stage.create({
    data: {
      tenantId: tenant.id,
      routeId: route.id,
      name: "Tea Room",
    },
  });

  console.log("✅ Stage created");

  // 4. Vehicle Owner
  const owner = await prisma.vehicleOwner.create({
    data: {
      tenantId: tenant.id,
      name: "John Mwangi",
      phone: "0712345678",
    },
  });

  console.log("✅ Vehicle owner created");

  // 5. Vehicles
  await prisma.vehicle.createMany({
    data: [
      {
        tenantId: tenant.id,
        vehicleOwnerId: owner.id,
        registrationNumber: "KDA123A",
        plateSuffix: "123A",
        capacity: 33,
      },
      {
        tenantId: tenant.id,
        vehicleOwnerId: owner.id,
        registrationNumber: "KDB456B",
        plateSuffix: "456B",
        capacity: 33,
      },
      {
        tenantId: tenant.id,
        vehicleOwnerId: owner.id,
        registrationNumber: "KDC789C",
        plateSuffix: "789C",
        capacity: 33,
      },
    ],
  });

  console.log("✅ Vehicles created");

  console.log("🎉 Seed completed successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });