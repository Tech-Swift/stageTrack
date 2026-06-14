import { prisma } from "../lib/prisma";
import crypto from "crypto";

async function run() {
  const users = await prisma.user.findMany({
    where: {
      accountStatus: "PENDING_SETUP",
    },
  });

  console.log(`Found ${users.length} users needing tokens`);

  for (const user of users) {
    const token = crypto.randomBytes(32).toString("hex");

    const result = await prisma.passwordSetupToken.upsert({
      where: { userId: user.id },
      update: {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      create: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    console.log(`✔ Generated token for ${user.email}`, result.token);
  }

  console.log("Done fixing missing tokens");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });