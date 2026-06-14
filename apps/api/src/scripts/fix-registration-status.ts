import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting registration cleanup...");

  // Get all requests that are still pending
  const pendingRequests = await prisma.registrationRequest.findMany({
    where: {
      status: "PENDING",
    },
  });

  console.log(`Found ${pendingRequests.length} pending requests`);

  let updated = 0;
  let skipped = 0;

  for (const req of pendingRequests) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.email },
      });

      // If user exists → request MUST be approved
      if (user) {
        await prisma.registrationRequest.update({
          where: { id: req.id },
          data: {
            status: "APPROVED",
            approvedAt: user.updatedAt,
            approvedById: user.id,
          },
        });

        console.log(`✅ Fixed: ${req.email} → APPROVED`);
        updated++;
      } else {
        console.log(`⏭ No user found: ${req.email}`);
        skipped++;
      }
    } catch (err) {
      console.error(`❌ Error processing ${req.email}`, err);
    }
  }

  console.log("----- SUMMARY -----");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log("Cleanup completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });