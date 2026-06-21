import { prisma } from "../lib/prisma";

async function setVehicleLoading() {
      const next = await prisma.stageQueue.findFirst({
    where: {
      status: "QUEUED",
    },
    orderBy: {
      position: "asc",
    },
  });

  if (!next) {
    console.log("No queued vehicles found");
    return;
  }
    const updated = await prisma.stageQueue.update({
    where: {
      id: next.id,
    },
    data: {
      status: "LOADING",
    },
  });
  console.log("Updated queue entry:", updated);
}

setVehicleLoading()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });